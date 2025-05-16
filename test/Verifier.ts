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

describe("Test Verifier", function () {
    async function deployFixture() {

        const TokenContract = await hre.ethers.getContractFactory("PaymentToken");
        const tokenContract = await TokenContract.deploy(
            "USD Coin",
            "USDC",
        );
        const EscrowContract = await hre.ethers.getContractFactory("OBEscrow");
        const escrowContract = await EscrowContract.deploy(
            await (tokenContract).getAddress()
        );

        return { escrowContract, tokenContract };
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
            const [alice, bob ] = await hre.ethers.getSigners();
            const { tokenContract, escrowContract } = await loadFixture(deployFixture);
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
            const verified = await escrowContract.verifyTest(
                proof.slice(4),
                publicInputs
            );
            console.log("Verified: ", verified)
            // 5. Withdrawing with proof
            console.log("Withdrawing")
            await escrowContract.connect(bob).withdraw(
                proof.slice(4),
                publicInputs[1],
                publicInputs[0],
                await alice.getAddress()
            )
            const balance = await tokenContract.balanceOf(await bob.getAddress());
            console.log("Bob Balance: ", balance)
        });
    });
});