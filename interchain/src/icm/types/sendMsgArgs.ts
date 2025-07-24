import { Prettify } from "viem";
import { ChainConfig } from "./chainConfig";
import { DefaultICMParams } from "./defaultICMParams";

export type SendMessageArgs = Prettify<{
    sourceChain: ChainConfig;
    destinationChain: ChainConfig;
    message: string;
    recipientAddress?: `0x${string}`;
} & DefaultICMParams>;
