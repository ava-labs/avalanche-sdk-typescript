import { createPrimaryNetworkCoreClient } from "../../src/primaryNetworkCoreClient";
import { newAddSubnetValidatorTx } from "../../src/transactions/p-chain";
import { Wallet } from "../../src/wallet";

async function main() {
    const wallet = new Wallet({
        nodeUrl: "https://api.avax-test.network",
        privateKeys: ["56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"], // common ewoq address for testing
    });

    const pnClient = createPrimaryNetworkCoreClient({
        nodeUrlOrChain: "fuji",
        wallet,
    });
    
    const addSubnetValidatorTx = await newAddSubnetValidatorTx(
        pnClient,
        {
            subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
            nodeId: 'NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ',
            end: BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 2), // 2 days
            subnetAuth: [0],
            weight: 12345n,
        },
    )
    await addSubnetValidatorTx.sign()
    console.log(await addSubnetValidatorTx.issue())
}

main()
