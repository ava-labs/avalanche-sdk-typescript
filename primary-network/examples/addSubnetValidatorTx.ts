import { fetchInstantiatedClients } from "./boilerPlate";

const { pnClient } = fetchInstantiatedClients()

async function main() {
    const addSubnetValidatorTx = await pnClient.pChain.newAddSubnetValidatorTx({
        subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
        nodeId: 'NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ',
        end: BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 2), // 2 days
        subnetAuth: [0],
        weight: 12345n,
    })
    await addSubnetValidatorTx.sign()
    addSubnetValidatorTx.issue().then(console.log)
}

main()
