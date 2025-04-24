import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";
import { SetLogLevelParameters } from "./types/setLogLevel.js";


export async function setLogLevel<chain extends Chain | undefined>(
    client: Client<Transport, chain>,
    params: SetLogLevelParameters
): Promise<void> {
    return client.request<
        AdminRpcSchema,
        {
            method: "admin.setLogLevel";
            params: SetLogLevelParameters;
        },
        void
    >({
        method: "admin.setLogLevel",
        params,
    });
}

