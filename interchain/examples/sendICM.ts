import { createWalletClient, http } from "viem";
import { createICMClient } from "../src/icm/icm";
import { privateKeyToAccount } from "viem/accounts";
import { avalancheFuji } from "./chains/avalancheFuji";
import { dispatch } from "./chains/dispatch";

const account = privateKeyToAccount('0x63e0730edea86f6e9e95db48dbcab18406e60bebae45ad33e099f09d21450ebf');

const wallet = createWalletClient({
    transport: http('https://api.avax-test.network/ext/bc/C/rpc'),
    account,
})

const icmClient = createICMClient(wallet);

async function main() {
    const hash = await icmClient.sendMsg({
        sourceChain: avalancheFuji,
        destinationChain: dispatch,
        message: 'Hello from Avalanche Fuji to Dispatch Fuji!',
    });
    console.log('Message sent with hash:', hash);
}

main()