# @avalanche-sdk/metrics

Developer-friendly & type-safe Typescript SDK specifically catered to leverage *@avalanche-sdk/metrics* API.

<div align="left">
    <a href="https://www.speakeasy.com/?utm_source=@avalanche-sdk/metrics&utm_campaign=typescript"><img src="https://custom-icon-badges.demolab.com/badge/-Built%20By%20Speakeasy-212015?style=for-the-badge&logoColor=FBE331&logo=speakeasy&labelColor=545454" /></a>
    <a href="https://opensource.org/licenses/MIT">
        <img src="https://img.shields.io/badge/License-MIT-blue.svg" style="width: 100px; height: 28px;" />
    </a>
</div>


<br /><br />

<!-- Start Summary [summary] -->
## Summary

Metrics API: The Metrics API provides metrics and analytics of on-chain activity. The API is in Beta and may be subject to change.</br></br>If you have  feedback or feature requests for the API, please submit them <a href="https://portal.productboard.com/dndv9ahlkdfye4opdm8ksafi/tabs/4-glacier-api">here</a>. Bug reports can be submitted <a href="https://docs.google.com/forms/d/e/1FAIpQLSeJQrcp7QoNiqozMDKrVJGX5wpU827d3cVTgF8qa7t_J1Pb-g/viewform">here</a>, and any potential security issues can be reported <a href="https://hackenproof.com/avalanche">here</a>.
<!-- End Summary [summary] -->

