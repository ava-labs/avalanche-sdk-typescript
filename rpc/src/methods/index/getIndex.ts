import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { IndexRpcSchema } from "./indexRpcSchema.js";
import { GetIndexParameters, GetIndexReturnType } from "./types/getIndex.js";

export async function getIndex<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetIndexParameters
): Promise<GetIndexReturnType> {
  return client.request<
    IndexRpcSchema,
    { 
        method: "index.getIndex"; 
        params: GetIndexParameters 
    },
    GetIndexReturnType
  >({
    method: "index.getIndex",
    params,
  });
}
