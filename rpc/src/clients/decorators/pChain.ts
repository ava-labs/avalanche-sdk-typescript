import { Transport, Chain } from "viem";
import { getCurrentValidators } from "../../methods/pchain/getCurrentValidators.js";
import {
  GetCurrentValidatorsParameters,
  GetCurrentValidatorsReturnType,
} from "../../methods/pchain/types/getCurrentValidators.js";
import { getBalance } from "../../methods/pchain/getBalance.js";
import {
  GetBalanceParameters,
  GetBalanceReturnType,
} from "../../methods/pchain/types/getBalance.js";
import {
  GetBlockParameters,
  GetBlockReturnType,
} from "../../methods/pchain/types/getBlock.js";
import { getBlock as getBlock } from "../../methods/pchain/getBlock.js";
import {
  GetBlockByHeightParameters,
  GetBlockByHeightReturnType,
} from "../../methods/pchain/types/getBlockByHeight.js";
import { getBlockByHeight } from "../../methods/pchain/getBlockByHeight.js";
import { GetBlockchainsReturnType } from "../../methods/pchain/types/getBlockchains.js";
import { getBlockchains } from "../../methods/pchain/getBlockchains.js";
import { getBlockchainStatus } from "../../methods/pchain/getBlockchainStatus.js";
import {
  GetBlockchainStatusParameters,
  GetBlockchainStatusReturnType,
} from "../../methods/pchain/types/getBlockchainStatus.js";
import {
  GetCurrentSupplyParameters,
  GetCurrentSupplyReturnType,
} from "../../methods/pchain/types/getCurrentSupply.js";
import { getCurrentSupply } from "../../methods/pchain/getCurrentSupply.js";
import { getFeeConfig } from "../../methods/pchain/getFeeConfig.js";
import { GetFeeStateReturnType } from "../../methods/pchain/types/getFeeState.js";
import { getFeeState } from "../../methods/pchain/getFeeState.js";
import {
  GetL1ValidatorParameters,
  GetL1ValidatorReturnType,
} from "../../methods/pchain/types/getL1Validator.js";
import { GetHeightReturnType } from "../../methods/pchain/types/getHeight.js";
import { getHeight } from "../../methods/pchain/getHeight.js";
import { getL1Validator } from "../../methods/pchain/getL1Validator.js";
import { GetFeeConfigReturnType } from "../../methods/pchain/types/getFeeConfig.js";
import { GetProposedHeightReturnType } from "../../methods/pchain/types/getProposedHeight.js";
import { getProposedHeight } from "../../methods/pchain/getProposedHeight.js";
import {
  GetMinStakeParameters,
  GetMinStakeReturnType,
} from "../../methods/pchain/types/getMinStake.js";
import { getMinStake } from "../../methods/pchain/getMinStake.js";
import {
  GetRewardUTXOsParameters,
  GetRewardUTXOsReturnType,
} from "../../methods/pchain/types/getRewardUTXOs.js";
import { getRewardUTXOs } from "../../methods/pchain/getRewardUTXOs.js";
import {
  GetStakeParameters,
  GetStakeReturnType,
} from "../../methods/pchain/types/getStake.js";
import { getStake } from "../../methods/pchain/getStake.js";
import { getStakingAssetID } from "../../methods/pchain/getStakingAssetID.js";
import {
  GetStakingAssetIDParameters,
  GetStakingAssetIDReturnType,
} from "../../methods/pchain/types/getStakingAssetID.js";
import {
  GetSubnetParameters,
  GetSubnetReturnType,
} from "../../methods/pchain/types/getSubnet.js";
import {
  GetSubnetsParameters,
  GetSubnetsReturnType,
} from "../../methods/pchain/types/getSubnets.js";
import {
  GetTotalStakeParameters,
  GetTotalStakeReturnType,
} from "../../methods/pchain/types/getTotalStake.js";
import { GetTimestampReturnType } from "../../methods/pchain/types/getTimestamp.js";
import {
  GetTxParameters,
  GetTxReturnType,
} from "../../methods/pchain/types/getTx.js";
import {
  GetTxStatusParameters,
  GetTxStatusReturnType,
} from "../../methods/pchain/types/getTxStatus.js";
import {
  GetUTXOsParameters,
  GetUTXOsReturnType,
} from "../../methods/pchain/types/getUTXOs.js";
import {
  GetValidatorsAtParameters,
  GetValidatorsAtReturnType,
} from "../../methods/pchain/types/getValidatorsAt.js";
import {
  IssueTxParameters,
  IssueTxReturnType,
} from "../../methods/pchain/types/issueTx.js";
import {
  SampleValidatorsParameters,
  SampleValidatorsReturnType,
} from "../../methods/pchain/types/sampleValidators.js";
import {
  ValidatesParameters,
  ValidatesReturnType,
} from "../../methods/pchain/types/validates.js";
import {
  ValidatedByParameters,
  ValidatedByReturnType,
} from "../../methods/pchain/types/validatedBy.js";
import { getSubnet } from "../../methods/pchain/getSubnet.js";
import { getSubnets } from "../../methods/pchain/getSubnets.js";
import { getTimestamp } from "../../methods/pchain/getTimestamp.js";
import { getTotalStake } from "../../methods/pchain/getTotalStake.js";
import { getTx } from "../../methods/pchain/getTx.js";
import { getTxStatus } from "../../methods/pchain/getTxStatus.js";
import { getValidatorsAt } from "../../methods/pchain/getValidatorsAt.js";
import { issueTx } from "../../methods/pchain/issueTx.js";
import { getUTXOs } from "../../methods/pchain/getUTXOs.js";
import { sampleValidators } from "../../methods/pchain/sampleValidators.js";
import { validates } from "../../methods/pchain/validates.js";
import { validatedBy } from "../../methods/pchain/validatedBy.js";
import { AvalancheCoreClient } from "../createAvalancheCoreClient.js";

