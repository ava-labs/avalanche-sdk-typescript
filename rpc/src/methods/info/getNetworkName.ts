import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { GetNetworkNameReturnType } from "./types/getNetworkName.js";

export async function getNetworkName<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetNetworkNameReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.getNetworkName"; params: {} },
    GetNetworkNameReturnType
  >({
    method: "info.getNetworkName",
    params: {},
  });
}
