import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { IndexRpcSchema } from "./indexRpcSchema.js";
import {
  GetContainerByIndexParameters,
  GetContainerByIndexReturnType,
} from "./types/getContainerByIndex.js";

export async function getContainerByIndex<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetContainerByIndexParameters
): Promise<GetContainerByIndexReturnType> {
  return client.request<
    IndexRpcSchema,
    {
      method: "index.getContainerByIndex";
      params: GetContainerByIndexParameters;
    },
    GetContainerByIndexReturnType
  >({
    method: "index.getContainerByIndex",
    params,
  });
}
