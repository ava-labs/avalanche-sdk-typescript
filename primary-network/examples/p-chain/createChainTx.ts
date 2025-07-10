import { createPrimaryNetworkClient } from "../../src/primaryNetworkClient";

const pnClient = createPrimaryNetworkClient({
    nodeUrlOrChain: "fuji",
    privateKeys: ["56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"], // common ewoq address for testing
});

async function main() {
    const createChainTx = await pnClient.pChain.newCreateChainTx({
        subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
        vmId: 'mDtV8ES8wRL1j2m6Kvc1qRFAvnpq4kufhueAY1bwbzVhk336o',
        chainName: 'test chain avalanche sdk',
        genesisData: {},
        subnetAuth: [0],
    })
    await createChainTx.sign()
    console.log(await createChainTx.issue())
}

main()
