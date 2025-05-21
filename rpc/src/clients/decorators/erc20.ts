import { Chain, Transport } from "viem";
import { deployErc20 } from "../../methods/wallet/erc20/deployErc20.js";
import { getErc20Decimals } from "../../methods/wallet/erc20/getErc20Decimals.js";
import { getErc20Name } from "../../methods/wallet/erc20/getErc20Name.js";
import { getErc20Symbol } from "../../methods/wallet/erc20/getErc20Symbol.js";
import {
  DeployErc20Parameters,
  DeployErc20ReturnType,
} from "../../methods/wallet/erc20/index.js";
import {
  GetErc20DecimalsParameters,
  GetErc20DecimalsReturnType,
} from "../../methods/wallet/erc20/types/getErc20Decimals.js";
import {
  GetErc20NameParameters,
  GetErc20NameReturnType,
} from "../../methods/wallet/erc20/types/getErc20Name.js";
import {
  GetErc20SymbolParameters,
  GetErc20SymbolReturnType,
} from "../../methods/wallet/erc20/types/getErc20Symbol.js";
import { AvalancheWalletCoreClient } from "../createAvalancheWalletCoreClient.js";

export type Erc20Actions = {
  deploy: (args: DeployErc20Parameters) => Promise<DeployErc20ReturnType>;
  getName: (args: GetErc20NameParameters) => Promise<GetErc20NameReturnType>;
  getSymbol: (
    args: GetErc20SymbolParameters
  ) => Promise<GetErc20SymbolReturnType>;
  getDecimals: (
    args: GetErc20DecimalsParameters
  ) => Promise<GetErc20DecimalsReturnType>;
};

export function erc20Actions<
  chain extends Chain | undefined = Chain | undefined
>(client: AvalancheWalletCoreClient<Transport, chain>): Erc20Actions {
  return {
    deploy: (args) => deployErc20(client, args),
    getName: (args) => getErc20Name(client, args),
    getDecimals: (args) => getErc20Decimals(client, args),
    getSymbol: (args) => getErc20Symbol(client, args),
  };
}