<!-- Start Table of Contents [toc] -->
## Table of Contents
<!-- $toc-max-depth=2 -->
* [@avalanche-sdk/metrics](#avalanche-sdkmetrics)
  * [SDK Installation](#sdk-installation)
  * [Requirements](#requirements)
  * [SDK Example Usage](#sdk-example-usage)
  * [Available Resources and Operations](#available-resources-and-operations)
  * [Standalone functions](#standalone-functions)
  * [Global Parameters](#global-parameters)
  * [Pagination](#pagination)
  * [Retries](#retries)
  * [Error Handling](#error-handling)
  * [Server Selection](#server-selection)
  * [Custom HTTP Client](#custom-http-client)
  * [Debugging](#debugging)
* [Development](#development)
  * [Maturity](#maturity)
  * [Contributions](#contributions)

<!-- End Table of Contents [toc] -->

<!-- Start SDK Installation [installation] -->
## SDK Installation

> [!TIP]
> To finish publishing your SDK to npm and others you must [run your first generation action](https://www.speakeasy.com/docs/github-setup#step-by-step-guide).


The SDK can be installed with either [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), [bun](https://bun.sh/) or [yarn](https://classic.yarnpkg.com/en/) package managers.

### NPM

```bash
npm add https://gitpkg.now.sh/ava-labs/avalanche-sdk-typescript/metrics
```

### PNPM

```bash
pnpm add https://gitpkg.now.sh/ava-labs/avalanche-sdk-typescript/metrics
```

### Bun

```bash
bun add https://gitpkg.now.sh/ava-labs/avalanche-sdk-typescript/metrics
```

### Yarn

```bash
yarn add https://gitpkg.now.sh/ava-labs/avalanche-sdk-typescript/metrics zod

# Note that Yarn does not install peer dependencies automatically. You will need
# to install zod as shown above.
```

> [!NOTE]
> This package is published with CommonJS and ES Modules (ESM) support.


### Model Context Protocol (MCP) Server

This SDK is also an installable MCP server where the various SDK methods are
exposed as tools that can be invoked by AI applications.

> Node.js v20 or greater is required to run the MCP server.

<details>
<summary>Claude installation steps</summary>

Add the following server definition to your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "Avalanche": {
      "command": "npx",
      "args": [
        "-y", "--package", "@avalanche-sdk/metrics",
        "--",
        "mcp", "start",
        "--chain-id", "...",
        "--network", "..."
      ]
    }
  }
}
```

</details>

<details>
<summary>Cursor installation steps</summary>

Go to `Cursor Settings > Features > MCP Servers > Add new MCP server` and use the following settings:

- Name: Avalanche
- Type: `command`
- Command:
```sh
npx -y --package @avalanche-sdk/metrics -- mcp start --chain-id ... --network ... 
```

</details>

For a full list of server arguments, run:

```sh
npx -y --package @avalanche-sdk/metrics -- mcp start --help
```
<!-- End SDK Installation [installation] -->

<!-- Start Requirements [requirements] -->
## Requirements

For supported JavaScript runtimes, please consult [RUNTIMES.md](RUNTIMES.md).
<!-- End Requirements [requirements] -->

<!-- Start SDK Example Usage [usage] -->
## SDK Example Usage

### Example

```typescript
import { Avalanche } from "@avalanche-sdk/metrics";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.metrics.healthCheck.metricsHealthCheck();

  // Handle the result
  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->

<!-- Start Available Resources and Operations [operations] -->
## Available Resources and Operations

<details open>
<summary>Available methods</summary>


### [metrics](docs/sdks/metrics/README.md)


#### [metrics.chain](docs/sdks/chain/README.md)


#### [metrics.chain.metrics](docs/sdks/chainmetrics/README.md)

* [getEvmChainMetrics](docs/sdks/chainmetrics/README.md#getevmchainmetrics) - Get metrics for EVM chains
* [getTeleporterMetricsByChain](docs/sdks/chainmetrics/README.md#getteleportermetricsbychain) - Get teleporter metrics for EVM chains
* [getEvmChainRollingWindowMetrics](docs/sdks/chainmetrics/README.md#getevmchainrollingwindowmetrics) - Get rolling window metrics for EVM chains
* [getStakingMetrics](docs/sdks/chainmetrics/README.md#getstakingmetrics) - Get staking metrics for a given subnet

#### [metrics.evm](docs/sdks/evm/README.md)


#### [metrics.evm.chains](docs/sdks/chains/README.md)

* [listChains](docs/sdks/chains/README.md#listchains) - Get a list of supported blockchains
* [getChain](docs/sdks/chains/README.md#getchain) - Get chain information for supported blockchain

#### [metrics.healthCheck](docs/sdks/healthcheck/README.md)

* [metricsHealthCheck](docs/sdks/healthcheck/README.md#metricshealthcheck) - Get the health of the service

#### [metrics.lookingGlass](docs/sdks/lookingglass/README.md)

* [getNftHoldersByContractAddress](docs/sdks/lookingglass/README.md#getnftholdersbycontractaddress) - Get NFT holders by contract address
* [getAddressesByBalanceOverTime](docs/sdks/lookingglass/README.md#getaddressesbybalanceovertime) - Get addresses by balance over time
* [getAddressesByBtcbBridged](docs/sdks/lookingglass/README.md#getaddressesbybtcbbridged) - Get addresses by BTCb bridged balance
* [getValidatorsByDateRange](docs/sdks/lookingglass/README.md#getvalidatorsbydaterange) - Get addresses running validators during a given time frame
* [compositeQuery](docs/sdks/lookingglass/README.md#compositequery) - Composite query

</details>
<!-- End Available Resources and Operations [operations] -->

<!-- Start Standalone functions [standalone-funcs] -->
## Standalone functions

All the methods listed above are available as standalone functions. These
functions are ideal for use in applications running in the browser, serverless
runtimes or other environments where application bundle size is a primary
concern. When using a bundler to build your application, all unused
functionality will be either excluded from the final bundle or tree-shaken away.

To read more about standalone functions, check [FUNCTIONS.md](./FUNCTIONS.md).

<details>

<summary>Available standalone functions</summary>

- [`metricsChainMetricsGetEvmChainMetrics`](docs/sdks/chainmetrics/README.md#getevmchainmetrics) - Get metrics for EVM chains
- [`metricsChainMetricsGetEvmChainRollingWindowMetrics`](docs/sdks/chainmetrics/README.md#getevmchainrollingwindowmetrics) - Get rolling window metrics for EVM chains
- [`metricsChainMetricsGetStakingMetrics`](docs/sdks/chainmetrics/README.md#getstakingmetrics) - Get staking metrics for a given subnet
- [`metricsChainMetricsGetTeleporterMetricsByChain`](docs/sdks/chainmetrics/README.md#getteleportermetricsbychain) - Get teleporter metrics for EVM chains
- [`metricsEvmChainsGetChain`](docs/sdks/chains/README.md#getchain) - Get chain information for supported blockchain
- [`metricsEvmChainsListChains`](docs/sdks/chains/README.md#listchains) - Get a list of supported blockchains
- [`metricsHealthCheckMetricsHealthCheck`](docs/sdks/healthcheck/README.md#metricshealthcheck) - Get the health of the service
- [`metricsLookingGlassCompositeQuery`](docs/sdks/lookingglass/README.md#compositequery) - Composite query
- [`metricsLookingGlassGetAddressesByBalanceOverTime`](docs/sdks/lookingglass/README.md#getaddressesbybalanceovertime) - Get addresses by balance over time
- [`metricsLookingGlassGetAddressesByBtcbBridged`](docs/sdks/lookingglass/README.md#getaddressesbybtcbbridged) - Get addresses by BTCb bridged balance
- [`metricsLookingGlassGetNftHoldersByContractAddress`](docs/sdks/lookingglass/README.md#getnftholdersbycontractaddress) - Get NFT holders by contract address
- [`metricsLookingGlassGetValidatorsByDateRange`](docs/sdks/lookingglass/README.md#getvalidatorsbydaterange) - Get addresses running validators during a given time frame

</details>
<!-- End Standalone functions [standalone-funcs] -->

<!-- Start Global Parameters [global-parameters] -->
## Global Parameters

Certain parameters are configured globally. These parameters may be set on the SDK client instance itself during initialization. When configured as an option during SDK initialization, These global values will be used as defaults on the operations that use them. When such operations are called, there is a place in each to override the global value, if needed.

For example, you can set `chainId` to `"43114"` at SDK initialization and then you do not have to pass the same value on calls to operations like `listChains`. But if you want to do so you may, which will locally override the global setting. See the example code below for a demonstration.


### Available Globals

The following global parameters are available.

| Name    | Type                          | Description                                              |
| ------- | ----------------------------- | -------------------------------------------------------- |
| chainId | string                        | A supported EVM chain id, chain alias, or blockchain id. |
| network | components.GlobalParamNetwork | A supported network type mainnet or testnet/fuji.        |

### Example

```typescript
import { Avalanche } from "@avalanche-sdk/metrics";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.metrics.evm.chains.listChains({
    network: "mainnet",
  });

  for await (const page of result) {
    // Handle the page
    console.log(page);
  }
}

run();

```
<!-- End Global Parameters [global-parameters] -->

<!-- Start Pagination [pagination] -->
## Pagination

Some of the endpoints in this SDK support pagination. To use pagination, you
make your SDK calls as usual, but the returned response object will also be an
async iterable that can be consumed using the [`for await...of`][for-await-of]
syntax.

[for-await-of]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of

Here's an example of one such pagination call:

```typescript
import { Avalanche } from "@avalanche-sdk/metrics";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.metrics.evm.chains.listChains({
    network: "mainnet",
  });

  for await (const page of result) {
    // Handle the page
    console.log(page);
  }
}

run();

```
<!-- End Pagination [pagination] -->

<!-- Start Retries [retries] -->
## Retries

Some of the endpoints in this SDK support retries.  If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API.  However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:
```typescript
import { Avalanche } from "@avalanche-sdk/metrics";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.metrics.healthCheck.metricsHealthCheck({
    retries: {
      strategy: "backoff",
      backoff: {
        initialInterval: 1,
        maxInterval: 50,
        exponent: 1.1,
        maxElapsedTime: 100,
      },
      retryConnectionErrors: false,
    },
  });

  // Handle the result
  console.log(result);
}

run();

```

If you'd like to override the default retry strategy for all operations that support retries, you can provide a retryConfig at SDK initialization:
```typescript
import { Avalanche } from "@avalanche-sdk/metrics";

const avalanche = new Avalanche({
  retryConfig: {
    strategy: "backoff",
    backoff: {
      initialInterval: 1,
      maxInterval: 50,
      exponent: 1.1,
      maxElapsedTime: 100,
    },
    retryConnectionErrors: false,
  },
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.metrics.healthCheck.metricsHealthCheck();

  // Handle the result
  console.log(result);
}

run();

```
<!-- End Retries [retries] -->

<!-- Start Error Handling [errors] -->
## Error Handling

Some methods specify known errors which can be thrown. All the known errors are enumerated in the `models/errors/errors.ts` module. The known errors for a method are documented under the *Errors* tables in SDK docs. For example, the `metricsHealthCheck` method may throw the following errors:

| Error Type                     | Status Code | Content Type     |
| ------------------------------ | ----------- | ---------------- |
| errors.BadRequestError         | 400         | application/json |
| errors.UnauthorizedError       | 401         | application/json |
| errors.ForbiddenError          | 403         | application/json |
| errors.NotFoundError           | 404         | application/json |
| errors.TooManyRequestsError    | 429         | application/json |
| errors.InternalServerError     | 500         | application/json |
| errors.BadGatewayError         | 502         | application/json |
| errors.ServiceUnavailableError | 503         | application/json |
| errors.AvalancheAPIError       | 4XX, 5XX    | \*/\*            |

If the method throws an error and it is not captured by the known errors, it will default to throwing a `AvalancheAPIError`.

```typescript
import { Avalanche } from "@avalanche-sdk/metrics";
import {
  BadGatewayError,
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  SDKValidationError,
  ServiceUnavailableError,
  TooManyRequestsError,
  UnauthorizedError,
} from "@avalanche-sdk/metrics/models/errors";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  let result;
  try {
    result = await avalanche.metrics.healthCheck.metricsHealthCheck();

    // Handle the result
    console.log(result);
  } catch (err) {
    switch (true) {
      // The server response does not match the expected SDK schema
      case (err instanceof SDKValidationError): {
        // Pretty-print will provide a human-readable multi-line error message
        console.error(err.pretty());
        // Raw value may also be inspected
        console.error(err.rawValue);
        return;
      }
      case (err instanceof BadRequestError): {
        // Handle err.data$: BadRequestErrorData
        console.error(err);
        return;
      }
      case (err instanceof UnauthorizedError): {
        // Handle err.data$: UnauthorizedErrorData
        console.error(err);
        return;
      }
      case (err instanceof ForbiddenError): {
        // Handle err.data$: ForbiddenErrorData
        console.error(err);
        return;
      }
      case (err instanceof NotFoundError): {
        // Handle err.data$: NotFoundErrorData
        console.error(err);
        return;
      }
      case (err instanceof TooManyRequestsError): {
        // Handle err.data$: TooManyRequestsErrorData
        console.error(err);
        return;
      }
      case (err instanceof InternalServerError): {
        // Handle err.data$: InternalServerErrorData
        console.error(err);
        return;
      }
      case (err instanceof BadGatewayError): {
        // Handle err.data$: BadGatewayErrorData
        console.error(err);
        return;
      }
      case (err instanceof ServiceUnavailableError): {
        // Handle err.data$: ServiceUnavailableErrorData
        console.error(err);
        return;
      }
      default: {
        // Other errors such as network errors, see HTTPClientErrors for more details
        throw err;
      }
    }
  }
}

run();

```

Validation errors can also occur when either method arguments or data returned from the server do not match the expected format. The `SDKValidationError` that is thrown as a result will capture the raw value that failed validation in an attribute called `rawValue`. Additionally, a `pretty()` method is available on this error that can be used to log a nicely formatted multi-line string since validation errors can list many issues and the plain error string may be difficult read when debugging.

In some rare cases, the SDK can fail to get a response from the server or even make the request due to unexpected circumstances such as network conditions. These types of errors are captured in the `models/errors/httpclienterrors.ts` module:

| HTTP Client Error                                    | Description                                          |
| ---------------------------------------------------- | ---------------------------------------------------- |
| RequestAbortedError                                  | HTTP request was aborted by the client               |
| RequestTimeoutError                                  | HTTP request timed out due to an AbortSignal signal  |
| ConnectionError                                      | HTTP client was unable to make a request to a server |
| InvalidRequestError                                  | Any input used to create a request is invalid        |
| UnexpectedClientError                                | Unrecognised or unexpected error                     |
<!-- End Error Handling [errors] -->

<!-- Start Server Selection [server] -->
## Server Selection

### Override Server URL Per-Client

The default server can be overridden globally by passing a URL to the `serverURL: string` optional parameter when initializing the SDK client instance. For example:
```typescript
import { Avalanche } from "@avalanche-sdk/metrics";

const avalanche = new Avalanche({
  serverURL: "https://metrics.avax.network",
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.metrics.healthCheck.metricsHealthCheck();

  // Handle the result
  console.log(result);
}

run();

```
<!-- End Server Selection [server] -->

<!-- Start Custom HTTP Client [http-client] -->
## Custom HTTP Client

The TypeScript SDK makes API calls using an `HTTPClient` that wraps the native
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This
client is a thin wrapper around `fetch` and provides the ability to attach hooks
around the request lifecycle that can be used to modify the request or handle
errors and response.

The `HTTPClient` constructor takes an optional `fetcher` argument that can be
used to integrate a third-party HTTP client or when writing tests to mock out
the HTTP client and feed in fixtures.

The following example shows how to use the `"beforeRequest"` hook to to add a
custom header and a timeout to requests and how to use the `"requestError"` hook
to log errors:

```typescript
import { Avalanche } from "@avalanche-sdk/metrics";
import { HTTPClient } from "@avalanche-sdk/metrics/lib/http";

const httpClient = new HTTPClient({
  // fetcher takes a function that has the same signature as native `fetch`.
  fetcher: (request) => {
    return fetch(request);
  }
});

httpClient.addHook("beforeRequest", (request) => {
  const nextRequest = new Request(request, {
    signal: request.signal || AbortSignal.timeout(5000)
  });

  nextRequest.headers.set("x-custom-header", "custom value");

  return nextRequest;
});

httpClient.addHook("requestError", (error, request) => {
  console.group("Request Error");
  console.log("Reason:", `${error}`);
  console.log("Endpoint:", `${request.method} ${request.url}`);
  console.groupEnd();
});

const sdk = new Avalanche({ httpClient });
```
<!-- End Custom HTTP Client [http-client] -->

<!-- Start Debugging [debug] -->
## Debugging

You can setup your SDK to emit debug logs for SDK requests and responses.

You can pass a logger that matches `console`'s interface as an SDK option.

> [!WARNING]
> Beware that debug logging will reveal secrets, like API tokens in headers, in log messages printed to a console or files. It's recommended to use this feature only during local development and not in production.

```typescript
import { Avalanche } from "@avalanche-sdk/metrics";

const sdk = new Avalanche({ debugLogger: console });
```
<!-- End Debugging [debug] -->

<!-- Placeholder for Future Speakeasy SDK Sections -->

# Development

## Maturity

This SDK is in beta, and there may be breaking changes between versions without a major version update. Therefore, we recommend pinning usage
to a specific package version. This way, you can install the same version each time without breaking changes unless you are intentionally
looking for the latest version.

## Contributions

While we value open-source contributions to this SDK, this library is generated programmatically. Any manual changes added to internal files will be overwritten on the next generation. 
We look forward to hearing your feedback. Feel free to open a PR or an issue with a proof of concept and we'll do our best to include it in a future release.