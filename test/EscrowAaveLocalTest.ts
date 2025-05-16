import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, parseEther } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Escrow Aave Local Tests", function () {
  let mockAsset: any;
  let mockAToken: any;
  let mockLendingPool: any;
  let escrow: any;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    // Deploy mock contracts
    const MockAsset = await ethers.getContractFactory("MockAsset");
    mockAsset = await MockAsset.deploy();
    await mockAsset.waitForDeployment();

    const MockAToken = await ethers.getContractFactory("MockAToken");
    mockAToken = await MockAToken.deploy(await mockAsset.getAddress());
    await mockAToken.waitForDeployment();

    const MockLendingPool = await ethers.getContractFactory("MockLendingPool");
    mockLendingPool = await MockLendingPool.deploy(
      await mockAsset.getAddress(),
      await mockAToken.getAddress()
    );
    await mockLendingPool.waitForDeployment();

    // Deploy our Escrow contract
    const Escrow = await ethers.getContractFactory("OBEscrow");
    escrow = await Escrow.deploy(
      await mockAsset.getAddress(),
      await mockLendingPool.getAddress()
    );
    await escrow.waitForDeployment();

    // Mint tokens to user for testing
    await mockAsset.mint(await user.getAddress(), parseEther("1000"));
  });

  it("should deposit to Aave and withdraw with yield", async function () {
    const amount = parseEther("100");
    const userAddress = await user.getAddress();

    // Get initial balances
    const initialBalance = await mockAsset.balanceOf(userAddress);

    // Approve and deposit
    await mockAsset.connect(user).approve(await escrow.getAddress(), amount);
    await escrow.connect(user).deposit(amount, 0);

    // Simulate time passing and yield accrual
    await mockAToken.mintInterest(await escrow.getAddress(), parseEther("10"));

    // Withdraw
    await escrow.connect(user).withdraw(amount, 0);

    // Check final balance
    const finalBalance = await mockAsset.balanceOf(userAddress);
    expect(finalBalance).to.equal(parseEther("1010")); // 1000 - 100 + 110
  });

  it("should handle multiple deposits and withdrawals", async function () {
    const deposit1 = parseEther("50");
    const deposit2 = parseEther("30");
    const withdraw1 = parseEther("40");
    const userAddress = await user.getAddress();

    // First deposit
    await mockAsset.connect(user).approve(await escrow.getAddress(), deposit1);
    await escrow.connect(user).deposit(deposit1, 0);
    await mockAToken.mintInterest(await escrow.getAddress(), parseEther("5"));

    // Second deposit
    await mockAsset.connect(user).approve(await escrow.getAddress(), deposit2);
    await escrow.connect(user).deposit(deposit2, 0);
    await mockAToken.mintInterest(await escrow.getAddress(), parseEther("3"));

    // Partial withdrawal
    await escrow.connect(user).withdraw(withdraw1, 0);

    // Check balances
    const balance = await mockAsset.balanceOf(userAddress);
    expect(balance).to.equal(parseEther("964")); // 1000 - 50 - 30 + 40 + 4 (yield)
  });

  it("should revert on insufficient balance", async function () {
    const amount = parseEther("100");
    const userAddress = await user.getAddress();

    // Approve and deposit
    await mockAsset.connect(user).approve(await escrow.getAddress(), amount);
    await escrow.connect(user).deposit(amount, 0);

    // Try to withdraw more than deposited
    await expect(
      escrow.connect(user).withdraw(parseEther("150"), 0)
    ).to.be.revertedWith("Insufficient balance in Aave");
  });
}); 