
import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetTimestampReturnType } from "./types/getTimestamp.js";

export async function getTimestamp<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetTimestampReturnType> {
  return client.request<
    PlatformChainRpcSchema,
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