import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer, parseEther } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"; // Correct import
// import { describe, it, beforeEach } from "mocha";

describe("Escrow Aave Functionality", function () {
  let mockAsset: any;
  let mockAToken: any;
  let mockLendingPool: any;
  let escrow: any;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  let escrowAddress: string;

  beforeEach(async function () {
    // Get test accounts
    [owner, user] = await ethers.getSigners();

    // Deploy mock contracts
    const MockAsset = await ethers.getContractFactory("MockAsset");
    mockAsset = await MockAsset.deploy();
    await mockAsset.waitForDeployment();
    const mockAssetAddress = await mockAsset.getAddress();

    const MockAToken = await ethers.getContractFactory("MockAToken");
    mockAToken = await MockAToken.deploy(mockAssetAddress);
    await mockAToken.waitForDeployment();
    const mockATokenAddress = await mockAToken.getAddress();

    const MockLendingPool = await ethers.getContractFactory("MockLendingPool");
    mockLendingPool = await MockLendingPool.deploy(mockAssetAddress, mockATokenAddress);
    await mockLendingPool.waitForDeployment();
    const mockLendingPoolAddress = await mockLendingPool.getAddress();

    // Deploy your Escrow contract (adjust constructor args as needed)
    const Escrow = await ethers.getContractFactory("OBEscrow");
    escrow = await Escrow.deploy(mockAssetAddress, mockLendingPoolAddress);
    await escrow.waitForDeployment();
    escrowAddress = await escrow.getAddress();

    // Mint tokens to user for testing
    await mockAsset.mint(await user.getAddress(), parseEther("1000"));
  });

  it("should deposit to Aave and withdraw with yield", async function () {
    const userAddress = await user.getAddress();
    const amount = parseEther("100");

    // Approve Escrow to spend user's tokens
    await mockAsset.connect(user).approve(escrowAddress, amount);

    // Deposit to Aave via Escrow (adjust function name if different)
    await escrow.connect(user).deposit(amount, 0);

    // Simulate yield accrual
    await mockAToken.mintInterest(escrowAddress, parseEther("10"));

    // Withdraw from Aave via Escrow (adjust function name if different)
    await escrow.connect(user).withdraw(amount, 0);

    // Check user's balance (includes initial + withdrawn + yield)
    const userBalance = await mockAsset.balanceOf(userAddress);
    expect(userBalance).to.equal(parseEther("1010")); // 1000 - 100 + 110
  });
});