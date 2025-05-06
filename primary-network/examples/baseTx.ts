import { fetchInstantiatedClients } from "./boilerPlate";

async function main() {
    const { pnClient } = await fetchInstantiatedClients()

    const baseTx = await pnClient.pChain.newBaseTx({
        outputs: [
            {
                addresses: ['P-fuji18jma8ppw3nhx5r4ap8clazz0dps7rv5u6wmu4t'],
                amount: 0.00001,
            }
        ],
    })

    await baseTx.sign()
    baseTx.issue().then(console.log)
}
main()
