import { Chain, Transport } from "viem";
import { GetTxParameters } from "../../methods/pChain/index.js";
import { buildGenesis } from "../../methods/xChain/buildGenesis.js";
import { getAllBalances } from "../../methods/xChain/getAllBalances.js";
import { getAssetDescription } from "../../methods/xChain/getAssetDescription.js";
import { getBalance } from "../../methods/xChain/getBalance.js";
import { getBlock } from "../../methods/xChain/getBlock.js";
import { getBlockByHeight } from "../../methods/xChain/getBlockByHeight.js";
import { getHeight } from "../../methods/xChain/getHeight.js";
import { getTx } from "../../methods/xChain/getTx.js";
import { getTxFee } from "../../methods/xChain/getTxFee.js";
import { getTxStatus } from "../../methods/xChain/getTxStatus.js";
import { getUTXOs } from "../../methods/xChain/getUTXOs.js";
import { issueTx } from "../../methods/xChain/issueTx.js";
import {
  BuildGenesisParameters,
  BuildGenesisReturnType,
} from "../../methods/xChain/types/buildGenesis.js";
import {
  GetAllBalancesParameters,
  GetAllBalancesReturnType,
} from "../../methods/xChain/types/getAllBalances.js";
import {
  GetAssetDescriptionParameters,
  GetAssetDescriptionReturnType,
} from "../../methods/xChain/types/getAssetDescription.js";
import {
  GetBalanceParameters,
  GetBalanceReturnType,
} from "../../methods/xChain/types/getBalance.js";
import {
  GetBlockParameters,
  GetBlockReturnType,
} from "../../methods/xChain/types/getBlock.js";
import {
  GetBlockByHeightParameters,
  GetBlockByHeightReturnType,
} from "../../methods/xChain/types/getBlockByHeight.js";
import { GetHeightReturnType } from "../../methods/xChain/types/getHeight.js";
import { GetTxReturnType } from "../../methods/xChain/types/getTx.js";
import { GetTxFeeReturnType } from "../../methods/xChain/types/getTxFee.js";
import {
  GetTxStatusParameters,
  GetTxStatusReturnType,
} from "../../methods/xChain/types/getTxStatus.js";
import {
  GetUTXOsParameters,
  GetUTXOsReturnType,
} from "../../methods/xChain/types/getUTXOs.js";
import {
  IssueTxParameters,
  IssueTxReturnType,
} from "../../methods/xChain/types/issueTx.js";
import { AvalancheCoreClient } from "../createAvalancheCoreClient.js";

