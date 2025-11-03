import { Chain, Transport } from "viem";
import { getAllValidatorsAt } from "../../methods/pChain/getAllValidatorsAt.js";
import { getBalance } from "../../methods/pChain/getBalance.js";
import { getBlock } from "../../methods/pChain/getBlock.js";
import { getBlockByHeight } from "../../methods/pChain/getBlockByHeight.js";
import { getBlockchains } from "../../methods/pChain/getBlockchains.js";
import { getBlockchainStatus } from "../../methods/pChain/getBlockchainStatus.js";
import { getCurrentSupply } from "../../methods/pChain/getCurrentSupply.js";
import { getCurrentValidators } from "../../methods/pChain/getCurrentValidators.js";
import { getFeeConfig } from "../../methods/pChain/getFeeConfig.js";
import { getFeeState } from "../../methods/pChain/getFeeState.js";
import { getHeight } from "../../methods/pChain/getHeight.js";
import { getL1Validator } from "../../methods/pChain/getL1Validator.js";
import { getMinStake } from "../../methods/pChain/getMinStake.js";
import { getProposedHeight } from "../../methods/pChain/getProposedHeight.js";
import { getRewardUTXOs } from "../../methods/pChain/getRewardUTXOs.js";
import { getStake } from "../../methods/pChain/getStake.js";
import { getStakingAssetID } from "../../methods/pChain/getStakingAssetID.js";
import { getSubnet } from "../../methods/pChain/getSubnet.js";
import { getSubnets } from "../../methods/pChain/getSubnets.js";
import { getTimestamp } from "../../methods/pChain/getTimestamp.js";
import { getTotalStake } from "../../methods/pChain/getTotalStake.js";
import { getTx } from "../../methods/pChain/getTx.js";
import { getTxStatus } from "../../methods/pChain/getTxStatus.js";
import { getUTXOs } from "../../methods/pChain/getUTXOs.js";
import { getValidatorsAt } from "../../methods/pChain/getValidatorsAt.js";
import { issueTx } from "../../methods/pChain/issueTx.js";
import { sampleValidators } from "../../methods/pChain/sampleValidators.js";
import {
  GetAllValidatorsAtParameters,
  GetAllValidatorsAtReturnType,
} from "../../methods/pChain/types/getAllValidatorsAt.js";
import {
  GetBalanceParameters,
  GetBalanceReturnType,
} from "../../methods/pChain/types/getBalance.js";
import {
  GetBlockParameters,
  GetBlockReturnType,
} from "../../methods/pChain/types/getBlock.js";
import {
  GetBlockByHeightParameters,
  GetBlockByHeightReturnType,
} from "../../methods/pChain/types/getBlockByHeight.js";
import { GetBlockchainsReturnType } from "../../methods/pChain/types/getBlockchains.js";
import {
  GetBlockchainStatusParameters,
  GetBlockchainStatusReturnType,
} from "../../methods/pChain/types/getBlockchainStatus.js";
import {
  GetCurrentSupplyParameters,
  GetCurrentSupplyReturnType,
} from "../../methods/pChain/types/getCurrentSupply.js";
import {
  GetCurrentValidatorsParameters,
  GetCurrentValidatorsReturnType,
} from "../../methods/pChain/types/getCurrentValidators.js";
import { GetFeeConfigReturnType } from "../../methods/pChain/types/getFeeConfig.js";
import { GetFeeStateReturnType } from "../../methods/pChain/types/getFeeState.js";
import { GetHeightReturnType } from "../../methods/pChain/types/getHeight.js";
import {
  GetL1ValidatorParameters,
  GetL1ValidatorReturnType,
} from "../../methods/pChain/types/getL1Validator.js";
import {
  GetMinStakeParameters,
  GetMinStakeReturnType,
} from "../../methods/pChain/types/getMinStake.js";
import { GetProposedHeightReturnType } from "../../methods/pChain/types/getProposedHeight.js";
import {
  GetRewardUTXOsParameters,
  GetRewardUTXOsReturnType,
} from "../../methods/pChain/types/getRewardUTXOs.js";
import {
  GetStakeParameters,
  GetStakeReturnType,
} from "../../methods/pChain/types/getStake.js";
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
import { GetTimestampReturnType } from "../../methods/pChain/types/getTimestamp.js";
import {
  GetTotalStakeParameters,
  GetTotalStakeReturnType,
} from "../../methods/pChain/types/getTotalStake.js";
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
  ValidatedByParameters,
  ValidatedByReturnType,
} from "../../methods/pChain/types/validatedBy.js";
import {
  ValidatesParameters,
  ValidatesReturnType,
} from "../../methods/pChain/types/validates.js";
import { validatedBy } from "../../methods/pChain/validatedBy.js";
import { validates } from "../../methods/pChain/validates.js";
import { AvalancheCoreClient } from "../createAvalancheCoreClient.js";

