import { Chain, Transport } from "viem";
import { AvalancheCoreClient } from "../createAvalancheCoreClient.js";
import { GetAssetDescriptionParameters, GetAssetDescriptionReturnType } from "../../methods/xChain/types/getAssetDescription.js";
import { BuildGenesisParameters, BuildGenesisReturnType } from "../../methods/xChain/types/buildGenesis.js";
import { GetAllBalancesParameters, GetAllBalancesReturnType } from "../../methods/xChain/types/getAllBalances.js";
import { GetBalanceParameters, GetBalanceReturnType } from "../../methods/xChain/types/getBalance.js";
import { GetTxParameters } from "../../methods/pChain/index.js";
import { IssueTxParameters, IssueTxReturnType } from "../../methods/xChain/types/issueTx.js";
import { GetBlockParameters, GetBlockReturnType } from "../../methods/xChain/types/getBlock.js";
import { GetBlockByHeightParameters, GetBlockByHeightReturnType } from "../../methods/xChain/types/getBlockByHeight.js";
import { GetHeightReturnType } from "../../methods/xChain/types/getHeight.js";
import { GetTxReturnType } from "../../methods/xChain/types/getTx.js";
import { GetTxFeeReturnType } from "../../methods/xChain/types/getTxFee.js";
import { GetTxStatusParameters, GetTxStatusReturnType } from "../../methods/xChain/types/getTxStatus.js";
import { GetUTXOsParameters, GetUTXOsReturnType } from "../../methods/xChain/types/getUTXOs.js";
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