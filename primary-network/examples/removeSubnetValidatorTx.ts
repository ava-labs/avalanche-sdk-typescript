import { fetchInstantiatedClients } from "./boilerPlate";

async function main() {
    const { pnClient } = await fetchInstantiatedClients()

    const removeSubnetValidatorTx = await pnClient.pChain.newRemoveSubnetValidatorTx({
        subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
        nodeId: 'NodeID-NQGEHM5YVqjT9yGo59bS7q2byqmkRGcsV',
        subnetAuth: [0],
    })
    await removeSubnetValidatorTx.sign()
    removeSubnetValidatorTx.issue().then(console.log)
}

main()
