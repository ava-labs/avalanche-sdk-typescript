import { Chain, Transport } from "viem";
import { acps } from "../../methods/info/acps.js";
import { getBlockchainID } from "../../methods/info/getBlockchainID.js";
import { getNetworkID } from "../../methods/info/getNetworkID.js";
import { getNetworkName } from "../../methods/info/getNetworkName.js";
import { getNodeID } from "../../methods/info/getNodeID.js";
import { getNodeIP } from "../../methods/info/getNodeIP.js";
import { getNodeVersion } from "../../methods/info/getNodeVersion.js";
import { getTxFee } from "../../methods/info/getTxFee.js";
import { getVMs } from "../../methods/info/getVMs.js";
import { isBootstrapped } from "../../methods/info/isBootstrapped.js";
import { peers } from "../../methods/info/peers.js";
import { AcpsReturnType } from "../../methods/info/types/acps.js";
import {
  GetBlockchainIDParameters,
  GetBlockchainIDReturnType,
} from "../../methods/info/types/getBlockchainID.js";
import { GetNetworkIDReturnType } from "../../methods/info/types/getNetworkID.js";
import { GetNetworkNameReturnType } from "../../methods/info/types/getNetworkName.js";
import { GetNodeIDReturnType } from "../../methods/info/types/getNodeID.js";
import { GetNodeIPReturnType } from "../../methods/info/types/getNodeIP.js";
import { GetNodeVersionReturnType } from "../../methods/info/types/getNodeVersion.js";
import { GetTxFeeReturnType } from "../../methods/info/types/getTxFee.js";
import { GetVMsReturnType } from "../../methods/info/types/getVMs.js";
import {
  IsBootstrappedParameters,
  IsBootstrappedReturnType,
} from "../../methods/info/types/isBootstrapped.js";
import {
  PeersParameters,
  PeersReturnType,
} from "../../methods/info/types/peers.js";
import { UpgradesReturnType } from "../../methods/info/types/upgrades.js";
import { UptimeReturnType } from "../../methods/info/types/uptime.js";
import { upgrades } from "../../methods/info/upgrades.js";
import { uptime } from "../../methods/info/uptime.js";
import { AvalancheCoreClient } from "../createAvalancheCoreClient.js";

