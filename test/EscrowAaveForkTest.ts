import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, parseEther } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

// Aave V3 addresses on Ethereum mainnet
const AAVE_POOL_ADDRESS = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const A_DAI_ADDRESS = "0x018008bfb33d285247A21d44E50697654f754e63";

describe("Escrow Aave Fork Tests", function () {
  let escrow: Contract;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  let dai: Contract;
  let aDai: Contract;

  before(async function () {
    // Skip if not running on fork
    if (!process.env.FORK_URL) {
      this.skip();
    }

    [owner, user] = await ethers.getSigners();

    // Get the real DAI and aDAI contracts
    const erc20Abi = ["function balanceOf(address) view returns (uint256)"];
    dai = new ethers.Contract(DAI_ADDRESS, erc20Abi, ethers.provider);
    aDai = new ethers.Contract(A_DAI_ADDRESS, erc20Abi, ethers.provider);

    // Deploy our Escrow contract with real Aave addresses
    const Escrow = await ethers.getContractFactory("OBEscrow");
    escrow = await Escrow.deploy(DAI_ADDRESS, AAVE_POOL_ADDRESS);
    await escrow.waitForDeployment();
  });

  it("should deposit to Aave and withdraw with yield", async function () {
    const amount = parseEther("100");
    const userAddress = await user.getAddress();

    // Get initial balances
    const initialDaiBalance = await dai.balanceOf(userAddress);
    const initialADaiBalance = await aDai.balanceOf(await escrow.getAddress());

    // Approve and deposit
    await dai.connect(user).approve(await escrow.getAddress(), amount);
    await escrow.connect(user).deposit(amount, 0);

    // Wait for some blocks to accrue yield
    await ethers.provider.send("evm_mine", []);
    await ethers.provider.send("evm_mine", []);

    // Withdraw
    await escrow.connect(user).withdraw(amount, 0);

    // Check final balances
    const finalDaiBalance = await dai.balanceOf(userAddress);
    const finalADaiBalance = await aDai.balanceOf(await escrow.getAddress());

    // Verify balances
    expect(finalDaiBalance).to.be.gt(initialDaiBalance);
    expect(finalADaiBalance).to.equal(0);
  });
}); 