import { Transport, Chain } from "viem";
import { getCurrentValidators } from "../../methods/pChain/getCurrentValidators.js";
import {
  GetCurrentValidatorsParameters,
  GetCurrentValidatorsReturnType,
} from "../../methods/pChain/types/getCurrentValidators.js";
import { getBalance } from "../../methods/pChain/getBalance.js";
import {
  GetBalanceParameters,
  GetBalanceReturnType,
} from "../../methods/pChain/types/getBalance.js";
import {
  GetBlockParameters,
  GetBlockReturnType,
} from "../../methods/pChain/types/getBlock.js";
import { getBlock as getBlock } from "../../methods/pChain/getBlock.js";
import {
  GetBlockByHeightParameters,
  GetBlockByHeightReturnType,
} from "../../methods/pChain/types/getBlockByHeight.js";
import { getBlockByHeight } from "../../methods/pChain/getBlockByHeight.js";
import { GetBlockchainsReturnType } from "../../methods/pChain/types/getBlockchains.js";
import { getBlockchains } from "../../methods/pChain/getBlockchains.js";
import { getBlockchainStatus } from "../../methods/pChain/getBlockchainStatus.js";
import {
  GetBlockchainStatusParameters,
  GetBlockchainStatusReturnType,
} from "../../methods/pChain/types/getBlockchainStatus.js";
import {
  GetCurrentSupplyParameters,
  GetCurrentSupplyReturnType,
} from "../../methods/pChain/types/getCurrentSupply.js";
import { getCurrentSupply } from "../../methods/pChain/getCurrentSupply.js";
import { getFeeConfig } from "../../methods/pChain/getFeeConfig.js";
import { GetFeeStateReturnType } from "../../methods/pChain/types/getFeeState.js";
import { getFeeState } from "../../methods/pChain/getFeeState.js";
import {
  GetL1ValidatorParameters,
  GetL1ValidatorReturnType,
} from "../../methods/pChain/types/getL1Validator.js";
import { GetHeightReturnType } from "../../methods/pChain/types/getHeight.js";
import { getHeight } from "../../methods/pChain/getHeight.js";
import { getL1Validator } from "../../methods/pChain/getL1Validator.js";
import { GetFeeConfigReturnType } from "../../methods/pChain/types/getFeeConfig.js";
import { GetProposedHeightReturnType } from "../../methods/pChain/types/getProposedHeight.js";
import { getProposedHeight } from "../../methods/pChain/getProposedHeight.js";
import {
  GetMinStakeParameters,
  GetMinStakeReturnType,
} from "../../methods/pChain/types/getMinStake.js";
import { getMinStake } from "../../methods/pChain/getMinStake.js";
import {
  GetRewardUTXOsParameters,
  GetRewardUTXOsReturnType,
} from "../../methods/pChain/types/getRewardUTXOs.js";
import { getRewardUTXOs } from "../../methods/pChain/getRewardUTXOs.js";
import {
  GetStakeParameters,
  GetStakeReturnType,
} from "../../methods/pChain/types/getStake.js";
import { getStake } from "../../methods/pChain/getStake.js";
import { getStakingAssetID } from "../../methods/pChain/getStakingAssetID.js";
import {
  GetStakingAssetIDParameters,
  GetStakingAssetIDReturnType,
} from "../../methods/pChain/types/getStakingAssetID.js";
import {
  GetSubnetParameters,
  GetSubnetReturnType,
} from "../../methods/pChain/types/getSubnet.js";
import {
  GetSubnetsParameters,
  GetSubnetsReturnType,
} from "../../methods/pChain/types/getSubnets.js";
import {
  GetTotalStakeParameters,
  GetTotalStakeReturnType,
} from "../../methods/pChain/types/getTotalStake.js";
import { GetTimestampReturnType } from "../../methods/pChain/types/getTimestamp.js";
import {
  GetTxParameters,
  GetTxReturnType,
} from "../../methods/pChain/types/getTx.js";
import {
  GetTxStatusParameters,
  GetTxStatusReturnType,
} from "../../methods/pChain/types/getTxStatus.js";
import {
  GetUTXOsParameters,
  GetUTXOsReturnType,
} from "../../methods/pChain/types/getUTXOs.js";
import {
  GetValidatorsAtParameters,
  GetValidatorsAtReturnType,
} from "../../methods/pChain/types/getValidatorsAt.js";
import {
  IssueTxParameters,
  IssueTxReturnType,
} from "../../methods/pChain/types/issueTx.js";
import {
  SampleValidatorsParameters,
  SampleValidatorsReturnType,
} from "../../methods/pChain/types/sampleValidators.js";
import {
  ValidatesParameters,
  ValidatesReturnType,
} from "../../methods/pChain/types/validates.js";
import {
  ValidatedByParameters,
  ValidatedByReturnType,
} from "../../methods/pChain/types/validatedBy.js";
import { getSubnet } from "../../methods/pChain/getSubnet.js";
import { getSubnets } from "../../methods/pChain/getSubnets.js";
import { getTimestamp } from "../../methods/pChain/getTimestamp.js";
import { getTotalStake } from "../../methods/pChain/getTotalStake.js";
import { getTx } from "../../methods/pChain/getTx.js";
import { getTxStatus } from "../../methods/pChain/getTxStatus.js";
import { getValidatorsAt } from "../../methods/pChain/getValidatorsAt.js";
import { issueTx } from "../../methods/pChain/issueTx.js";
import { getUTXOs } from "../../methods/pChain/getUTXOs.js";
import { sampleValidators } from "../../methods/pChain/sampleValidators.js";
import { validates } from "../../methods/pChain/validates.js";
import { validatedBy } from "../../methods/pChain/validatedBy.js";
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
