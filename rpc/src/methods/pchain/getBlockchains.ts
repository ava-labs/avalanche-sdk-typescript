import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetBlockchainsReturnType } from "./types/getBlockchains.js";

export async function getBlockchains<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetBlockchainsReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getBlockchains";
      params: {};
    },
    GetBlockchainsReturnType
  >({
    method: "platform.getBlockchains",
    params: {},
  });
}
