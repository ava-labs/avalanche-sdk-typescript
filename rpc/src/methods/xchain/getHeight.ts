
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { XChainRpcSchema } from "./xChainRpcSchema.js";
import { GetHeightReturnType } from "./types/getHeight.js";

export async function getHeight<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetHeightReturnType> {
  return client.request<
    XChainRpcSchema,
    {
      method: "avm.getHeight";
      params: {};
    },
    GetHeightReturnType
  >({
    method: "avm.getHeight",
    params: {},
  });
}