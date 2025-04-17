import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetBlockchainsReturnType } from "./types/getBlockchains.js";

export async function getBlockchains<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetBlockchainsReturnType> {
  return client.request<
    PlatformChainRpcSchema,
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
