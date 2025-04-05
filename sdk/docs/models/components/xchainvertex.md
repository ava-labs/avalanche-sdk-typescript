# XChainVertex

## Example Usage

```typescript
import { XChainVertex } from "@avalanche-sdk/sdk/models/components";

let value: XChainVertex = {
  vertexHash: "<value>",
  parentHashes: [
    "<value>",
  ],
  vertexHeight: 4766.24,
  vertexIndex: 5902.46,
  vertexTimestamp: 8444.73,
  txCount: 489.21,
  transactions: [
    "<value>",
  ],
  vertexSizeBytes: 3285.61,
};
```

## Fields

| Field              | Type               | Required           | Description        |
| ------------------ | ------------------ | ------------------ | ------------------ |
| `vertexHash`       | *string*           | :heavy_check_mark: | N/A                |
| `parentHashes`     | *string*[]         | :heavy_check_mark: | N/A                |
| `vertexHeight`     | *number*           | :heavy_check_mark: | N/A                |
| `vertexIndex`      | *number*           | :heavy_check_mark: | N/A                |
| `vertexTimestamp`  | *number*           | :heavy_check_mark: | N/A                |
| `txCount`          | *number*           | :heavy_check_mark: | N/A                |
| `transactions`     | *string*[]         | :heavy_check_mark: | N/A                |
| `vertexSizeBytes`  | *number*           | :heavy_check_mark: | N/A                |