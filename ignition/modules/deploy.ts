// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OBEscrowModule = buildModule("OBEscrowModule", (m) => {
    // Deploy Mock Ofac Saction Pool
//   const mockOfacSanction = m.contract("OfacSanction");

  // Deploy PaymentToken
  const paymentToken = m.contract("PaymentToken", ["USD Coin", "USDC"]);

  // Deploy MockAToken with PaymentToken address
  const mockAToken = m.contract("MockAToken", [paymentToken]);
  
  // Deploy MockLendingPool with PaymentToken and MockAToken addresses
  const mockLendingPool = m.contract("MockLendingPool", [paymentToken, mockAToken]);

  // Deploy OBEscrow with PaymentToken and MockLendingPool addresses
  const obEscrow = m.contract("OBEscrow", [paymentToken, mockLendingPool, "0x5f3f1dBD7B74C6B46e8c44f98792A1dAf8d69154"]);
  return { obEscrow, paymentToken, mockLendingPool, mockAToken };
});

export default OBEscrowModule;