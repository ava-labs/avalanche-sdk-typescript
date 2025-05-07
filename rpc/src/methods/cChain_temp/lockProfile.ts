import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { CChainRpcSchema } from "./cChainRpcSchema.js";

export async function lockProfile<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<void> {
  return client.request<
    CChainRpcSchema,
    { method: "admin.lockProfile"; params: {} },
    void
  >({
    method: "admin.lockProfile",
    params: {},
  });
}
