import { fetchInstantiatedClients } from "./boilerPlate";

async function main() {
    const { pClient } = await fetchInstantiatedClients()

    const exportTx = await pClient.txBuilder.newExportTx({
        exportedOutputs: [
            {
                addresses: ['P-fuji18jma8ppw3nhx5r4ap8clazz0dps7rv5u6wmu4t'],
                amount: 0.00001,
            }
        ],
        destinationChain: 'c-chain',
    })

    await exportTx.sign()
    exportTx.issue().then(console.log)
}

main()
