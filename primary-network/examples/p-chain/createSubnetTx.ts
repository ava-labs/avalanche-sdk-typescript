import { fetchInstantiatedClients } from "../boilerPlate";

const { pnClient } = fetchInstantiatedClients()

async function main() {
    const subnetOwners = {
        addresses: ['P-fuji18jma8ppw3nhx5r4ap8clazz0dps7rv5u6wmu4t'],
        locktime: 123n,
        threshold: 1
    }

    const createSubnetTx = await pnClient.pChain.newCreateSubnetTx({
        subnetOwners,
    })

    await createSubnetTx.sign()
    console.log(await createSubnetTx.issue())
}

main()
