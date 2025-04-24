import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { HealthRpcSchema } from "./healthRpcSchema.js";
import { LivenessReturnType } from "./types/liveness.js";

export async function liveness<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<LivenessReturnType> {
  return client.request<
    HealthRpcSchema,
    { method: "health.liveness"; params: {} },
    LivenessReturnType
  >({
    method: "health.liveness",
    params: {},
  });
}
