import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { XChainRpcSchema } from "./XChainRpcSchema.js";
import {
  GetAllBalancesParameters,
  GetAllBalancesReturnType,
} from "./types/getAllBalances.js";

export async function getAllBalances<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetAllBalancesParameters
): Promise<GetAllBalancesReturnType> {
  const allBalances = await client.request<
    XChainRpcSchema,
    {
      method: "avm.getAllBalances";
      params: GetAllBalancesParameters;
    },
    GetAllBalancesReturnType
  >({
    method: "avm.getAllBalances",
    params,
  });
  return {
    balances: allBalances.balances.map((balance) => ({
      ...balance,
      balance: BigInt(balance.balance),
    })),
  };
}
