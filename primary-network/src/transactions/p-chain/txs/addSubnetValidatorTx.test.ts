import { describe, expect, it, vi, beforeEach } from 'vitest';
import { pvm, utils } from '@avalabs/avalanchejs';
import { feeState, testContext, getValidUtxo, createSubnetTx } from '../../fixtures/transactions';
import { pAddressForTest, pAddressForTest2, pAddressForTest4, privateKeyForTest, privateKeyForTest2 } from '../../fixtures/accounts';
import type { Output } from '../../common/types';
import type { PrimaryNetworkCore } from '../../../primaryNetworkCoreClient';
import { checkOutputs } from '../../fixtures/utils';
import { type AddSubnetValidatorTxParams, newAddSubnetValidatorTx } from './addSubnetValidatorTx';

describe('addSubnetValidatorTx', () => {
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

        const endTime = Date.now() + 2 * 24 * 60 * 60 * 1000  // 2 days from now
        const mockTxParams: AddSubnetValidatorTxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
            nodeId: 'NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ',
            weight: 12345n,
            end: BigInt(endTime),
            subnetAuth: [0],
        };
        const testOutputs: Output[] = []

        const result = await newAddSubnetValidatorTx(mockPrimaryNetworkCoreClient, mockTxParams);
        const outputs = result.getOutputs()

        const fee = pvm.calculateFee(result.tx, testContext.platformFeeConfig.weights, feeState().price)
        const expectedFeesInAvax = Number(fee) / 1e9
        const expectedChangeAmount = testInputAmount - expectedFeesInAvax

        // expected change output
        testOutputs.push({
            amount: expectedChangeAmount,
            addresses: changeAddresses,
        })

        // check change and staked outputs
        checkOutputs(testOutputs, outputs)

        // actual burned amount is same as fees
        const allInputAmounts = result.tx.getInputs().reduce((acc, i) => acc + i.amount(), 0n)
        const allOutputAmounts = outputs.reduce((acc, i) => acc + i.output.amount(), 0n)
        expect(allInputAmounts - allOutputAmounts, 'expected and actual burned amount mismatch').toBe(BigInt(expectedFeesInAvax * 1e9))
    });

    it('should create correct staking details', async () => {
        const changeAddresses = [pAddressForTest2]

        const endTime = 1234356770
        const mockTxParams: AddSubnetValidatorTxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
            nodeId: 'NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ',
            weight: 12345n,
            end: BigInt(endTime),
            subnetAuth: [0],
        };
        const result = await newAddSubnetValidatorTx(mockPrimaryNetworkCoreClient, mockTxParams);

        // check staking details
        const vldr = result.tx.subnetValidator.validator
        expect(vldr.nodeId.value(), 'nodeId mismatch').toBe(mockTxParams.nodeId)
        expect(vldr.endTime.value(), 'endTime mismatch').toBe(BigInt(mockTxParams.end))
        expect(vldr.weight.value(), 'weight mismatch').toBe(BigInt(mockTxParams.weight))
        expect(result.tx.subnetValidator.subnetId.value(), 'subnetId mismatch').toBe(mockTxParams.subnetId)
        expect(result.tx.getSubnetAuth().values(), 'subnetAuth mismatch').deep.equal(mockTxParams.subnetAuth)
    });

    it('should correctly sign inputs and subnet auth', async () => {
        const changeAddresses = [pAddressForTest2]

        const endTime = 1234356770
        const mockTxParams: AddSubnetValidatorTxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
            nodeId: 'NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ',
            weight: 12345n,
            end: BigInt(endTime),
            subnetAuth: [0],
        };
        const result = await newAddSubnetValidatorTx(mockPrimaryNetworkCoreClient, mockTxParams);
        await result.sign()
        expect(result.unsignedTx.hasAllSignatures(), 'transaction is not signed').toBe(true)
    });

    it('should correctly sign multi-sig subnet auth', async () => {
        mockPvmRpc.getTx = vi.fn().mockResolvedValue(createSubnetTx(
            { addresses: [pAddressForTest4, pAddressForTest, pAddressForTest2], threshold: 2 }
        ))

        const changeAddresses = [pAddressForTest2]

        const endTime = 1234356770
        const mockTxParams: AddSubnetValidatorTxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
            nodeId: 'NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ',
            weight: 12345n,
            end: BigInt(endTime),
            subnetAuth: [1, 2],
        };
        const result = await newAddSubnetValidatorTx(mockPrimaryNetworkCoreClient, mockTxParams);

        await result.sign() // sign address 1 from the wallet
        await result.sign([privateKeyForTest2]) // sign address 2 directly
        expect(result.unsignedTx.hasAllSignatures(), 'transaction is not signed').toBe(true)
    });

    it('should give correct transaction hash', async () => {
        const changeAddresses = [pAddressForTest2]

        const endTime = 1234356770
        const mockTxParams: AddSubnetValidatorTxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
            nodeId: 'NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ',
            weight: 12345n,
            end: BigInt(endTime),
            subnetAuth: [0],
        };
        const result = await newAddSubnetValidatorTx(mockPrimaryNetworkCoreClient, mockTxParams);
        await result.sign()
        expect(result.getId(), 'transaction hash mismatch').toBe('2tvLG4SLvZXEtU8sP3U5owqC4AmkUDksPKKcZt9V6vtmerUDY')
    });
}); 