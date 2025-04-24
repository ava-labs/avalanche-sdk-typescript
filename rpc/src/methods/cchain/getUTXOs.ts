import { GetUTXOsReturnType } from "./types/getUTXOs.js";
import { Transport, Chain } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { GetUTXOsParameters } from "./types/getUTXOs.js";
import { CChainRpcSchema } from "./cChainRpcSchema.js";

export async function getUTXOs<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetUTXOsParameters
): Promise<GetUTXOsReturnType> {
  return client.request<
    CChainRpcSchema,
    {
      method: "avax.getUTXOs";
      params: GetUTXOsParameters;
    },
    GetUTXOsReturnType
  >({
    method: "avax.getUTXOs",
    params,
  });
}
