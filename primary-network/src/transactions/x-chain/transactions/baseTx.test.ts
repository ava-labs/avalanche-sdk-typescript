import { describe, expect, it, vi, type Mock, beforeEach } from 'vitest';
import { avm, utils } from '@avalabs/avalanchejs';
import { newBaseTx } from './baseTx';
import type { PrimaryNetworkCore } from '../../../primaryNetworkCoreClient';
import type { BaseTxParams } from './baseTx';
import { feeState, testContext, getValidUtxo } from '../../fixtures/transactions';
import { xAddressForTest, xAddressForTest2, xAddressForTest3, xAddressForTest4, privateKeyForTest, privateKeyForTest2 } from '../../fixtures/accounts';
import type { Output } from '../../common/types';
import { checkOutputs } from '../../fixtures/utils';
import { avaxToNanoAvax, getChainIdFromAlias, nanoAvaxToAvax } from '../../common/utils';

describe('newBaseTx', () => {
    const testInputAmount = 1
    
    // mocked wallet always returns 1 avax utxo
    const mockWallet = {
        getBech32Addresses: vi.fn().mockReturnValue([xAddressForTest]),
        getPrivateKeysBuffer: vi.fn().mockReturnValue([utils.hexToBuffer(privateKeyForTest)]),
        getUtxos: vi.fn().mockResolvedValue([getValidUtxo(testInputAmount /* avax */)]),
    };

    const mockAvmRpc = {
        getFeeState: vi.fn().mockResolvedValue(feeState()),
        getTxFee: vi.fn().mockResolvedValue({ txFee: testContext.baseTxFee, createAssetTxFee: testContext.createAssetTxFee }),
    };
    
    const mockPrimaryNetworkCoreClient = {
        initializeContextIfNot: vi.fn().mockResolvedValue(testContext),
        avmRpc: mockAvmRpc,
        wallet: mockWallet,
        nodeUrl: 'http://localhost:9650',
    } as unknown as PrimaryNetworkCore;

    beforeEach(() => {
        vi.clearAllMocks()
        // Reset mock implementation to default
        mockWallet.getUtxos = vi.fn().mockResolvedValue([getValidUtxo(testInputAmount /* avax */)])
    });

    it('should create correct outputs and fees', async () => {
        const receiverAddresses = [xAddressForTest, xAddressForTest3]
        const changeAddresses = [xAddressForTest2]

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

        // Calculate fees using X-chain pattern
        const fee = (await mockAvmRpc.getTxFee()).txFee
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
        const receiverAddresses = [xAddressForTest, xAddressForTest3]
        const changeAddresses = [xAddressForTest2]

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

        // calculate fees using X-chain pattern
        const fee = (await mockAvmRpc.getTxFee()).txFee
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
        const spenderAddresses = [xAddressForTest4]
        const receiverAddresses = [xAddressForTest, xAddressForTest3]

        mockWallet.getUtxos = vi.fn().mockImplementation((addresses: string[]) => {
            if (addresses.includes(xAddressForTest4)) {
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

        const fee = (await mockAvmRpc.getTxFee()).txFee
        // // Use integer arithmetic in nanoAvax to avoid precision issues
        // const testSpentAmountNano = avaxToNanoAvax(testSpentAmount)
        // const testOutputAmountNano = avaxToNanoAvax(testOutputAmount)
        // const expectedChangeAmountNano = testSpentAmountNano - testOutputAmountNano - fee
        const expectedChangeAmount = testSpentAmount - testOutputAmount - (Number(fee) / 1e9)
        // const expectedChangeAmount = nanoAvaxToAvax(expectedChangeAmountNano)

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
        expect(allInputAmounts - allOutputAmounts, 'expected and actual burned amount mismatch').toBe(fee)
    })

    it('should sign the tx properly', async () => {
        const receiverAddresses = [xAddressForTest, xAddressForTest3]
        const changeAddresses = [xAddressForTest2]

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
            getValidUtxo(1 /* avax */, undefined, [xAddressForTest, xAddressForTest2], undefined, 2),
        ])
        const receiverAddresses = [xAddressForTest3]
        const changeAddresses = [xAddressForTest4]

        const testOutputAmount = 0.1234
        const testOutputs: Output[] = [{
            amount: testOutputAmount,
            addresses: receiverAddresses,
        }]
        const mockTxParams: BaseTxParams = {
            fromAddresses: [xAddressForTest, xAddressForTest2],
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
        const receiverAddresses = [xAddressForTest, xAddressForTest3]
        const changeAddresses = [xAddressForTest2]

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
        expect(result.getId(), 'expected and actual tx hash mismatch').toBe('2dj5QDTEi6G6vPuVdY3LBbFWgffKes8GurLbUxGeCypvHLZzHP')
    })

    it('should handle errors appropriately', async () => {
        const mockTxParams: BaseTxParams = {
            fromAddresses: [xAddressForTest],
            outputs: [{
                amount: 40,
                addresses: [xAddressForTest],
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