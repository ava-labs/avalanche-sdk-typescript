import { defineChain } from "viem";

export const avalancheLocal = /*#__PURE__*/ defineChain({
  id: 43_112,
  name: "Avalanche Local",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche",
    symbol: "AVAX",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:9650/ext/bc/C/rpc"] },
  },
  testnet: true,
});
