import { describe, expect, it, vi, beforeEach } from 'vitest';
import { pvm, utils } from '@avalabs/avalanchejs';
import { feeState, testContext, getValidUtxo } from '../../fixtures/transactions';
import { pAddressForTest, pAddressForTest2, privateKeyForTest } from '../../fixtures/accounts';
import type { Output } from '../../common/types';
import type { PrimaryNetworkCore } from '../../../primaryNetworkCoreClient';
import { checkOutputs } from '../../fixtures/utils';
import { newCreateSubnetTx, type CreateSubnetTxParams } from './createSubnetTx';

describe('createSubnetTx', () => {
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

    it('should create correct outputs and fees', async () => {
        const changeAddresses = [pAddressForTest2]

        const mockTxParams: CreateSubnetTxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            subnetOwners: {
                addresses: [pAddressForTest2],
                threshold: 1,
            },
        };
        const testOutputs: Output[] = []
        const result = await newCreateSubnetTx(mockPrimaryNetworkCoreClient, mockTxParams);
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

        const mockTxParams: CreateSubnetTxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            subnetOwners: {
                addresses: [pAddressForTest2, pAddressForTest],
                threshold: 2,
            },
        };
        const result = await newCreateSubnetTx(mockPrimaryNetworkCoreClient, mockTxParams);

        expect(result.tx.getSubnetOwners().addrs.map(addr => `P-${addr.toString('fuji')}`), 'subnetOwners addresses mismatch').deep.equal(mockTxParams.subnetOwners.addresses)
        expect(result.tx.getSubnetOwners().threshold.value(), 'subnetOwners threshold mismatch').toBe(mockTxParams.subnetOwners.threshold)
    });

    it('should give correct transaction hash', async () => {
        const changeAddresses = [pAddressForTest2]

        const mockTxParams: CreateSubnetTxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            subnetOwners: {
                addresses: [pAddressForTest2],
                threshold: 1,
            },
        };
        const result = await newCreateSubnetTx(mockPrimaryNetworkCoreClient, mockTxParams);

        await result.sign()
        expect(result.getId()).toBe('AL72oparjCxHBkL11A9L9BZ2wbCHNr6TiLCkLEwKK98KgP9A9')
    });
}); 