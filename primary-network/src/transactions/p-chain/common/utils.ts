import { type Utxo, type UnsignedTx, secp256k1, Address } from "@avalabs/avalanchejs";
import type { PChainOwner } from '../../common/types'

/**
 * Inputs must be sorted and unique. Inputs are sorted first lexicographically by their TxID and then by the UTXOIndex from low to high.
 * If there are inputs that have the same TxID and UTXOIndex, then the transaction is invalid as this would result in a double spend.
 */
export function sortUtxos(utxos: Utxo[]): Utxo[] {
    return [...utxos].sort((a, b) => {
        // First compare by txID
        const txIdCompare = a.utxoId.txID.toString().localeCompare(b.utxoId.txID.toString());
        if (txIdCompare !== 0) {
            return txIdCompare;
        }
        // If txIDs are equal, compare by outputIndex
        return a.utxoId.outputIdx.value() - b.utxoId.outputIdx.value();
    });
}

export async function addPChainOwnerAuthSignature(
    owners: PChainOwner,
    authIndices: number[],
    unsignedTx: UnsignedTx,
    privateKeys: Uint8Array[],
) {
    // Get the addresses that need to sign based on subnetAuth indices
    const signingOwners = owners.addresses.filter((_, index) => authIndices.includes(index));

    // Last credential index is for the subnet auth signatures
    const credentialIndex = unsignedTx.getCredentials().length - 1;

    // Extract HRP from first signing owner address
    const hrp = signingOwners[0]?.split('1')[0];
    if (!hrp) {
        throw new Error('No signing owners found');
    }

    // Sign with available private keys if they match required signers
    await Promise.all(privateKeys.map(async (privateKey) => {
        const address = new Address(
            secp256k1.publicKeyBytesToAddress(
                secp256k1.getPublicKey(privateKey)
            )
        );
        const addressString = address.toString(hrp);

        const signerIndex = signingOwners.indexOf(addressString);
        if (signerIndex !== -1) {
            const signature = await secp256k1.sign(unsignedTx.toBytes(), privateKey);
            unsignedTx.addSignatureAt(signature, credentialIndex, signerIndex);
        }
    }));
}
