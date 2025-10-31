import { RpcSchemaOverride } from "viem";
import { GetAllValidatorsAtMethod } from "./types/getAllValidatorsAt.js";
import { GetBalanceMethod } from "./types/getBalance.js";
import { GetBlockMethod } from "./types/getBlock.js";
import { GetBlockByHeightMethod } from "./types/getBlockByHeight.js";
import { GetBlockchainsMethod } from "./types/getBlockchains.js";
import { GetBlockchainStatusMethod } from "./types/getBlockchainStatus.js";
import { GetCurrentSupplyMethod } from "./types/getCurrentSupply.js";
import { GetCurrentValidatorsMethod } from "./types/getCurrentValidators.js";
import { GetFeeConfigMethod } from "./types/getFeeConfig.js";
import { GetFeeStateMethod } from "./types/getFeeState.js";
import { GetHeightMethod } from "./types/getHeight.js";
import { GetL1ValidatorMethod } from "./types/getL1Validator.js";
import { GetMinStakeMethod } from "./types/getMinStake.js";
import { GetProposedHeightMethod } from "./types/getProposedHeight.js";
import { GetRewardUTXOsMethod } from "./types/getRewardUTXOs.js";
import { GetStakeMethod } from "./types/getStake.js";
import { GetStakingAssetIDMethod } from "./types/getStakingAssetID.js";
import { GetSubnetMethod } from "./types/getSubnet.js";
import { GetSubnetsMethod } from "./types/getSubnets.js";
import { GetTimestampMethod } from "./types/getTimestamp.js";
import { GetTotalStakeMethod } from "./types/getTotalStake.js";
import { GetTxMethod } from "./types/getTx.js";
import { GetTxStatusMethod } from "./types/getTxStatus.js";
import { GetUTXOsMethod } from "./types/getUTXOs.js";
import { GetValidatorsAtMethod } from "./types/getValidatorsAt.js";
import { IssueTxMethod } from "./types/issueTx.js";
import { SampleValidatorsMethod } from "./types/sampleValidators.js";
import { ValidatedByMethod } from "./types/validatedBy.js";
import { ValidatesMethod } from "./types/validates.js";

export type PChainMethods = [
  GetBalanceMethod,
  GetBlockMethod,
  GetBlockByHeightMethod,
  GetBlockchainsMethod,
  GetBlockchainStatusMethod,
  GetCurrentValidatorsMethod,
  GetCurrentSupplyMethod,
  GetFeeConfigMethod,
  GetFeeStateMethod,
  GetHeightMethod,
  GetL1ValidatorMethod,
  GetProposedHeightMethod,
  GetMinStakeMethod,
  GetRewardUTXOsMethod,
  GetStakeMethod,
  GetStakingAssetIDMethod,
  GetSubnetMethod,
  GetSubnetsMethod,
  GetTimestampMethod,
  GetTotalStakeMethod,
  GetTxMethod,
  GetTxStatusMethod,
  GetUTXOsMethod,
  GetAllValidatorsAtMethod,
  GetValidatorsAtMethod,
  IssueTxMethod,
  SampleValidatorsMethod,
  ValidatesMethod,
  ValidatedByMethod
];

/**
 * The RPC schema for the P-Chain methods.
 *
 * @see {@link PChainMethods}
 */
export type PChainRpcSchema = RpcSchemaOverride & PChainMethods;
