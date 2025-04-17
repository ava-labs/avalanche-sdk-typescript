import { Transport, Chain, Client } from "viem";
import { getCurrentValidators } from "../../methods/platformChain/getCurrentValidators.js";
import {
  GetCurrentValidatorsParameters,
  GetCurrentValidatorsReturnType,
} from "../../methods/platformChain/types/getCurrentValidators.js";
import { getPChainBalance } from "../../methods/platformChain/getPChainBalance.js";
import {
  GetPChainBalanceParameters,
  GetPChainBalanceReturnType,
} from "../../methods/platformChain/types/getPChainBalance.js";
import {
  GetPChainBlockParameters,
  GetPChainBlockReturnType,
} from "../../methods/platformChain/types/getPChainBlock.js";
import { getPChainBlock } from "../../methods/platformChain/getPChainBlock.js";
import {
  GetBlockByHeightParameters,
  GetBlockByHeightReturnType,
} from "../../methods/platformChain/types/getBlockByHeight.js";
import { getBlockByHeight } from "../../methods/platformChain/getBlockByHeight.js";
import { GetBlockchainsReturnType } from "../../methods/platformChain/types/getBlockchains.js";
import { getBlockchains } from "../../methods/platformChain/getBlockchains.js";
import { getBlockchainStatus } from "../../methods/platformChain/getBlockchainStatus.js";
import {
  GetBlockchainStatusParameters,
  GetBlockchainStatusReturnType,
} from "../../methods/platformChain/types/getBlockchainStatus.js";
import {
  GetCurrentSupplyParameters,
  GetCurrentSupplyReturnType,
} from "../../methods/platformChain/types/getCurrentSupply.js";
import { getCurrentSupply } from "../../methods/platformChain/getCurrentSupply.js";
import { getFeeConfig } from "../../methods/platformChain/getFeeConfig.js";
import { GetFeeStateReturnType } from "../../methods/platformChain/types/getFeeState.js";
import { getFeeState } from "../../methods/platformChain/getFeeState.js";
import {
  GetL1ValidatorParameters,
  GetL1ValidatorReturnType,
} from "../../methods/platformChain/types/getL1Validator.js";
import { GetHeightReturnType } from "../../methods/platformChain/types/getHeight.js";
import { getHeight } from "../../methods/platformChain/getHeight.js";
import { getL1Validator } from "../../methods/platformChain/getL1Validator.js";
import { GetFeeConfigReturnType } from "../../methods/platformChain/types/getFeeConfig.js";
import { GetProposedHeightReturnType } from "../../methods/platformChain/types/getProposedHeight.js";
import { getProposedHeight } from "../../methods/platformChain/getProposedHeight.js";
import {
  GetMinStakeParameters,
  GetMinStakeReturnType,
} from "../../methods/platformChain/types/getMinStake.js";
import { getMinStake } from "../../methods/platformChain/getMinStake.js";
import {
  GetRewardUTXOsParameters,
  GetRewardUTXOsReturnType,
} from "../../methods/platformChain/types/getRewardUTXOs.js";
import { getRewardUTXOs } from "../../methods/platformChain/getRewardUTXOs.js";
import {
  GetStakeParameters,
  GetStakeReturnType,
} from "../../methods/platformChain/types/getStake.js";
import { getStake } from "../../methods/platformChain/getStake.js";
import { getStakingAssetID } from "../../methods/platformChain/getStakingAssetID.js";
import {
  GetStakingAssetIDParameters,
  GetStakingAssetIDReturnType,
} from "../../methods/platformChain/types/getStakingAssetID.js";
import {
  GetSubnetParameters,
  GetSubnetReturnType,
} from "../../methods/platformChain/types/getSubnet.js";
import {
  GetSubnetsParameters,
  GetSubnetsReturnType,
} from "../../methods/platformChain/types/getSubnets.js";
import {
  GetTotalStakeParameters,
  GetTotalStakeReturnType,
} from "../../methods/platformChain/types/getTotalStake.js";
import { GetTimestampReturnType } from "../../methods/platformChain/types/getTimestamp.js";
import {
  GetTxParameters,
  GetTxReturnType,
} from "../../methods/platformChain/types/getTx.js";
import {
  GetTxStatusParameters,
  GetTxStatusReturnType,
} from "../../methods/platformChain/types/getTxStatus.js";
import {
  GetUTXOsParameters,
  GetUTXOsReturnType,
} from "../../methods/platformChain/types/getUTXOs.js";
import {
  GetValidatorsAtParameters,
  GetValidatorsAtReturnType,
} from "../../methods/platformChain/types/getValidatorsAt.js";
import {
  IssueTxParameters,
  IssueTxReturnType,
} from "../../methods/platformChain/types/issueTx.js";
import {
  SampleValidatorsParameters,
  SampleValidatorsReturnType,
} from "../../methods/platformChain/types/sampleValidators.js";
import {
  ValidatesParameters,
  ValidatesReturnType,
} from "../../methods/platformChain/types/validates.js";
import {
  ValidatedByParameters,
  ValidatedByReturnType,
} from "../../methods/platformChain/types/validatedBy.js";
import { getSubnet } from "../../methods/platformChain/getSubnet.js";
import { getSubnets } from "../../methods/platformChain/getSubnets.js";
import { getTimestamp } from "../../methods/platformChain/getTimestamp.js";
import { getTotalStake } from "../../methods/platformChain/getTotalStake.js";
import { getTx } from "../../methods/platformChain/getTx.js";
import { getTxStatus } from "../../methods/platformChain/getTxStatus.js";
import { getValidatorsAt } from "../../methods/platformChain/getValidatorsAt.js";
import { issueTx } from "../../methods/platformChain/issueTx.js";
import { getUTXOs } from "../../methods/platformChain/getUTXOs.js";
import { sampleValidators } from "../../methods/platformChain/sampleValidators.js";
import { validates } from "../../methods/platformChain/validates.js";
import { validatedBy } from "../../methods/platformChain/validatedBy.js";

export type PlatformChainActions = {
  getPChainBalance: (
    args: GetPChainBalanceParameters
  ) => Promise<GetPChainBalanceReturnType>;
  getPChainBlock: (
    args: GetPChainBlockParameters
  ) => Promise<GetPChainBlockReturnType>;
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

export function platformChainActions<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined
>(client: Client<transport, chain>): PlatformChainActions {
  return {
    getPChainBalance: (args) => getPChainBalance(client, args),
    getPChainBlock: (args) => getPChainBlock(client, args),
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
