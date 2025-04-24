export {
  type Abi,
  type AbiFunction,
  type AbiParameter,
  type AbiEvent,
  type AbiStateMutability,
  type AbiParameterKind,
  type AbiParameterToPrimitiveType,
  type Address,
  type Narrow,
  type ParseAbi,
  type ParseAbiItem,
  type ParseAbiParameter,
  type ParseAbiParameters,
  type ResolvedRegister,
  type TypedData,
  type TypedDataDomain,
  type TypedDataParameter,
  CircularReferenceError,
  InvalidAbiParameterError,
  InvalidAbiParametersError,
  InvalidAbiItemError,
  InvalidAbiTypeParameterError,
  InvalidFunctionModifierError,
  InvalidModifierError,
  InvalidParameterError,
  InvalidParenthesisError,
  InvalidSignatureError,
  InvalidStructSignatureError,
  SolidityProtectedKeywordError,
  UnknownTypeError,
  UnknownSignatureError,
  parseAbi,
  parseAbiItem,
  parseAbiParameter,
  parseAbiParameters,
} from "viem";
export {
  getContract,
  type GetContractErrorType,
  type GetContractParameters,
  type GetContractReturnType,
} from "viem";
export {
  type GetContractEventsErrorType,
  type GetContractEventsParameters,
  type GetContractEventsReturnType,
} from "viem";
export {
  type GetEip712DomainErrorType,
  type GetEip712DomainParameters,
  type GetEip712DomainReturnType,
} from "viem";
export { type AddChainErrorType, type AddChainParameters } from "viem";
export {
  type CallErrorType,
  type CallParameters,
  type CallReturnType,
} from "viem";
export type {
  CreateAccessListParameters,
  CreateAccessListReturnType,
  CreateAccessListErrorType,
} from "viem";
export type {
  CreateBlockFilterErrorType,
  CreateBlockFilterReturnType,
} from "viem";
export type {
  CreateContractEventFilterErrorType,
  CreateContractEventFilterParameters,
  CreateContractEventFilterReturnType,
} from "viem";
export type {
  CreateEventFilterErrorType,
  CreateEventFilterParameters,
  CreateEventFilterReturnType,
} from "viem";
export type {
  CreatePendingTransactionFilterErrorType,
  CreatePendingTransactionFilterReturnType,
} from "viem";
export type {
  EstimateContractGasErrorType,
  EstimateContractGasParameters,
  EstimateContractGasReturnType,
} from "viem";
export type {
  EstimateGasErrorType,
  EstimateGasParameters,
  EstimateGasReturnType,
} from "viem";
export type {
  EstimateFeesPerGasErrorType,
  EstimateFeesPerGasParameters,
  EstimateFeesPerGasReturnType,
} from "viem";
export type {
  EstimateMaxPriorityFeePerGasErrorType,
  EstimateMaxPriorityFeePerGasParameters,
  EstimateMaxPriorityFeePerGasReturnType,
} from "viem";
export type {
  GetBalanceErrorType,
  GetBalanceParameters,
  GetBalanceReturnType,
} from "viem";
export type { GetBlobBaseFeeErrorType, GetBlobBaseFeeReturnType } from "viem";
export type {
  GetBlockNumberErrorType,
  GetBlockNumberParameters,
  GetBlockNumberReturnType,
} from "viem";
export type {
  GetBlockErrorType,
  GetBlockParameters,
  GetBlockReturnType,
} from "viem";
export type {
  GetBlockTransactionCountErrorType,
  GetBlockTransactionCountParameters,
  GetBlockTransactionCountReturnType,
} from "viem";
export type {
  /** @deprecated Use `GetCodeErrorType` instead */
  GetCodeErrorType as GetBytecodeErrorType,
  /** @deprecated Use `GetCodeParameters` instead */
  GetCodeParameters as GetBytecodeParameters,
  /** @deprecated Use `GetCodeReturnType` instead  */
  GetCodeReturnType as GetBytecodeReturnType,
  GetCodeErrorType,
  GetCodeParameters,
  GetCodeReturnType,
} from "viem";
export type { GetChainIdErrorType, GetChainIdReturnType } from "viem";
export type {
  GetFeeHistoryErrorType,
  GetFeeHistoryParameters,
  GetFeeHistoryReturnType,
} from "viem";
export type {
  GetFilterChangesErrorType,
  GetFilterChangesParameters,
  GetFilterChangesReturnType,
} from "viem";
export type {
  GetFilterLogsErrorType,
  GetFilterLogsParameters,
  GetFilterLogsReturnType,
} from "viem";
export type { GetGasPriceErrorType, GetGasPriceReturnType } from "viem";
export type {
  GetLogsErrorType,
  GetLogsParameters,
  GetLogsReturnType,
} from "viem";
export type {
  GetProofErrorType,
  GetProofParameters,
  GetProofReturnType,
} from "viem";
export type {
  GetStorageAtErrorType,
  GetStorageAtParameters,
  GetStorageAtReturnType,
} from "viem";
export type {
  GetTransactionConfirmationsErrorType,
  GetTransactionConfirmationsParameters,
  GetTransactionConfirmationsReturnType,
} from "viem";
export type {
  GetTransactionCountErrorType,
  GetTransactionCountParameters,
  GetTransactionCountReturnType,
} from "viem";
export type {
  GetTransactionErrorType,
  GetTransactionParameters,
  GetTransactionReturnType,
} from "viem";
export type {
  GetTransactionReceiptErrorType,
  GetTransactionReceiptParameters,
  GetTransactionReceiptReturnType,
} from "viem";
export type {
  MulticallErrorType,
  MulticallParameters,
  MulticallReturnType,
} from "viem";
export type {
  SimulateBlocksParameters,
  SimulateBlocksReturnType,
  SimulateBlocksErrorType,
} from "viem";
export type {
  SimulateCallsParameters,
  SimulateCallsReturnType,
  SimulateCallsErrorType,
} from "viem";
export type {
  GetMutabilityAwareValue,
  SimulateContractParameters,
  SimulateContractReturnType,
  SimulateContractErrorType,
} from "viem";
export type {
  OnBlock,
  OnBlockParameter,
  WatchBlocksErrorType,
  WatchBlocksParameters,
  WatchBlocksReturnType,
} from "viem";
export type {
  OnBlockNumberFn,
  OnBlockNumberParameter,
  WatchBlockNumberErrorType,
  WatchBlockNumberParameters,
  WatchBlockNumberReturnType,
} from "viem";
export type {
  WatchEventOnLogsFn,
  WatchEventOnLogsParameter,
  WatchEventErrorType,
  WatchEventParameters,
  WatchEventReturnType,
} from "viem";
export type {
  OnTransactionsFn,
  OnTransactionsParameter,
  WatchPendingTransactionsErrorType,
  WatchPendingTransactionsParameters,
  WatchPendingTransactionsReturnType,
} from "viem";
export type {
  ReadContractErrorType,
  ReadContractParameters,
  ReadContractReturnType,
} from "viem";
export type {
  ReplacementReason,
  ReplacementReturnType,
  WaitForTransactionReceiptErrorType,
  WaitForTransactionReceiptParameters,
  WaitForTransactionReceiptReturnType,
} from "viem";
export type {
  UninstallFilterErrorType,
  UninstallFilterParameters,
  UninstallFilterReturnType,
} from "viem";
export type {
  VerifyHashErrorType as VerifyHashActionErrorType,
  VerifyHashParameters as VerifyHashActionParameters,
  VerifyHashReturnType as VerifyHashActionReturnType,
} from "viem";
export type {
  VerifyTypedDataErrorType as VerifyTypedDataActionErrorType,
  VerifyTypedDataParameters as VerifyTypedDataActionParameters,
  VerifyTypedDataReturnType as VerifyTypedDataActionReturnType,
} from "viem";
export type {
  VerifyMessageErrorType as VerifyMessageActionErrorType,
  VerifyMessageParameters as VerifyMessageActionParameters,
  VerifyMessageReturnType as VerifyMessageActionReturnType,
} from "viem";
export type {
  WatchContractEventOnLogsFn,
  WatchContractEventOnLogsParameter,
  WatchContractEventErrorType,
  WatchContractEventParameters,
  WatchContractEventReturnType,
} from "viem";
export type { Call, Calls } from "viem";
export type {
  Chain,
  ChainConfig,
  ChainContract,
  ChainEstimateFeesPerGasFn,
  ChainFees,
  ChainFeesFnParameters,
  ChainFormatter,
  ChainEstimateFeesPerGasFnParameters,
  ChainMaxPriorityFeePerGasFn,
  DeriveChain,
  GetChainParameter,
  ChainFormatters,
  ChainSerializers,
  ExtractChainFormatterExclude,
  ExtractChainFormatterParameters,
  ExtractChainFormatterReturnType,
} from "viem";
export {
  type CustomTransport,
  type CustomTransportConfig,
  type CustomTransportErrorType,
  custom,
} from "viem";
export {
  type FallbackTransport,
  type FallbackTransportConfig,
  type FallbackTransportErrorType,
  fallback,
  shouldThrow,
} from "viem";
export {
  type HttpTransport,
  type HttpTransportConfig,
  type HttpTransportErrorType,
  http,
} from "viem";
export {
  type Transport,
  type TransportConfig,
  type CreateTransportErrorType,
  createTransport,
} from "viem";
export {
  type WebSocketTransport,
  type WebSocketTransportConfig,
  type WebSocketTransportErrorType,
  webSocket,
} from "viem";
export {
  multicall3Abi,
  erc20Abi,
  erc20Abi_bytes32,
  erc721Abi,
  erc4626Abi,
  universalSignatureValidatorAbi,
} from "viem";
export { ethAddress, zeroAddress } from "viem";
export {
  deploylessCallViaBytecodeBytecode,
  deploylessCallViaFactoryBytecode,
  universalSignatureValidatorByteCode,
} from "viem";
export { etherUnits, gweiUnits, weiUnits } from "viem";
export {
  maxInt8,
  maxInt16,
  maxInt24,
  maxInt32,
  maxInt40,
  maxInt48,
  maxInt56,
  maxInt64,
  maxInt72,
  maxInt80,
  maxInt88,
  maxInt96,
  maxInt104,
  maxInt112,
  maxInt120,
  maxInt128,
  maxInt136,
  maxInt144,
  maxInt152,
  maxInt160,
  maxInt168,
  maxInt176,
  maxInt184,
  maxInt192,
  maxInt200,
  maxInt208,
  maxInt216,
  maxInt224,
  maxInt232,
  maxInt240,
  maxInt248,
  maxInt256,
  maxUint8,
  maxUint16,
  maxUint24,
  maxUint32,
  maxUint40,
  maxUint48,
  maxUint56,
  maxUint64,
  maxUint72,
  maxUint80,
  maxUint88,
  maxUint96,
  maxUint104,
  maxUint112,
  maxUint120,
  maxUint128,
  maxUint136,
  maxUint144,
  maxUint152,
  maxUint160,
  maxUint168,
  maxUint176,
  maxUint184,
  maxUint192,
  maxUint200,
  maxUint208,
  maxUint216,
  maxUint224,
  maxUint232,
  maxUint240,
  maxUint248,
  maxUint256,
  minInt8,
  minInt16,
  minInt24,
  minInt32,
  minInt40,
  minInt48,
  minInt56,
  minInt64,
  minInt72,
  minInt80,
  minInt88,
  minInt96,
  minInt104,
  minInt112,
  minInt120,
  minInt128,
  minInt136,
  minInt144,
  minInt152,
  minInt160,
  minInt168,
  minInt176,
  minInt184,
  minInt192,
  minInt200,
  minInt208,
  minInt216,
  minInt224,
  minInt232,
  minInt240,
  minInt248,
  minInt256,
} from "viem";
export { zeroHash } from "viem";
export { presignMessagePrefix } from "viem";
export {
  AbiConstructorNotFoundError,
  type AbiConstructorNotFoundErrorType,
  AbiConstructorParamsNotFoundError,
  type AbiConstructorParamsNotFoundErrorType,
  AbiDecodingDataSizeInvalidError,
  type AbiDecodingDataSizeInvalidErrorType,
  AbiDecodingDataSizeTooSmallError,
  type AbiDecodingDataSizeTooSmallErrorType,
  AbiDecodingZeroDataError,
  type AbiDecodingZeroDataErrorType,
  AbiEncodingArrayLengthMismatchError,
  type AbiEncodingArrayLengthMismatchErrorType,
  AbiEncodingLengthMismatchError,
  type AbiEncodingLengthMismatchErrorType,
  AbiEncodingBytesSizeMismatchError,
  type AbiEncodingBytesSizeMismatchErrorType,
  AbiErrorInputsNotFoundError,
  type AbiErrorInputsNotFoundErrorType,
  AbiErrorNotFoundError,
  type AbiErrorNotFoundErrorType,
  AbiErrorSignatureNotFoundError,
  type AbiErrorSignatureNotFoundErrorType,
  AbiEventNotFoundError,
  type AbiEventNotFoundErrorType,
  AbiEventSignatureEmptyTopicsError,
  type AbiEventSignatureEmptyTopicsErrorType,
  AbiEventSignatureNotFoundError,
  type AbiEventSignatureNotFoundErrorType,
  AbiFunctionNotFoundError,
  type AbiFunctionNotFoundErrorType,
  AbiFunctionOutputsNotFoundError,
  type AbiFunctionOutputsNotFoundErrorType,
  AbiFunctionSignatureNotFoundError,
  type AbiFunctionSignatureNotFoundErrorType,
  BytesSizeMismatchError,
  type BytesSizeMismatchErrorType,
  DecodeLogDataMismatch,
  type DecodeLogDataMismatchErrorType,
  DecodeLogTopicsMismatch,
  type DecodeLogTopicsMismatchErrorType,
  InvalidAbiDecodingTypeError,
  type InvalidAbiDecodingTypeErrorType,
  InvalidAbiEncodingTypeError,
  type InvalidAbiEncodingTypeErrorType,
  InvalidArrayError,
  type InvalidArrayErrorType,
  InvalidDefinitionTypeError,
  type InvalidDefinitionTypeErrorType,
  UnsupportedPackedAbiType,
  type UnsupportedPackedAbiTypeErrorType,
} from "viem";
export { BaseError, type BaseErrorType, setErrorConfig } from "viem";
export { BlockNotFoundError, type BlockNotFoundErrorType } from "viem";
export {
  CallExecutionError,
  type CallExecutionErrorType,
  ContractFunctionExecutionError,
  type ContractFunctionExecutionErrorType,
  ContractFunctionRevertedError,
  type ContractFunctionRevertedErrorType,
  ContractFunctionZeroDataError,
  type ContractFunctionZeroDataErrorType,
  RawContractError,
  type RawContractErrorType,
  CounterfactualDeploymentFailedError,
  type CounterfactualDeploymentFailedErrorType,
} from "viem";
export {
  BaseFeeScalarError,
  type BaseFeeScalarErrorType,
  Eip1559FeesNotSupportedError,
  type Eip1559FeesNotSupportedErrorType,
  MaxFeePerGasTooLowError,
  type MaxFeePerGasTooLowErrorType,
} from "viem";
export {
  ChainDisconnectedError,
  type ChainDisconnectedErrorType,
  InternalRpcError,
  type InternalRpcErrorType,
  InvalidInputRpcError,
  type InvalidInputRpcErrorType,
  InvalidParamsRpcError,
  type InvalidParamsRpcErrorType,
  InvalidRequestRpcError,
  type InvalidRequestRpcErrorType,
  JsonRpcVersionUnsupportedError,
  type JsonRpcVersionUnsupportedErrorType,
  LimitExceededRpcError,
  type LimitExceededRpcErrorType,
  MethodNotFoundRpcError,
  type MethodNotFoundRpcErrorType,
  MethodNotSupportedRpcError,
  type MethodNotSupportedRpcErrorType,
  ParseRpcError,
  type ParseRpcErrorType,
  ProviderDisconnectedError,
  type ProviderDisconnectedErrorType,
  ProviderRpcError,
  type ProviderRpcErrorCode,
  type ProviderRpcErrorType,
  ResourceNotFoundRpcError,
  type ResourceNotFoundRpcErrorType,
  ResourceUnavailableRpcError,
  type ResourceUnavailableRpcErrorType,
  RpcError,
  type RpcErrorType,
  type RpcErrorCode,
  SwitchChainError,
  TransactionRejectedRpcError,
  type TransactionRejectedRpcErrorType,
  UnauthorizedProviderError,
  type UnauthorizedProviderErrorType,
  UnknownRpcError,
  type UnknownRpcErrorType,
  UnsupportedProviderMethodError,
  type UnsupportedProviderMethodErrorType,
  UserRejectedRequestError,
  type UserRejectedRequestErrorType,
} from "viem";
export {
  ChainDoesNotSupportContract,
  type ChainDoesNotSupportContractErrorType,
  ChainMismatchError,
  type ChainMismatchErrorType,
  ChainNotFoundError,
  type ChainNotFoundErrorType,
  ClientChainNotConfiguredError,
  type ClientChainNotConfiguredErrorType,
  InvalidChainIdError,
  type InvalidChainIdErrorType,
} from "viem";
export {
  InvalidBytesBooleanError,
  type InvalidBytesBooleanErrorType,
  IntegerOutOfRangeError,
  type IntegerOutOfRangeErrorType,
  InvalidHexBooleanError,
  type InvalidHexBooleanErrorType,
  InvalidHexValueError,
  type InvalidHexValueErrorType,
  SizeOverflowError,
  type SizeOverflowErrorType,
} from "viem";
export {
  type InvalidDecimalNumberErrorType,
  InvalidDecimalNumberError,
} from "viem";
export {
  EstimateGasExecutionError,
  type EstimateGasExecutionErrorType,
} from "viem";
export {
  ExecutionRevertedError,
  type ExecutionRevertedErrorType,
  FeeCapTooHighError,
  type FeeCapTooHighErrorType,
  FeeCapTooLowError,
  type FeeCapTooLowErrorType,
  InsufficientFundsError,
  type InsufficientFundsErrorType,
  IntrinsicGasTooHighError,
  type IntrinsicGasTooHighErrorType,
  IntrinsicGasTooLowError,
  type IntrinsicGasTooLowErrorType,
  NonceMaxValueError,
  type NonceMaxValueErrorType,
  NonceTooHighError,
  type NonceTooHighErrorType,
  NonceTooLowError,
  type NonceTooLowErrorType,
  TipAboveFeeCapError,
  type TipAboveFeeCapErrorType,
  TransactionTypeNotSupportedError,
  type TransactionTypeNotSupportedErrorType,
  UnknownNodeError,
  type UnknownNodeErrorType,
} from "viem";
export {
  FilterTypeNotSupportedError,
  type FilterTypeNotSupportedErrorType,
} from "viem";
export {
  HttpRequestError,
  type HttpRequestErrorType,
  RpcRequestError,
  type RpcRequestErrorType,
  TimeoutError,
  type TimeoutErrorType,
  SocketClosedError,
  type SocketClosedErrorType,
  WebSocketRequestError,
  type WebSocketRequestErrorType,
} from "viem";
export { InvalidAddressError, type InvalidAddressErrorType } from "viem";
export {
  FeeConflictError,
  type FeeConflictErrorType,
  InvalidLegacyVError,
  type InvalidLegacyVErrorType,
  InvalidSerializableTransactionError,
  type InvalidSerializableTransactionErrorType,
  InvalidSerializedTransactionError,
  type InvalidSerializedTransactionErrorType,
  InvalidSerializedTransactionTypeError,
  type InvalidSerializedTransactionTypeErrorType,
  InvalidStorageKeySizeError,
  type InvalidStorageKeySizeErrorType,
  TransactionExecutionError,
  type TransactionExecutionErrorType,
  TransactionNotFoundError,
  type TransactionNotFoundErrorType,
  TransactionReceiptNotFoundError,
  type TransactionReceiptNotFoundErrorType,
  WaitForTransactionReceiptTimeoutError,
  type WaitForTransactionReceiptTimeoutErrorType,
} from "viem";
export {
  SizeExceedsPaddingSizeError,
  type SizeExceedsPaddingSizeErrorType,
  SliceOffsetOutOfBoundsError,
  type SliceOffsetOutOfBoundsErrorType,
} from "viem";
export { UrlRequiredError, type UrlRequiredErrorType } from "viem";
export {
  AccountStateConflictError,
  type AccountStateConflictErrorType,
  StateAssignmentConflictError,
  type StateAssignmentConflictErrorType,
} from "viem";
export {
  InvalidDomainError,
  type InvalidDomainErrorType,
  InvalidPrimaryTypeError,
  type InvalidPrimaryTypeErrorType,
  InvalidStructTypeError,
  type InvalidStructTypeErrorType,
} from "viem";
export type {
  AbiEventParameterToPrimitiveType,
  AbiEventParametersToPrimitiveTypes,
  AbiEventTopicToPrimitiveType,
  AbiItem,
  AbiItemArgs,
  AbiItemName,
  ContractConstructorArgs,
  ContractEventArgsFromTopics,
  EventDefinition,
  ExtractAbiFunctionForArgs,
  ExtractAbiItem,
  ExtractAbiItemForArgs,
  ExtractAbiItemNames,
  ContractErrorArgs,
  ContractErrorName,
  ContractEventArgs,
  ContractEventName,
  ContractFunctionParameters,
  ContractFunctionReturnType,
  ContractFunctionArgs,
  ContractFunctionName,
  GetEventArgs,
  GetValue,
  LogTopicType,
  MaybeAbiEventName,
  MaybeExtractEventArgsFromAbi,
  UnionWiden,
  Widen,
} from "viem";
export type {
  AccessList,
  Transaction,
  TransactionBase,
  TransactionEIP1559,
  TransactionEIP2930,
  TransactionEIP4844,
  TransactionEIP7702,
  TransactionLegacy,
  TransactionReceipt,
  TransactionRequest,
  TransactionRequestBase,
  TransactionRequestEIP1559,
  TransactionRequestEIP2930,
  TransactionRequestEIP4844,
  TransactionRequestEIP7702,
  TransactionRequestGeneric,
  TransactionRequestLegacy,
  TransactionSerializable,
  TransactionSerializableBase,
  TransactionSerializableEIP1559,
  TransactionSerializableEIP2930,
  TransactionSerializableEIP4844,
  TransactionSerializableEIP7702,
  TransactionSerializableGeneric,
  TransactionSerializableLegacy,
  TransactionSerialized,
  TransactionSerializedEIP1559,
  TransactionSerializedEIP2930,
  TransactionSerializedEIP4844,
  TransactionSerializedEIP7702,
  TransactionSerializedGeneric,
  TransactionSerializedLegacy,
  TransactionType,
} from "viem";
export type {
  Assign,
  Branded,
  Evaluate,
  IsNarrowable,
  IsUndefined,
  IsUnion,
  LooseOmit,
  MaybePartial,
  MaybePromise,
  MaybeRequired,
  Mutable,
  NoInfer,
  NoUndefined,
  Omit,
  Or,
  PartialBy,
  RequiredBy,
  Some,
  UnionEvaluate,
  UnionLooseOmit,
  ValueOf,
  Prettify,
  ExactPartial,
  ExactRequired,
  IsNever,
  OneOf,
  UnionOmit,
  UnionPartialBy,
  UnionPick,
  UnionRequiredBy,
  UnionToTuple,
} from "viem";
export type {
  Block,
  BlockIdentifier,
  BlockNumber,
  BlockTag,
  Uncle,
} from "viem";
export type {
  ByteArray,
  Hash,
  Hex,
  LogTopic,
  Signature,
  CompactSignature,
  SignableMessage,
} from "viem";
export type {
  AddEthereumChainParameter,
  BundlerRpcSchema,
  DebugBundlerRpcSchema,
  EIP1193EventMap,
  EIP1193Events,
  EIP1193Parameters,
  EIP1193Provider,
  EIP1193RequestFn,
  EIP1474Methods,
  ProviderRpcErrorType as EIP1193ProviderRpcErrorType,
  ProviderConnectInfo,
  ProviderMessage,
  PublicRpcSchema,
  PaymasterRpcSchema,
  NetworkSync,
  RpcSchema,
  RpcSchemaOverride,
  TestRpcSchema,
  WalletCapabilities,
  WalletCapabilitiesRecord,
  WalletCallReceipt,
  WalletGetCallsStatusReturnType,
  WalletGrantPermissionsParameters,
  WalletGrantPermissionsReturnType,
  WalletSendCallsParameters,
  WalletSendCallsReturnType,
  WalletPermissionCaveat,
  WalletPermission,
  WalletRpcSchema,
  WatchAssetParams,
} from "viem";
export { ProviderRpcError as EIP1193ProviderRpcError } from "viem";
export type { BlobSidecar, BlobSidecars } from "viem";
export type {
  FeeHistory,
  FeeValues,
  FeeValuesEIP1559,
  FeeValuesEIP4844,
  FeeValuesLegacy,
  FeeValuesType,
} from "viem";
export type { Filter, FilterType } from "viem";
export type { TypedDataDefinition } from "viem";
export type { GetTransportConfig, GetPollOptions } from "viem";
export type { Log } from "viem";
export type {
  MulticallContracts,
  MulticallResponse,
  MulticallResults,
} from "viem";
export type {
  Authorization,
  AuthorizationList,
  SerializedAuthorization,
  SerializedAuthorizationList,
  SignedAuthorization,
  SignedAuthorizationList,
} from "viem";
export type {
  Index,
  Quantity,
  RpcAuthorization,
  RpcAuthorizationList,
  RpcBlock,
  RpcBlockIdentifier,
  RpcBlockNumber,
  RpcFeeHistory,
  RpcFeeValues,
  RpcLog,
  RpcTransaction,
  RpcTransactionReceipt,
  RpcTransactionRequest,
  RpcUncle,
  Status,
  RpcProof,
  RpcAccountStateOverride,
  RpcStateOverride,
  RpcStateMapping,
} from "viem";
export type { Withdrawal } from "viem";
export type { StateMapping, StateOverride } from "viem";
export { labelhash, type LabelhashErrorType } from "viem";
export { namehash, type NamehashErrorType } from "viem";
export {
  type FormattedBlock,
  defineBlock,
  type DefineBlockErrorType,
  formatBlock,
  type FormatBlockErrorType,
} from "viem";
export { formatLog, type FormatLogErrorType } from "viem";
export {
  type DecodeAbiParametersErrorType,
  type DecodeAbiParametersReturnType,
  decodeAbiParameters,
} from "viem";
export {
  type DecodeDeployDataErrorType,
  type DecodeDeployDataParameters,
  type DecodeDeployDataReturnType,
  decodeDeployData,
} from "viem";
export {
  type DecodeErrorResultErrorType,
  type DecodeErrorResultParameters,
  type DecodeErrorResultReturnType,
  decodeErrorResult,
} from "viem";
export {
  type DecodeEventLogErrorType,
  type DecodeEventLogParameters,
  type DecodeEventLogReturnType,
  decodeEventLog,
} from "viem";
export {
  type DecodeFunctionDataErrorType,
  type DecodeFunctionDataParameters,
  type DecodeFunctionDataReturnType,
  decodeFunctionData,
} from "viem";
export {
  type DecodeFunctionResultErrorType,
  type DecodeFunctionResultParameters,
  type DecodeFunctionResultReturnType,
  decodeFunctionResult,
} from "viem";
export {
  type EncodeAbiParametersErrorType,
  type EncodeAbiParametersReturnType,
  encodeAbiParameters,
} from "viem";
export {
  type EncodeDeployDataErrorType,
  type EncodeDeployDataParameters,
  type EncodeDeployDataReturnType,
  encodeDeployData,
} from "viem";
export {
  type EncodeErrorResultErrorType,
  type EncodeErrorResultParameters,
  type EncodeErrorResultReturnType,
  encodeErrorResult,
} from "viem";
export {
  type EncodeEventTopicsErrorType,
  type EncodeEventTopicsParameters,
  type EncodeEventTopicsReturnType,
  encodeEventTopics,
} from "viem";
export {
  type EncodeFunctionDataErrorType,
  type EncodeFunctionDataParameters,
  type EncodeFunctionDataReturnType,
  encodeFunctionData,
} from "viem";
export {
  type PrepareEncodeFunctionDataErrorType,
  type PrepareEncodeFunctionDataParameters,
  type PrepareEncodeFunctionDataReturnType,
  prepareEncodeFunctionData,
} from "viem";
export {
  type EncodeFunctionResultErrorType,
  type EncodeFunctionResultParameters,
  type EncodeFunctionResultReturnType,
  encodeFunctionResult,
} from "viem";
export {
  type ParseEventLogsErrorType,
  type ParseEventLogsParameters,
  type ParseEventLogsReturnType,
  parseEventLogs,
} from "viem";
export {
  type FormattedTransaction,
  defineTransaction,
  type DefineTransactionErrorType,
  formatTransaction,
  type FormatTransactionErrorType,
  transactionType,
} from "viem";
export {
  type FormattedTransactionReceipt,
  defineTransactionReceipt,
  type DefineTransactionReceiptErrorType,
  formatTransactionReceipt,
  type FormatTransactionReceiptErrorType,
} from "viem";
export {
  type FormattedTransactionRequest,
  defineTransactionRequest,
  type DefineTransactionRequestErrorType,
  formatTransactionRequest,
  type FormatTransactionRequestErrorType,
  rpcTransactionType,
} from "viem";
export {
  type GetAbiItemErrorType,
  type GetAbiItemParameters,
  type GetAbiItemReturnType,
  getAbiItem,
} from "viem";
export {
  type GetContractAddressOptions,
  type GetCreate2AddressOptions,
  type GetCreate2AddressErrorType,
  type GetCreateAddressOptions,
  type GetCreateAddressErrorType,
  getContractAddress,
  getCreate2Address,
  getCreateAddress,
} from "viem";
export {
  type GetSerializedTransactionType,
  type GetSerializedTransactionTypeErrorType,
  getSerializedTransactionType,
} from "viem";
export {
  type GetTransactionType,
  type GetTransactionTypeErrorType,
  getTransactionType,
} from "viem";
export {
  type HashDomainErrorType,
  type HashStructErrorType,
  type HashTypedDataErrorType,
  type HashTypedDataParameters,
  type HashTypedDataReturnType,
  hashDomain,
  hashStruct,
  hashTypedData,
} from "viem";
export {
  type CompactSignatureToSignatureErrorType,
  compactSignatureToSignature,
} from "viem";
export {
  /** @deprecated Use `ParseCompactSignatureErrorType`. */
  type ParseCompactSignatureErrorType as HexToCompactSignatureErrorType,
  /** @deprecated Use `parseCompactSignature`. */
  parseCompactSignature as hexToCompactSignature,
  type ParseCompactSignatureErrorType,
  parseCompactSignature,
} from "viem";
export {
  /** @deprecated Use `ParseSignatureErrorType`. */
  type ParseSignatureErrorType as HexToSignatureErrorType,
  /** @deprecated Use `parseSignature`. */
  parseSignature as hexToSignature,
  type ParseSignatureErrorType,
  parseSignature,
} from "viem";
export {
  type RecoverAddressErrorType,
  type RecoverAddressParameters,
  type RecoverAddressReturnType,
  recoverAddress,
} from "viem";
export {
  type RecoverMessageAddressErrorType,
  type RecoverMessageAddressParameters,
  type RecoverMessageAddressReturnType,
  recoverMessageAddress,
} from "viem";
export {
  type RecoverPublicKeyErrorType,
  type RecoverPublicKeyParameters,
  type RecoverPublicKeyReturnType,
  recoverPublicKey,
} from "viem";
export {
  type RecoverTransactionAddressErrorType,
  type RecoverTransactionAddressParameters,
  type RecoverTransactionAddressReturnType,
  recoverTransactionAddress,
} from "viem";
export {
  type RecoverTypedDataAddressErrorType,
  type RecoverTypedDataAddressParameters,
  type RecoverTypedDataAddressReturnType,
  recoverTypedDataAddress,
} from "viem";
export {
  type SignatureToCompactSignatureErrorType,
  signatureToCompactSignature,
} from "viem";
export {
  /** @deprecated Use `SignatureToHexErrorType` instead. */
  type SerializeCompactSignatureErrorType as CompactSignatureToHexErrorType,
  /** @deprecated Use `serializeCompactSignature` instead. */
  serializeCompactSignature as compactSignatureToHex,
  type SerializeCompactSignatureErrorType,
  serializeCompactSignature,
} from "viem";
export {
  /** @deprecated Use `SignatureToHexErrorType` instead. */
  type SerializeSignatureErrorType as SignatureToHexErrorType,
  /** @deprecated Use `serializeSignature` instead. */
  serializeSignature as signatureToHex,
  type SerializeSignatureParameters,
  type SerializeSignatureReturnType,
  type SerializeSignatureErrorType,
  serializeSignature,
} from "viem";
export {
  bytesToRlp,
  type BytesToRlpErrorType,
  hexToRlp,
  type HexToRlpErrorType,
  toRlp,
  type ToRlpErrorType,
  type ToRlpReturnType,
} from "viem";
export {
  type VerifyHashErrorType,
  type VerifyHashParameters,
  type VerifyHashReturnType,
  verifyHash,
} from "viem";
export {
  type VerifyMessageErrorType,
  type VerifyMessageParameters,
  type VerifyMessageReturnType,
  verifyMessage,
} from "viem";
export {
  type VerifyTypedDataErrorType,
  type VerifyTypedDataParameters,
  type VerifyTypedDataReturnType,
  verifyTypedData,
} from "viem";
export {
  type ParseErc6492SignatureErrorType,
  type ParseErc6492SignatureParameters,
  type ParseErc6492SignatureReturnType,
  parseErc6492Signature,
} from "viem";
export {
  type IsErc6492SignatureErrorType,
  type IsErc6492SignatureParameters,
  type IsErc6492SignatureReturnType,
  isErc6492Signature,
} from "viem";
export {
  type SerializeErc6492SignatureErrorType,
  type SerializeErc6492SignatureParameters,
  type SerializeErc6492SignatureReturnType,
  serializeErc6492Signature,
} from "viem";
export { type AssertRequestErrorType, assertRequest } from "viem";
export {
  type AssertTransactionEIP1559ErrorType,
  assertTransactionEIP1559,
  type AssertTransactionEIP2930ErrorType,
  assertTransactionEIP2930,
  type AssertTransactionLegacyErrorType,
  assertTransactionLegacy,
} from "viem";
export {
  type BoolToBytesErrorType,
  type BoolToBytesOpts,
  boolToBytes,
  type HexToBytesErrorType,
  type HexToBytesOpts,
  hexToBytes,
  type NumberToBytesErrorType,
  numberToBytes,
  type StringToBytesErrorType,
  type StringToBytesOpts,
  stringToBytes,
  type ToBytesErrorType,
  type ToBytesParameters,
  toBytes,
} from "viem";
export {
  type BoolToHexErrorType,
  type BoolToHexOpts,
  boolToHex,
  type BytesToHexErrorType,
  type BytesToHexOpts,
  bytesToHex,
  type NumberToHexErrorType,
  type NumberToHexOpts,
  numberToHex,
  type StringToHexErrorType,
  type StringToHexOpts,
  stringToHex,
  type ToHexErrorType,
  type ToHexParameters,
  toHex,
} from "viem";
export {
  type BytesToBigIntErrorType,
  type BytesToBigIntOpts,
  bytesToBigInt,
  type BytesToBoolErrorType,
  type BytesToBoolOpts,
  bytesToBool,
  type BytesToNumberErrorType,
  type BytesToNumberOpts,
  bytesToNumber,
  type BytesToStringErrorType,
  type BytesToStringOpts,
  bytesToString,
  type FromBytesErrorType,
  type FromBytesParameters,
  fromBytes,
} from "viem";
export {
  type CcipRequestParameters,
  type CcipRequestErrorType,
  ccipRequest,
  /** @deprecated Use `ccipRequest`. */
  ccipRequest as ccipFetch,
  type OffchainLookupErrorType,
  offchainLookup,
  offchainLookupAbiItem,
  offchainLookupSignature,
} from "viem";
export {
  type ConcatBytesErrorType,
  type ConcatErrorType,
  type ConcatHexErrorType,
  type ConcatReturnType,
  concat,
  concatBytes,
  concatHex,
} from "viem";
export {
  type AssertCurrentChainErrorType,
  type AssertCurrentChainParameters,
  assertCurrentChain,
} from "viem";
export { defineChain } from "viem";
export {
  type ExtractChainErrorType,
  type ExtractChainParameters,
  type ExtractChainReturnType,
  extractChain,
} from "viem";
export {
  type GetChainContractAddressErrorType,
  getChainContractAddress,
} from "viem";
export { type EncodePackedErrorType, encodePacked } from "viem";
export { withCache } from "viem";
export { type WithRetryErrorType, withRetry } from "viem";
export { type WithTimeoutErrorType, withTimeout } from "viem";
export { type FormatEtherErrorType, formatEther } from "viem";
export { type FormatGweiErrorType, formatGwei } from "viem";
export { type FormatUnitsErrorType, formatUnits } from "viem";
export {
  type FromHexErrorType,
  fromHex,
  type HexToBigIntErrorType,
  hexToBigInt,
  type HexToBoolErrorType,
  hexToBool,
  type HexToNumberErrorType,
  hexToNumber,
  type HexToStringErrorType,
  hexToString,
} from "viem";
export { type FromRlpErrorType, type FromRlpReturnType, fromRlp } from "viem";
export {
  type ChecksumAddressErrorType,
  type GetAddressErrorType,
  checksumAddress,
  getAddress,
} from "viem";
export { type GetContractErrorReturnType, getContractError } from "viem";
export {
  type ToEventSelectorErrorType,
  toEventSelector,
  /** @deprecated use `ToEventSelectorErrorType`. */
  type ToEventSelectorErrorType as GetEventSelectorErrorType,
  /** @deprecated use `toEventSelector`. */
  toEventSelector as getEventSelector,
} from "viem";
export {
  type ToFunctionSelectorErrorType,
  toFunctionSelector,
  /** @deprecated use `ToFunctionSelectorErrorType`. */
  type ToFunctionSelectorErrorType as GetFunctionSelectorErrorType,
  /** @deprecated use `toFunctionSelector`. */
  toFunctionSelector as getFunctionSelector,
} from "viem";
export {
  type ToEventSignatureErrorType,
  toEventSignature,
  /** @deprecated use `ToEventSignatureErrorType`. */
  type ToEventSignatureErrorType as GetEventSignatureErrorType,
  /** @deprecated use `toEventSignature`. */
  toEventSignature as getEventSignature,
} from "viem";
export {
  type ToFunctionSignatureErrorType,
  toFunctionSignature,
  /** @deprecated use `ToFunctionSignatureErrorType`. */
  type ToFunctionSignatureErrorType as GetFunctionSignatureErrorType,
  /** @deprecated use `toFunctionSignature`. */
  toFunctionSignature as getFunctionSignature,
} from "viem";
export { type ToEventHashErrorType, toEventHash } from "viem";
export { type ToFunctionHashErrorType, toFunctionHash } from "viem";
export { type HashMessageErrorType, hashMessage } from "viem";
export { type ToPrefixedMessageErrorType, toPrefixedMessage } from "viem";
export {
  type IsAddressOptions,
  type IsAddressErrorType,
  isAddress,
} from "viem";
export {
  type IsAddressEqualReturnType,
  type IsAddressEqualErrorType,
  isAddressEqual,
} from "viem";
export { type IsBytesErrorType, isBytes } from "viem";
export { type IsHashErrorType, isHash } from "viem";
export { type IsHexErrorType, isHex } from "viem";
export { type Keccak256Hash, type Keccak256ErrorType, keccak256 } from "viem";
export { type Sha256Hash, type Sha256ErrorType, sha256 } from "viem";
export { type Ripemd160Hash, type Ripemd160ErrorType, ripemd160 } from "viem";
export {
  type PadBytesErrorType,
  type PadErrorType,
  type PadHexErrorType,
  type PadReturnType,
  pad,
  padBytes,
  padHex,
} from "viem";
export { type ParseEtherErrorType, parseEther } from "viem";
export { type ParseGweiErrorType, parseGwei } from "viem";
export {
  type ParseTransactionErrorType,
  type ParseTransactionReturnType,
  parseTransaction,
} from "viem";
export { type ParseUnitsErrorType, parseUnits } from "viem";
export { type SerializeAccessListErrorType, serializeAccessList } from "viem";
export {
  serializeTransaction,
  type SerializeTransactionErrorType,
  type SerializedTransactionReturnType,
  type SerializeTransactionFn,
} from "viem";
export { type SizeErrorType, size } from "viem";
export {
  type SliceBytesErrorType,
  type SliceErrorType,
  type SliceHexErrorType,
  slice,
  sliceBytes,
  sliceHex,
} from "viem";
export { type StringifyErrorType, stringify } from "viem";
export { type TrimErrorType, type TrimReturnType, trim } from "viem";
export {
  type DomainSeparatorErrorType,
  type GetTypesForEIP712DomainErrorType,
  type SerializeTypedDataErrorType,
  type ValidateTypedDataErrorType,
  serializeTypedData,
  validateTypedData,
  domainSeparator,
  getTypesForEIP712Domain,
} from "viem";
import { getContract as viemGetContract } from "viem";
export const myGetContract = viemGetContract; 

// ------------- Custom Clients ------------- //
export {
  type AvalancheCoreClient,
  type AvalancheCoreClientConfig,
  type CreateAvalancheCoreClientErrorType,
  createAvalancheCoreClient  ,
} from './clients/createAvalancheCoreClient.js'
export {
  type PChainClient,
  type PChainClientConfig,
  type CreatePChainClientErrorType,
  createPChainClient,
} from './clients/createPChainClient.js'
export {
  type AvalancheClient,
  type AvalancheClientConfig,
  type CreateAvalancheClientErrorType,
} from './clients/types/createAvalancheClient.js'
export {
  createAvalancheClient,
} from './clients/createAvalancheClient.js'
export {
  type PChainRpcSchema
} from './methods/pchain/pChainRpcSchema.js'

