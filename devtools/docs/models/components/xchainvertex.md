# XChainVertex

## Example Usage

```typescript
import { XChainVertex } from "@avalanche-sdk/devtools/models/components";

let value: XChainVertex = {
  vertexHash: "<value>",
  parentHashes: [
    "<value 1>",
  ],
  vertexHeight: 5902.46,
  vertexIndex: 8444.73,
  vertexTimestamp: 489.21,
  txCount: 3285.61,
  transactions: [
    "<value 1>",
  ],
  vertexSizeBytes: 1754.76,
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