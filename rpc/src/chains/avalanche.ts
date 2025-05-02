import { defineChain } from "viem";

export const avalanche = /*#__PURE__*/ defineChain({
  id: 43_114,
  name: "Avalanche",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche",
    symbol: "AVAX",
  },
  rpcUrls: {
    default: { http: ["https://api.avax.network/ext/bc/C/rpc"] },
  },
  blockExplorers: {
    default: {
      name: "Avalanche Explorer",
      url: "https://subnets.avax.network",
      apiUrl: "https://api.avax.network",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 11907934,
    },
  },
});
