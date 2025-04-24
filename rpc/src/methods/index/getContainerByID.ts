import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { IndexRpcSchema } from "./indexRpcSchema.js";
import {
  GetContainerByIDParameters,
  GetContainerByIDReturnType,
} from "./types/getContainerByID.js";

export async function getContainerByID<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetContainerByIDParameters
): Promise<GetContainerByIDReturnType> {
  return client.request<
    IndexRpcSchema,
    { method: "index.getContainerByID"; params: GetContainerByIDParameters },
    GetContainerByIDReturnType
  >({
    method: "index.getContainerByID",
    params,
  });
}
