import { createPrimaryNetworkClient } from "../../src/primaryNetworkClient";

const pnClient = createPrimaryNetworkClient({
    nodeUrlOrChain: "fuji",
    privateKeys: ["56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"], // common ewoq address for testing
});

async function main() {
    const increaseL1ValidatorBalanceTx = await pnClient.pChain.newIncreaseL1ValidatorBalanceTx({
        balanceInAvax: 0.001,
        validationId: 'FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu',
    })

    await increaseL1ValidatorBalanceTx.sign()
    console.log(await increaseL1ValidatorBalanceTx.issue())
}

main()
