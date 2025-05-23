/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
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

export interface IAavePoolInterface extends Interface {
  getFunction(nameOrSignature: "supply" | "withdraw"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "supply",
    values: [AddressLike, BigNumberish, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [AddressLike, BigNumberish, AddressLike]
  ): string;

  decodeFunctionResult(functionFragment: "supply", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}

export interface IAavePool extends BaseContract {
  connect(runner?: ContractRunner | null): IAavePool;
  waitForDeployment(): Promise<this>;

  interface: IAavePoolInterface;

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

  supply: TypedContractMethod<
    [
      asset: AddressLike,
      amount: BigNumberish,
      onBehalfOf: AddressLike,
      referralCode: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  withdraw: TypedContractMethod<
    [asset: AddressLike, amount: BigNumberish, to: AddressLike],
    [bigint],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "supply"
  ): TypedContractMethod<
    [
      asset: AddressLike,
      amount: BigNumberish,
      onBehalfOf: AddressLike,
      referralCode: BigNumberish
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<
    [asset: AddressLike, amount: BigNumberish, to: AddressLike],
    [bigint],
    "nonpayable"
  >;

  filters: {};
}