export type PChainActions = {
  /**
   * Get the balance of AVAX controlled by a given address.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetbalance
   *
   * @param args - {@link GetBalanceParameters} The addresses to get the balance of
   * @returns The balance information. {@link GetBalanceReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const balance = await client.pChain.getBalance({
   *   addresses: ["P-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p"]
   * })
   * ```
   */
  getBalance: (args: GetBalanceParameters) => Promise<GetBalanceReturnType>;

  /**
   * Get a block by its ID.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetblock
   *
   * @param args - {@link GetBlockParameters} The block ID and encoding format
   * @returns The block data. {@link GetBlockReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const block = await client.pChain.getBlock({
   *   blockID: "d7WYmb8VeZNHsny3EJCwMm6QA37s1EHwMxw1Y71V3FqPZ5EFG",
   *   encoding: "hex"
   * })
   * ```
   */
  getBlock: (args: GetBlockParameters) => Promise<GetBlockReturnType>;

  /**
   * Get a block by its height.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetblockbyheight
   *
   * @param args - {@link GetBlockByHeightParameters} The block height and encoding format
   * @returns The block data. {@link GetBlockByHeightReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const block = await client.pChain.getBlockByHeight({
   *   height: 1000001,
   *   encoding: "hex"
   * })
   * ```
   */
  getBlockByHeight: (
    args: GetBlockByHeightParameters
  ) => Promise<GetBlockByHeightReturnType>;

  /**
   * Get all the blockchains that exist (excluding the P-Chain).
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetblockchains
   *
   * @returns The list of blockchains. {@link GetBlockchainsReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const blockchains = await client.pChain.getBlockchains()
   * ```
   */
  getBlockchains: () => Promise<GetBlockchainsReturnType>;

  /**
   * Get the status of a blockchain.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetblockchainstatus
   *
   * @param args - {@link GetBlockchainStatusParameters} The blockchain ID
   * @returns The blockchain status. {@link GetBlockchainStatusReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const status = await client.pChain.getBlockchainStatus({
   *   blockchainID: "11111111111111111111111111111111LpoYY"
   * })
   * ```
   */
  getBlockchainStatus: (
    args: GetBlockchainStatusParameters
  ) => Promise<GetBlockchainStatusReturnType>;

  /**
   * Get the current validators of the specified Subnet.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetcurrentvalidators
   *
   * @param args - {@link GetCurrentValidatorsParameters} The subnet ID
   * @returns The current validators. {@link GetCurrentValidatorsReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const validators = await client.pChain.getCurrentValidators({
   *   subnetID: "11111111111111111111111111111111LpoYY"
   * })
   * ```
   */
  getCurrentValidators: (
    args: GetCurrentValidatorsParameters
  ) => Promise<GetCurrentValidatorsReturnType>;

  /**
   * Get the current supply of an asset.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetcurrentsupply
   *
   * @param args - {@link GetCurrentSupplyParameters} The asset ID
   * @returns The current supply. {@link GetCurrentSupplyReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const supply = await client.pChain.getCurrentSupply({
   *   assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z"
   * })
   * ```
   */
  getCurrentSupply: (
    args: GetCurrentSupplyParameters
  ) => Promise<GetCurrentSupplyReturnType>;

  /**
   * Get the fee configuration for the P-Chain.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetfeeconfig
   *
   * @returns The fee configuration. {@link GetFeeConfigReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const feeConfig = await client.pChain.getFeeConfig()
   * ```
   */
  getFeeConfig: () => Promise<GetFeeConfigReturnType>;

  /**
   * Get the current fee state of the P-Chain.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetfeestate
   *
   * @returns The fee state. {@link GetFeeStateReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const feeState = await client.pChain.getFeeState()
   * ```
   */
  getFeeState: () => Promise<GetFeeStateReturnType>;

  /**
   * Get the height of the last accepted block.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetheight
   *
   * @returns The current height. {@link GetHeightReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const height = await client.pChain.getHeight()
   * ```
   */
  getHeight: () => Promise<GetHeightReturnType>;

  /**
   * Get the L1 validator information.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetl1validator
   *
   * @param args - {@link GetL1ValidatorParameters} The validator node ID
   * @returns The L1 validator information. {@link GetL1ValidatorReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const validator = await client.pChain.getL1Validator({
   *   nodeID: "NodeID-111111111111111111111111111111111111111"
   * })
   * ```
   */
  getL1Validator: (
    args: GetL1ValidatorParameters
  ) => Promise<GetL1ValidatorReturnType>;

  /**
   * Get the proposed height of the P-Chain.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetproposedheight
   *
   * @returns The proposed height. {@link GetProposedHeightReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const proposedHeight = await client.pChain.getProposedHeight()
   * ```
   */
  getProposedHeight: () => Promise<GetProposedHeightReturnType>;

  /**
   * Get the minimum stake amount for a subnet.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetminstake
   *
   * @param args - {@link GetMinStakeParameters} The subnet ID
   * @returns The minimum stake amount. {@link GetMinStakeReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const minStake = await client.pChain.getMinStake({
   *   subnetID: "11111111111111111111111111111111LpoYY"
   * })
   * ```
   */
  getMinStake: (args: GetMinStakeParameters) => Promise<GetMinStakeReturnType>;

  /**
   * Get the reward UTXOs for a transaction.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetrewardutxos
   *
   * @param args - {@link GetRewardUTXOsParameters} The transaction ID and encoding
   * @returns The reward UTXOs. {@link GetRewardUTXOsReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const rewardUTXOs = await client.pChain.getRewardUTXOs({
   *   txID: "11111111111111111111111111111111LpoYY",
   *   encoding: "hex"
   * })
   * ```
   */
  getRewardUTXOs: (
    args: GetRewardUTXOsParameters
  ) => Promise<GetRewardUTXOsReturnType>;

  /**
   * Get the stake amount for a set of addresses.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetstake
   *
   * @param args - {@link GetStakeParameters} The addresses and subnet ID
   * @returns The stake amount. {@link GetStakeReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const stake = await client.pChain.getStake({
   *   addresses: ["P-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p"],
   *   subnetID: "11111111111111111111111111111111LpoYY"
   * })
   * ```
   */
  getStake: (args: GetStakeParameters) => Promise<GetStakeReturnType>;

  /**
   * Get the staking asset ID for a subnet.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetstakingassetid
   *
   * @param args - {@link GetStakingAssetIDParameters} The subnet ID
   * @returns The staking asset ID. {@link GetStakingAssetIDReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const stakingAssetID = await client.pChain.getStakingAssetID({
   *   subnetID: "11111111111111111111111111111111LpoYY"
   * })
   * ```
   */
  getStakingAssetID: (
    args: GetStakingAssetIDParameters
  ) => Promise<GetStakingAssetIDReturnType>;

  /**
   * Get information about a subnet.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetsubnet
   *
   * @param args - {@link GetSubnetParameters} The subnet ID
   * @returns The subnet information. {@link GetSubnetReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const subnet = await client.pChain.getSubnet({
   *   subnetID: "11111111111111111111111111111111LpoYY"
   * })
   * ```
   */
  getSubnet: (args: GetSubnetParameters) => Promise<GetSubnetReturnType>;

  /**
   * Get all subnets.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetsubnets
   *
   * @param args - {@link GetSubnetsParameters} Optional parameters
   * @returns The list of subnets. {@link GetSubnetsReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const subnets = await client.pChain.getSubnets()
   * ```
   */
  getSubnets: (args: GetSubnetsParameters) => Promise<GetSubnetsReturnType>;

  /**
   * Get the current timestamp of the P-Chain.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgettimestamp
   *
   * @returns The current timestamp. {@link GetTimestampReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const timestamp = await client.pChain.getTimestamp()
   * ```
   */
  getTimestamp: () => Promise<GetTimestampReturnType>;

  /**
   * Get the total stake amount for a subnet.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgettotalstake
   *
   * @param args - {@link GetTotalStakeParameters} The subnet ID
   * @returns The total stake amount. {@link GetTotalStakeReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const totalStake = await client.pChain.getTotalStake({
   *   subnetID: "11111111111111111111111111111111LpoYY"
   * })
   * ```
   */
  getTotalStake: (
    args: GetTotalStakeParameters
  ) => Promise<GetTotalStakeReturnType>;

  /**
   * Get a transaction by its ID.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgettx
   *
   * @param args - {@link GetTxParameters} The transaction ID and encoding
   * @returns The transaction data. {@link GetTxReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const tx = await client.pChain.getTx({
   *   txID: "11111111111111111111111111111111LpoYY",
   *   encoding: "hex"
   * })
   * ```
   */
  getTx: (args: GetTxParameters) => Promise<GetTxReturnType>;

  /**
   * Get the status of a transaction.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgettxstatus
   *
   * @param args - {@link GetTxStatusParameters} The transaction ID
   * @returns The transaction status. {@link GetTxStatusReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const status = await client.pChain.getTxStatus({
   *   txID: "11111111111111111111111111111111LpoYY"
   * })
   * ```
   */
  getTxStatus: (args: GetTxStatusParameters) => Promise<GetTxStatusReturnType>;

  /**
   * Get the UTXOs for a set of addresses.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetutxos
   *
   * @param args - {@link GetUTXOsParameters} The addresses and source chain
   * @returns The UTXOs. {@link GetUTXOsReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const utxos = await client.pChain.getUTXOs({
   *   addresses: ["P-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p"],
   *   sourceChain: "X"
   * })
   * ```
   */
  getUTXOs: (args: GetUTXOsParameters) => Promise<GetUTXOsReturnType>;

  /**
   * Get the validators at a specific height.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetvalidatorsat
   *
   * @param args - {@link GetValidatorsAtParameters} The height and subnet ID
   * @returns The validators at that height. {@link GetValidatorsAtReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const validators = await client.pChain.getValidatorsAt({
   *   height: 1000001,
   *   subnetID: "11111111111111111111111111111111LpoYY"
   * })
   * ```
   */
  getValidatorsAt: (
    args: GetValidatorsAtParameters
  ) => Promise<GetValidatorsAtReturnType>;

  /**
   * Get all validators at a specific height across all Subnets and the Primary Network.
   *
   * Note: The public API (api.avax.network) only support height within 1000 blocks
   * from the P-Chain tip.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetallvalidatorsat
   *
   * @param args - {@link GetAllValidatorsAtParameters} The height
   * @returns All validators at that height across all Subnets. {@link GetAllValidatorsAtReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const validators = await client.pChain.getAllValidatorsAt({
   *   height: 1000001
   * })
   * ```
   */
  getAllValidatorsAt: (
    args: GetAllValidatorsAtParameters
  ) => Promise<GetAllValidatorsAtReturnType>;

  /**
   * Issue a transaction to the Platform Chain.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformissuetx
   *
   * @param args - {@link IssueTxParameters} The transaction bytes and encoding
   * @returns The transaction ID. {@link IssueTxReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const txID = await client.pChain.issueTx({
   *   tx: "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
   *   encoding: "hex"
   * })
   * ```
   */
  issueTx: (args: IssueTxParameters) => Promise<IssueTxReturnType>;

  /**
   * Sample validators from the specified Subnet.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformsamplevalidators
   *
   * @param args - {@link SampleValidatorsParameters} The number of validators to sample and subnet ID
   * @returns The sampled validators. {@link SampleValidatorsReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const validators = await client.pChain.sampleValidators({
   *   size: 2,
   *   subnetID: "11111111111111111111111111111111LpoYY"
   * })
   * ```
   */
  sampleValidators: (
    args: SampleValidatorsParameters
  ) => Promise<SampleValidatorsReturnType>;

  /**
   * Get the Subnet that validates a given blockchain.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformvalidatedby
   *
   * @param args - {@link ValidatedByParameters} The blockchain ID
   * @returns The subnet ID. {@link ValidatedByReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const subnetID = await client.pChain.validatedBy({
   *   blockchainID: "11111111111111111111111111111111LpoYY"
   * })
   * ```
   */
  validatedBy: (args: ValidatedByParameters) => Promise<ValidatedByReturnType>;

  /**
   * Get the IDs of the blockchains a Subnet validates.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformvalidates
   *
   * @param args - {@link ValidatesParameters} The subnet ID
   * @returns The blockchain IDs. {@link ValidatesReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const blockchainIDs = await client.pChain.validates({
   *   subnetID: "11111111111111111111111111111111LpoYY"
   * })
   * ```
   */
  validates: (args: ValidatesParameters) => Promise<ValidatesReturnType>;
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
    getAllValidatorsAt: (args) => getAllValidatorsAt(client, args),
    getValidatorsAt: (args) => getValidatorsAt(client, args),
    issueTx: (args) => issueTx(client, args),
    sampleValidators: (args) => sampleValidators(client, args),
    validates: (args) => validates(client, args),
    validatedBy: (args) => validatedBy(client, args),
  };
}
