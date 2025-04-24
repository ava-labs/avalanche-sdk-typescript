import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { HealthRpcSchema } from "./healthRpcSchema.js";
import { ReadinessParameters, ReadinessReturnType } from "./types/readiness.js";

export async function readiness<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: ReadinessParameters
): Promise<ReadinessReturnType> {
  return client.request<
    HealthRpcSchema,
    { method: "health.readiness"; params: ReadinessParameters },
    ReadinessReturnType
  >({
    method: "health.readiness",
    params,
  });
}
