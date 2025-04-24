import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";
import { AliasChainParameters } from "./types/aliasChain.js";


export async function aliasChain<chain extends Chain | undefined>(
    client: Client<Transport, chain>,
    params: AliasChainParameters
): Promise<void> {
    return client.request<
        AdminRpcSchema,
        {
            method: "admin.aliasChain";
            params: AliasChainParameters;
        },
        void
    >({
        method: "admin.aliasChain",
        params: params,
    });
}
