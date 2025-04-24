import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { AcpsReturnType } from "./types/acps.js";

export async function acps<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<AcpsReturnType> {
  const acps = await client.request<
    InfoRpcSchema,
    { method: "info.acps"; params: {} },
    AcpsReturnType
  >({
    method: "info.acps",
    params: {},
  });
  return Object.keys(acps.acps).reduce((acc, curr) => {
    const key = parseInt(curr);
    acc.acps.set(key, {
      supportWeight: BigInt(acps.acps.get(key)?.supportWeight || 0n),
      supporters: new Set(acps.acps.get(key)?.supporters || []),
      objectWeight: BigInt(acps.acps.get(key)?.objectWeight || 0n),
      objectors: new Set(acps.acps.get(key)?.objectors || []),
      abstainWeight: BigInt(acps.acps.get(key)?.abstainWeight || 0n)
    });
    return acc;
  }, { acps: new Map() } as AcpsReturnType);
}
