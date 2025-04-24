import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { GetChainConfigReturnType } from "./types/getChainConfig.js";
import { CChainRpcSchema } from "./cChainRpcSchema.js";

export async function getChainConfig<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetChainConfigReturnType> {
  return client.request<
    CChainRpcSchema,
    {
      method: "eth_getChainConfig";
      params: [];
    },
    GetChainConfigReturnType
  >({
    method: "eth_getChainConfig",
    params: [],
  });
}
