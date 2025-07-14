import { defineChain } from "viem";

export const avalancheFuji = /*#__PURE__*/ defineChain({
  id: 43_113,
  name: "Avalanche Fuji",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche Fuji",
    symbol: "AVAX",
  },
  rpcUrls: {
    default: { http: ["https://api.avax-test.network/ext/bc/C/rpc"] },
  },
  blockExplorers: {
    default: {
      name: "Avalanche Explorer",
      url: "https://subnets.avax-test.network/",
      apiUrl: "https://api.avax-test.network/",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 7096959,
    },
    teleporterRegistry: {
      address: "0xF86Cb19Ad8405AEFa7d09C778215D2Cb6eBfB228",
    },
    teleporterMessenger: {
      address: "0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf",
    },
  },
  testnet: true,
});
