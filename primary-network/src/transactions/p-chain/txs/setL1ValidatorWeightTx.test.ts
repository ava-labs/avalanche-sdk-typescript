import { describe, expect, it, vi, beforeEach } from 'vitest';
import { pvm, utils } from '@avalabs/avalanchejs';
import { feeState, testContext, getValidUtxo } from '../../fixtures/transactions';
import { pAddressForTest, pAddressForTest2, pAddressForTest3, privateKeyForTest } from '../../fixtures/accounts';
import type { Output } from '../../common/types';
import type { PrimaryNetworkCore } from '../../../primaryNetworkCoreClient';
import { checkOutputs } from '../../fixtures/utils';
import { type SetL1ValidatorWeightTxParams, newSetL1ValidatorWeightTx } from './setL1ValidatorWeightTx';
import { avaxToNanoAvax, nanoAvaxToAvax } from '../../common/utils';
import { signedWarpMsgL1ValidatorWeightHex } from '../../fixtures/warp';

describe('setL1ValidatorWeightTx', () => {
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

        const mockTxParams: SetL1ValidatorWeightTxParams = {
            changeAddresses,
            message: signedWarpMsgL1ValidatorWeightHex,
        };
        const testOutputs: Output[] = []

        const result = await newSetL1ValidatorWeightTx(mockPrimaryNetworkCoreClient, mockTxParams);
        const outputs = result.getOutputs()

        const fee = pvm.calculateFee(result.tx, testContext.platformFeeConfig.weights, feeState().price)
        const expectedChangeAmount = avaxToNanoAvax(testInputAmount) - fee

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
        expect(allInputAmounts - allOutputAmounts, 'expected and actual burned amount mismatch').toBe(fee)
    });

    it('should create correct increase balance details', async () => {
        const changeAddresses = [pAddressForTest, pAddressForTest3]

        const mockTxParams: SetL1ValidatorWeightTxParams = {
            changeAddresses,
            message: signedWarpMsgL1ValidatorWeightHex,
        };
        const result = await newSetL1ValidatorWeightTx(mockPrimaryNetworkCoreClient, mockTxParams);

        // check tx details
        expect(utils.bufferToHex(result.tx.message.bytes), 'message mismatch').toBe(mockTxParams.message)
    });

    it('should give correct transaction hash', async () => {
        const changeAddresses = [pAddressForTest2]

        const mockTxParams: SetL1ValidatorWeightTxParams = {
            changeAddresses,
            message: signedWarpMsgL1ValidatorWeightHex,
        };
        const result = await newSetL1ValidatorWeightTx(mockPrimaryNetworkCoreClient, mockTxParams);

        await result.sign()
        expect(result.getId(), 'transaction hash mismatch').toBe('6ytqETXy1V8GfJJNyX5pbGTuVyUvbDrPwWBMKY6ZEAMqvK59n')
    });
}); 