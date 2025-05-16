import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";
import { generateEmailVerifierInputs } from "@zk-email/zkemail-nr";
import fs from "fs";
import { BarretenbergSync, Fr, splitHonkProof, UltraHonkBackend } from "@aztec/bb.js";
import { Noir } from "@noir-lang/noir_js";
import { X509Certificate } from 'crypto'
// import { describe, it } from "mocha";
import { generateNoirInputs } from "./utils/inputs";

import circuit from "../circuit/target/openbanking.json";

const payload = fs.readFileSync('./test/test_data/revolut_payload.txt', 'utf8')
const { publicKey } = new X509Certificate(
    fs.readFileSync('./test/test_data/revolut.cert', 'utf8')
);
const signature =
    '3e42c30cab535ed5a20dcac4d405004b5098451c72a80b4460b4e3e9a4bc89f131fa6078c1f7de1d740bfd8216e0ea8b67e5d78eaa7897d02902d73c50d3d0e7bbeb4e1b4b6b4d0281bcfb0e029c44f3ea90363e4e1d7ec591e09fc2bdd832428396b054f4f89336df49c01a88bb7e5b5015e706cd179467bf9794a79474884e799fb388050a7fdcaa074225bdc1b856048640e4fb7955a06675649acd89b049b603c0dc32dc5f37796453602f36cc982f86257055162457db6aec9377e7e9fdcb31e4ebce5d6e445c722f0e6a20936bda5c83481b12013078c0cc72551373586dc69db541d729b8d02521a26bb4f42068764438443e9c9164dca039b0fb1176';

const paymentTokenAddress = "0xD42912755319665397FF090fBB63B1a31aE87Cee";
const escrowAddress = "0x32EEce76C2C2e8758584A83Ee2F522D4788feA0f";
const ofacSanctionAddress = "0x5f3f1dBD7B74C6B46e8c44f98792A1dAf8d69154";

describe("Test Verifier", function () {
    async function deployFixture() {

        // // deploy mock token
        // const TokenContract = await hre.ethers.getContractFactory("PaymentToken");
        // const tokenContract = await TokenContract.deploy(
        //     "USD Coin",
        //     "USDC",
        // );

        // // deploy mock aToken
        // const AaveToken = await hre.ethers.getContractFactory("MockAToken");
        // const aaveToken = await AaveToken.deploy(await tokenContract.getAddress());

        // // deploy mock aave
        // const AaveContract = await hre.ethers.getContractFactory("MockLendingPool");
        // const aaveContract = await AaveContract.deploy(
        //     await tokenContract.getAddress(),
        //     await aaveToken.getAddress()
        // );

        // // deploy openbanking escrow
        // const EscrowContract = await hre.ethers.getContractFactory("OBEscrow");
        // const escrowContract = await EscrowContract.deploy(
        //     await tokenContract.getAddress(),
        //     await aaveContract.getAddress(),    
        // );

        // return { escrowContract, tokenContract, aaveContract };
        const escrowContract = await hre.ethers.getContractAt("OBEscrow", escrowAddress);
        const tokenContract = await hre.ethers.getContractAt("PaymentToken", paymentTokenAddress);
        const ofacSanctionContract = await hre.ethers.getContractAt("OfacSanction", ofacSanctionAddress);
        return { escrowContract, tokenContract, ofacSanctionContract };
    }

    describe("OpenBanking EVM Test", function () {
        it("Should verify", async function () {
            // 0. build bank account commitment
            // commented out - couldn't get hash to line up perfectly in time just hardcoding for now
            // const sortCode = new Fr(BigInt(Buffer.from("04290953215338", "utf-8").toString('hex')));
            // const currencyCode = new Fr(BigInt(Buffer.from("GBP", "utf-8").toString('hex')));
            // const barretenbergApi = await BarretenbergSync.initSingleton();
            // const commitment = barretenbergApi.poseidon2Hash([sortCode, currencyCode]);
            const commitment = "0x10e4d800065fb7a7ab68f5df429c1705330ebbedabf11bea2dc8e845a70d5bce";
            // // 1. instantiate environment
            const [alice, bob] = await hre.ethers.getSigners();
            const { tokenContract, escrowContract } = await loadFixture(deployFixture);
            await escrowContract.connect(alice).setRulesEngineAddress("0x0165878A594ca255338adfa4d48449f69242Eb8F");
            await escrowContract.connect(alice).register(await alice.getAddress());
            await escrowContract.connect(bob).register(await bob.getAddress());
            // 2. mint tokens to alice
            console.log("Minting");
            const escrowAmount = 10000n * 10n ** 18n;
            await tokenContract.mint(
                await alice.getAddress(),
                escrowAmount
            )
            // 3. escrow tokens into the contract
            console.log("Escrowing")
            await tokenContract.connect(alice).approve(
                await escrowContract.getAddress(),
                escrowAmount
            );
            await escrowContract.connect(alice).deposit(
                escrowAmount,
                BigInt(commitment.toString())
            );
            // 4. generate ob proof
            console.log("Proving")
            //@ts-ignore
            const noir = new Noir(circuit);
            const backend = new UltraHonkBackend(circuit.bytecode, { threads: 8 });
            const inputs = generateNoirInputs(
                payload,
                signature,
                publicKey
            );
            const { witness } = await noir.execute({ params: inputs })
            const { proof, publicInputs } = await backend.generateProof(witness, { keccak: true });
            // const verified = await escrowContract.verifyTest(
            //     proof.slice(4),
            //     publicInputs
            // );
            // console.log("Verified: ", verified)
            // 5. Withdrawing with proof
            console.log("Withdrawing")
            await escrowContract.connect(bob).withdraw(
                proof.slice(4),
                publicInputs[1],
                publicInputs[0],
                await alice.getAddress(),
                await bob.getAddress(),
            )
            const balance = await tokenContract.balanceOf(await bob.getAddress());
            console.log("Bob Balance: ", balance)
        });
        it("Should fail register if blacklisted", async () => {
            const [alice, bob, charlie] = await hre.ethers.getSigners();
            const { ofacSanctionContract, escrowContract } = await loadFixture(deployFixture);
            await escrowContract.connect(alice).setRulesEngineAddress("0x0165878A594ca255338adfa4d48449f69242Eb8F");

            // console.log("EscrowContract", await escrowContract.connect(alice).)
            await escrowContract.connect(alice).register(await alice.getAddress());
            await escrowContract.connect(bob).register(await bob.getAddress());
            await ofacSanctionContract.connect(alice).blacklist(await charlie.getAddress());
            
            // try to register charlie
            await expect(
                escrowContract.connect(charlie).register(await charlie.getAddress())
            ).to.be.reverted;
        })
    });
});