import { describe, expect, it, vi, beforeEach } from 'vitest';
import { pvm, utils } from '@avalabs/avalanchejs';
import { feeState, testContext, getValidUtxo, getL1Validator } from '../../fixtures/transactions';
import { pAddressForTest, pAddressForTest2, pAddressForTest4, privateKeyForTest, privateKeyForTest2 } from '../../fixtures/accounts';
import type { Output } from '../../common/types';
import type { PrimaryNetworkCore } from '../../../primaryNetworkCoreClient';
import { checkOutputs } from '../../fixtures/utils';
import { newDisableL1ValidatorTx, type DisableL1ValidatorTxParams } from './disableL1ValidatorTx';

describe('disableL1ValidatorTx', () => {
    const testInputAmount = 1
    
    // mocked wallet always returns 1 avax utxo
    const mockWallet = {
        getBech32Addresses: vi.fn().mockReturnValue([pAddressForTest]),
        getPrivateKeysBuffer: vi.fn().mockReturnValue([utils.hexToBuffer(privateKeyForTest)]),
        getUtxos: vi.fn().mockResolvedValue([getValidUtxo(testInputAmount /* avax */)]),
        hasPrivateKeys: vi.fn().mockReturnValue(true),
    };

    const mockPvmRpc = {
        getFeeState: vi.fn().mockResolvedValue(feeState()),
        getL1Validator: vi.fn().mockResolvedValue(getL1Validator({ addresses: [pAddressForTest], threshold: 1 }))
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
        mockPvmRpc.getL1Validator = vi.fn().mockResolvedValue(getL1Validator({ addresses: [pAddressForTest], threshold: 1 }))
    });

    it('should create correct outputs and fees', async () => {
        const changeAddresses = [pAddressForTest2]

        const mockTxParams: DisableL1ValidatorTxParams = {
            changeAddresses,
            validationId: 'FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu',
            disableAuth: [0],
        };
        const testOutputs: Output[] = []

        const result = await newDisableL1ValidatorTx(mockPrimaryNetworkCoreClient, mockTxParams);
        const outputs = result.getOutputs()

        const fee = pvm.calculateFee(result.tx, testContext.platformFeeConfig.weights, feeState().price)
        const expectedFeesInAvax = Number(fee) / 1e9
        const expectedChangeAmount = testInputAmount - expectedFeesInAvax

        // expected change output
        testOutputs.push({
            amount: expectedChangeAmount,
            addresses: changeAddresses,
        })

        checkOutputs(testOutputs, outputs)

        // actual burned amount is same as fees
        const allInputAmounts = result.tx.getInputs().reduce((acc, i) => acc + i.amount(), 0n)
        const allOutputAmounts = outputs.reduce((acc, i) => acc + i.output.amount(), 0n)
        expect(allInputAmounts - allOutputAmounts, 'expected and actual burned amount mismatch').toBe(BigInt(expectedFeesInAvax * 1e9))
    });

    it('should create correct validator removal details', async () => {
        const changeAddresses = [pAddressForTest2]

        const mockTxParams: DisableL1ValidatorTxParams = {
            changeAddresses,
            validationId: 'FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu',
            disableAuth: [0],
        };
        const result = await newDisableL1ValidatorTx(mockPrimaryNetworkCoreClient, mockTxParams);

        expect(result.tx.validationId.value(), 'validationId mismatch').toBe(mockTxParams.validationId)
        expect(result.tx.getDisableAuth().values(), 'disableAuth mismatch').deep.equal(mockTxParams.disableAuth)
    });

    it('should correctly sign inputs and subnet auth', async () => {
        const changeAddresses = [pAddressForTest2]

        const mockTxParams: DisableL1ValidatorTxParams = {
            changeAddresses,
            validationId: 'FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu',
            disableAuth: [0],
        };
        const result = await newDisableL1ValidatorTx(mockPrimaryNetworkCoreClient, mockTxParams);
        await result.sign()
        expect(result.unsignedTx.hasAllSignatures(), 'transaction is not signed').toBe(true)
    });

    it('should correctly sign multi-sig subnet auth', async () => {
        mockPvmRpc.getL1Validator = vi.fn().mockResolvedValue(getL1Validator(
            { addresses: [pAddressForTest4, pAddressForTest, pAddressForTest2], threshold: 2 }
        ))

        const changeAddresses = [pAddressForTest2]

        const mockTxParams: DisableL1ValidatorTxParams = {
            changeAddresses,
            validationId: 'FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu',
            disableAuth: [1, 2],
        };
        const result = await newDisableL1ValidatorTx(mockPrimaryNetworkCoreClient, mockTxParams);

        await result.sign() // sign address 1 from the wallet
        await result.sign([privateKeyForTest2]) // sign address 2 directly
        expect(result.unsignedTx.hasAllSignatures(), 'transaction is not signed').toBe(true)
    });

    it('should give correct transaction hash', async () => {
        const changeAddresses = [pAddressForTest2]

        const mockTxParams: DisableL1ValidatorTxParams = {
            changeAddresses,
            validationId: 'FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu',
            disableAuth: [0],
        };
        const result = await newDisableL1ValidatorTx(mockPrimaryNetworkCoreClient, mockTxParams);

        await result.sign()
        expect(result.getId(), 'transaction hash mismatch').toBe('2Vd3e5GcHW9Qq83ptvir1pSJL83VAREcJ77ZUSqfZJMc4jnS5U')
    });
}); 