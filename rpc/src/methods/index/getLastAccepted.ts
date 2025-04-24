import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { IndexRpcSchema } from "./indexRpcSchema.js";
import {
  GetLastAcceptedParameters,
  GetLastAcceptedReturnType,
} from "./types/getLastAccepted.js";

export async function getLastAccepted<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetLastAcceptedParameters
): Promise<GetLastAcceptedReturnType> {
  return client.request<
    IndexRpcSchema,
    { 
        method: "index.getLastAccepted"; 
        params: GetLastAcceptedParameters 
    },
    GetLastAcceptedReturnType
  >({
    method: "index.getLastAccepted",
    params,
  });
}
