import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { GetVMsReturnType } from "./types/getVMs.js";


export async function getVMs<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetVMsReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.getVMs"; params: {} },
    GetVMsReturnType
  >({
    method: "info.getVMs",
    params: {},
  });
}
