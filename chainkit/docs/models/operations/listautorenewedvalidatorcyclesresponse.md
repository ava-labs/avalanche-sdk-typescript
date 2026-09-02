# ListAutoRenewedValidatorCyclesResponse

## Example Usage

```typescript
import { ListAutoRenewedValidatorCyclesResponse } from "@avalanche-sdk/chainkit/models/operations";

let value: ListAutoRenewedValidatorCyclesResponse = {
  result: {
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
  },
};
```

## Fields

| Field                                                                                                | Type                                                                                                 | Required                                                                                             | Description                                                                                          |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `result`                                                                                             | [components.ListAutoRenewedCyclesResponse](../../models/components/listautorenewedcyclesresponse.md) | :heavy_check_mark:                                                                                   | N/A                                                                                                  |