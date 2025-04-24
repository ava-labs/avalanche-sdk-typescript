import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { GetNodeVersionReturnType } from "./types/getNodeVersion.js";


export async function getNodeVersion<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetNodeVersionReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.getNodeVersion"; params: {} },
    GetNodeVersionReturnType
  >({
    method: "info.getNodeVersion",
    params: {},
  });
}
