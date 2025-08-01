import { Prettify } from "viem";
import { ChainConfig } from "../../chains/types/chainConfig";
import { DefaultICMParams } from "./defaultICMParams";

export type SendMessageArgs = Prettify<{
    sourceChain?: ChainConfig;
    destinationChain?: ChainConfig;
    message: string;
    recipientAddress?: `0x${string}`;
} & DefaultICMParams>;
