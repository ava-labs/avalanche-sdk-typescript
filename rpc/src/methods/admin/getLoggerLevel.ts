import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";
import {
  GetLoggerLevelParameters,
  GetLoggerLevelReturnType,
} from "./types/getLoggerLevel.js";

export async function getLoggerLevel<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetLoggerLevelParameters
): Promise<GetLoggerLevelReturnType> {
  return client.request<
    AdminRpcSchema,
    { method: "admin.getLoggerLevel"; params: GetLoggerLevelParameters },
    GetLoggerLevelReturnType
  >({
    method: "admin.getLoggerLevel",
    params,
  });
}
