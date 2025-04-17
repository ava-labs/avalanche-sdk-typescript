import { RpcSchemaOverride } from 'viem';
import { GetCurrentValidatorsMethod } from './types/getCurrentValidators.js';
import { GetPChainBalanceMethod } from './types/getPChainBalance.js';
import { GetPChainBlockMethod } from './types/getPChainBlock.js';
import { GetBlockByHeightMethod } from './types/getBlockByHeight.js';
import { GetBlockchainsMethod } from './types/getBlockchains.js';
import { GetBlockchainStatusMethod } from './types/getBlockchainStatus.js';
import { GetCurrentSupplyMethod } from './types/getCurrentSupply.js';
import { GetFeeConfigMethod } from './types/getFeeConfig.js';
import { GetFeeStateMethod } from './types/getFeeState.js';
import { GetHeightMethod } from './types/getHeight.js';
import { GetL1ValidatorMethod } from './types/getL1Validator.js';
import { GetProposedHeightMethod } from './types/getProposedHeight.js';
import { GetMinStakeMethod } from './types/getMinStake.js';
import { GetRewardUTXOsMethod } from './types/getRewardUTXOs.js';
import { GetStakeMethod } from './types/getStake.js';
import { GetStakingAssetIDMethod } from './types/getStakingAssetID.js';
import { GetSubnetMethod } from './types/getSubnet.js';
import { GetSubnetsMethod } from './types/getSubnets.js';
import { GetTimestampMethod } from './types/getTimestamp.js';
import { GetTotalStakeMethod } from './types/getTotalStake.js';
import { GetTxMethod } from './types/getTx.js';
import { GetTxStatusMethod } from './types/getTxStatus.js';
import { GetUTXOsMethod } from './types/getUTXOs.js';
import { GetValidatorsAtMethod } from './types/getValidatorsAt.js';
import { IssueTxMethod } from './types/issueTx.js';
import { SampleValidatorsMethod } from './types/sampleValidators.js';
import { ValidatesMethod } from './types/validates.js';
import { ValidatedByMethod } from './types/validatedBy.js';

export type PlatformChainMethods = [
    GetPChainBalanceMethod,
    GetPChainBlockMethod,
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
    GetValidatorsAtMethod,
    IssueTxMethod,
    SampleValidatorsMethod,
    ValidatesMethod,
    ValidatedByMethod,
];

export type PlatformChainRpcSchema = RpcSchemaOverride & PlatformChainMethods;

