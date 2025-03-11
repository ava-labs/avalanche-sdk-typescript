# AnyTimeNftHoldersQueryDto

## Example Usage

```typescript
import { AnyTimeNftHoldersQueryDto } from "@avalanche-sdk/metrics/models/components";

let value: AnyTimeNftHoldersQueryDto = {
  id: "<id>",
  type: "AnyTimeNftHolders",
  params: {
    firstDate: "<value>",
    lastDate: "<value>",
    evmChainId: "<id>",
    contractAddress: "<value>",
  },
};
```

## Fields

| Field                                                                                | Type                                                                                 | Required                                                                             | Description                                                                          |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `id`                                                                                 | *string*                                                                             | :heavy_check_mark:                                                                   | N/A                                                                                  |
| `type`                                                                               | [components.TypeAnyTimeNftHolders](../../models/components/typeanytimenftholders.md) | :heavy_check_mark:                                                                   | N/A                                                                                  |
| `params`                                                                             | *components.AnyTimeNftHoldersQueryDtoParams*                                         | :heavy_check_mark:                                                                   | N/A                                                                                  |