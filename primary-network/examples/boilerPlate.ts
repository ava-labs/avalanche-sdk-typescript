import { createPrimaryNetworkClient } from "../src/primaryNetworkClient";

export function fetchInstantiatedClients() {
    const pnClient = createPrimaryNetworkClient({
        nodeUrlOrChain: "fuji",
        // common ewoq address for testing
        privateKeys: ["56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"], // 0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC
    });

    pnClient.linkPrivateKeys(
        [
            // only for testing, do not use in production
            "98cb077f972feb0481f1d894f272c6a1e3c15e272a1658ff716444f465200070", // 0x909d71Ed4090ac6e57E3645dcF2042f8c6548664
            "63e0730edea86f6e9e95db48dbcab18406e60bebae45ad33e099f09d21450ebf" // 0x35F884853114D298D7aA8607f4e7e0DB52205f07
        ]
    );

    return { pnClient }
}
