export function getNodeUrlFromChain(chain: 'mainnet' | 'fuji' | `http${'s' | ''}://${string}`) {
    if (chain === 'mainnet') {
        return 'https://api.avax.network'
    }
    if (chain === 'fuji') {
        return 'https://api.avax-test.network'
    }
    // if chain is none of the above, it must be a valid url
    return chain
}
