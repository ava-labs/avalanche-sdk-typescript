import { describe, expect, it, vi, beforeEach } from 'vitest';
import { pvm, utils } from '@avalabs/avalanchejs';
import { type ExportTxParams, newExportTx } from './exportTx';
import type { PrimaryNetworkCore } from '../../../primaryNetworkCoreClient';
import { feeState, testContext, getValidUtxo } from '../../fixtures/transactions';
import { pAddressForTest, pAddressForTest2, pAddressForTest3, pAddressForTest4, privateKeyForTest } from '../../fixtures/accounts';
import type { Output } from '../common/types';
import { checkOutputs } from '../../fixtures/utils';
import { avaxToNanoAvax, getChainIdFromAlias, nanoAvaxToAvax } from '../common/utils';

describe('exportTx', () => {
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
        const receiverAddresses2 = [pAddressForTest4]
        const changeAddresses = [pAddressForTest2]

        const testOutputAmount = 0.1234
        const testOutputAmount2 = 0.2345
        const testOutputs: Output[] = [
            {
                amount: testOutputAmount,
                addresses: receiverAddresses,
            },
            {
                amount: testOutputAmount2,
                addresses: receiverAddresses2,
            },
        ]
        const mockTxParams: ExportTxParams = {
            changeAddresses: changeAddresses,
            exportedOutputs: testOutputs,
            destinationChain: 'c-chain'
        };

        const result = await newExportTx(mockPrimaryNetworkCoreClient, mockTxParams);
        const outputs = result.getExportedOutputs()
        outputs.push(...result.getOutputs())

        const fee = pvm.calculateFee(result.tx, testContext.platformFeeConfig.weights, feeState().price)
        const expectedChangeAmount = avaxToNanoAvax(testInputAmount) - avaxToNanoAvax(testOutputAmount) - avaxToNanoAvax(testOutputAmount2) - fee

        // expected change output
        testOutputs.push({
            amount: nanoAvaxToAvax(expectedChangeAmount),
            addresses: changeAddresses,
        })

        // check outputs
        checkOutputs(testOutputs, outputs)

        // actual burned amount is same as fees
        const allInputAmounts = result.tx.getInputs().reduce((acc, i) => acc + i.amount(), 0n)
        const allOutputAmounts = outputs.reduce((acc, i) => acc + i.output.amount(), 0n)
        expect(allInputAmounts - allOutputAmounts, 'expected and actual burned amount mismatch').toBe(fee)
    });

    it('should create correct export tx details', async () => {
        const receiverAddresses = [pAddressForTest, pAddressForTest3]
        const changeAddresses = [pAddressForTest2]

        const testOutputAmount = 0.1234
        const testOutputs: Output[] = [{
            amount: testOutputAmount,
            addresses: receiverAddresses,
        }]
        const mockTxParamsCChain: ExportTxParams = {
            changeAddresses: changeAddresses,
            exportedOutputs: testOutputs,
            destinationChain: 'c-chain'
        };
        const cChainExportTx = await newExportTx(mockPrimaryNetworkCoreClient, mockTxParamsCChain);

        const mockTxParamsXChain: ExportTxParams = {
            changeAddresses: changeAddresses,
            exportedOutputs: testOutputs,
            destinationChain: 'x-chain'
        };
        const xChainExportTx = await newExportTx(mockPrimaryNetworkCoreClient, mockTxParamsXChain);

        expect(
            cChainExportTx.tx.destination.value(),
            'expected destination chain mismatch for c-chain export tx',
        ).toBe(getChainIdFromAlias(mockTxParamsCChain.destinationChain, testContext.networkID))

        expect(
            xChainExportTx.tx.destination.value(),
            'expected destination chain mismatch for x-chain export tx',
        ).toBe(getChainIdFromAlias(mockTxParamsXChain.destinationChain, testContext.networkID))
    });

    it('should create correct tx hash', async () => {
        const receiverAddresses = [pAddressForTest, pAddressForTest3]
        const changeAddresses = [pAddressForTest2]

        const testOutputAmount = 0.1234
        const testOutputs: Output[] = [{
            amount: testOutputAmount,
            addresses: receiverAddresses,
        }]
        const mockTxParamsCChain: ExportTxParams = {
            changeAddresses: changeAddresses,
            exportedOutputs: testOutputs,
            destinationChain: 'c-chain'
        };
        const cChainExportTx = await newExportTx(mockPrimaryNetworkCoreClient, mockTxParamsCChain);
        await cChainExportTx.sign()

        const mockTxParamsXChain: ExportTxParams = {
            changeAddresses: changeAddresses,
            exportedOutputs: testOutputs,
            destinationChain: 'x-chain'
        };
        const xChainExportTx = await newExportTx(mockPrimaryNetworkCoreClient, mockTxParamsXChain);
        await xChainExportTx.sign()

        expect(
            cChainExportTx.getId(),
            'expected c-chain export tx hash mismatch',
        ).toBe('29d94GvoD5dLnZUuLD5uv8HaKwwGNGCrpGWtGR7ZbwrtwzaaHp')

        expect(
            xChainExportTx.getId(),
            'expected x-chain export tx hash mismatch',
        ).toBe('297fxqPXUbThB9EqDVVvXhE5bNYifpnqhXvMPtZsk9vTtA7Lg9')
    });
}); 