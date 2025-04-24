import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetProposedHeightReturnType } from "./types/getProposedHeight.js";

export async function getProposedHeight<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetProposedHeightReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getProposedHeight";
      params: {};
    },
    GetProposedHeightReturnType
  >({
    method: "platform.getProposedHeight",
    params: {},
  });
}