export type InfoAPIActions = {
  /**
   * Returns peer preferences for Avalanche Community Proposals (ACPs).
   *
   * - Docs: https://build.avax.network/docs/api-reference/info-api#infoacps
   *
   * @returns The ACP preferences. {@link AcpsReturnType}
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
   * const acpPreferences = await client.info.acps()
   * ```
   */
  acps: () => Promise<AcpsReturnType>;

  /**
   * Given a blockchain's alias, get its ID.
   *
   * - Docs: https://build.avax.network/docs/api-reference/info-api#infogetblockchainid
   *
   * @param args - {@link GetBlockchainIDParameters} The blockchain alias
   * @returns The blockchain ID. {@link GetBlockchainIDReturnType}
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
   * const blockchainID = await client.info.getBlockchainID({
   *   alias: "X"
   * })
   * ```
   */
  getBlockchainID: (
    args: GetBlockchainIDParameters
  ) => Promise<GetBlockchainIDReturnType>;

  /**
   * Get the ID of the network this node is participating in.
   * Network ID of 1 = Mainnet, Network ID of 5 = Fuji (testnet).
   *
   * - Docs: https://build.avax.network/docs/api-reference/info-api#infogetnetworkid
   *
   * @returns The network ID. {@link GetNetworkIDReturnType}
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
   * const networkID = await client.info.getNetworkID()
   * ```
   */
  getNetworkID: () => Promise<GetNetworkIDReturnType>;

  /**
   * Get the name of the network this node is participating in.
   *
   * - Docs: https://build.avax.network/docs/api-reference/info-api#infogetnetworkname
   *
   * @returns The network name. {@link GetNetworkNameReturnType}
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
   * const networkName = await client.info.getNetworkName()
   * ```
   */
  getNetworkName: () => Promise<GetNetworkNameReturnType>;

  /**
   * Get the ID, the BLS key, and the proof of possession of this node.
   * Note: This endpoint is only available on specific nodes, not on public servers.
   *
   * - Docs: https://build.avax.network/docs/api-reference/info-api#infogetnodeid
   *
   * @returns The node ID and BLS key information. {@link GetNodeIDReturnType}
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
   * const nodeInfo = await client.info.getNodeID()
   * ```
   */
  getNodeID: () => Promise<GetNodeIDReturnType>;

  /**
   * Get the IP address of this node.
   *
   * - Docs: https://build.avax.network/docs/api-reference/info-api#infogetnodeip
   *
   * @returns The node's IP address. {@link GetNodeIPReturnType}
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
   * const nodeIP = await client.info.getNodeIP()
   * ```
   */
  getNodeIP: () => Promise<GetNodeIPReturnType>;

  /**
   * Get the version of this node.
   *
   * - Docs: https://build.avax.network/docs/api-reference/info-api#infogetnodeversion
   *
   * @returns The node's version. {@link GetNodeVersionReturnType}
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
   * const nodeVersion = await client.info.getNodeVersion()
   * ```
   */
  getNodeVersion: () => Promise<GetNodeVersionReturnType>;

  /**
   * Get the transaction fee for this node.
   *
   * - Docs: https://build.avax.network/docs/api-reference/info-api#infogettxfee
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
   * const txFee = await client.info.getTxFee()
   * ```
   */
  getTxFee: () => Promise<GetTxFeeReturnType>;

  /**
   * Get the virtual machines (VMs) this node is running.
   *
   * - Docs: https://build.avax.network/docs/api-reference/info-api#infogetvms
   *
   * @returns The VMs running on this node. {@link GetVMsReturnType}
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
   * const vms = await client.info.getVMs()
   * ```
   */
  getVMs: () => Promise<GetVMsReturnType>;

  /**
   * Check whether a given chain is done bootstrapping.
   *
   * - Docs: https://build.avax.network/docs/api-reference/info-api#infoisbootstrapped
   *
   * @param args - {@link IsBootstrappedParameters} The chain ID or alias
   * @returns Whether the chain is bootstrapped. {@link IsBootstrappedReturnType}
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
   * const isBootstrapped = await client.info.isBootstrapped({
   *   chain: "X"
   * })
   * ```
   */
  isBootstrapped: (
    args: IsBootstrappedParameters
  ) => Promise<IsBootstrappedReturnType>;

  /**
   * Get a description of peer connections.
   *
   * - Docs: https://build.avax.network/docs/api-reference/info-api#infopeers
   *
   * @param args - {@link PeersParameters} Optional node IDs to filter peers
   * @returns Information about connected peers. {@link PeersReturnType}
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
   * const peers = await client.info.peers({
   *   nodeIDs: []
   * })
   * ```
   */
  peers: (args: PeersParameters) => Promise<PeersReturnType>;

  /**
   * Returns the upgrade history and configuration of the network.
   *
   * - Docs: https://build.avax.network/docs/api-reference/info-api#infoupgrades
   *
   * @returns The network upgrade information. {@link UpgradesReturnType}
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
   * const upgrades = await client.info.upgrades()
   * ```
   */
  upgrades: () => Promise<UpgradesReturnType>;

  /**
   * Returns the network's observed uptime of this node.
   * This is the only reliable source of data for your node's uptime.
   *
   * - Docs: https://build.avax.network/docs/api-reference/info-api#infouptime
   *
   * @returns The node's uptime statistics. {@link UptimeReturnType}
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
   * const uptime = await client.info.uptime()
   * ```
   */
  uptime: () => Promise<UptimeReturnType>;
};

export function infoAPIActions<
  chain extends Chain | undefined = Chain | undefined
>(client: AvalancheCoreClient<Transport, chain>): InfoAPIActions {
  return {
    acps: () => acps(client),
    getBlockchainID: (args) => getBlockchainID(client, args),
    getNetworkID: () => getNetworkID(client),
    getNetworkName: () => getNetworkName(client),
    getNodeID: () => getNodeID(client),
    getNodeIP: () => getNodeIP(client),
    getNodeVersion: () => getNodeVersion(client),
    getTxFee: () => getTxFee(client),
    getVMs: () => getVMs(client),
    isBootstrapped: (args) => isBootstrapped(client, args),
    peers: (args) => peers(client, args),
    upgrades: () => upgrades(client),
    uptime: () => uptime(client),
  };
}
