import { describe, expect, it, vi, beforeEach } from 'vitest';
import { pvm, utils } from '@avalabs/avalanchejs';
import { feeState, testContext, getValidUtxo, createSubnetTx } from '../../fixtures/transactions';
import { pAddressForTest, pAddressForTest2, privateKeyForTest } from '../../fixtures/accounts';
import type { Output } from '../../common/types';
import type { PrimaryNetworkCore } from '../../../primaryNetworkCoreClient';
import { checkOutputs } from '../../fixtures/utils';
import { newRemoveSubnetValidatorTx, type RemoveSubnetValidatorTxParams } from './removeSubnetValidatorTx';

describe('removeSubnetValidatorTx', () => {
    const testInputAmount = 1
    
    // mocked wallet always returns 1 avax utxo
    const mockWallet = {
        getBech32Addresses: vi.fn().mockReturnValue([pAddressForTest]),
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

        const mockTxParams: RemoveSubnetValidatorTxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
            nodeId: 'NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ',
            subnetAuth: [0],
        };
        const testOutputs: Output[] = []

        const result = await newRemoveSubnetValidatorTx(mockPrimaryNetworkCoreClient, mockTxParams);
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

        const mockTxParams: RemoveSubnetValidatorTxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
            nodeId: 'NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ',
            subnetAuth: [0],
        };

        const result = await newRemoveSubnetValidatorTx(mockPrimaryNetworkCoreClient, mockTxParams);

        expect(result.tx.nodeId.value(), 'nodeId mismatch').toBe(mockTxParams.nodeId)
        expect(result.tx.subnetId.value(), 'subnetId mismatch').toBe(mockTxParams.subnetId)
        expect(result.tx.getSubnetAuth().values(), 'subnetAuth mismatch').deep.equal(mockTxParams.subnetAuth)
    });

    it('should give correct transaction hash', async () => {
        const changeAddresses = [pAddressForTest2]

        const mockTxParams: RemoveSubnetValidatorTxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
            nodeId: 'NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ',
            subnetAuth: [0],
        };

        const result = await newRemoveSubnetValidatorTx(mockPrimaryNetworkCoreClient, mockTxParams);

        await result.sign()
        expect(result.getId(), 'transaction hash mismatch').toBe('Ve2UBm5KgDbSdY7YnRyWSYhTqvhAfpuujvgDTdAsebMRGEGWW')
    });
}); 