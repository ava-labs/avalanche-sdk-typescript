import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";
import { LoadVMsReturnType } from "./types/loadVMs.js";


export async function loadVMs<chain extends Chain | undefined>(
    client: Client<Transport, chain>
): Promise<LoadVMsReturnType> {
    return client.request<
        AdminRpcSchema,
        {
            method: "admin.loadVMs";
            params: {};
        },
        LoadVMsReturnType
    >({
        method: "admin.loadVMs",
        params: {},
    });
}


