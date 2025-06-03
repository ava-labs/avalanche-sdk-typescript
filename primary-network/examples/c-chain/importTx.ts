import { fetchInstantiatedClients } from "../boilerPlate";

const { pnClient } = fetchInstantiatedClients()

async function main() {
    const importTx = await pnClient.cChain.newImportTx({
        sourceChain: 'P',
        toAddress: '0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC',
    })

    await importTx.sign()
    console.log(await importTx.issue())
}
main()
