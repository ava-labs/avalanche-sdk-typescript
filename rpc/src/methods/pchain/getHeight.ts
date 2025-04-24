import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetHeightReturnType } from "./types/getHeight.js";

export async function getHeight<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetHeightReturnType> {
  return client.request<
    PChainRpcSchema,
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
