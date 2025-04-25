import { fetchInstantiatedClients } from "./boilerPlate";

async function main() {
    const { pClient } = await fetchInstantiatedClients()

    const addSubnetValidatorTx = await pClient.txBuilder.newAddSubnetValidatorTx({
        subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
        nodeId: 'NodeID-NQGEHM5YVqjT9yGo59bS7q2byqmkRGcsV',
        end: BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 2), // 2 days
        subnetAuth: [0],
        weight: 12345n,
    })
    await addSubnetValidatorTx.sign()
    addSubnetValidatorTx.issue().then(console.log)
}

main()
