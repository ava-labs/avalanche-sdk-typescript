import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import {
  GetBlockchainIDParameters,
  GetBlockchainIDReturnType,
} from "./types/getBlockchainID.js";

export async function getBlockchainID<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetBlockchainIDParameters
): Promise<GetBlockchainIDReturnType> {
  return client.request<
    InfoRpcSchema,
    { 
        method: "info.getBlockchainID"; 
        params: GetBlockchainIDParameters 
    },
    GetBlockchainIDReturnType
  >({
    method: "info.getBlockchainID",
    params,
  });
}
