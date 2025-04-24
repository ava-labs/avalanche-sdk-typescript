import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { UptimeReturnType } from "./types/uptime.js";


export async function uptime<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<UptimeReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.uptime"; params: {} },
    UptimeReturnType
  >({
    method: "info.uptime",
    params: {},
  });
}
