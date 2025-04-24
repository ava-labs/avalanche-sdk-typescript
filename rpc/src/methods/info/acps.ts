import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { AcpsReturnType } from "./types/acps.js";

export async function acps<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<AcpsReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.acps"; params: {} },
    AcpsReturnType
  >({
    method: "info.acps",
    params: {},
  });
}
