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

export interface OBEscrowInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "aavePool"
      | "deposit"
      | "escrowData"
      | "isWhitelisted"
      | "ofacSanction"
      | "paymentToken"
      | "register"
      | "rulesEngineAddress"
      | "setCallingContractAdmin"
      | "setRulesEngineAddress"
      | "verifier"
      | "verifyTest"
      | "withdraw"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "aavePool", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "escrowData",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isWhitelisted",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "ofacSanction",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "paymentToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "register",
    values: [AddressLike]
  ): string;
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
  encodeFunctionData(functionFragment: "verifier", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "verifyTest",
    values: [BytesLike, BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [BytesLike, BigNumberish, BigNumberish, AddressLike, AddressLike]
  ): string;

  decodeFunctionResult(functionFragment: "aavePool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "escrowData", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isWhitelisted",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "ofacSanction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "paymentToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "register", data: BytesLike): Result;
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
  decodeFunctionResult(functionFragment: "verifier", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "verifyTest", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}

export interface OBEscrow extends BaseContract {
  connect(runner?: ContractRunner | null): OBEscrow;
  waitForDeployment(): Promise<this>;

  interface: OBEscrowInterface;

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

  aavePool: TypedContractMethod<[], [string], "view">;

  deposit: TypedContractMethod<
    [_amount: BigNumberish, _commitment: BigNumberish],
    [void],
    "nonpayable"
  >;

  escrowData: TypedContractMethod<
    [arg0: AddressLike],
    [[bigint, bigint] & { amount: bigint; commitment: bigint }],
    "view"
  >;

  isWhitelisted: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  ofacSanction: TypedContractMethod<[], [string], "view">;

  paymentToken: TypedContractMethod<[], [string], "view">;

  register: TypedContractMethod<[_user: AddressLike], [void], "nonpayable">;

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

  verifier: TypedContractMethod<[], [string], "view">;

  verifyTest: TypedContractMethod<
    [_proof: BytesLike, _publicInputs: BytesLike[]],
    [boolean],
    "view"
  >;

  withdraw: TypedContractMethod<
    [
      _proof: BytesLike,
      _amount: BigNumberish,
      _commitment: BigNumberish,
      _from: AddressLike,
      _to: AddressLike
    ],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "aavePool"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "deposit"
  ): TypedContractMethod<
    [_amount: BigNumberish, _commitment: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "escrowData"
  ): TypedContractMethod<
    [arg0: AddressLike],
    [[bigint, bigint] & { amount: bigint; commitment: bigint }],
    "view"
  >;
  getFunction(
    nameOrSignature: "isWhitelisted"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "ofacSanction"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "paymentToken"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "register"
  ): TypedContractMethod<[_user: AddressLike], [void], "nonpayable">;
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
  getFunction(
    nameOrSignature: "verifier"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "verifyTest"
  ): TypedContractMethod<
    [_proof: BytesLike, _publicInputs: BytesLike[]],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<
    [
      _proof: BytesLike,
      _amount: BigNumberish,
      _commitment: BigNumberish,
      _from: AddressLike,
      _to: AddressLike
    ],
    [void],
    "nonpayable"
  >;

  filters: {};
}
