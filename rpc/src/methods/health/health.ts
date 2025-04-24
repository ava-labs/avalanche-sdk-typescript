import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { HealthRpcSchema } from "./healthRpcSchema.js";
import { HealthParameters, HealthReturnType } from "./types/health.js";

export async function health<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: HealthParameters
): Promise<HealthReturnType> {
  return client.request<
    HealthRpcSchema,
    { method: "health.health"; params: HealthParameters },
    HealthReturnType
  >({
    method: "health.health",
    params,
  });
}
