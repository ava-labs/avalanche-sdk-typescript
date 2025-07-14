// import { parseAvalancheAccount } from "src/accounts/utils/parseAvalancheAccount";
// import { AvalancheWalletCoreClient } from "src/clients/createAvalancheWalletCoreClient";
// import { getErc20Decimals } from "./getErc20Decimals";
// import { getErc20Name } from "./getErc20Name";
// import { getErc20Symbol } from "./getErc20Symbol";
// import {
//   BridgeErc20ToL1Parameters,
//   BridgeErc20ToL1ReturnType,
// } from "./types/bridgeErc20ToL1";
// import { readContract } from "viem/actions";
// import { teleporterRegistryABI } from "../abis/teleporterRegistry";
// import { deployTokenHome } from "./deployTokenHome";
// import { deployTokenRemote } from "./deployTokenRemote";
// import { erc20ABI } from "../abis/erc20";

// export async function bridgeErc20ToL1(
//   client: AvalancheWalletCoreClient,
//   params: BridgeErc20ToL1Parameters
// ): Promise<BridgeErc20ToL1ReturnType> {
//   let {
//     destinationChain,
//     erc20TokenAddr,
//     amount,
//     recipient,
//     destinationBlockchainID,
//     homeBlockchainID,
//     gasLimit,
//     feeReceiver,
//     tokenRemoteAddr,
//     tokenHomeAddr,
//     account,
//   } = params;

//   const acc = parseAvalancheAccount(account);
//   if (!acc && !client.account) {
//     throw new Error("no account found");
//   }

//   const homeTeleporterRegistryAddr = (client.chain?.contracts?.['teleporterRegistry'] as any)?.['address'];
//   const homeTeleporterManagerAddr = acc?.evmAccount.address ||  (client.account as any)?.address;
//   const remoteTeleporterRegistryAddr = (destinationChain?.contracts?.['teleporterRegistry'] as any)?.['address'];

//   if (!homeTeleporterRegistryAddr || !remoteTeleporterRegistryAddr) {
//     throw new Error("Teleporter registry address not found for destination or source chain");
//   }

//   console.log("Fetching Erc20  token details........");

//   const tokenName = await getErc20Name(client, {
//     contractAddress: erc20TokenAddr,
//   });

//   const tokenSymbol = await getErc20Symbol(client, {
//     contractAddress: erc20TokenAddr,
//   });

//   const tokenDecimals = await getErc20Decimals(client, {
//     contractAddress: erc20TokenAddr,
//   });

//   console.log("Token details fetched successfully........");
//   console.log("Token name: ", tokenName);
//   console.log("Token symbol: ", tokenSymbol);
//   console.log("Token decimals: ", tokenDecimals);

//   if (!tokenHomeAddr) {
//     try {
//         if (!homeBlockchainID) {
//             console.log("Fetching home blockchain ID........");

//             homeBlockchainID = await readContract(client, {
//                 account: acc?.evmAccount,
//                 address: homeTeleporterRegistryAddr,
//                 abi: teleporterRegistryABI,
//                 functionName: "blockchainID",
//             }) as string;

//             console.log("Home blockchain ID fetched successfully........");
//             console.log("Home blockchain ID: ", homeBlockchainID);
//         }

//         const tokenHome = await deployTokenHome(client, {
//             account: acc,
//             erc20ContractAddr: erc20TokenAddr,
//             minTeleporterVersion: 1,
//             teleporterRegistryAddr: homeTeleporterRegistryAddr,
//             teleporterManagerAddr: homeTeleporterManagerAddr,
//             decimals: tokenDecimals,
//         });

//         if (tokenHome.status === "success") {
//             tokenHomeAddr = tokenHome.contractAddress as any;
//             console.log("Token home deployed successfully........");
//             console.log("Token home address: ", tokenHomeAddr);
//         } else {
//             throw new Error("Token home deployment failed");
//         }
//     } catch (error) {
//         console.error("Error deploying token home: ", error);
//         throw error;
//     }
//   }

//   if (!tokenRemoteAddr) {
//     try {
//       const tokenRemote = await deployTokenRemote(client, {
//         minTeleporterVersion: 1,
//         remoteTeleporterRegistryAddr: remoteTeleporterRegistryAddr,
//         remoteTeleporterManagerAddr: remoteTeleporterMessengerAddr,
//         tokenHomeBlockchainId: homeBlockchainID,
//         tokenHomeContractAddr: tokenHomeAddr,
//         remoteTokenName: tokenName,
//         remoteTokenSymbol: tokenSymbol,
//     decimals,
//       });

//       if (tokenRemote.status === "success") {
//         tokenRemoteAddr = tokenRemote.contractAddress as any;
//         console.log("Token remote deployed successfully........");

//       }
// }
