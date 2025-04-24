import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";
import { AliasParameters } from "./types/alias.js";


export async function alias<chain extends Chain | undefined>(
    client: Client<Transport, chain>,
    params: AliasParameters
): Promise<void> {
    return client.request<
        AdminRpcSchema,
        {
            method: "admin.alias";      
            params: AliasParameters;
        },
        void
    >({
        method: "admin.alias",
        params: params,
    });
}