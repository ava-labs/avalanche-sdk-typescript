
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { XChainRpcSchema } from "./XChainRpcSchema.js";
import { BuildGenesisParameters, BuildGenesisReturnType } from "./types/buildGenesis.js";

export async function buildGenesis<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: BuildGenesisParameters
): Promise<BuildGenesisReturnType> {
  return client.request<
    XChainRpcSchema,
    {
      method: "avm.buildGenesis";
      params: BuildGenesisParameters;
    },
    BuildGenesisReturnType
  >({
    method: "avm.buildGenesis",
    params,
  });
}