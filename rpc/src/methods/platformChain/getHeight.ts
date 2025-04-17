import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetHeightReturnType } from "./types/getHeight.js";

export async function getHeight<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetHeightReturnType> {
  return client.request<
    PlatformChainRpcSchema,
    {
      method: "platform.getHeight";
      params: {};
    },
    GetHeightReturnType
  >({
    method: "platform.getHeight",
    params: {},
  });
}
