export {
  call,
  createAccessList,
  createBlockFilter,
  createContractEventFilter,
  createEventFilter,
  createPendingTransactionFilter,
  estimateContractGas,
  estimateFeesPerGas,
  estimateGas,
  estimateMaxPriorityFeePerGas,
  getBalance,
  getBlobBaseFee,
  getBlock,
  getBlockNumber,
  getBlockTransactionCount,
  /** @deprecated Use `getCode` instead  */
  getCode as getBytecode,
  getChainId,
  getCode,
  getContractEvents,
  getEip712Domain,
  getFeeHistory,
  getFilterChanges,
  getFilterLogs,
  getGasPrice,
  getLogs,
  getStorageAt,
  getTransaction,
  getTransactionConfirmations,
  getTransactionCount,
  getTransactionReceipt,
  type CallErrorType,
  type CallParameters,
  type CallReturnType,
  type CreateAccessListErrorType,
  type CreateAccessListParameters,
  type CreateAccessListReturnType,
  type CreateBlockFilterErrorType,
  type CreateBlockFilterReturnType,
  type CreateContractEventFilterErrorType,
  type CreateContractEventFilterParameters,
  type CreateContractEventFilterReturnType,
  type CreateEventFilterErrorType,
  type CreateEventFilterParameters,
  type CreateEventFilterReturnType,
  type CreatePendingTransactionFilterErrorType,
  type CreatePendingTransactionFilterReturnType,
  type EstimateContractGasErrorType,
  type EstimateContractGasParameters,
  type EstimateContractGasReturnType,
  type EstimateFeesPerGasErrorType,
  type EstimateFeesPerGasParameters,
  type EstimateFeesPerGasReturnType,
  type EstimateGasErrorType,
  type EstimateGasParameters,
  type EstimateGasReturnType,
  type EstimateMaxPriorityFeePerGasErrorType,
  type EstimateMaxPriorityFeePerGasParameters,
  type EstimateMaxPriorityFeePerGasReturnType,
  type GetBalanceErrorType,
  type GetBalanceParameters,
  type GetBalanceReturnType,
  type GetBlobBaseFeeErrorType,
  type GetBlobBaseFeeReturnType,
  type GetBlockErrorType,
  type GetBlockNumberErrorType,
  type GetBlockNumberParameters,
  type GetBlockNumberReturnType,
  type GetBlockParameters,
  type GetBlockReturnType,
  type GetBlockTransactionCountErrorType,
  type GetBlockTransactionCountParameters,
  type GetBlockTransactionCountReturnType,
  /** @deprecated Use `GetCodeErrorType` instead */
  type GetCodeErrorType as GetBytecodeErrorType,
  /** @deprecated Use `GetCodeParameters` instead */
  type GetCodeParameters as GetBytecodeParameters,
  /** @deprecated Use `GetCodeReturnType` instead  */
  type GetCodeReturnType as GetBytecodeReturnType,
  type GetChainIdErrorType,
  type GetChainIdReturnType,
  type GetCodeErrorType,
  type GetCodeParameters,
  type GetCodeReturnType,
  type GetContractEventsErrorType,
  type GetContractEventsParameters,
  type GetContractEventsReturnType,
  type GetEip712DomainErrorType,
  type GetEip712DomainParameters,
  type GetEip712DomainReturnType,
  type GetFeeHistoryErrorType,
  type GetFeeHistoryParameters,
  type GetFeeHistoryReturnType,
  type GetFilterChangesErrorType,
  type GetFilterChangesParameters,
  type GetFilterChangesReturnType,
  type GetFilterLogsErrorType,
  type GetFilterLogsParameters,
  type GetFilterLogsReturnType,
  type GetGasPriceErrorType,
  type GetGasPriceReturnType,
  type GetLogsErrorType,
  type GetLogsParameters,
  type GetLogsReturnType,
  type GetStorageAtErrorType,
  type GetStorageAtParameters,
  type GetStorageAtReturnType,
  type GetTransactionConfirmationsErrorType,
  type GetTransactionConfirmationsParameters,
  type GetTransactionConfirmationsReturnType,
  type GetTransactionCountErrorType,
  type GetTransactionCountParameters,
  type GetTransactionCountReturnType,
  type GetTransactionErrorType,
  type GetTransactionParameters,
  type GetTransactionReceiptErrorType,
  type GetTransactionReceiptParameters,
  type GetTransactionReceiptReturnType,
  type GetTransactionReturnType,
} from "viem/actions";

