
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetTimestampReturnType } from "./types/getTimestamp.js";

export async function getTimestamp<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetTimestampReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getTimestamp";
      params: {};
    },
    GetTimestampReturnType
  >({
    method: "platform.getTimestamp",
    params: {},
  });
}