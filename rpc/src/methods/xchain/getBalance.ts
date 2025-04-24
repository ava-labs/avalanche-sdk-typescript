
import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { XChainRpcSchema } from "./XChainRpcSchema.js";
import { GetBalanceParameters, GetBalanceReturnType } from "./types/getBalance.js";

export async function getBalance<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetBalanceParameters
): Promise<GetBalanceReturnType> {
  return client.request<
    XChainRpcSchema,
    {
      method: "avm.getBalance";
      params: GetBalanceParameters;
    },
    GetBalanceReturnType
  >({
    method: "avm.getBalance",
    params,
  });
}