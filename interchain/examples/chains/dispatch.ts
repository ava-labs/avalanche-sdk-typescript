import { defineChain } from "viem";

export const dispatch = defineChain({
  id: 779672,
  name: 'Dispatch L1',
  blockchainId: '0x9f3be606497285d0ffbb5ac9ba24aa60346a9b1812479ed66cb329f394a4b1c7',
  nativeCurrency: {
    decimals: 18,
    name: 'DIS',
    symbol: 'DIS',
  },
  rpcUrls: {
    default: {
      http: ['https://subnets.avax.network/dispatch/testnet/rpc'],
    },
  },
  blockExplorers: {
    default: { name: 'Dispatch Explorer', url: 'https://subnets-test.avax.network/dispatch' },
  },
  contracts: {
    teleporterRegistry: {
      address: '0x083e276d96ce818f2225d901b44e358dcfc5d606'
    }
  },
  testnet: true
}); 