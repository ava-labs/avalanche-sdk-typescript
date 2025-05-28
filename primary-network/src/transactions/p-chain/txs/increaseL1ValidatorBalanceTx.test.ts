import { describe, expect, it, vi, beforeEach } from 'vitest';
import { pvm, utils } from '@avalabs/avalanchejs';
import { feeState, testContext, getValidUtxo } from '../../fixtures/transactions';
import { pAddressForTest, pAddressForTest2, pAddressForTest3, privateKeyForTest } from '../../fixtures/accounts';
import type { Output } from '../common/types';
import type { PrimaryNetworkCore } from '../../../primaryNetworkCoreClient';
import { checkOutputs } from '../../fixtures/utils';
import { type IncreaseL1ValidatorBalanceTxParams, newIncreaseL1ValidatorBalanceTx } from './increaseL1ValidatorBalanceTx';
import { avaxToNanoAvax, nanoAvaxToAvax } from '../common/utils';

describe('increaseL1ValidatorBalanceTx', () => {
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

    it('should create correct change outputs and fees', async () => {
        const changeAddresses = [pAddressForTest2]

        const mockTxParams: IncreaseL1ValidatorBalanceTxParams = {
            changeAddresses,
            balanceInAvax: 0.123,
            validationId: 'FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu',
        };
        const testOutputs: Output[] = []

        const result = await newIncreaseL1ValidatorBalanceTx(mockPrimaryNetworkCoreClient, mockTxParams);
        const outputs = result.getOutputs()

        const fee = pvm.calculateFee(result.tx, testContext.platformFeeConfig.weights, feeState().price)
        const totalBurnedAmount = fee + avaxToNanoAvax(mockTxParams.balanceInAvax)
        const expectedChangeAmount = avaxToNanoAvax(testInputAmount) - totalBurnedAmount

        // expected change output
        testOutputs.push({
            amount: nanoAvaxToAvax(expectedChangeAmount),
            addresses: changeAddresses,
        })

        // check change outputs
        checkOutputs(testOutputs, outputs)

        // actual burned amount is same as fees
        const allInputAmounts = result.tx.getInputs().reduce((acc, i) => acc + i.amount(), 0n)
        const allOutputAmounts = outputs.reduce((acc, i) => acc + i.output.amount(), 0n)
        expect(allInputAmounts - allOutputAmounts, 'expected and actual burned amount mismatch').toBe(totalBurnedAmount)
    });

    it('should create correct increase balance details', async () => {
        const changeAddresses = [pAddressForTest, pAddressForTest3]

        const mockTxParams: IncreaseL1ValidatorBalanceTxParams = {
            changeAddresses,
            balanceInAvax: 0.123,
            validationId: 'FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu',
        };
        const result = await newIncreaseL1ValidatorBalanceTx(mockPrimaryNetworkCoreClient, mockTxParams);

        // check tx details
        expect(result.tx.balance.value(), 'balance mismatch').toBe(avaxToNanoAvax(mockTxParams.balanceInAvax))
        expect(utils.base58check.encode(result.tx.validationId.toBytes()), 'validationId mismatch').toBe(mockTxParams.validationId)
    });

    it('should give correct transaction hash', async () => {
        const changeAddresses = [pAddressForTest2]

        const mockTxParams: IncreaseL1ValidatorBalanceTxParams = {
            changeAddresses,
            balanceInAvax: 0.123,
            validationId: 'FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu',
        };
        const result = await newIncreaseL1ValidatorBalanceTx(mockPrimaryNetworkCoreClient, mockTxParams);

        await result.sign()
        expect(result.getId(), 'transaction hash mismatch').toBe('293GQSF2zQCRkE3wKkmgiTDrexb4gsibKYgxH4heREKhUNcxmD')
    });
}); 