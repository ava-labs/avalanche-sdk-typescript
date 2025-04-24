import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";
import { GetChainAliasesParameters, GetChainAliasesReturnType } from "./types/getChainAliases.js";


export async function getChainAliases<chain extends Chain | undefined>(
    client: Client<Transport, chain>,
    params: GetChainAliasesParameters
): Promise<GetChainAliasesReturnType> {
    return client.request<
        AdminRpcSchema,
        {
            method: "admin.getChainAliases";
            params: GetChainAliasesParameters;
        },
        GetChainAliasesReturnType
    >({
        method: "admin.getChainAliases",
        params,
    });
}
