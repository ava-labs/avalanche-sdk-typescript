import { PrimaryNetwork } from "../src/primaryNetworkClient";
import { Wallet } from "../src/wallet";

export async function fetchInstantiatedClients() {
    const wallet = new Wallet({
        nodeUrl: "https://api.avax-test.network",
        privateKeys: ["56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"], // common ewoq address for testing
    });

    const pnClient = await PrimaryNetwork.newClient({
        nodeUrl: "https://api.avax-test.network",
        wallet,
    });

    return { pnClient, wallet }
}
