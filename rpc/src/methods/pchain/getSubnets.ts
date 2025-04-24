
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetSubnetsParameters, GetSubnetsReturnType } from "./types/getSubnets.js";

export async function getSubnets<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetSubnetsParameters
): Promise<GetSubnetsReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getSubnets";
      params: GetSubnetsParameters;
    },
    GetSubnetsReturnType
  >({
    method: "platform.getSubnets",
    params,
  });
}