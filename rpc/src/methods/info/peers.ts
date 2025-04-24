import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { PeersParameters, PeersReturnType } from "./types/peers.js";


export async function peers<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: PeersParameters
): Promise<PeersReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.peers"; params: PeersParameters },
    PeersReturnType
  >({
    method: "info.peers",
    params,
  });
}