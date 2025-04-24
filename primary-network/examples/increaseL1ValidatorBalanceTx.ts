import { fetchInstantiatedClients } from "./boilerPlate";

async function main() {
    const { pClient } = await fetchInstantiatedClients()

    const increaseL1ValidatorBalanceTx = await pClient.txBuilder.newIncreaseL1ValidatorBalanceTx({
        balanceInAVAX: 0.001,
        validationId: 'FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu',
    })

    await increaseL1ValidatorBalanceTx.sign()
    increaseL1ValidatorBalanceTx.issue().then(console.log)
}

main()
