import { createPrimaryNetworkClient } from "../../src/primaryNetworkClient";

const pnClient = createPrimaryNetworkClient({
    nodeUrlOrChain: "fuji",
});

pnClient.linkPrivateKeys(
    ["56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"], // common ewoq address for testing
);

async function main() {
    const exportTx = await pnClient.cChain.newExportTx({
        destinationChain: 'P',
        fromAddress: '0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC',
        exportedOutput: {
            addresses: ['P-fuji18jma8ppw3nhx5r4ap8clazz0dps7rv5u6wmu4t'],
            amountInAvax: 0.1,
        }
    })

    await exportTx.sign()
    console.log(await exportTx.issue())
}
main()
