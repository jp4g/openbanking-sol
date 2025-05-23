/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IRulesEngine,
  IRulesEngineInterface,
} from "../../../../../@thrackle-io/forte-rules-engine/src/client/IRulesEngine";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "arguments",
        type: "bytes",
      },
    ],
    name: "checkPolicies",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_callingContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "grantCallingContractRole",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IRulesEngine__factory {
  static readonly abi = _abi;
  static createInterface(): IRulesEngineInterface {
    return new Interface(_abi) as IRulesEngineInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IRulesEngine {
    return new Contract(address, _abi, runner) as unknown as IRulesEngine;
  }
}
