import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { UpgradesReturnType } from "./types/upgrades.js";

export async function upgrades<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<UpgradesReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.upgrades"; params: {} },
    UpgradesReturnType
  >({
    method: "info.upgrades",
    params: {},
  });
}
