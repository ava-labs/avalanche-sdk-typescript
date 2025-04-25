import { fetchInstantiatedClients } from "./boilerPlate";

async function main() {
    const { pClient } = await fetchInstantiatedClients()

    const importTx = await pClient.txBuilder.newImportTx({
        sourceChain: 'c-chain',
        importedOutput: {
            addresses: ['P-fuji18jma8ppw3nhx5r4ap8clazz0dps7rv5u6wmu4t'],
        },
    })

    await importTx.sign()
    importTx.issue().then(console.log)
}

main()
