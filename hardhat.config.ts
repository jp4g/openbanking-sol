import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.27", // Adjust to match your contract's Solidity version
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337, // Local network chain ID
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        count: 10, // Number of test accounts
      },
      allowUnlimitedContractSize: true
    },
    local: {
      url: "http://localhost:8545",
      chainId: 31337, // Local network chain ID
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        count: 10, // Number of test accounts
      },
      allowUnlimitedContractSize: true
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    gas: 120000000,
    blockGasLimit: 1200000000,
    timeout: 300000
  }
};

export default config;