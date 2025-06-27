import { fetchInstantiatedClients } from "../boilerPlate";

// uncustomized EVM ID
const EVM_VM_ID = "srEXiWaHuhNyGwPUi444Tu47ZEDwxTWrbQiuD7FmgSAQ6X7Dy";   

async function main() {
    try {
        const { pnClient } = fetchInstantiatedClients();
        
        // Step 1: Create a subnet
        const ownerAddress = 'P-fuji1ppz4jq9ng9el0550dm44dz2wwjaca8v0nzfhaw';
        
        const createSubnetTx = await pnClient.pChain.newCreateSubnetTx({
            subnetOwners: {
                addresses: [ownerAddress],
                locktime: 123n,
                threshold: 1
            }
        });

        await createSubnetTx.sign();
        const subnetId = await createSubnetTx.issue();
        console.log("Subnet created successfully. Subnet ID:", subnetId);

        // Step 2: Create a chain on the subnet
        const genesisData = {
            config: {
                chainId: 43214,
                homesteadBlock: 0,
                eip150Block: 0,
                eip150Hash: "0x2086799aeebeae135c246c65021c82b4e15a2c451340993aacfd2751886514f0",
                eip155Block: 0,
                eip158Block: 0,
                byzantiumBlock: 0,
                constantinopleBlock: 0,
                petersburgBlock: 0,
                istanbulBlock: 0,
                muirGlacierBlock: 0,
                subnetEVMTimestamp: 0,
                feeConfig: {
                    gasLimit: 8000000,
                    minBaseFee: 25000000000,
                    targetGas: 15000000,
                    baseFeeChangeDenominator: 36,
                    minBlockGasCost: 0,
                    maxBlockGasCost: 1000000,
                    targetBlockRate: 2,
                    blockGasCostStep: 200000
                },
                allowFeeRecipients: false
            },
            alloc: {
                // You should add your test wallet address here, for example:
                "P-fuji1ppz4jq9ng9el0550dm44dz2wwjaca8v0nzfhaw": {
                        "balance": "0x4" 
                }
            },
            nonce: "0x0",
            timestamp: "0x0",
            extraData: "0x00",
            gasLimit: "0x7A1200",
            difficulty: "0x0",
            mixHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
            coinbase: "0x0000000000000000000000000000000000000000",
            number: "0x0",
            gasUsed: "0x0",
            parentHash: "0x0000000000000000000000000000000000000000000000000000000000000000"
        } as Record<string, unknown>;  // Type assertion to fix linter error

        const createChainTx = await pnClient.pChain.newCreateChainTx({
            subnetId,
            vmId: EVM_VM_ID,
            chainName: "Boring Magnificent Fortune Chain",
            genesisData,
            subnetAuth: [0]
        });

        await createChainTx.sign();
        const chainId = await createChainTx.issue();
        
        console.log("Complete! Created subnet and chain:");
        console.log("Subnet ID:", subnetId);
        console.log("Chain ID:", chainId);

    } catch (error) {
        console.error("Error in main:", error);
    }
}

main();