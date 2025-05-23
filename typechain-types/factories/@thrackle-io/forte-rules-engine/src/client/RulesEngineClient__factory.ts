/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  RulesEngineClient,
  RulesEngineClientInterface,
} from "../../../../../@thrackle-io/forte-rules-engine/src/client/RulesEngineClient";

const _abi = [
  {
    inputs: [],
    name: "rulesEngineAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "callingContractAdmin",
        type: "address",
      },
    ],
    name: "setCallingContractAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "rulesEngine",
        type: "address",
      },
    ],
    name: "setRulesEngineAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class RulesEngineClient__factory {
  static readonly abi = _abi;
  static createInterface(): RulesEngineClientInterface {
    return new Interface(_abi) as RulesEngineClientInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): RulesEngineClient {
    return new Contract(address, _abi, runner) as unknown as RulesEngineClient;
  }
}
