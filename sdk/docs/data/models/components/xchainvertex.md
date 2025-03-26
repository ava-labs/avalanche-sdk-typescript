# XChainVertex

## Example Usage

```typescript
import { XChainVertex } from "@avalanche-sdk/sdk/data/models/components";

let value: XChainVertex = {
  vertexHash: "<value>",
  parentHashes: [
    "<value>",
  ],
  vertexHeight: 2228.64,
  vertexIndex: 805.32,
  vertexTimestamp: 853.11,
  txCount: 2213.96,
  transactions: [
    "<value>",
  ],
  vertexSizeBytes: 1000.14,
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