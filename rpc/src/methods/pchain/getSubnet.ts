import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetSubnetParameters, GetSubnetReturnType } from "./types/getSubnet.js";

export async function getSubnet<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetSubnetParameters
): Promise<GetSubnetReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getSubnet";
      params: GetSubnetParameters;
    },
    GetSubnetReturnType
  >({
    method: "platform.getSubnet",
    params,
  });
}
