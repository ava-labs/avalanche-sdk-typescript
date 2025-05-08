import { fetchInstantiatedClients } from "./boilerPlate";

const { pnClient } = fetchInstantiatedClients()

async function main() {
    const importTx = await pnClient.pChain.newImportTx({
        sourceChain: 'c-chain',
        importedOutput: {
            addresses: ['P-fuji18jma8ppw3nhx5r4ap8clazz0dps7rv5u6wmu4t'],
        },
    })

    await importTx.sign()
    importTx.issue().then(console.log)
}

main()
