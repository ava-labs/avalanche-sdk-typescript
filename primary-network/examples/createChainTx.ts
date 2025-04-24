import { fetchInstantiatedClients } from "./boilerPlate";

async function main() {
    const { pClient } = await fetchInstantiatedClients()

    const createChainTx = await pClient.txBuilder.newCreateChainTx({
        outputs: [
            {
                addresses: ['P-fuji18jma8ppw3nhx5r4ap8clazz0dps7rv5u6wmu4t'],
                amount: 0.000001,
            }
        ],
        subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
        vmId: 'mDtV8ES8wRL1j2m6Kvc1qRFAvnpq4kufhueAY1bwbzVhk336o',
        chainName: 'test chain avalanche sdk',
        genesisData: {},
        subnetAuth: [0],
    })
    await createChainTx.sign()
    createChainTx.issue().then(console.log)
}

main()
