import { RpcSchemaOverride } from "viem";
import { BuildGenesisMethod } from "./types/buildGenesis.js";
import { GetAllBalancesMethod } from "./types/getAllBalances.js";
import { GetAssetDescriptionMethod } from "./types/getAssetDescription.js";
import { GetBalanceMethod } from "./types/getBalance.js";
import { GetBlockMethod } from "./types/getBlock.js";
import { GetBlockByHeightMethod } from "./types/getBlockByHeight.js";
import { GetHeightMethod } from "./types/getHeight.js";
import { GetTxMethod } from "./types/getTx.js";
import { GetTxFeeMethod } from "./types/getTxFee.js";
import { GetTxStatusMethod } from "./types/getTxStatus.js";
import { GetUTXOsMethod } from "./types/getUTXOs.js";
import { IssueTxMethod } from "./types/issueTx.js";

export type XChainMethods = [
  BuildGenesisMethod,
  GetAllBalancesMethod,
  GetAssetDescriptionMethod,
  GetBalanceMethod,
  GetBlockMethod,
  GetBlockByHeightMethod,
  GetHeightMethod,
  GetTxMethod,
  GetTxFeeMethod,
  GetTxStatusMethod,
  GetUTXOsMethod,
  IssueTxMethod
];

/**
 * The RPC schema for the X-Chain methods.
 *
 * @see {@link XChainMethods}
 */
export type XChainRpcSchema = RpcSchemaOverride & XChainMethods;
