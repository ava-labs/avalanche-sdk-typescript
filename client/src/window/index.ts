import type { EIP1193Provider } from "viem";
declare global {
  interface Window {
    ethereum?: EIP1193Provider | undefined;
    avalanche?: EIP1193Provider | undefined;
  }
}
