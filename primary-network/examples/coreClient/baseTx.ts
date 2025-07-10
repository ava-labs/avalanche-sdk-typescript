import { createPrimaryNetworkCoreClient } from "../../src/primaryNetworkCoreClient";
import { newBaseTx } from "../../src/transactions/p-chain";

const pnClient = createPrimaryNetworkCoreClient({
    nodeUrlOrChain: "fuji",
    privateKeys: ["56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"], // common ewoq address for testing
});

async function main() {
    const baseTx = await newBaseTx(
        pnClient,
        {
            outputs: [
                {
                addresses: ['P-fuji18jma8ppw3nhx5r4ap8clazz0dps7rv5u6wmu4t'],
                amount: 0.00001,
            }
        ],
    })

    await baseTx.sign()
    console.log(await baseTx.issue())
}
main()
