import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { GetNodeIDReturnType } from "./types/getNodeID.js";

export async function getNodeID<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetNodeIDReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.getNodeID"; params: {} },
    GetNodeIDReturnType
  >({
    method: "info.getNodeID",
    params: {},
  });
}
