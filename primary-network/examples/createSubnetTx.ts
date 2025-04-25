import { fetchInstantiatedClients } from "./boilerPlate";

async function main() {
    const { pClient } = await fetchInstantiatedClients()

    const subnetOwners = {
        addresses: ['P-fuji18jma8ppw3nhx5r4ap8clazz0dps7rv5u6wmu4t'],
        locktime: 123n,
        threshold: 1
    }

    const createSubnetTx = await pClient.txBuilder.newCreateSubnetTx({
        subnetOwners,
    })

    await createSubnetTx.sign()
    createSubnetTx.issue().then(console.log)
}

main()
