import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { CChainRpcSchema } from "./cChainRpcSchema.js";
import { SetLogLevelParameters } from "./types/setLogLevel.js";

export async function setLogLevel<chain extends Chain | undefined>(
    client: Client<Transport, chain>,
    params: SetLogLevelParameters
): Promise<void> {
    return client.request<CChainRpcSchema, { method: "admin.setLogLevel"; params: SetLogLevelParameters }, void>({
        method: "admin.setLogLevel",
        params: params,
    });
}