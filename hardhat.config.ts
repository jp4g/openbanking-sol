import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    }
  },
  mocha: {
    gas: 120000000,
    blockGasLimit: 1200000000,
    timeout: 300000
  }
};

export default config;