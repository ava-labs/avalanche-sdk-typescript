# CompositeQueryRequestDto

## Example Usage

```typescript
import { CompositeQueryRequestDto } from "@avalanche-sdk/metrics/models/components";

let value: CompositeQueryRequestDto = {
  queries: [
    {
      id: "<id>",
      type: "AnyTimeNativeBalance",
      params: {
        firstDate: "<value>",
        lastDate: "<value>",
        minBalance: "<value>",
        evmChainId: "<id>",
      },
    },
  ],
  operator: "OR",
};
```

## Fields

| Field                                                                                           | Type                                                                                            | Required                                                                                        | Description                                                                                     |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `pageToken`                                                                                     | *string*                                                                                        | :heavy_minus_sign:                                                                              | A page token, received from a previous list call. Provide this to retrieve the subsequent page. |
| `pageSize`                                                                                      | *number*                                                                                        | :heavy_minus_sign:                                                                              | The maximum number of items to return.                                                          |
| `queries`                                                                                       | *components.Query*[]                                                                            | :heavy_check_mark:                                                                              | N/A                                                                                             |
| `operator`                                                                                      | [components.Operator](../../models/components/operator.md)                                      | :heavy_check_mark:                                                                              | N/A                                                                                             |