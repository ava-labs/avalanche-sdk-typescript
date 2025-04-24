import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";


export async function stopCPUProfiler<chain extends Chain | undefined>(
    client: Client<Transport, chain>
): Promise<void> {
    return client.request<
        AdminRpcSchema,
        {
            method: "admin.stopCPUProfiler";
            params: {};
        },
        void
    >({
        method: "admin.stopCPUProfiler",
        params: {},
    });
}


