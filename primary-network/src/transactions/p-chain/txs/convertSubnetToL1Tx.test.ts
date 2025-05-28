import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NodeId, pvm, utils } from '@avalabs/avalanchejs';
import { feeState, testContext, getValidUtxo, createSubnetTx } from '../../fixtures/transactions';
import { pAddressForTest, pAddressForTest2, pAddressForTest3, pAddressForTest4, privateKeyForTest } from '../../fixtures/accounts';
import type { Output } from '../common/types';
import type { PrimaryNetworkCore } from '../../../primaryNetworkCoreClient';
import { checkOutputs } from '../../fixtures/utils';
import { type ConvertSubnetToL1TxParams, newConvertSubnetToL1Tx } from './convertSubnetToL1Tx';
import { popPublicKeyHex, popSignatureHex } from '../../fixtures/signatures';
import { avaxToNanoAvax, nanoAvaxToAvax } from '../common/utils';

describe('convertSubnetToL1Tx', () => {
    const testInputAmount = 1
    
    // mocked wallet always returns 1 avax utxo
    const mockWallet = {
        addresses: [pAddressForTest],
        getPrivateKeysBuffer: vi.fn().mockReturnValue([utils.hexToBuffer(privateKeyForTest)]),
        getUtxos: vi.fn().mockResolvedValue([getValidUtxo(testInputAmount /* avax */)]),
    };

    const mockPvmRpc = {
        getFeeState: vi.fn().mockResolvedValue(feeState()),
        getTx: vi.fn().mockResolvedValue(createSubnetTx({ addresses: [pAddressForTest], threshold: 1 }))
    };
    
    const mockPrimaryNetworkCoreClient = {
        initializeContextIfNot: vi.fn().mockResolvedValue(testContext),
        pvmRpc: mockPvmRpc,
        wallet: mockWallet,
        nodeUrl: 'http://localhost:9650',
    } as unknown as PrimaryNetworkCore;

    beforeEach(() => {
        vi.clearAllMocks()
        // Reset mock implementation to default
        mockWallet.getUtxos = vi.fn().mockResolvedValue([getValidUtxo(testInputAmount /* avax */)])
        mockPvmRpc.getTx = vi.fn().mockResolvedValue(createSubnetTx({ addresses: [pAddressForTest], threshold: 1 }))
    });

    it('should create correct outputs and fees', async () => {
        const changeAddresses = [pAddressForTest2]

        const l1Validators = [
            {
                nodeId: 'NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ',
                nodePoP: {
                    publicKey: popPublicKeyHex,
                    proofOfPossession: popSignatureHex,
                },
                weight: 12345n,
                initialBalanceInAvax: 0.123,
                remainingBalanceOwner: {
                    addresses: [pAddressForTest2],
                    threshold: 1,
                },
                deactivationOwner: {
                    addresses: [pAddressForTest2],
                    threshold: 1,
                },
            },
            {
                nodeId: 'NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ',
                nodePoP: {
                    publicKey: popPublicKeyHex,
                    proofOfPossession: popSignatureHex,
                },
                weight: 12345n,
                initialBalanceInAvax: 0.456,
                remainingBalanceOwner: {
                    addresses: [pAddressForTest2],
                    threshold: 1,
                },
                deactivationOwner: {
                    addresses: [pAddressForTest2],
                    threshold: 1,
                },
            }
        ];

        const mockTxParams: ConvertSubnetToL1TxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
            blockchainId: '2WDjMPX9jMRXvXvzAZ2RsjLaFz1R7oj9BXxpPYsRyFqNqmAxh4',
            managerContractAddress: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
            validators: l1Validators,
            subnetAuth: [0],
        };
        const testOutputs: Output[] = []

        const result = await newConvertSubnetToL1Tx(mockPrimaryNetworkCoreClient, mockTxParams);
        const outputs = result.getOutputs()

        const fee = pvm.calculateFee(result.tx, testContext.platformFeeConfig.weights, feeState().price)
        const l1ValidatorBurnedFees = l1Validators.reduce((acc, v) => acc + avaxToNanoAvax(v.initialBalanceInAvax), 0n)
        const totalBurnedFees = fee + l1ValidatorBurnedFees
        const expectedChangeAmount = avaxToNanoAvax(testInputAmount) - totalBurnedFees

        // expected change output
        testOutputs.push({
            amount: nanoAvaxToAvax(expectedChangeAmount),
            addresses: changeAddresses,
        })

        checkOutputs(testOutputs, outputs)

        // actual burned amount is same as fees
        const allInputAmounts = result.tx.getInputs().reduce((acc, i) => acc + i.amount(), 0n)
        const allOutputAmounts = outputs.reduce((acc, i) => acc + i.output.amount(), 0n)
        expect(allInputAmounts - allOutputAmounts, 'expected and actual burned amount mismatch').toBe(totalBurnedFees)
    });

    it('should create correct conversion details', async () => {
        const changeAddresses = [pAddressForTest2]

        const l1Validators = [
            {
                nodeId: 'NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ',
                nodePoP: {
                    publicKey: popPublicKeyHex,
                    proofOfPossession: popSignatureHex,
                },
                weight: 12345n,
                initialBalanceInAvax: 0.123,
                remainingBalanceOwner: {
                    addresses: [pAddressForTest2],
                    threshold: 1,
                },
                deactivationOwner: {
                    addresses: [pAddressForTest2],
                    threshold: 1,
                },
            },
            {
                nodeId: 'NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ',
                nodePoP: {
                    publicKey: popPublicKeyHex,
                    proofOfPossession: popSignatureHex,
                },
                weight: 12345n,
                initialBalanceInAvax: 0.456,
                remainingBalanceOwner: {
                    addresses: [pAddressForTest2, pAddressForTest3],
                    threshold: 1,
                },
                deactivationOwner: {
                    addresses: [pAddressForTest2, pAddressForTest4],
                    threshold: 1,
                },
            }
        ];

        const mockTxParams: ConvertSubnetToL1TxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
            blockchainId: '2WDjMPX9jMRXvXvzAZ2RsjLaFz1R7oj9BXxpPYsRyFqNqmAxh4',
            managerContractAddress: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
            validators: l1Validators,
            subnetAuth: [0],
        };
        const result = await newConvertSubnetToL1Tx(mockPrimaryNetworkCoreClient, mockTxParams);

        // check validator details
        expect(result.tx.validators.length, 'expected and actual validator count mismatch').toBe(l1Validators.length)
        l1Validators.forEach((a, i) => {
            const e = result.tx.validators[i]
            expect(e).toBeDefined()
            if (e) {
                expect(new NodeId(e.nodeId.bytes).toString(), 'nodeId mismatch').toBe(a.nodeId)
                expect(e.getWeight().valueOf(), 'weight mismatch').toBe(BigInt(a.weight))
                expect(e.getBalance().value(), 'balance mismatch').toBe(avaxToNanoAvax(a.initialBalanceInAvax))
                expect(e.getDeactivationOwner().threshold.value(), 'deactivationOwner threshold mismatch').toBe(a.deactivationOwner.threshold)
                expect(e.getDeactivationOwner().addresses.map(a => `P-${a.toString('fuji')}`), 'deactivationOwner mismatch').deep.equal(a.deactivationOwner.addresses)
                expect(e.getRemainingBalanceOwner().threshold.value(), 'remainingBalanceOwner threshold mismatch').toBe(a.remainingBalanceOwner.threshold)
                expect(e.getRemainingBalanceOwner().addresses.map(a => `P-${a.toString('fuji')}`), 'remainingBalanceOwner mismatch').deep.equal(a.remainingBalanceOwner.addresses)
                expect(utils.bufferToHex(e.signer.publicKey), 'publicKey mismatch').toBe(a.nodePoP.publicKey)
                expect(utils.bufferToHex(e.signer.signature), 'proofOfPossession mismatch').toBe(a.nodePoP.proofOfPossession)
            }
        })
        expect(result.tx.chainID.value(), 'chainID mismatch').toBe(mockTxParams.blockchainId)
        expect(utils.bufferToHex(result.tx.address.bytes), 'managerContractAddress mismatch').toBe(mockTxParams.managerContractAddress.toLowerCase())
        expect(result.tx.getSubnetAuth().values(), 'subnetAuth mismatch').deep.equal(mockTxParams.subnetAuth)
    });

    it('should give correct transaction hash', async () => {
        const changeAddresses = [pAddressForTest2]

        const l1Validators = [
            {
                nodeId: 'NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ',
                nodePoP: {
                    publicKey: popPublicKeyHex,
                    proofOfPossession: popSignatureHex,
                },
                weight: 12345n,
                initialBalanceInAvax: 0.123,
                remainingBalanceOwner: {
                    addresses: [pAddressForTest2],
                    threshold: 1,
                },
                deactivationOwner: {
                    addresses: [pAddressForTest2],
                    threshold: 1,
                },
            }
        ];
        const mockTxParams: ConvertSubnetToL1TxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
            blockchainId: '2WDjMPX9jMRXvXvzAZ2RsjLaFz1R7oj9BXxpPYsRyFqNqmAxh4',
            managerContractAddress: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
            validators: l1Validators,
            subnetAuth: [0],
        };
        const result = await newConvertSubnetToL1Tx(mockPrimaryNetworkCoreClient, mockTxParams);
        await result.sign()
        expect(result.getId(), 'transaction hash mismatch').toBe('24RNBu1UQxnuqAtf6ERVhHJv1yB1uji26gTENVY5UkyUw5YChu')
    });
});