# ListContractDeploymentsRequest

## Example Usage

```typescript
import { ListContractDeploymentsRequest } from "@avalanche-sdk/sdk/models/operations";

let value: ListContractDeploymentsRequest = {
  chainId: "43114",
  address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
};
```

## Fields

| Field                                                                                                       | Type                                                                                                        | Required                                                                                                    | Description                                                                                                 | Example                                                                                                     |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `pageToken`                                                                                                 | *string*                                                                                                    | :heavy_minus_sign:                                                                                          | A page token, received from a previous list call. Provide this to retrieve the subsequent page.             |                                                                                                             |
| `pageSize`                                                                                                  | *number*                                                                                                    | :heavy_minus_sign:                                                                                          | The maximum number of items to return. The minimum page size is 1. The maximum pageSize is 100.             | 10                                                                                                          |
| `chainId`                                                                                                   | *string*                                                                                                    | :heavy_minus_sign:                                                                                          | A supported evm chain id or blockchain id. Use the `/chains` endpoint to get a list of supported chain ids. | 43114                                                                                                       |
| `address`                                                                                                   | *string*                                                                                                    | :heavy_check_mark:                                                                                          | A wallet address.                                                                                           | 0x71C7656EC7ab88b098defB751B7401B5f6d8976F                                                                  |