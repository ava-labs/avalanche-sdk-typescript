import { createPrimaryNetworkClient } from "../../src/primaryNetworkClient";

const pnClient = createPrimaryNetworkClient({
    nodeUrlOrChain: "fuji",
    privateKeys: ["56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"], // common ewoq address for testing
});

async function main() {
    const removeSubnetValidatorTx = await pnClient.pChain.newRemoveSubnetValidatorTx({
        subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
        nodeId: 'NodeID-NQGEHM5YVqjT9yGo59bS7q2byqmkRGcsV',
        subnetAuth: [0],
    })
    await removeSubnetValidatorTx.sign()
    console.log(await removeSubnetValidatorTx.issue())
}

main()