export {
  getProof,
  multicall,
  readContract,
  /** @deprecated Use `simulateBlocks` instead */
  simulateBlocks as simulate,
  simulateBlocks,
  simulateCalls,
  simulateContract,
  uninstallFilter,
  verifyHash,
  verifyMessage,
  verifyTypedData,
  waitForTransactionReceipt,
  watchBlockNumber,
  watchBlocks,
  watchContractEvent,
  watchEvent,
  watchPendingTransactions,
  type GetProofErrorType,
  type GetProofParameters,
  type GetProofReturnType,
  type MulticallErrorType,
  type MulticallParameters,
  type MulticallReturnType,
  type OnBlock,
  type OnBlockNumberFn,
  type OnBlockNumberParameter,
  type OnBlockParameter,
  type OnTransactionsFn,
  type OnTransactionsParameter,
  type ReadContractErrorType,
  type ReadContractParameters,
  type ReadContractReturnType,
  type ReplacementReason,
  type ReplacementReturnType,
  type SimulateBlocksErrorType,
  type SimulateBlocksParameters,
  type SimulateBlocksReturnType,
  type SimulateCallsErrorType,
  type SimulateCallsParameters,
  type SimulateCallsReturnType,
  type SimulateContractErrorType,
  type SimulateContractParameters,
  type SimulateContractReturnType,
  /** @deprecated Use `SimulateBlocksErrorType` instead */
  type SimulateBlocksErrorType as SimulateErrorType,
  /** @deprecated Use `SimulateBlocksParameters` instead */
  type SimulateBlocksParameters as SimulateParameters,
  /** @deprecated Use `SimulateBlocksReturnType` instead */
  type SimulateBlocksReturnType as SimulateReturnType,
  type UninstallFilterErrorType,
  type UninstallFilterParameters,
  type UninstallFilterReturnType,
  type VerifyHashErrorType,
  type VerifyHashParameters,
  type VerifyHashReturnType,
  type VerifyMessageErrorType,
  type VerifyMessageParameters,
  type VerifyMessageReturnType,
  type VerifyTypedDataErrorType,
  type VerifyTypedDataParameters,
  type VerifyTypedDataReturnType,
  type WaitForTransactionReceiptErrorType,
  type WaitForTransactionReceiptParameters,
  type WaitForTransactionReceiptReturnType,
  type WatchBlockNumberErrorType,
  type WatchBlockNumberParameters,
  type WatchBlockNumberReturnType,
  type WatchBlocksErrorType,
  type WatchBlocksParameters,
  type WatchBlocksReturnType,
  type WatchContractEventErrorType,
  type WatchContractEventParameters,
  type WatchContractEventReturnType,
  type WatchEventOnLogsFn,
  type WatchEventOnLogsParameter,
  type WatchEventParameters,
  type WatchEventReturnType,
  type WatchPendingTransactionsErrorType,
  type WatchPendingTransactionsParameters,
  type WatchPendingTransactionsReturnType,
} from "viem/actions";

// ------ Avalanche P-Chain Exports ------ //
// export {
//   type Encoding,
//   type PChainBlockType,
//   type BlockchainStatus,
// } from "./pChain/types/common.js"

// export {
//   type GetCurrentValidatorsParameters,
//   type GetCurrentValidatorsReturnType,
//   type GetCurrentValidatorsErrorType,
// } from "./pChain/types/getCurrentValidators.js"
// export {
//   getCurrentValidators
// } from "./pChain/getCurrentValidators.js"

// export {
//   type GetBalanceParameters as GetPChainBalanceParameters,
//   type GetBalanceReturnType as GetPChainBalanceReturnType,
//   type GetBalanceErrorType as GetPChainBalanceErrorType,
// } from "./pChain/types/getBalance.js"
// export {
//   getBalance as getPChainBalance
// } from "./pChain/getPChainBalance.js"

// export {
//   type GetBlockParameters as GetPChainBlockParameters,
//   type GetBlockReturnType as GetPChainBlockReturnType,
//   type GetBlockErrorType as GetPChainBlockErrorType,
// } from "./pChain/types/getBlock.js"
// export {
//   getPChainBlock
// } from "./pChain/getPChainBlock.js"

// export {
//   type GetBlockByHeightParameters,
//   type GetBlockByHeightReturnType,
//   type GetBlockByHeightErrorType,
// } from "./pChain/types/getBlockByHeight.js"
// export {
//   getBlockByHeight
// } from "./pChain/getBlockByHeight.js"

// export {
//   type GetBlockchainsReturnType,
//   type GetBlockchainsErrorType,
// } from "./pChain/types/getBlockchains.js"
// export {
//   getBlockchains
// } from "./pChain/getBlockchains.js"

// export {
//   type GetFeeConfigReturnType,
//   type GetFeeConfigErrorType,
// } from "./pChain/types/getFeeConfig.js"
// export {
//   getFeeConfig
// } from "./pChain/getFeeConfig.js"

// export {
//   type GetHeightReturnType,
//   type GetHeightErrorType,
// } from "./pChain/types/getHeight.js"
// export {
//   getHeight
// } from "./pChain/getHeight.js"

// export {
//   type GetL1ValidatorParameters,
//   type GetL1ValidatorReturnType,
//   type GetL1ValidatorErrorType,
// } from "./pChain/types/getL1Validator.js"
// export {
//   getL1Validator
// } from "./pChain/getL1Validator.js"

