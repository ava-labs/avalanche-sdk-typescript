import { createPrimaryNetworkClient } from "../../src/primaryNetworkClient";

const pnClient = createPrimaryNetworkClient({
    nodeUrlOrChain: "fuji",
});

pnClient.linkPrivateKeys(
    ["56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"], // common ewoq address for testing
);

async function main() {
    const importTx = await pnClient.cChain.newImportTx({
        sourceChain: 'P',
        toAddress: '0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC',
    })

    await importTx.sign()
    console.log(await importTx.issue())
}
main()
