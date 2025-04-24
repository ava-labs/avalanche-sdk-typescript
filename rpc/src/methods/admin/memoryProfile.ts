import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";


export async function memoryProfile<chain extends Chain | undefined>(
    client: Client<Transport, chain>
): Promise<void> {
    return client.request<
        AdminRpcSchema,
        {
            method: "admin.memoryProfile";
            params: {};
        },
        void
    >({
        method: "admin.memoryProfile",
        params: {},
    });
}

