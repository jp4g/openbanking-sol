import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";
import { generateEmailVerifierInputs }  from "@zk-email/zkemail-nr";
import fs from "fs";
import { UltraHonkBackend } from "@aztec/bb.js";
import { Noir } from "@noir-lang/noir_js";
import { describe, it } from "mocha";

import circuit from "../circuit/target/openbanking.json";

describe("Test Verifier", function () {
  async function deployFixture() {

    const TokenContract = await hre.ethers.getContractFactory("PaymentToken");
    const tokenContract = TokenContract.deploy();
    const EscrowContract = await hre.ethers.getContractFactory("OBEscrow");
    const escrowContract = await EscrowContract.deploy();

    return { escrowContract, tokenContract };
  }

  describe("OpenBanking EVM Test", function () {
    it("Should verify", async function () {
      //@ts-ignore
      const noir = new Noir(circuit);
      const backend = new UltraHonkBackend(circuit.bytecode, { threads: 8 });
    //   const { testContract } = await loadFixture(deployFixture);

    //   const inputs = await generateEmailVerifierInputs(email, {
    //     maxHeadersLength: 512,
    //     maxBodyLength: 1024,
    //   });

    //   const { witness, returnValue } = await noir.execute(inputs);
    //   const pubkey = (returnValue as string[])[0];
    //   const nullifier = (returnValue as string[])[1];
    //   const { proof } = await backend.generateProof(witness, { keccak: true });
    //   const res = await testContract.verify(
    //     proof.slice(4),
    //     pubkey,
    //     nullifier
    //   );
    //   expect(res).to.equal(true);
    });
  });
});