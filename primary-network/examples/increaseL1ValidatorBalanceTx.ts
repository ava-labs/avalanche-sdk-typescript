import { fetchInstantiatedClients } from "./boilerPlate";

const { pnClient } = fetchInstantiatedClients()

async function main() {
    const increaseL1ValidatorBalanceTx = await pnClient.pChain.newIncreaseL1ValidatorBalanceTx({
        balanceInAvax: 0.001,
        validationId: 'FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu',
    })

    await increaseL1ValidatorBalanceTx.sign()
    console.log(await increaseL1ValidatorBalanceTx.issue())
}

main()
