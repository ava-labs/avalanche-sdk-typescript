import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { GetNodeIPReturnType } from "./types/getNodeIP.js";


export async function getNodeIP<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetNodeIPReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.getNodeIP"; params: {} },
    GetNodeIPReturnType
  >({
    method: "info.getNodeIP",
    params: {},
  });
}
