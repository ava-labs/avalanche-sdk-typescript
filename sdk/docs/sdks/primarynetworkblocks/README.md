# PrimaryNetworkBlocks
(*data.primaryNetwork.blocks*)

## Overview

### Available Operations

* [get](#get) - Get block
* [listByNodeId](#listbynodeid) - List blocks proposed by node
* [listLatest](#listlatest) - List latest blocks

## get

Gets a block by block height or block hash on one of the Primary Network chains.

### Example Usage

```typescript
import { Avalanche } from "@avalanche-sdk/sdk";

const avalanche = new Avalanche({
  network: "mainnet",
});

async function run() {
  const result = await avalanche.data.primaryNetwork.blocks.get({
    blockchainId: "p-chain",
    blockId: "5615di9ytxujackzaXNrVuWQy5y8Yrt8chPCscMr5Ku9YxJ1S",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AvalancheCore } from "@avalanche-sdk/sdk/core.js";
import { dataPrimaryNetworkBlocksGet } from "@avalanche-sdk/sdk/funcs/dataPrimaryNetworkBlocksGet.js";

// Use `AvalancheCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const avalanche = new AvalancheCore({
  network: "mainnet",
});

async function run() {
  const res = await dataPrimaryNetworkBlocksGet(avalanche, {
    blockchainId: "p-chain",
    blockId: "5615di9ytxujackzaXNrVuWQy5y8Yrt8chPCscMr5Ku9YxJ1S",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("dataPrimaryNetworkBlocksGet failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.GetBlockByIdRequest](../../models/operations/getblockbyidrequest.md)                                                                                               | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |
| `options.serverURL`                                                                                                                                                            | *string*                                                                                                                                                                       | :heavy_minus_sign:                                                                                                                                                             | An optional server URL to use.                                                                                                                                                 |

### Response

**Promise\<[components.GetPrimaryNetworkBlockResponse](../../models/components/getprimarynetworkblockresponse.md)\>**

### Errors

| Error Type                     | Status Code                    | Content Type                   |
| ------------------------------ | ------------------------------ | ------------------------------ |
| errors.BadRequestError         | 400                            | application/json               |
| errors.UnauthorizedError       | 401                            | application/json               |
| errors.ForbiddenError          | 403                            | application/json               |
| errors.NotFoundError           | 404                            | application/json               |
| errors.TooManyRequestsError    | 429                            | application/json               |
| errors.InternalServerError     | 500                            | application/json               |
| errors.BadGatewayError         | 502                            | application/json               |
| errors.ServiceUnavailableError | 503                            | application/json               |
| errors.AvalancheAPIError       | 4XX, 5XX                       | \*/\*                          |

## listByNodeId

Lists the latest blocks proposed by a given NodeID on one of the Primary Network chains.

### Example Usage

```typescript
import { Avalanche } from "@avalanche-sdk/sdk";

const avalanche = new Avalanche({
  network: "mainnet",
});

async function run() {
  const result = await avalanche.data.primaryNetwork.blocks.listByNodeId({
    startTimestamp: 1689541049,
    endTimestamp: 1689800249,
    blockchainId: "p-chain",
    nodeId: "NodeID-111111111111111111116DBWJs",
  });

  for await (const page of result) {
    console.log(page);
  }
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AvalancheCore } from "@avalanche-sdk/sdk/core.js";
import { dataPrimaryNetworkBlocksListByNodeId } from "@avalanche-sdk/sdk/funcs/dataPrimaryNetworkBlocksListByNodeId.js";

// Use `AvalancheCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const avalanche = new AvalancheCore({
  network: "mainnet",
});

async function run() {
  const res = await dataPrimaryNetworkBlocksListByNodeId(avalanche, {
    startTimestamp: 1689541049,
    endTimestamp: 1689800249,
    blockchainId: "p-chain",
    nodeId: "NodeID-111111111111111111116DBWJs",
  });
  if (res.ok) {
    const { value: result } = res;
    for await (const page of result) {
    console.log(page);
  }
  } else {
    console.log("dataPrimaryNetworkBlocksListByNodeId failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ListPrimaryNetworkBlocksByNodeIdRequest](../../models/operations/listprimarynetworkblocksbynodeidrequest.md)                                                       | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |
| `options.serverURL`                                                                                                                                                            | *string*                                                                                                                                                                       | :heavy_minus_sign:                                                                                                                                                             | An optional server URL to use.                                                                                                                                                 |

### Response

**Promise\<[operations.ListPrimaryNetworkBlocksByNodeIdResponse](../../models/operations/listprimarynetworkblocksbynodeidresponse.md)\>**

### Errors

| Error Type                     | Status Code                    | Content Type                   |
| ------------------------------ | ------------------------------ | ------------------------------ |
| errors.BadRequestError         | 400                            | application/json               |
| errors.UnauthorizedError       | 401                            | application/json               |
| errors.ForbiddenError          | 403                            | application/json               |
| errors.NotFoundError           | 404                            | application/json               |
| errors.TooManyRequestsError    | 429                            | application/json               |
| errors.InternalServerError     | 500                            | application/json               |
| errors.BadGatewayError         | 502                            | application/json               |
| errors.ServiceUnavailableError | 503                            | application/json               |
| errors.AvalancheAPIError       | 4XX, 5XX                       | \*/\*                          |

## listLatest

Lists latest blocks on one of the Primary Network chains.

### Example Usage

```typescript
import { Avalanche } from "@avalanche-sdk/sdk";

const avalanche = new Avalanche({
  network: "mainnet",
});

async function run() {
  const result = await avalanche.data.primaryNetwork.blocks.listLatest({
    startTimestamp: 1689541049,
    endTimestamp: 1689800249,
    blockchainId: "p-chain",
  });

  for await (const page of result) {
    console.log(page);
  }
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AvalancheCore } from "@avalanche-sdk/sdk/core.js";
import { dataPrimaryNetworkBlocksListLatest } from "@avalanche-sdk/sdk/funcs/dataPrimaryNetworkBlocksListLatest.js";

// Use `AvalancheCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const avalanche = new AvalancheCore({
  network: "mainnet",
});

async function run() {
  const res = await dataPrimaryNetworkBlocksListLatest(avalanche, {
    startTimestamp: 1689541049,
    endTimestamp: 1689800249,
    blockchainId: "p-chain",
  });
  if (res.ok) {
    const { value: result } = res;
    for await (const page of result) {
    console.log(page);
  }
  } else {
    console.log("dataPrimaryNetworkBlocksListLatest failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ListLatestPrimaryNetworkBlocksRequest](../../models/operations/listlatestprimarynetworkblocksrequest.md)                                                           | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |
| `options.serverURL`                                                                                                                                                            | *string*                                                                                                                                                                       | :heavy_minus_sign:                                                                                                                                                             | An optional server URL to use.                                                                                                                                                 |

### Response

**Promise\<[operations.ListLatestPrimaryNetworkBlocksResponse](../../models/operations/listlatestprimarynetworkblocksresponse.md)\>**

### Errors

| Error Type                     | Status Code                    | Content Type                   |
| ------------------------------ | ------------------------------ | ------------------------------ |
| errors.BadRequestError         | 400                            | application/json               |
| errors.UnauthorizedError       | 401                            | application/json               |
| errors.ForbiddenError          | 403                            | application/json               |
| errors.NotFoundError           | 404                            | application/json               |
| errors.TooManyRequestsError    | 429                            | application/json               |
| errors.InternalServerError     | 500                            | application/json               |
| errors.BadGatewayError         | 502                            | application/json               |
| errors.ServiceUnavailableError | 503                            | application/json               |
| errors.AvalancheAPIError       | 4XX, 5XX                       | \*/\*                          |