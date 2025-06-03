import { fetchInstantiatedClients } from "../boilerPlate";

const { pnClient } = fetchInstantiatedClients()

async function main() {
    const exportTx = await pnClient.pChain.newExportTx({
        exportedOutputs: [
            {
                addresses: ['P-fuji18jma8ppw3nhx5r4ap8clazz0dps7rv5u6wmu4t'],
                amount: 0.00001,
            }
        ],
        destinationChain: 'C',
    })

    await exportTx.sign()
    console.log(await exportTx.issue())
}

main()
