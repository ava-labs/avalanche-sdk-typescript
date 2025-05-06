import { fetchInstantiatedClients } from "./boilerPlate";

async function main() {
    const { pnClient } = await fetchInstantiatedClients()

    const createChainTx = await pnClient.pChain.newCreateChainTx({
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
