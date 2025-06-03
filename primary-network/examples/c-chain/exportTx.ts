import { fetchInstantiatedClients } from "../boilerPlate";

const { pnClient } = fetchInstantiatedClients()

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
