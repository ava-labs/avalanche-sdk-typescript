import { Chain, Transport } from "viem";
import { getContainerByID } from "../../methods/index/getContainerByID.js";
import { getContainerByIndex } from "../../methods/index/getContainerByIndex.js";
import { getContainerRange } from "../../methods/index/getContainerRange.js";
import { getIndex } from "../../methods/index/getIndex.js";
import { getLastAccepted } from "../../methods/index/getLastAccepted.js";
import { isAccepted } from "../../methods/index/isAccepted.js";
import {
  GetContainerByIDParameters,
  GetContainerByIDReturnType,
} from "../../methods/index/types/getContainerByID.js";
import {
  GetContainerByIndexParameters,
  GetContainerByIndexReturnType,
} from "../../methods/index/types/getContainerByIndex.js";
import {
  GetContainerRangeParameters,
  GetContainerRangeReturnType,
} from "../../methods/index/types/getContainerRange.js";
import {
  GetIndexParameters,
  GetIndexReturnType,
} from "../../methods/index/types/getIndex.js";
import {
  GetLastAcceptedParameters,
  GetLastAcceptedReturnType,
} from "../../methods/index/types/getLastAccepted.js";
import {
  IsAcceptedParameters,
  IsAcceptedReturnType,
} from "../../methods/index/types/isAccepted.js";
import { AvalancheCoreClient } from "../createAvalancheCoreClient.js";

export type IndexAPIActions = {
  /**
   * Get container by ID.
   *
   * - Docs: https://build.avax.network/docs/api-reference/index-api#indexgetcontainerbyid
   *
   * @param args - {@link GetContainerByIDParameters} The container ID and encoding
   * @returns The container details. {@link GetContainerByIDReturnType}
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
   * const container = await client.indexBlock.pChain.getContainerByID({
   *   id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
   *   encoding: "hex"
   * })
   * ```
   */
  getContainerByID: (
    args: GetContainerByIDParameters
  ) => Promise<GetContainerByIDReturnType>;

  /**
   * Get container by index.
   *
   * - Docs: https://build.avax.network/docs/api-reference/index-api#indexgetcontainerbyindex
   *
   * @param args - {@link GetContainerByIndexParameters} The index and encoding
   * @returns The container details. {@link GetContainerByIndexReturnType}
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
   * const container = await client.indexBlock.pChain.getContainerByIndex({
   *   index: 1,
   *   encoding: "hex"
   * })
   * ```
   */
  getContainerByIndex: (
    args: GetContainerByIndexParameters
  ) => Promise<GetContainerByIndexReturnType>;

  /**
   * Get a range of containers by their indices.
   *
   * - Docs: https://build.avax.network/docs/api-reference/index-api#indexgetcontainerrange
   *
   * @param args - {@link GetContainerRangeParameters} The start index, end index, and encoding
   * @returns The container details. {@link GetContainerRangeReturnType}
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
   * const containers = await client.indexBlock.pChain.getContainerRange({
   *   startIndex: 0,
   *   endIndex: 10,
   *   encoding: "hex"
   * })
   * ```
   */
  getContainerRange: (
    args: GetContainerRangeParameters
  ) => Promise<GetContainerRangeReturnType>;

  /**
   * Get the index of a container by its ID.
   *
   * - Docs: https://build.avax.network/docs/api-reference/index-api#indexgetindex
   *
   * @param args - {@link GetIndexParameters} The container ID and encoding
   * @returns The container index. {@link GetIndexReturnType}
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
   * const index = await client.indexBlock.pChain.getIndex({
   *   id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
   *   encoding: "hex"
   * })
   * ```
   */
  getIndex: (args: GetIndexParameters) => Promise<GetIndexReturnType>;

  /**
   * Get the last accepted container.
   *
   * - Docs: https://build.avax.network/docs/api-reference/index-api#indexgetlastaccepted
   *
   * @param args - {@link GetLastAcceptedParameters} The encoding
   * @returns The last accepted container. {@link GetLastAcceptedReturnType}
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
   * const lastAccepted = await client.indexBlock.pChain.getLastAccepted({
   *   encoding: "hex"
   * })
   * ```
   */
  getLastAccepted: (
    args: GetLastAcceptedParameters
  ) => Promise<GetLastAcceptedReturnType>;

  /**
   * Check if a container is accepted.
   *
   * - Docs: https://build.avax.network/docs/api-reference/index-api#indexisaccepted
   *
   * @param args - {@link IsAcceptedParameters} The container ID and encoding
   * @returns Whether the container is accepted. {@link IsAcceptedReturnType}
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
   * const isAccepted = await client.indexBlock.pChain.isAccepted({
   *   id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
   *   encoding: "hex"
   * })
   * ```
   */
  isAccepted: (args: IsAcceptedParameters) => Promise<IsAcceptedReturnType>;
};

export function indexAPIActions<
  chain extends Chain | undefined = Chain | undefined
>(client: AvalancheCoreClient<Transport, chain>): IndexAPIActions {
  return {
    getContainerByID: (args) => getContainerByID(client, args),
    getContainerByIndex: (args) => getContainerByIndex(client, args),
    getContainerRange: (args) => getContainerRange(client, args),
    getIndex: (args) => getIndex(client, args),
    getLastAccepted: (args) => getLastAccepted(client, args),
    isAccepted: (args) => isAccepted(client, args),
  };
}
