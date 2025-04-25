import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";
import { SetLoggerLevelParameters } from "./types/setLoggerLevel.js";


export async function setLoggerLevel<chain extends Chain | undefined>(
    client: Client<Transport, chain>,
    params: SetLoggerLevelParameters
): Promise<void> {
    return client.request<
        AdminRpcSchema,
        {
            method: "admin.setLoggerLevel";
            params: SetLoggerLevelParameters;
        },
        void
    >({
        method: "admin.setLoggerLevel",
        params,
    });
}

