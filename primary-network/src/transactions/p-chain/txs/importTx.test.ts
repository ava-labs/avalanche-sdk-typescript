import { describe, expect, it, vi, beforeEach } from 'vitest';
import { pvm, utils } from '@avalabs/avalanchejs';
import { type ImportedOutput, type ImportTxParams, newImportTx } from './importTx';
import type { PrimaryNetworkCore } from '../../../primaryNetworkCoreClient';
import { feeState, testContext, getValidUtxo } from '../../fixtures/transactions';
import { pAddressForTest, pAddressForTest3, privateKeyForTest } from '../../fixtures/accounts';
import type { Output } from '../../common/types';
import { checkOutputs } from '../../fixtures/utils';
import { avaxToNanoAvax, getChainIdFromAlias, nanoAvaxToAvax } from '../../common/utils';

describe('importTx', () => {
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

    it('should create correct outputs and fees', async () => {
        const receiverAddresses = [pAddressForTest, pAddressForTest3]

        const importedOutput: ImportedOutput = {
            addresses: receiverAddresses,
            locktime: 1000,
            threshold: 1,
        }
        const testOutputs: Output[] = []
        const mockTxParams: ImportTxParams = {
            importedOutput: importedOutput,
            sourceChain: 'C'
        };

        const result = await newImportTx(mockPrimaryNetworkCoreClient, mockTxParams);
        const outputs = result.getOutputs() // only imported output (no change outputs)

        const fee = pvm.calculateFee(result.tx, testContext.platformFeeConfig.weights, feeState().price)

        // imported output as the only change output
        const testImportedOutputAmount = avaxToNanoAvax(testInputAmount) - fee
        testOutputs.push({
            amount: nanoAvaxToAvax(testImportedOutputAmount),
            addresses: importedOutput.addresses,
            locktime: importedOutput.locktime ?? 0,
            threshold: importedOutput.threshold ?? 1,
        })

        // check outputs
        checkOutputs(testOutputs, outputs)

        // actual burned amount is same as fees
        const allInputAmounts = result.tx.ins.reduce((acc, i) => acc + i.amount(), 0n)
        const allOutputAmounts = outputs.reduce((acc, i) => acc + i.output.amount(), 0n)
        expect(allInputAmounts - allOutputAmounts, 'expected and actual burned amount mismatch').toBe(fee)
    });

    it('should create correct import tx details', async () => {
        const receiverAddresses = [pAddressForTest, pAddressForTest3]

        const importedOutput: ImportedOutput = {
            addresses: receiverAddresses,
            locktime: 1000,
            threshold: 1,
        }
        const mockTxParams: ImportTxParams = {
            importedOutput: importedOutput,
            sourceChain: 'C'
        };
        const result = await newImportTx(mockPrimaryNetworkCoreClient, mockTxParams);
        expect(result.tx.sourceChain.value(), 'source chain mismatch').toBe(getChainIdFromAlias(mockTxParams.sourceChain, testContext.networkID))
    });

    it('should create correct tx hash', async () => {
        const receiverAddresses = [pAddressForTest, pAddressForTest3]

        const importedOutput: ImportedOutput = {
            addresses: receiverAddresses,
            locktime: 1000,
            threshold: 1,
        }
        const mockTxParams: ImportTxParams = {
            importedOutput: importedOutput,
            sourceChain: 'C'
        };
        const result = await newImportTx(mockPrimaryNetworkCoreClient, mockTxParams);
        await result.sign()
        expect(result.getId(), 'transaction hash mismatch').toEqual('2bXedKBdcXsjUQnhT4KMsCv1NTgpDS81E6xdtHtms6HUKLs7eY')
    });
}); 