/**
 * Pre-funded EWOQ test wallet constants.
 *
 * EWOQ is a well-known pre-funded local-network wallet from avalanchego's
 * `genesis_local.go`.  It is publicly documented and MUST NEVER be used on
 * mainnet.
 *
 * See: https://github.com/ava-labs/avalanchego/blob/master/genesis/genesis_local.go
 */

export const TMPNET_EWOQ_KEY =
  process.env.AVALANCHE_TEST_KEY ?? "56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027";

export const TMPNET_EWOQ_KEY_FORMATTED = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN";

export const TMPNET_EWOQ_ADDRESS = "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC";

export const EWOQ_WALLET_NAME = "ewoq";

// HRP (Human Readable Part) for different networks
export const HRP_LOCAL = "local";
export const HRP_FUJI = "fuji";
export const HRP_MAINNET = "avax";
