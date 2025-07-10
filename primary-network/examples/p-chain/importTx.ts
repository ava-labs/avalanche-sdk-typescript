import { createPrimaryNetworkClient } from "../../src/primaryNetworkClient";

const pnClient = createPrimaryNetworkClient({
    nodeUrlOrChain: "fuji",
    privateKeys: ["56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"], // common ewoq address for testing
});

async function main() {
    const importTx = await pnClient.pChain.newImportTx({
        sourceChain: 'C',
        importedOutput: {
            addresses: ['P-fuji18jma8ppw3nhx5r4ap8clazz0dps7rv5u6wmu4t'],
        },
    })

    await importTx.sign()
    console.log(await importTx.issue())
}

main()