// export {
//   type GetMinStakeParameters,
//   type GetMinStakeReturnType,
//   type GetMinStakeErrorType,
// } from "./pChain/types/getMinStake.js"
// export {
//   getMinStake
// } from "./pChain/getMinStake.js"

// export {
//   type GetProposedHeightReturnType,
//   type GetProposedHeightErrorType,
// } from "./pChain/types/getProposedHeight.js"
// export {
//   getProposedHeight
// } from "./pChain/getProposedHeight.js"

// export {
//   type GetRewardUTXOsParameters,
//   type GetRewardUTXOsReturnType,
//   type GetRewardUTXOsErrorType,
// } from "./pChain/types/getRewardUTXOs.js"
// export {
//   getRewardUTXOs
// } from "./pChain/getRewardUTXOs.js"

// export {
//   type GetStakeParameters,
//   type GetStakeReturnType,
//   type GetStakeErrorType,
// } from "./pChain/types/getStake.js"
// export {
//   getStake
// } from "./pChain/getStake.js"

// export {
//   type GetCurrentSupplyParameters,
//   type GetCurrentSupplyReturnType,
//   type GetCurrentSupplyErrorType,
// } from "./pChain/types/getCurrentSupply.js"
// export {
//   getCurrentSupply
// } from "./pChain/getCurrentSupply.js"

// export {
//   type GetBlockchainStatusParameters,
//   type GetBlockchainStatusReturnType,
//   type GetBlockchainStatusErrorType,
// } from "./pChain/types/getBlockchainStatus.js"
// export {
//   getBlockchainStatus
// } from "./pChain/getBlockchainStatus.js"

// export {
//   type GetFeeStateReturnType,
//   type GetFeeStateErrorType,
// } from "./pChain/types/getFeeState.js"
// export {
//   getFeeState
// } from "./pChain/getFeeState.js"

// export {
//   type GetStakingAssetIDParameters,
//   type GetStakingAssetIDReturnType,
//   type GetStakingAssetIDErrorType,
// } from "./pChain/types/getStakingAssetID.js"
// export {
//   getStakingAssetID
// } from "./pChain/getStakingAssetID.js"

// export {
//   type GetSubnetParameters,
//   type GetSubnetReturnType,
//   type GetSubnetErrorType,
// } from "./pChain/types/getSubnet.js"
// export {
//   getSubnet
// } from "./pChain/getSubnet.js"

// export {
//   type GetSubnetsParameters,
//   type GetSubnetsReturnType,
//   type GetSubnetsErrorType,
// } from "./pChain/types/getSubnets.js"
// export {
//   getSubnets
// } from "./pChain/getSubnets.js"

// export {
//   type GetTimestampReturnType,
//   type GetTimestampErrorType,
// } from "./pChain/types/getTimestamp.js"
// export {
//   getTimestamp
// } from "./pChain/getTimestamp.js"

// export {
//   type GetTotalStakeParameters,
//   type GetTotalStakeReturnType,
//   type GetTotalStakeErrorType,
// } from "./pChain/types/getTotalStake.js"
// export {
//   getTotalStake
// } from "./pChain/getTotalStake.js"

// export {
//   type GetTxParameters,
//   type GetTxReturnType,
//   type GetTxErrorType,
// } from "./pChain/types/getTx.js"
// export {
//   getTx
// } from "./pChain/getTx.js"

// export {
//   type GetTxStatusParameters,
//   type GetTxStatusReturnType,
//   type GetTxStatusErrorType,
// } from "./pChain/types/getTxStatus.js"
// export {
//   getTxStatus
// } from "./pChain/getTxStatus.js"

// export {
//   type GetUTXOsParameters,
//   type GetUTXOsReturnType,
//   type GetUTXOsErrorType,
// } from "./pChain/types/getUTXOs.js"
// export {
//   getUTXOs
// } from "./pChain/getUTXOs.js"

// export {
//   type GetValidatorsAtParameters,
//   type GetValidatorsAtReturnType,
//   type GetValidatorsAtErrorType,
// } from "./pChain/types/getValidatorsAt.js"
// export {
//   getValidatorsAt
// } from "./pChain/getValidatorsAt.js"

// export {
//   type IssueTxParameters,
//   type IssueTxReturnType,
//   type IssueTxErrorType,
// } from "./pChain/types/issueTx.js"
// export {
//   issueTx
// } from "./pChain/issueTx.js"

// export {
//   type SampleValidatorsParameters,
//   type SampleValidatorsReturnType,
//   type SampleValidatorsErrorType,
// } from "./pChain/types/sampleValidators.js"
// export {
//   sampleValidators
// } from "./pChain/sampleValidators.js"

// export {
//   type ValidatesParameters,
//   type ValidatesReturnType,
//   type ValidatesErrorType,
// } from "./pChain/types/validates.js"
// export {
//   validates
// } from "./pChain/validates.js"

// export {
//   type ValidatedByParameters,
//   type ValidatedByReturnType,
//   type ValidatedByErrorType,
// } from "./pChain/types/validatedBy.js"
// export {
//   validatedBy
// } from "./pChain/validatedBy.js"
