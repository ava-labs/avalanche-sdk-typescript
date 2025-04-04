# AllTimeNftHoldersQueryDto

## Example Usage

```typescript
import { AllTimeNftHoldersQueryDto } from "@avalanche-sdk/devtools/models/components";

let value: AllTimeNftHoldersQueryDto = {
  id: "<id>",
  type: "AllTimeNftHolders",
  params: {
    firstDate: "<value>",
    lastDate: "<value>",
    evmChainId: "<id>",
    contractAddress: "<value>",
  },
};
```

## Fields

| Field                                                                                                | Type                                                                                                 | Required                                                                                             | Description                                                                                          |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `id`                                                                                                 | *string*                                                                                             | :heavy_check_mark:                                                                                   | N/A                                                                                                  |
| `type`                                                                                               | [components.AllTimeNftHoldersQueryDtoType](../../models/components/alltimenftholdersquerydtotype.md) | :heavy_check_mark:                                                                                   | N/A                                                                                                  |
| `params`                                                                                             | *components.AllTimeNftHoldersQueryDtoParams*                                                         | :heavy_check_mark:                                                                                   | N/A                                                                                                  |