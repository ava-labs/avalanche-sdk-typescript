# ListAutoRenewedCyclesResponse

## Example Usage

```typescript
import { ListAutoRenewedCyclesResponse } from "@avalanche-sdk/chainkit/models/components";

let value: ListAutoRenewedCyclesResponse = {
  cycles: [
    {
      cycleIndex: 1,
      rewardTxHash: "vu36Rv1E8DqbXqhNR2s8ohvXXT4hMP8neG1EUodpfdzZn1Kxv",
      stakingTxHash: "gcuYVzYGXwzFnB355WRxVdZoHwkag2uj1N2ieEUQMcat3ytL",
      startTimestamp: 1786653163,
      endTimestamp: 1786739563,
      weightAtCycleStart: "1000000000",
      grossValidationReward: "1274832",
      withdrawnValidationReward: "956124",
      compoundedValidationReward: "318708",
      grossDelegateeReward: "0",
      withdrawnDelegateeReward: "0",
      compoundedDelegateeReward: "0",
      autoCompoundSharePercent: 25,
      outcome: "renewed",
      delegatorCount: 0,
      amountDelegated: "0",
    },
  ],
};
```

## Fields

| Field                                                                                                                                                          | Type                                                                                                                                                           | Required                                                                                                                                                       | Description                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                                                | *string*                                                                                                                                                       | :heavy_minus_sign:                                                                                                                                             | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages.                         |
| `cycles`                                                                                                                                                       | [components.AutoRenewedCycle](../../models/components/autorenewedcycle.md)[]                                                                                   | :heavy_check_mark:                                                                                                                                             | Settled cycles, newest first by default. Empty for a node with no auto-renewed validation. The in-flight cycle is not included; it is on the validator object. |
| `currentCycle`                                                                                                                                                 | [components.CurrentAutoRenewedCycle](../../models/components/currentautorenewedcycle.md)                                                                       | :heavy_minus_sign:                                                                                                                                             | The cycle in flight. Absent when the position has ended, and on any page but the first.                                                                        |