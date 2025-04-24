import { Chain, Transport } from "viem";
import { AvalancheCoreClient } from "../createAvalancheCoreClient.js";
import { GetAssetDescriptionParameters, GetAssetDescriptionReturnType } from "../../methods/xchain/types/getAssetDescription.js";
import { BuildGenesisParameters, BuildGenesisReturnType } from "../../methods/xchain/types/buildGenesis.js";
import { GetAllBalancesParameters, GetAllBalancesReturnType } from "../../methods/xchain/types/getAllBalances.js";
import { GetBalanceParameters, GetBalanceReturnType } from "../../methods/xchain/types/getBalance.js";
import { GetTxParameters } from "../../methods/pchain/index.js";
import { IssueTxParameters, IssueTxReturnType } from "../../methods/xchain/types/issueTx.js";
import { GetBlockParameters, GetBlockReturnType } from "../../methods/xchain/types/getBlock.js";
import { GetBlockByHeightParameters, GetBlockByHeightReturnType } from "../../methods/xchain/types/getBlockByHeight.js";
import { GetHeightReturnType } from "../../methods/xchain/types/getHeight.js";
import { GetTxReturnType } from "../../methods/xchain/types/getTx.js";
import { GetTxFeeReturnType } from "../../methods/xchain/types/getTxFee.js";
import { GetTxStatusParameters, GetTxStatusReturnType } from "../../methods/xchain/types/getTxStatus.js";
import { GetUTXOsParameters, GetUTXOsReturnType } from "../../methods/xchain/types/getUTXOs.js";
import { buildGenesis } from "../../methods/xchain/buildGenesis.js";
import { getAllBalances } from "../../methods/xchain/getAllBalances.js";
import { getAssetDescription } from "../../methods/xchain/getAssetDescription.js";
import { getBalance } from "../../methods/xchain/getBalance.js";
import { getBlock } from "../../methods/xchain/getBlock.js";
import { getBlockByHeight } from "../../methods/xchain/getBlockByHeight.js";
import { getHeight } from "../../methods/xchain/getHeight.js";
import { getTx } from "../../methods/xchain/getTx.js";
import { getTxFee } from "../../methods/xchain/getTxFee.js";
import { getTxStatus } from "../../methods/xchain/getTxStatus.js";
import { getUTXOs } from "../../methods/xchain/getUTXOs.js";
import { issueTx } from "../../methods/xchain/issueTx.js";

export type XChainActions = {
    buildGenesis: (args: BuildGenesisParameters) => Promise<BuildGenesisReturnType>;
    getAllBalances: (args: GetAllBalancesParameters) => Promise<GetAllBalancesReturnType>;
    getAssetDescription: (args: GetAssetDescriptionParameters) => Promise<GetAssetDescriptionReturnType>;
    getBalance: (args: GetBalanceParameters) => Promise<GetBalanceReturnType>
    getBlock: (args: GetBlockParameters) => Promise<GetBlockReturnType>;
    getBlockByHeight: (args: GetBlockByHeightParameters) => Promise<GetBlockByHeightReturnType>;
    getHeight: () => Promise<GetHeightReturnType>;
    getTx: (args: GetTxParameters) => Promise<GetTxReturnType>;
    getTxFee: () => Promise<GetTxFeeReturnType>;
    getTxStatus: (args: GetTxStatusParameters) => Promise<GetTxStatusReturnType>;
    getUTXOs: (args: GetUTXOsParameters) => Promise<GetUTXOsReturnType>;
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