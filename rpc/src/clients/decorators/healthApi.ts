import { Chain, Transport } from "viem";
import { AvalancheCoreClient } from "../createAvalancheCoreClient.js";
import { HealthParameters, HealthReturnType } from "../../methods/health/types/health.js";
import { LivenessReturnType } from "../../methods/health/types/liveness.js";
import { ReadinessParameters, ReadinessReturnType } from "../../methods/health/types/readiness.js";
import { health } from "../../methods/health/health.js";
import { liveness } from "../../methods/health/liveness.js";
import { readiness } from "../../methods/health/readiness.js";

export type HealthAPIActions = {
   health: (args: HealthParameters) => Promise<HealthReturnType>;
   liveness: () => Promise<LivenessReturnType>;
   readiness: (args: ReadinessParameters) => Promise<ReadinessReturnType>;
};

export function healthAPIActions<
  chain extends Chain | undefined = Chain | undefined
>(client: AvalancheCoreClient<Transport, chain>): HealthAPIActions {
  return {
    health: (args) => health(client, args),
    liveness: () => liveness(client),
    readiness: (args) => readiness(client, args),
  };
}