export type XChainActions = {
  /**
   * Given a JSON representation of this Virtual Machine's genesis state, create the byte representation of that state.
   *
   * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmbuildgenesis
   *
   * @param args - {@link BuildGenesisParameters} The network ID and genesis data
   * @returns The genesis bytes. {@link BuildGenesisReturnType}
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
   * const genesis = await client.xChain.buildGenesis({
   *   networkID: 16,
   *   genesisData: {
   *     asset1: {
   *       name: "myFixedCapAsset",
   *       symbol: "MFCA",
   *       initialState: {
   *         fixedCap: [
   *           {
   *             amount: 100000,
   *             address: "avax13ery2kvdrkd2nkquvs892gl8hg7mq4a6ufnrn6"
   *           }
   *         ]
   *       }
   *     }
   *   }
   * })
   * ```
   */
  buildGenesis: (
    args: BuildGenesisParameters
  ) => Promise<BuildGenesisReturnType>;

  /**
   * Get the balances of all assets controlled by given addresses.
   *
   * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgetallbalances
   *
   * @param args - {@link GetAllBalancesParameters} The addresses to get balances for
   * @returns The balances of all assets. {@link GetAllBalancesReturnType}
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
   * const balances = await client.xChain.getAllBalances({
   *   addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"]
   * })
   * ```
   */
  getAllBalances: (
    args: GetAllBalancesParameters
  ) => Promise<GetAllBalancesReturnType>;

  /**
   * Get information about an asset.
   *
   * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgetassetdescription
   *
   * @param args - {@link GetAssetDescriptionParameters} The asset ID
   * @returns The asset description. {@link GetAssetDescriptionReturnType}
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
   * const asset = await client.xChain.getAssetDescription({
   *   assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z"
   * })
   * ```
   */
  getAssetDescription: (
    args: GetAssetDescriptionParameters
  ) => Promise<GetAssetDescriptionReturnType>;

  /**
   * Get the balance of an asset controlled by given addresses.
   *
   * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgetbalance
   *
   * @param args - {@link GetBalanceParameters} The addresses and asset ID
   * @returns The balance of the asset. {@link GetBalanceReturnType}
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
   * const balance = await client.xChain.getBalance({
   *   addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
   *   assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z"
   * })
   * ```
   */
  getBalance: (args: GetBalanceParameters) => Promise<GetBalanceReturnType>;

  /**
   * Get a block by its ID.
   *
   * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgetblock
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
   * const block = await client.xChain.getBlock({
   *   blockID: "d7WYmb8VeZNHsny3EJCwMm6QA37s1EHwMxw1Y71V3FqPZ5EFG",
   *   encoding: "hex"
   * })
   * ```
   */
  getBlock: (args: GetBlockParameters) => Promise<GetBlockReturnType>;

  /**
   * Get a block by its height.
   *
   * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgetblockbyheight
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
   * const block = await client.xChain.getBlockByHeight({
   *   height: 1000001,
   *   encoding: "hex"
   * })
   * ```
   */
  getBlockByHeight: (
    args: GetBlockByHeightParameters
  ) => Promise<GetBlockByHeightReturnType>;

  /**
   * Get the height of the last accepted block.
   *
   * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgetheight
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
   * const height = await client.xChain.getHeight()
   * ```
   */
  getHeight: () => Promise<GetHeightReturnType>;

  /**
   * Get a transaction by its ID.
   *
   * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgettx
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
   * const tx = await client.xChain.getTx({
   *   txID: "11111111111111111111111111111111LpoYY",
   *   encoding: "hex"
   * })
   * ```
   */
  getTx: (args: GetTxParameters) => Promise<GetTxReturnType>;

  /**
   * Get the transaction fee for this node.
   *
   * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgettxfee
   *
   * @returns The transaction fee. {@link GetTxFeeReturnType}
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
   * const txFee = await client.xChain.getTxFee()
   * ```
   */
  getTxFee: () => Promise<GetTxFeeReturnType>;

  /**
   * Get the status of a transaction.
   *
   * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgettxstatus
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
   * const status = await client.xChain.getTxStatus({
   *   txID: "11111111111111111111111111111111LpoYY"
   * })
   * ```
   */
  getTxStatus: (args: GetTxStatusParameters) => Promise<GetTxStatusReturnType>;

  /**
   * Get the UTXOs for a set of addresses.
   *
   * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgetutxos
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
   * const utxos = await client.xChain.getUTXOs({
   *   addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
   *   sourceChain: "P"
   * })
   * ```
   */
  getUTXOs: (args: GetUTXOsParameters) => Promise<GetUTXOsReturnType>;

  /**
   * Send a signed transaction to the network.
   *
   * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmissuetx
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
   * const txID = await client.xChain.issueTx({
   *   tx: "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
   *   encoding: "hex"
   * })
   * ```
   */
  issueTx: (args: IssueTxParameters) => Promise<IssueTxReturnType>;
};

export function xChainActions<
  chain extends Chain | undefined = Chain | undefined
>(client: AvalancheCoreClient<Transport, chain>): XChainActions {
  return {
    buildGenesis: (args) => buildGenesis(client, args),
    getAllBalances: (args) => getAllBalances(client, args),
    getAssetDescription: (args) => getAssetDescription(client, args),
    getBalance: (args) => getBalance(client, args),
    getBlock: (args) => getBlock(client, args),
    getBlockByHeight: (args) => getBlockByHeight(client, args),
    getHeight: () => getHeight(client),
    getTx: (args) => getTx(client, args),
    getTxFee: () => getTxFee(client),
    getTxStatus: (args) => getTxStatus(client, args),
    getUTXOs: (args) => getUTXOs(client, args),
    issueTx: (args) => issueTx(client, args),
  };
}
