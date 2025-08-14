export type PChainOwner = {
    threshold: number;
    addresses: string[];
}

export type ValidatorData = {
    nodeId: string,
    blsPublicKey: string,
    weight: bigint,
}
