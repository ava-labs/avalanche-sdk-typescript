import { fetchInstantiatedClients } from "./boilerPlate";

async function main() {
    const { pnClient } = await fetchInstantiatedClients()

    const increaseL1ValidatorBalanceTx = await pnClient.pChain.newIncreaseL1ValidatorBalanceTx({
        balanceInAVAX: 0.001,
        validationId: 'FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu',
    })

    await increaseL1ValidatorBalanceTx.sign()
    increaseL1ValidatorBalanceTx.issue().then(console.log)
}

main()
