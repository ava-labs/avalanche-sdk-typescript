import { describe, expect, it, vi, beforeEach } from 'vitest';
import { pvm, utils } from '@avalabs/avalanchejs';
import { feeState, testContext, getValidUtxo } from '../../fixtures/transactions';
import { pAddressForTest, pAddressForTest2, pAddressForTest3, privateKeyForTest } from '../../fixtures/accounts';
import type { Output } from '../common/types';
import { newAddPermissionlessDelegatorTx, type AddPermissionlessDelegatorTxParams } from './addPermissionlessDelegatorTx';
import type { PrimaryNetworkCore } from '../../../primaryNetworkCoreClient';
import { checkOutputs } from '../../fixtures/utils';

describe('addPermissionlessDelegatorTx', () => {
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

    it('should create correct stake and change outputs', async () => {
        const rewardAddresses = [pAddressForTest, pAddressForTest3]
        const changeAddresses = [pAddressForTest2]

        const stakeAmount = 0.5
        const endTime = 1234356770
        const mockTxParams: AddPermissionlessDelegatorTxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            stakeInAvax: stakeAmount,
            nodeId: 'NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ',
            end: Math.floor(endTime / 1000),
            rewardAddresses,
        };
        // stake output
        const testOutputs: Output[] = [{
            amount: stakeAmount,
            addresses: changeAddresses,
        }]

        const result = await newAddPermissionlessDelegatorTx(mockPrimaryNetworkCoreClient, mockTxParams);
        const stakedOutputs = result.getStakeOutputs()
        const transferableOutputs = result.getOutputs()
        const outputs = [...stakedOutputs, ...transferableOutputs]

        const fee = pvm.calculateFee(result.tx, testContext.platformFeeConfig.weights, feeState().price)
        const expectedFeesInAvax = Number(fee) / 1e9
        const expectedChangeAmount = testInputAmount - stakeAmount - expectedFeesInAvax

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
        const rewardAddresses = [pAddressForTest, pAddressForTest3]
        const changeAddresses = [pAddressForTest2]

        const stakeAmount = 0.5
        const endTime = 1234356770
        const mockTxParams: AddPermissionlessDelegatorTxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            stakeInAvax: stakeAmount,
            nodeId: 'NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ',
            end: Math.floor(endTime / 1000),
            rewardAddresses,
            threshold: 3,
            locktime: 1234567890,
        };
        const result = await newAddPermissionlessDelegatorTx(mockPrimaryNetworkCoreClient, mockTxParams);

        // check staking details
        const vldr = result.tx.subnetValidator.validator
        expect(vldr.nodeId.value(), 'nodeId mismatch').toBe(mockTxParams.nodeId)
        expect(vldr.endTime.value(), 'endTime mismatch').toBe(BigInt(mockTxParams.end))
        expect(vldr.weight.value(), 'weight mismatch').toBe(BigInt(mockTxParams.stakeInAvax * 1e9))

        // check delegator rewards owner
        const drw = result.tx.getDelegatorRewardsOwner()
        expect(drw.locktime.value(), 'locktime mismatch').toBe(BigInt(mockTxParams.locktime ?? 0n))
        expect(drw.threshold.value(), 'threshold mismatch').toBe(mockTxParams.threshold ?? 1)
        expect(
            drw.addrs.map(a => a.toString('fuji')),
            'reward addresses mismatch'
        ).toEqual(
            mockTxParams.rewardAddresses.map(a => a.replace('P-', ''))
        )
    });

    it('should give correct transaction hash', async () => {
        const rewardAddresses = [pAddressForTest, pAddressForTest3]
        const changeAddresses = [pAddressForTest2]

        const stakeAmount = 0.5
        const endTime = 1234356770
        const mockTxParams: AddPermissionlessDelegatorTxParams = {
            changeAddresses, // staked outputs will be owned by these addresses
            stakeInAvax: stakeAmount,
            nodeId: 'NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ',
            end: Math.floor(endTime / 1000),
            rewardAddresses,
            threshold: 3,
            locktime: 1234567890,
        };
        const result = await newAddPermissionlessDelegatorTx(mockPrimaryNetworkCoreClient, mockTxParams);

        await result.sign()
        expect(result.getId()).toBe('2vMibCNEgJBFtaYBGQQGLSxSn8btudvg7dsS9TrmD5fmWeomhf')
    });
}); 