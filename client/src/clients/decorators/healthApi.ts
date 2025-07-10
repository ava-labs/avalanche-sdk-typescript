import { Chain, Transport } from "viem";
import { health } from "../../methods/health/health.js";
import { liveness } from "../../methods/health/liveness.js";
import { readiness } from "../../methods/health/readiness.js";
import {
  HealthParameters,
  HealthReturnType,
} from "../../methods/health/types/health.js";
import { LivenessReturnType } from "../../methods/health/types/liveness.js";
import {
  ReadinessParameters,
  ReadinessReturnType,
} from "../../methods/health/types/readiness.js";
import { AvalancheCoreClient } from "../createAvalancheCoreClient.js";

export type HealthAPIActions = {
  /**
   * Returns the last set of health check results for the node.
   * This includes checks for all chains, network, database, and other components.
   *
   * - Docs: https://build.avax.network/docs/api-reference/health-api#healthhealth
   *
   * @param args - {@link HealthParameters} Optional tags to filter health checks
   * @returns The health check results. {@link HealthReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const healthStatus = await client.health.health({
   *   tags: ["11111111111111111111111111111111LpoYY", "29uVeLPJB1eQJkzRemU8g8wZDw5uJRqpab5U2mX9euieVwiEbL"]
   * })
   *
   * ```
   */
  health: (args: HealthParameters) => Promise<HealthReturnType>;

  /**
   * Returns a simple health check indicating if the node is alive and can handle requests.
   * This is a lightweight check that always returns healthy if the endpoint is available.
   *
   * - Docs: https://build.avax.network/docs/api-reference/health-api#healthliveness
   *
   * @returns The liveness check results. {@link LivenessReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * ```
   */
  liveness: () => Promise<LivenessReturnType>;

  /**
   * Returns the last evaluation of the startup health check results.
   * This indicates if the node has finished initializing and is ready to handle requests.
   *
   * - Docs: https://build.avax.network/docs/api-reference/health-api#healthreadiness
   *
   * @param args - {@link ReadinessParameters} Optional tags to filter readiness checks
   * @returns The readiness check results. {@link ReadinessReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const readinessStatus = await client.health.readiness({
   *   tags: ["11111111111111111111111111111111LpoYY"]
   * })
   *
   * ```
   */
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
