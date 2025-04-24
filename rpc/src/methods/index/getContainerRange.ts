import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { IndexRpcSchema } from "./indexRpcSchema.js";
import {
  GetContainerRangeParameters,
  GetContainerRangeReturnType,
} from "./types/getContainerRange.js";

export async function getContainerRange<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetContainerRangeParameters
): Promise<GetContainerRangeReturnType> {
  return client.request<
    IndexRpcSchema,
    { 
        method: "index.getContainerRange"; 
        params: GetContainerRangeParameters 
    },
    GetContainerRangeReturnType
  >({
    method: "index.getContainerRange",
    params,
  });
}
