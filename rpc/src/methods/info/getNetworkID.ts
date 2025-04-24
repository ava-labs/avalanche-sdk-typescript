import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { GetNetworkIDReturnType } from "./types/getNetworkID.js";


export async function getNetworkID<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
): Promise<GetNetworkIDReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.getNetworkID"; params: {} },
    GetNetworkIDReturnType
  >({
    method: "info.getNetworkID",
    params: {},
  });
}
