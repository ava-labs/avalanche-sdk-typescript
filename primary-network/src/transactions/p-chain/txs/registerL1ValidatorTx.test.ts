import { describe, expect, it, vi, beforeEach } from 'vitest';
import { pvm, utils } from '@avalabs/avalanchejs';
import { feeState, testContext, getValidUtxo } from '../../fixtures/transactions';
import { pAddressForTest, pAddressForTest2, pAddressForTest3, privateKeyForTest } from '../../fixtures/accounts';
import type { Output } from '../../common/types';
import type { PrimaryNetworkCore } from '../../../primaryNetworkCoreClient';
import { checkOutputs } from '../../fixtures/utils';
import { type RegisterL1ValidatorTxParams, newRegisterL1ValidatorTx } from './registerL1ValidatorTx';
import { popSignatureHex } from '../../fixtures/signatures';
import { signedWarpMsgRegisterL1ValidatorHex } from '../../fixtures/warp';
import { avaxToNanoAvax, nanoAvaxToAvax } from '../../common/utils';

describe('registerL1ValidatorTx', () => {
    const testInputAmount = 1
    
    // mocked wallet always returns 1 avax utxo
    const mockWallet = {
        getBech32Addresses: vi.fn().mockReturnValue([pAddressForTest]),
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

        const mockTxParams: RegisterL1ValidatorTxParams = {
            changeAddresses,
            initialBalanceInAvax: 0.123,
            blsSignature: popSignatureHex,
            message: signedWarpMsgRegisterL1ValidatorHex,
        };
        // stake output
        const testOutputs: Output[] = []

        const result = await newRegisterL1ValidatorTx(mockPrimaryNetworkCoreClient, mockTxParams);
        const outputs = result.getOutputs()

        const fee = pvm.calculateFee(result.tx, testContext.platformFeeConfig.weights, feeState().price)
        const totalBurnedAmount = fee + avaxToNanoAvax(mockTxParams.initialBalanceInAvax)
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

    it('should create correct registration details', async () => {
        const changeAddresses = [pAddressForTest, pAddressForTest3]

        const mockTxParams: RegisterL1ValidatorTxParams = {
            changeAddresses,
            initialBalanceInAvax: 0.123,
            blsSignature: popSignatureHex,
            message: signedWarpMsgRegisterL1ValidatorHex,
        };
        const result = await newRegisterL1ValidatorTx(mockPrimaryNetworkCoreClient, mockTxParams);

        // check tx details
        expect(result.tx.balance.value(), 'balance mismatch').toBe(avaxToNanoAvax(mockTxParams.initialBalanceInAvax))
        expect(utils.bufferToHex(result.tx.blsSignature.toBytes()), 'blsSignature mismatch').toBe(mockTxParams.blsSignature)
        expect(utils.bufferToHex(result.tx.message.bytes), 'message mismatch').toBe(mockTxParams.message)
    });

    it('should give correct transaction hash', async () => {
        const changeAddresses = [pAddressForTest2]

        const mockTxParams: RegisterL1ValidatorTxParams = {
            changeAddresses,
            initialBalanceInAvax: 0.123,
            blsSignature: popSignatureHex,
            message: signedWarpMsgRegisterL1ValidatorHex,
        };
        const result = await newRegisterL1ValidatorTx(mockPrimaryNetworkCoreClient, mockTxParams);

        await result.sign()
        expect(result.getId(), 'transaction hash mismatch').toBe('2MF9RWiS11gTJqKh3DQ9gZGARUUVPFvWt88ZhmQamM237LgUSm')
    });
}); 