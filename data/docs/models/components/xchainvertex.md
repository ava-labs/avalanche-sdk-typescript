# XChainVertex

## Example Usage

```typescript
import { XChainVertex } from "@avalanche-sdk/data/models/components";

let value: XChainVertex = {
  vertexHash: "<value>",
  parentHashes: [
    "<value>",
  ],
  vertexHeight: 8620.63,
  vertexIndex: 972.58,
  vertexTimestamp: 4977.77,
  txCount: 5810.82,
  transactions: [
    "<value>",
  ],
  vertexSizeBytes: 2415.57,
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