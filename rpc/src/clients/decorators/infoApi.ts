import { Transport } from "viem";
import { Chain } from "viem";
import { AvalancheCoreClient } from "../createAvalancheCoreClient.js";
import { AcpsReturnType } from "../../methods/info/types/acps.js";
import { GetBlockchainIDParameters } from "../../methods/info/types/getBlockchainID.js";
import { GetBlockchainIDReturnType } from "../../methods/info/types/getBlockchainID.js";
import { GetNetworkIDReturnType } from "../../methods/info/types/getNetworkID.js";
import { GetNetworkNameReturnType } from "../../methods/info/types/getNetworkName.js";
import { GetNodeIPReturnType } from "../../methods/info/types/getNodeIP.js";
import { GetNodeIDReturnType } from "../../methods/info/types/getNodeID.js";
import { GetNodeVersionReturnType } from "../../methods/info/types/getNodeVersion.js";
import { GetVMsReturnType } from "../../methods/info/types/getVMs.js";
import { IsBootstrappedReturnType, IsBootstrappedParameters } from "../../methods/info/types/isBootstrapped.js";
import { GetTxFeeReturnType } from "../../methods/info/types/getTxFee.js";
import { PeersReturnType, PeersParameters } from "../../methods/info/types/peers.js";
import { UpgradesReturnType } from "../../methods/info/types/upgrades.js";
import { UptimeReturnType } from "../../methods/info/types/uptime.js";
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
import { upgrades } from "../../methods/info/upgrades.js";
import { uptime } from "../../methods/info/uptime.js";

export type InfoAPIActions = {
    acps: () => Promise<AcpsReturnType>;
    getBlockchainID: (args: GetBlockchainIDParameters) => Promise<GetBlockchainIDReturnType>;
    getNetworkID: () => Promise<GetNetworkIDReturnType>;
    getNetworkName: () => Promise<GetNetworkNameReturnType>;
    getNodeID: () => Promise<GetNodeIDReturnType>;
    getNodeIP: () => Promise<GetNodeIPReturnType>;
    getNodeVersion: () => Promise<GetNodeVersionReturnType>;
    getTxFee: () => Promise<GetTxFeeReturnType>;
    getVMs: () => Promise<GetVMsReturnType>;
    isBootstrapped: (args: IsBootstrappedParameters) => Promise<IsBootstrappedReturnType>;
    peers: (args: PeersParameters) => Promise<PeersReturnType>;
    upgrades: () => Promise<UpgradesReturnType>;
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
