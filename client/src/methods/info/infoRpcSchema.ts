import { RpcSchemaOverride } from "viem";
import { AcpsMethod } from "./types/acps.js";
import { GetBlockchainIDMethod } from "./types/getBlockchainID.js";
import { GetNetworkIDMethod } from "./types/getNetworkID.js";
import { GetNetworkNameMethod } from "./types/getNetworkName.js";
import { GetNodeIDMethod } from "./types/getNodeID.js";
import { GetNodeIPMethod } from "./types/getNodeIP.js";
import { GetNodeVersionMethod } from "./types/getNodeVersion.js";
import { GetTxFeeMethod } from "./types/getTxFee.js";
import { GetVMsMethod } from "./types/getVMs.js";
import { IsBootstrappedMethod } from "./types/isBootstrapped.js";
import { PeersMethod } from "./types/peers.js";
import { UpgradesMethod } from "./types/upgrades.js";
import { UptimeMethod } from "./types/uptime.js";

export type InfoMethods = [
  AcpsMethod,
  GetBlockchainIDMethod,
  GetNetworkIDMethod,
  GetNetworkNameMethod,
  GetNodeIDMethod,
  GetNodeIPMethod,
  GetNodeVersionMethod,
  GetTxFeeMethod,
  GetVMsMethod,
  IsBootstrappedMethod,
  PeersMethod,
  UpgradesMethod,
  UptimeMethod
];

/**
 * The RPC schema for the Info methods.
 *
 * @see {@link InfoMethods}
 */
export type InfoRpcSchema = RpcSchemaOverride & InfoMethods;
