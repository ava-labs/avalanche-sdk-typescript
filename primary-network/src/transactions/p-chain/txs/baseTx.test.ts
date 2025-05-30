import { describe, expect, it, vi, type Mock, beforeEach } from 'vitest';
import { pvm, utils } from '@avalabs/avalanchejs';
import { newBaseTx } from './baseTx';
import type { PrimaryNetworkCore } from '../../../primaryNetworkCoreClient';
import type { BaseTxParams } from './baseTx';
import { feeState, testContext, getValidUtxo } from '../../fixtures/transactions';
import { pAddressForTest, pAddressForTest2, pAddressForTest3, pAddressForTest4, privateKeyForTest, privateKeyForTest2 } from '../../fixtures/accounts';
import type { Output } from '../common/types';
import { checkOutputs } from '../../fixtures/utils';

describe('newBaseTx', () => {
    const testInputAmount = 1
    
    // mocked wallet always returns 1 avax utxo
    const mockWallet = {
        addresses: [pAddressForTest],
        getPrivateKeysBuffer: vi.fn().mockReturnValue([utils.hexToBuffer(privateKeyForTest)]),
        getUtxos: vi.fn().mockResolvedValue([getValidUtxo(testInputAmount /* avax */)]),
    };

    const mockPvmRpc = {
        getFeeState: vi.fn().mockResolvedValue(feeState()),
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
    });

    it('should create correct outputs and fees', async () => {
        const receiverAddresses = [pAddressForTest, pAddressForTest3]
        const changeAddresses = [pAddressForTest2]

        const testOutputAmount = 0.1234
        const testOutputs: Output[] = [{
            amount: testOutputAmount,
            addresses: receiverAddresses,
        }]
        const mockTxParams: BaseTxParams = {
            changeAddresses: changeAddresses,
            outputs: testOutputs
        };

        const result = await newBaseTx(mockPrimaryNetworkCoreClient, mockTxParams);
        const outputs = result.getOutputs()

        // Calculate fees as per AvalancheJS method
        // (this method of using test Tx to calculate fees is correct upto some extent,
        // because the fees depends on number of inputs, outputs, signers, etc. and
        // won't change much by the amount)
        const fee = pvm.calculateFee(result.tx, testContext.platformFeeConfig.weights, feeState().price)
        const expectedFeesInAvax = Number(fee) / 1e9
        const expectedChangeAmount = testInputAmount - testOutputAmount - expectedFeesInAvax

        // expected change output
        testOutputs.push({
            amount: expectedChangeAmount,
            addresses: changeAddresses,
        })

        // theres must be 2 outputs
        expect(outputs.length, 'expected and actual outputs length mismatch').toBe(2)

        // check outputs
        checkOutputs(testOutputs, outputs)

        // actual burned amount is same as fees
        const allInputAmounts = result.tx.getInputs().reduce((acc, i) => acc + i.amount(), 0n)
        const allOutputAmounts = result.tx.baseTx.outputs.reduce((acc, i) => acc + i.amount(), 0n)
        expect(allInputAmounts - allOutputAmounts, 'expected and actual burned amount mismatch').toBe(BigInt(expectedFeesInAvax * 1e9))
    });

    it('should only use utxos passed in params', async () => {
        const receiverAddresses = [pAddressForTest, pAddressForTest3]
        const changeAddresses = [pAddressForTest2]

        const testOutputAmount = 0.1234
        const testInputAmount = 0.5
        const testOutputs = [{
            amount: testOutputAmount,
            addresses: receiverAddresses,
        }];
        const mockTxParams: BaseTxParams = {
            changeAddresses: changeAddresses,
            // utxos passed here override the wallet's or fromAddresses' utxos
            utxos: [getValidUtxo(testInputAmount /* avax */)],
            outputs: testOutputs
        };

        const result = await newBaseTx(mockPrimaryNetworkCoreClient, mockTxParams);
        const outputs = result.getOutputs()

        // calculate fees as per AvalancheJS method
        const fee = pvm.calculateFee(result.tx, testContext.platformFeeConfig.weights, feeState().price)
        const expectedFeesInAvax = Number(fee) / 1e9
        // if utxos passed in params are only used, then testInputAmount will be 0.5 instead of default 1
        const expectedChangeAmount = testInputAmount - testOutputAmount - expectedFeesInAvax

        // expected change output
        testOutputs.push({
            amount: expectedChangeAmount,
            addresses: changeAddresses,
        })

        // theres must be 2 outputs
        expect(outputs.length, 'expected and actual outputs length mismatch').toBe(2)

        // match testOutputs with outputs
        checkOutputs(testOutputs, outputs)

        // actual burned amount is same as fees
        const allInputAmounts = result.tx.getInputs().reduce((acc, i) => acc + i.amount(), 0n)
        const allOutputAmounts = result.tx.baseTx.outputs.reduce((acc, i) => acc + i.amount(), 0n)
        expect(allInputAmounts - allOutputAmounts).toBe(BigInt(expectedFeesInAvax * 1e9))
    });

    it('should use `fromAddresses` for fetching utxos and change addresses', async () => {
        const testSpentAmount = 0.645
        const spenderAddresses = [pAddressForTest4]
        const receiverAddresses = [pAddressForTest, pAddressForTest3]

        mockWallet.getUtxos = vi.fn().mockImplementation((addresses: string[]) => {
            if (addresses.includes(pAddressForTest4)) {
                return [getValidUtxo(testSpentAmount /* avax */, undefined, spenderAddresses)];
            }
            // if test spender address is not used, the mock will return empty utxos array
            // and tx won't be built
            return [];
        })

        const testOutputAmount = 0.1234
        const testOutputs: Output[] = [{
            amount: testOutputAmount,
            addresses: receiverAddresses,
        }]
        const mockTxParams: BaseTxParams = {
            fromAddresses: spenderAddresses,
            outputs: testOutputs
        };

        const result = await newBaseTx(mockPrimaryNetworkCoreClient, mockTxParams);
        const outputs = result.getOutputs()

        const fee = pvm.calculateFee(result.tx, testContext.platformFeeConfig.weights, feeState().price)
        const expectedFeesInAvax = Number(fee) / 1e9
        const expectedChangeAmount = testSpentAmount - testOutputAmount - expectedFeesInAvax

        // expected change output
        testOutputs.push({
            amount: expectedChangeAmount,
            // this will test if change address is not passed,
            // then fromAddresses will be used.
            addresses: spenderAddresses,
        })

        // theres must be 2 outputs
        expect(outputs.length, 'expected and actual outputs length mismatch').toBe(2)

        // check outputs
        checkOutputs(testOutputs, outputs)

        // actual burned amount is same as fees
        const allInputAmounts = result.tx.getInputs().reduce((acc, i) => acc + i.amount(), 0n)
        const allOutputAmounts = result.tx.baseTx.outputs.reduce((acc, i) => acc + i.amount(), 0n)
        expect(allInputAmounts - allOutputAmounts, 'expected and actual burned amount mismatch').toBe(BigInt(expectedFeesInAvax * 1e9))
    })

    it('should sign the tx properly', async () => {
        const receiverAddresses = [pAddressForTest, pAddressForTest3]
        const changeAddresses = [pAddressForTest2]

        const testOutputAmount = 0.1234
        const testOutputs: Output[] = [{
            amount: testOutputAmount,
            addresses: receiverAddresses,
        }]
        const mockTxParams: BaseTxParams = {
            changeAddresses: changeAddresses,
            outputs: testOutputs
        };

        const result = await newBaseTx(mockPrimaryNetworkCoreClient, mockTxParams);
        await result.sign()
        expect(result.unsignedTx.hasAllSignatures(), 'tx did not have all signatures').toBe(true)
    });

    it('should sign the multi sig tx properly', async () => {
        // the wallet will return a single multi-sig utxo, with one address already in the wallet.
        // another signature will be added directly 
        mockWallet.getUtxos = vi.fn().mockImplementation(() => [
            getValidUtxo(1 /* avax */, undefined, [pAddressForTest, pAddressForTest2], undefined, 2),
        ])
        const receiverAddresses = [pAddressForTest3]
        const changeAddresses = [pAddressForTest4]

        const testOutputAmount = 0.1234
        const testOutputs: Output[] = [{
            amount: testOutputAmount,
            addresses: receiverAddresses,
        }]
        const mockTxParams: BaseTxParams = {
            fromAddresses: [pAddressForTest, pAddressForTest2],
            changeAddresses: changeAddresses,
            outputs: testOutputs
        };

        const result = await newBaseTx(mockPrimaryNetworkCoreClient, mockTxParams);
        await result.sign() // signed with wallet
        expect(result.unsignedTx.hasAllSignatures(), 'tx have all signatures for the multi-sig without signing').toBe(false)
        await result.sign([privateKeyForTest2]) // signed by directly passing private key
        expect(result.unsignedTx.hasAllSignatures(), 'tx did not have all signatures').toBe(true)
    });

    it('should give correct tx hash', async () => {
        const receiverAddresses = [pAddressForTest, pAddressForTest3]
        const changeAddresses = [pAddressForTest2]

        const testOutputAmount = 0.1234
        const testOutputs: Output[] = [{
            amount: testOutputAmount,
            addresses: receiverAddresses,
        }]
        const mockTxParams: BaseTxParams = {
            changeAddresses: changeAddresses,
            outputs: testOutputs
        };

        const result = await newBaseTx(mockPrimaryNetworkCoreClient, mockTxParams);
        await result.sign()
        expect(result.getId(), 'expected and actual tx hash mismatch').toBe('2foYLsCJnxY9XkGTGDPf11BugnkjXBKShBo4dpoEKcjdLjqusW')
    })

    it('should handle errors appropriately', async () => {
        const mockTxParams: BaseTxParams = {
            fromAddresses: [pAddressForTest],
            outputs: [{
                amount: 40,
                addresses: [pAddressForTest],
            }],
        };

        // Mock an error in initializeContextIfNot
        (mockPrimaryNetworkCoreClient.initializeContextIfNot as Mock).mockRejectedValue(
            new Error('Failed to initialize context')
        );

        // Verify that the error is propagated
        await expect(
            newBaseTx(mockPrimaryNetworkCoreClient, mockTxParams)
        ).rejects.toThrow('Failed to initialize context');
    });
}); 