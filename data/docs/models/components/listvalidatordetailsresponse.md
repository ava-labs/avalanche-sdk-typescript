# ListValidatorDetailsResponse

## Example Usage

```typescript
import { ListValidatorDetailsResponse } from "@avalanche-sdk/data/models/components";

let value: ListValidatorDetailsResponse = {
  validators: [
    {
      txHash: "<value>",
      nodeId: "<id>",
      subnetId: "<id>",
      amountStaked: "<value>",
      startTimestamp: 9262.83,
      endTimestamp: 7276.2,
      validationStatus: "pending",
    },
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `validators`                                                                                                                           | *components.Validator*[]                                                                                                               | :heavy_check_mark:                                                                                                                     | The list of validator Details.                                                                                                         |