import { describe, expect, it, vi, beforeEach } from 'vitest';
import { pvm, utils } from '@avalabs/avalanchejs';
import { feeState, testContext, getValidUtxo, createSubnetTx } from '../../fixtures/transactions';
import { pAddressForTest, pAddressForTest2, privateKeyForTest } from '../../fixtures/accounts';
import type { Output } from '../../common/types';
import type { PrimaryNetworkCore } from '../../../primaryNetworkCoreClient';
import { checkOutputs } from '../../fixtures/utils';
import { newCreateChainTx, type CreateChainTxParams } from './createChainTx';

describe('createChainTx', () => {
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

        const mockTxParams: CreateChainTxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
            vmId: 'mDtV8ES8wRL1j2m6Kvc1qRFAvnpq4kufhueAY1bwbzVhk336o',
            chainName: 'test chain avalanche sdk',
            genesisData: {
                random: 'string data',
                timestamp: 1234567890,
                tx: 'tx data',
            },
            subnetAuth: [0],
        };
        const testOutputs: Output[] = []
        const result = await newCreateChainTx(mockPrimaryNetworkCoreClient, mockTxParams);
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

    it('should create correct chain details', async () => {
        const changeAddresses = [pAddressForTest2]

        const mockTxParams: CreateChainTxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
            vmId: 'mDtV8ES8wRL1j2m6Kvc1qRFAvnpq4kufhueAY1bwbzVhk336o',
            chainName: 'test chain avalanche sdk',
            genesisData: {
                random: 'string data',
                timestamp: 1234567890,
                tx: 'tx data',
            },
            subnetAuth: [0],
        };
        const result = await newCreateChainTx(mockPrimaryNetworkCoreClient, mockTxParams);

        expect(result.tx.chainName.value(), 'chainName mismatch').toBe(mockTxParams.chainName)
        expect(JSON.parse(result.tx.genesisData.toString()), 'genesisData mismatch').toMatchObject(mockTxParams.genesisData)
        expect(result.tx.getSubnetAuth().values(), 'subnetAuth mismatch').deep.equal(mockTxParams.subnetAuth)
    });

    it('should give correct transaction hash', async () => {
        const changeAddresses = [pAddressForTest2]

        const mockTxParams: CreateChainTxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            subnetId: 'tKEcW9xLggRsdhvhU87BXaDSjVKRUbLDh3z6R4A1TTSSVzegT',
            vmId: 'mDtV8ES8wRL1j2m6Kvc1qRFAvnpq4kufhueAY1bwbzVhk336o',
            chainName: 'test chain avalanche sdk',
            genesisData: {
                random: 'string data',
                timestamp: 1234567890,
                tx: 'tx data',
            },
            subnetAuth: [0],
        };
        const result = await newCreateChainTx(mockPrimaryNetworkCoreClient, mockTxParams);

        await result.sign()
        expect(result.getId(), 'transaction hash mismatch').toBe('2WDjMPX9jMRXvXvzAZ2RsjLaFz1R7oj9BXxpPYsRyFqNqmAxh4')
    });
}); 