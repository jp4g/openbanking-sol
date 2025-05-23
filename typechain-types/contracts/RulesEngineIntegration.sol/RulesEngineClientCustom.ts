/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface RulesEngineClientCustomInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "rulesEngineAddress"
      | "setCallingContractAdmin"
      | "setRulesEngineAddress"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "rulesEngineAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setCallingContractAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setRulesEngineAddress",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "rulesEngineAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setCallingContractAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRulesEngineAddress",
    data: BytesLike
  ): Result;
}

export interface RulesEngineClientCustom extends BaseContract {
  connect(runner?: ContractRunner | null): RulesEngineClientCustom;
  waitForDeployment(): Promise<this>;

  interface: RulesEngineClientCustomInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  rulesEngineAddress: TypedContractMethod<[], [string], "view">;

  setCallingContractAdmin: TypedContractMethod<
    [callingContractAdmin: AddressLike],
    [void],
    "nonpayable"
  >;

  setRulesEngineAddress: TypedContractMethod<
    [rulesEngine: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "rulesEngineAddress"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "setCallingContractAdmin"
  ): TypedContractMethod<
    [callingContractAdmin: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setRulesEngineAddress"
  ): TypedContractMethod<[rulesEngine: AddressLike], [void], "nonpayable">;

  filters: {};
}