export type PChainActions = {
  getBalance: (args: GetBalanceParameters) => Promise<GetBalanceReturnType>;
  getBlock: (args: GetBlockParameters) => Promise<GetBlockReturnType>;
  getBlockByHeight: (
    args: GetBlockByHeightParameters
  ) => Promise<GetBlockByHeightReturnType>;
  getBlockchains: () => Promise<GetBlockchainsReturnType>;
  getBlockchainStatus: (
    args: GetBlockchainStatusParameters
  ) => Promise<GetBlockchainStatusReturnType>;
  getCurrentValidators: (
    args: GetCurrentValidatorsParameters
  ) => Promise<GetCurrentValidatorsReturnType>;
  getCurrentSupply: (
    args: GetCurrentSupplyParameters
  ) => Promise<GetCurrentSupplyReturnType>;
  getFeeConfig: () => Promise<GetFeeConfigReturnType>;
  getFeeState: () => Promise<GetFeeStateReturnType>;
  getHeight: () => Promise<GetHeightReturnType>;
  getL1Validator: (
    args: GetL1ValidatorParameters
  ) => Promise<GetL1ValidatorReturnType>;
  getProposedHeight: () => Promise<GetProposedHeightReturnType>;
  getMinStake: (args: GetMinStakeParameters) => Promise<GetMinStakeReturnType>;
  getRewardUTXOs: (
    args: GetRewardUTXOsParameters
  ) => Promise<GetRewardUTXOsReturnType>;
  getStake: (args: GetStakeParameters) => Promise<GetStakeReturnType>;
  getStakingAssetID: (
    args: GetStakingAssetIDParameters
  ) => Promise<GetStakingAssetIDReturnType>;
  getSubnet: (args: GetSubnetParameters) => Promise<GetSubnetReturnType>;
  getSubnets: (args: GetSubnetsParameters) => Promise<GetSubnetsReturnType>;
  getTimestamp: () => Promise<GetTimestampReturnType>;
  getTotalStake: (
    args: GetTotalStakeParameters
  ) => Promise<GetTotalStakeReturnType>;
  getTx: (args: GetTxParameters) => Promise<GetTxReturnType>;
  getTxStatus: (args: GetTxStatusParameters) => Promise<GetTxStatusReturnType>;
  getUTXOs: (args: GetUTXOsParameters) => Promise<GetUTXOsReturnType>;
  getValidatorsAt: (
    args: GetValidatorsAtParameters
  ) => Promise<GetValidatorsAtReturnType>;
  issueTx: (args: IssueTxParameters) => Promise<IssueTxReturnType>;
  sampleValidators: (
    args: SampleValidatorsParameters
  ) => Promise<SampleValidatorsReturnType>;
  validates: (args: ValidatesParameters) => Promise<ValidatesReturnType>;
  validatedBy: (args: ValidatedByParameters) => Promise<ValidatedByReturnType>;
};

export function pChainActions<
  chain extends Chain | undefined = Chain | undefined
>(client: AvalancheCoreClient<Transport, chain>): PChainActions {
  return {
    getBalance: (args) => getBalance(client, args),
    getBlock: (args) => getBlock(client, args),
    getBlockByHeight: (args) => getBlockByHeight(client, args),
    getBlockchains: () => getBlockchains(client),
    getBlockchainStatus: (args) => getBlockchainStatus(client, args),
    getCurrentValidators: (args) => getCurrentValidators(client, args),
    getCurrentSupply: (args) => getCurrentSupply(client, args),
    getFeeConfig: () => getFeeConfig(client),
    getFeeState: () => getFeeState(client),
    getHeight: () => getHeight(client),
    getL1Validator: (args) => getL1Validator(client, args),
    getProposedHeight: () => getProposedHeight(client),
    getMinStake: (args) => getMinStake(client, args),
    getRewardUTXOs: (args) => getRewardUTXOs(client, args),
    getStake: (args) => getStake(client, args),
    getStakingAssetID: (args) => getStakingAssetID(client, args),
    getSubnet: (args) => getSubnet(client, args),
    getSubnets: (args) => getSubnets(client, args),
    getTimestamp: () => getTimestamp(client),
    getTotalStake: (args) => getTotalStake(client, args),
    getTx: (args) => getTx(client, args),
    getTxStatus: (args) => getTxStatus(client, args),
    getUTXOs: (args) => getUTXOs(client, args),
    getValidatorsAt: (args) => getValidatorsAt(client, args),
    issueTx: (args) => issueTx(client, args),
    sampleValidators: (args) => sampleValidators(client, args),
    validates: (args) => validates(client, args),
    validatedBy: (args) => validatedBy(client, args),
  };
}
