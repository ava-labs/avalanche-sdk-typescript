# Data.PrimaryNetwork.Utxos

## Overview

### Available Operations

* [listByAddresses](#listbyaddresses) - List UTXOs
* [listByAddressesV2](#listbyaddressesv2) - List UTXOs v2 - Supports querying for more addresses
* [getLastActivityTimestampByAddresses](#getlastactivitytimestampbyaddresses) - Get last activity timestamp by addresses
* [getLastActivityTimestampByAddressesV2](#getlastactivitytimestampbyaddressesv2) - Get last activity timestamp by addresses v2

## listByAddresses

Lists UTXOs on one of the Primary Network chains for the supplied addresses.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="getUtxosByAddresses" method="get" path="/v1/networks/{network}/blockchains/{blockchainId}/utxos" -->
```typescript
import { Avalanche } from "@avalanche-sdk/chainkit";

const avalanche = new Avalanche({
  network: "mainnet",
});

async function run() {
  const result = await avalanche.data.primaryNetwork.utxos.listByAddresses({
    addresses: "avax1h2ccj9f5ay5acl6tyn9mwmw32p8wref8vl8ctg",
    blockchainId: "p-chain",
    minUtxoAmount: 1000,
    sortOrder: "asc",
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
import { AvalancheCore } from "@avalanche-sdk/chainkit/core.js";
import { dataPrimaryNetworkUtxosListByAddresses } from "@avalanche-sdk/chainkit/funcs/dataPrimaryNetworkUtxosListByAddresses.js";

// Use `AvalancheCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const avalanche = new AvalancheCore({
  network: "mainnet",
});

async function run() {
  const res = await dataPrimaryNetworkUtxosListByAddresses(avalanche, {
    addresses: "avax1h2ccj9f5ay5acl6tyn9mwmw32p8wref8vl8ctg",
    blockchainId: "p-chain",
    minUtxoAmount: 1000,
    sortOrder: "asc",
  });
  if (res.ok) {
    const { value: result } = res;
    for await (const page of result) {
    console.log(page);
  }
  } else {
    console.log("dataPrimaryNetworkUtxosListByAddresses failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.GetUtxosByAddressesRequest](../../models/operations/getutxosbyaddressesrequest.md)                                                                                 | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |
| `options.serverURL`                                                                                                                                                            | *string*                                                                                                                                                                       | :heavy_minus_sign:                                                                                                                                                             | An optional server URL to use.                                                                                                                                                 |

### Response

**Promise\<[operations.GetUtxosByAddressesResponse](../../models/operations/getutxosbyaddressesresponse.md)\>**

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

## listByAddressesV2

Lists UTXOs on one of the Primary Network chains for the supplied addresses. This v2 route supports increased page size and address limit.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="getUtxosByAddressesV2" method="post" path="/v1/networks/{network}/blockchains/{blockchainId}/utxos" -->
```typescript
import { Avalanche } from "@avalanche-sdk/chainkit";

const avalanche = new Avalanche({
  network: "mainnet",
});

async function run() {
  const result = await avalanche.data.primaryNetwork.utxos.listByAddressesV2({
    pageSize: 10,
    blockchainId: "p-chain",
    minUtxoAmount: 1000,
    sortOrder: "asc",
    primaryNetworkAddressesBodyDto: {
      addresses: "P-avax1abc123,X-avax1def456,C-avax1ghi789",
    },
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
import { AvalancheCore } from "@avalanche-sdk/chainkit/core.js";
import { dataPrimaryNetworkUtxosListByAddressesV2 } from "@avalanche-sdk/chainkit/funcs/dataPrimaryNetworkUtxosListByAddressesV2.js";

// Use `AvalancheCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const avalanche = new AvalancheCore({
  network: "mainnet",
});

async function run() {
  const res = await dataPrimaryNetworkUtxosListByAddressesV2(avalanche, {
    pageSize: 10,
    blockchainId: "p-chain",
    minUtxoAmount: 1000,
    sortOrder: "asc",
    primaryNetworkAddressesBodyDto: {
      addresses: "P-avax1abc123,X-avax1def456,C-avax1ghi789",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    for await (const page of result) {
    console.log(page);
  }
  } else {
    console.log("dataPrimaryNetworkUtxosListByAddressesV2 failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.GetUtxosByAddressesV2Request](../../models/operations/getutxosbyaddressesv2request.md)                                                                             | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |
| `options.serverURL`                                                                                                                                                            | *string*                                                                                                                                                                       | :heavy_minus_sign:                                                                                                                                                             | An optional server URL to use.                                                                                                                                                 |

### Response

**Promise\<[operations.GetUtxosByAddressesV2Response](../../models/operations/getutxosbyaddressesv2response.md)\>**

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

## getLastActivityTimestampByAddresses

Gets the last activity timestamp for the supplied addresses on one of the Primary Network chains.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="getLastActivityTimestampByAddresses" method="get" path="/v1/networks/{network}/blockchains/{blockchainId}/lastActivityTimestampByAddresses" -->
```typescript
import { Avalanche } from "@avalanche-sdk/chainkit";

const avalanche = new Avalanche({
  network: "mainnet",
});

async function run() {
  const result = await avalanche.data.primaryNetwork.utxos.getLastActivityTimestampByAddresses({
    addresses: "avax1h2ccj9f5ay5acl6tyn9mwmw32p8wref8vl8ctg",
    blockchainId: "p-chain",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AvalancheCore } from "@avalanche-sdk/chainkit/core.js";
import { dataPrimaryNetworkUtxosGetLastActivityTimestampByAddresses } from "@avalanche-sdk/chainkit/funcs/dataPrimaryNetworkUtxosGetLastActivityTimestampByAddresses.js";

// Use `AvalancheCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const avalanche = new AvalancheCore({
  network: "mainnet",
});

async function run() {
  const res = await dataPrimaryNetworkUtxosGetLastActivityTimestampByAddresses(avalanche, {
    addresses: "avax1h2ccj9f5ay5acl6tyn9mwmw32p8wref8vl8ctg",
    blockchainId: "p-chain",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("dataPrimaryNetworkUtxosGetLastActivityTimestampByAddresses failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.GetLastActivityTimestampByAddressesRequest](../../models/operations/getlastactivitytimestampbyaddressesrequest.md)                                                 | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |
| `options.serverURL`                                                                                                                                                            | *string*                                                                                                                                                                       | :heavy_minus_sign:                                                                                                                                                             | An optional server URL to use.                                                                                                                                                 |

### Response

**Promise\<[operations.GetLastActivityTimestampByAddressesResponse](../../models/operations/getlastactivitytimestampbyaddressesresponse.md)\>**

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

## getLastActivityTimestampByAddressesV2

Gets the last activity timestamp for the supplied addresses on one of the Primary Network chains. V2 route supports querying for more addresses.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="getLastActivityTimestampByAddressesV2" method="post" path="/v1/networks/{network}/blockchains/{blockchainId}/lastActivityTimestampByAddresses" -->
```typescript
import { Avalanche } from "@avalanche-sdk/chainkit";

const avalanche = new Avalanche({
  network: "mainnet",
});

async function run() {
  const result = await avalanche.data.primaryNetwork.utxos.getLastActivityTimestampByAddressesV2({
    blockchainId: "p-chain",
    primaryNetworkAddressesBodyDto: {
      addresses: "P-avax1abc123,X-avax1def456,C-avax1ghi789",
    },
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AvalancheCore } from "@avalanche-sdk/chainkit/core.js";
import { dataPrimaryNetworkUtxosGetLastActivityTimestampByAddressesV2 } from "@avalanche-sdk/chainkit/funcs/dataPrimaryNetworkUtxosGetLastActivityTimestampByAddressesV2.js";

// Use `AvalancheCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const avalanche = new AvalancheCore({
  network: "mainnet",
});

async function run() {
  const res = await dataPrimaryNetworkUtxosGetLastActivityTimestampByAddressesV2(avalanche, {
    blockchainId: "p-chain",
    primaryNetworkAddressesBodyDto: {
      addresses: "P-avax1abc123,X-avax1def456,C-avax1ghi789",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("dataPrimaryNetworkUtxosGetLastActivityTimestampByAddressesV2 failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.GetLastActivityTimestampByAddressesV2Request](../../models/operations/getlastactivitytimestampbyaddressesv2request.md)                                             | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |
| `options.serverURL`                                                                                                                                                            | *string*                                                                                                                                                                       | :heavy_minus_sign:                                                                                                                                                             | An optional server URL to use.                                                                                                                                                 |

### Response

**Promise\<[operations.GetLastActivityTimestampByAddressesV2Response](../../models/operations/getlastactivitytimestampbyaddressesv2response.md)\>**

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