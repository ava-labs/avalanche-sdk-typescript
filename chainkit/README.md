<div align="center">
    <h1> @avalanche-sdk/chainkit </h1>
        <p>
            The Avalanche ChainKit SDK is a powerful and flexible toolset designed to simplify the integration with Avalanche's suite of blockchain services.
        </p>
        <p> 
            Currently, this SDK is focused on providing robust support for Data, Metrics and Webhooks APIs.  
        </p>
        <a href="https://developers.avacloud.io/data-api/overview">
            <img src="https://img.shields.io/static/v1?label=Docs&message=API Ref&color=3b6ef9&style=for-the-badge" />
        </a>
</div>

<!-- Start Summary [summary] -->
## Summary

Data, Metrics, and Webhooks API: The Avalanche API suite offers powerful tools for real-time and historical blockchain data. The Webhooks API enables instant monitoring of on-chain events, including smart contract activity, NFT transfers, and wallet transactions, with customizable filters and secure notifications. The Metrics API (Beta) provides analytics on blockchain activity, while the Data API (Beta) delivers multi-chain data for Avalanche and Ethereum, including transaction history, token balances, and metadata. These APIs empower developers to build dynamic web3 applications with real-time insights and seamless integration.
<!-- End Summary [summary] -->

<!-- Start Table of Contents [toc] -->
## Table of Contents
<!-- $toc-max-depth=2 -->
  * [SDK Installation](#sdk-installation)
  * [Requirements](#requirements)
  * [SDK Example Usage](#sdk-example-usage)
  * [Authentication](#authentication)
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

The SDK can be installed with either [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), [bun](https://bun.sh/) or [yarn](https://classic.yarnpkg.com/en/) package managers.

### NPM

```bash
npm add @avalanche-sdk/chainkit
```

### PNPM

```bash
pnpm add @avalanche-sdk/chainkit
```

### Bun

```bash
bun add @avalanche-sdk/chainkit
```

### Yarn

```bash
yarn add @avalanche-sdk/chainkit
```

> [!NOTE]
> This package is published with CommonJS and ES Modules (ESM) support.


### Model Context Protocol (MCP) Server

This SDK is also an installable MCP server where the various SDK methods are
exposed as tools that can be invoked by AI applications.

> Node.js v20 or greater is required to run the MCP server from npm.

<details>
<summary>Claude installation steps</summary>

Add the following server definition to your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "Avalanche": {
      "command": "npx",
      "args": [
        "-y", "--package", "@avalanche-sdk/chainkit",
        "--",
        "mcp", "start",
        "--api-key", "...",
        "--chain-id", "...",
        "--network", "...",
        "--enable-telemetry", "...",
        "--avacloud", "..."
      ]
    }
  }
}
```

</details>

<details>
<summary>Cursor installation steps</summary>

Create a `.cursor/mcp.json` file in your project root with the following content:

```json
{
  "mcpServers": {
    "Avalanche": {
      "command": "npx",
      "args": [
        "-y", "--package", "@avalanche-sdk/chainkit",
        "--",
        "mcp", "start",
        "--api-key", "...",
        "--chain-id", "...",
        "--network", "...",
        "--enable-telemetry", "...",
        "--avacloud", "..."
      ]
    }
  }
}
```

</details>

You can also run MCP servers as a standalone binary with no additional dependencies. You must pull these binaries from available Github releases:

```bash
curl -L -o mcp-server \
    https://github.com/{org}/{repo}/releases/download/{tag}/mcp-server-bun-darwin-arm64 && \
chmod +x mcp-server
```

If the repo is a private repo you must add your Github PAT to download a release `-H "Authorization: Bearer {GITHUB_PAT}"`.


```json
{
  "mcpServers": {
    "Todos": {
      "command": "./DOWNLOAD/PATH/mcp-server",
      "args": [
        "start"
      ]
    }
  }
}
```

For a full list of server arguments, run:

```sh
npx -y --package @avalanche-sdk/chainkit -- mcp start --help
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
import { Avalanche } from "@avalanche-sdk/chainkit";

const avalanche = new Avalanche();

async function run() {
  const result = await avalanche.webhooks.create({
    eventType: "address_activity",
    url: "https://sophisticated-exterior.org/",
    chainId: "<id>",
    metadata: {
      eventSignatures: [
        "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
      ],
      addresses: [
        "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      ],
    },
  });

  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->

<!-- Start Authentication [security] -->
## Authentication

### Per-Client Security Schemes

This SDK supports the following security scheme globally:

| Name     | Type   | Scheme  |
| -------- | ------ | ------- |
| `apiKey` | apiKey | API key |

To authenticate with the API the `apiKey` parameter must be set when initializing the SDK client instance. For example:
```typescript
import { Avalanche } from "@avalanche-sdk/chainkit";

const avalanche = new Avalanche({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const result = await avalanche.metrics.healthCheck();

  console.log(result);
}

run();

```
<!-- End Authentication [security] -->

<!-- Start Available Resources and Operations [operations] -->
## Available Resources and Operations

<details open>
<summary>Available methods</summary>

### [AVAXSupply](docs/sdks/avaxsupply/README.md)

* [get](docs/sdks/avaxsupply/README.md#get) - Get AVAX supply information

### [Data](docs/sdks/data/README.md)

* [healthCheck](docs/sdks/data/README.md#healthcheck) - Get the health of the service
* [liveCheck](docs/sdks/data/README.md#livecheck) - Get the liveliness of the service (reads only)

#### [Data.Evm.Address.Balances](docs/sdks/addressbalances/README.md)

* [getNative](docs/sdks/addressbalances/README.md#getnative) - Get native token balance
* [listErc20](docs/sdks/addressbalances/README.md#listerc20) - List ERC-20 balances
* [listErc721](docs/sdks/addressbalances/README.md#listerc721) - List ERC-721 balances
* [listErc1155](docs/sdks/addressbalances/README.md#listerc1155) - List ERC-1155 balances
* [listCollectibles](docs/sdks/addressbalances/README.md#listcollectibles) - List collectible (ERC-721/ERC-1155) balances

#### [Data.Evm.Address.Chains](docs/sdks/addresschains/README.md)

* [list](docs/sdks/addresschains/README.md#list) - List all chains associated with a given address

#### [Data.Evm.Address.Contracts](docs/sdks/addresscontracts/README.md)

* [listDeployments](docs/sdks/addresscontracts/README.md#listdeployments) - List deployed contracts

#### [Data.Evm.Address.Transactions](docs/sdks/addresstransactions/README.md)

* [list](docs/sdks/addresstransactions/README.md#list) - List transactions
* [listNative](docs/sdks/addresstransactions/README.md#listnative) - List native transactions
* [listErc20](docs/sdks/addresstransactions/README.md#listerc20) - List ERC-20 transfers
* [listErc721](docs/sdks/addresstransactions/README.md#listerc721) - List ERC-721 transfers
* [listErc1155](docs/sdks/addresstransactions/README.md#listerc1155) - List ERC-1155 transfers
* [listInternal](docs/sdks/addresstransactions/README.md#listinternal) - List internal transactions

#### [Data.Evm.Blocks](docs/sdks/evmblocks/README.md)

* [listLatestAllChains](docs/sdks/evmblocks/README.md#listlatestallchains) - List latest blocks across all supported EVM chains
* [listLatest](docs/sdks/evmblocks/README.md#listlatest) - List latest blocks
* [get](docs/sdks/evmblocks/README.md#get) - Get block
* [listTransactions](docs/sdks/evmblocks/README.md#listtransactions) - List transactions for a block

#### [Data.Evm.Chains](docs/sdks/evmchains/README.md)

* [list](docs/sdks/evmchains/README.md#list) - List chains
* [get](docs/sdks/evmchains/README.md#get) - Get chain information
* [~~getAddressChains~~](docs/sdks/evmchains/README.md#getaddresschains) - **[Deprecated]** Gets a list of all chains where the address was either a sender or receiver in a transaction or ERC transfer. The list is currently updated every 15 minutes.

⚠️ **This operation will be removed in a future release.  Please use /v1/address/:address/chains endpoint instead** . :warning: **Deprecated**
* [~~listAllLatestTransactions~~](docs/sdks/evmchains/README.md#listalllatesttransactions) - **[Deprecated]** Lists the latest transactions for all supported EVM chains. Filterable by status.

⚠️ **This operation will be removed in a future release.  Please use /v1/transactions endpoint instead** . :warning: **Deprecated**
* [~~listAllLatestBlocks~~](docs/sdks/evmchains/README.md#listalllatestblocks) - **[Deprecated]** Lists the latest blocks for all supported EVM chains. Filterable by network.

⚠️ **This operation will be removed in a future release.  Please use /v1/blocks endpoint instead** . :warning: **Deprecated**

#### [Data.Evm.Contracts](docs/sdks/contracts/README.md)

* [getDeploymentTransaction](docs/sdks/contracts/README.md#getdeploymenttransaction) - Get deployment transaction
* [getMetadata](docs/sdks/contracts/README.md#getmetadata) - Get contract metadata
* [listTransfers](docs/sdks/contracts/README.md#listtransfers) - List ERC transfers

#### [Data.Evm.Transactions](docs/sdks/evmtransactions/README.md)

* [listLatestAllChains](docs/sdks/evmtransactions/README.md#listlatestallchains) - List the latest transactions across all supported EVM chains
* [get](docs/sdks/evmtransactions/README.md#get) - Get transaction
* [listLatest](docs/sdks/evmtransactions/README.md#listlatest) - List latest transactions

#### [Data.Icm](docs/sdks/icm/README.md)

* [get](docs/sdks/icm/README.md#get) - Get an ICM message
* [list](docs/sdks/icm/README.md#list) - List ICM messages
* [listByAddress](docs/sdks/icm/README.md#listbyaddress) - List ICM messages by address

#### [Data.Nfts](docs/sdks/nfts/README.md)

* [reindex](docs/sdks/nfts/README.md#reindex) - Reindex NFT metadata
* [list](docs/sdks/nfts/README.md#list) - List tokens
* [get](docs/sdks/nfts/README.md#get) - Get token details

#### [Data.Operations](docs/sdks/operations/README.md)

* [getResult](docs/sdks/operations/README.md#getresult) - Get operation
* [exportTransactions](docs/sdks/operations/README.md#exporttransactions) - Create transaction export operation

#### [Data.PrimaryNetwork](docs/sdks/primarynetwork/README.md)

* [getAssetDetails](docs/sdks/primarynetwork/README.md#getassetdetails) - Get asset details
* [getChainIdsForAddresses](docs/sdks/primarynetwork/README.md#getchainidsforaddresses) - Get chain interactions for addresses
* [getNetworkDetails](docs/sdks/primarynetwork/README.md#getnetworkdetails) - Get network details
* [listBlockchains](docs/sdks/primarynetwork/README.md#listblockchains) - List blockchains
* [getBlockchainById](docs/sdks/primarynetwork/README.md#getblockchainbyid) - Get blockchain details by ID
* [listSubnets](docs/sdks/primarynetwork/README.md#listsubnets) - List subnets
* [getSubnetById](docs/sdks/primarynetwork/README.md#getsubnetbyid) - Get Subnet details by ID
* [listValidators](docs/sdks/primarynetwork/README.md#listvalidators) - List validators
* [getValidatorDetails](docs/sdks/primarynetwork/README.md#getvalidatordetails) - Get single validator details
* [listDelegators](docs/sdks/primarynetwork/README.md#listdelegators) - List delegators
* [listL1Validators](docs/sdks/primarynetwork/README.md#listl1validators) - List L1 validators

##### [Data.PrimaryNetwork.Balances](docs/sdks/primarynetworkbalances/README.md)

* [listByAddresses](docs/sdks/primarynetworkbalances/README.md#listbyaddresses) - Get balances

##### [Data.PrimaryNetwork.Blocks](docs/sdks/primarynetworkblocks/README.md)

* [get](docs/sdks/primarynetworkblocks/README.md#get) - Get block
* [listByNodeId](docs/sdks/primarynetworkblocks/README.md#listbynodeid) - List blocks proposed by node
* [listLatest](docs/sdks/primarynetworkblocks/README.md#listlatest) - List latest blocks

##### [Data.PrimaryNetwork.Rewards](docs/sdks/rewards/README.md)

* [listPendingRewards](docs/sdks/rewards/README.md#listpendingrewards) - List pending rewards
* [listHistoricalRewards](docs/sdks/rewards/README.md#listhistoricalrewards) - List historical rewards

##### [Data.PrimaryNetwork.Transactions](docs/sdks/primarynetworktransactions/README.md)

* [get](docs/sdks/primarynetworktransactions/README.md#get) - Get transaction
* [listLatest](docs/sdks/primarynetworktransactions/README.md#listlatest) - List latest transactions
* [listActiveStakingTransactions](docs/sdks/primarynetworktransactions/README.md#listactivestakingtransactions) - List staking transactions
* [listAssetTransactions](docs/sdks/primarynetworktransactions/README.md#listassettransactions) - List asset transactions

##### [Data.PrimaryNetwork.Utxos](docs/sdks/utxos/README.md)

* [listByAddresses](docs/sdks/utxos/README.md#listbyaddresses) - List UTXOs
* [listByAddressesV2](docs/sdks/utxos/README.md#listbyaddressesv2) - List UTXOs v2 - Supports querying for more addresses

##### [Data.PrimaryNetwork.Vertices](docs/sdks/vertices/README.md)

* [listLatest](docs/sdks/vertices/README.md#listlatest) - List vertices
* [getByHash](docs/sdks/vertices/README.md#getbyhash) - Get vertex
* [listByHeight](docs/sdks/vertices/README.md#listbyheight) - List vertices by height

#### [Data.SignatureAggregator](docs/sdks/signatureaggregator/README.md)

* [aggregate](docs/sdks/signatureaggregator/README.md#aggregate) - Aggregate Signatures
* [get](docs/sdks/signatureaggregator/README.md#get) - Get Aggregated Signatures

#### [~~Data.Teleporter~~](docs/sdks/teleporter/README.md)

* [~~getTeleporterMessage~~](docs/sdks/teleporter/README.md#getteleportermessage) - **[Deprecated]** Gets a teleporter message by message ID.

⚠️ **This operation will be removed in a future release.  Please use /v1/icm/messages/:messageId endpoint instead** . :warning: **Deprecated**
* [~~listTeleporterMessages~~](docs/sdks/teleporter/README.md#listteleportermessages) - **[Deprecated]** Lists teleporter messages. Ordered by timestamp in  descending order.

⚠️ **This operation will be removed in a future release.  Please use /v1/icm/messages endpoint instead** . :warning: **Deprecated**
* [~~listTeleporterMessagesByAddress~~](docs/sdks/teleporter/README.md#listteleportermessagesbyaddress) - **[Deprecated]** Lists teleporter messages by address. Ordered by  timestamp in descending order.

⚠️ **This operation will be removed in a future release.  Please use /v1/icm/addresses/:address/messages endpoint instead** . :warning: **Deprecated**

#### [Data.UsageMetrics](docs/sdks/usagemetrics/README.md)

* [getUsage](docs/sdks/usagemetrics/README.md#getusage) - Get usage metrics for the Data API
* [getLogs](docs/sdks/usagemetrics/README.md#getlogs) - Get logs for requests made by client
* [getSubnetRpcUsage](docs/sdks/usagemetrics/README.md#getsubnetrpcusage) - Get usage metrics for the Subnet RPC
* [~~getRpcUsageMetrics~~](docs/sdks/usagemetrics/README.md#getrpcusagemetrics) - **[Deprecated]**  Gets metrics for public Subnet RPC usage over a specified time interval aggregated at the specified time-duration granularity.

⚠️ **This operation will be removed in a future release.  Please use /v1/subnetRpcUsageMetrics endpoint instead**. :warning: **Deprecated**

### [Metrics](docs/sdks/metrics/README.md)

* [healthCheck](docs/sdks/metrics/README.md#healthcheck) - Get the health of the service
* [liveCheck](docs/sdks/metrics/README.md#livecheck) - Get the liveliness of the service

#### [Metrics.Chains](docs/sdks/metricschains/README.md)

* [list](docs/sdks/metricschains/README.md#list) - Get a list of supported blockchains
* [get](docs/sdks/metricschains/README.md#get) - Get chain information for supported blockchain
* [getMetrics](docs/sdks/metricschains/README.md#getmetrics) - Get metrics for EVM chains
* [getRollingWindowMetrics](docs/sdks/metricschains/README.md#getrollingwindowmetrics) - Get rolling window metrics for EVM chains
* [getICMTimeseries](docs/sdks/metricschains/README.md#geticmtimeseries) - Get ICM timeseries metrics
* [getICMSummary](docs/sdks/metricschains/README.md#geticmsummary) - Get ICM summary metrics
* [listNftHolders](docs/sdks/metricschains/README.md#listnftholders) - Get NFT holders by contract address
* [listTokenHoldersAboveThreshold](docs/sdks/metricschains/README.md#listtokenholdersabovethreshold) - Get addresses by balance over time
* [listBTCbBridgersAboveThreshold](docs/sdks/metricschains/README.md#listbtcbbridgersabovethreshold) - Get addresses by BTCb bridged balance

#### [Metrics.L1Validators](docs/sdks/l1validators/README.md)

* [listMetrics](docs/sdks/l1validators/README.md#listmetrics) - Get given metric for all validators
* [getMetricsByValidationId](docs/sdks/l1validators/README.md#getmetricsbyvalidationid) - Get metric values with given validationId and timestamp range
* [getMetricsByNodeId](docs/sdks/l1validators/README.md#getmetricsbynodeid) - Get metric values with given nodeId and timestamp range
* [getMetricsBySubnetId](docs/sdks/l1validators/README.md#getmetricsbysubnetid) - Get metric values with given subnetId and timestamp range

#### [Metrics.Networks](docs/sdks/networks/README.md)

* [getStakingMetrics](docs/sdks/networks/README.md#getstakingmetrics) - Get staking metrics for a given subnet

#### [Metrics.Subnets](docs/sdks/subnets/README.md)

* [getValidators](docs/sdks/subnets/README.md#getvalidators) - Get addresses running validators during a given time frame

### [Webhooks](docs/sdks/webhooks/README.md)

* [list](docs/sdks/webhooks/README.md#list) - List webhooks
* [create](docs/sdks/webhooks/README.md#create) - Create a webhook
* [get](docs/sdks/webhooks/README.md#get) - Get a webhook by ID
* [deactivate](docs/sdks/webhooks/README.md#deactivate) - Deactivate a webhook
* [update](docs/sdks/webhooks/README.md#update) - Update a webhook
* [generateOrRotateSharedSecret](docs/sdks/webhooks/README.md#generateorrotatesharedsecret) - Generate or rotate a shared secret
* [getSharedSecret](docs/sdks/webhooks/README.md#getsharedsecret) - Get a shared secret

#### [Webhooks.Addresses](docs/sdks/addresses/README.md)

* [list](docs/sdks/addresses/README.md#list) - List adresses by EVM activity webhooks
* [remove](docs/sdks/addresses/README.md#remove) - Remove addresses from EVM activity  webhook
* [add](docs/sdks/addresses/README.md#add) - Add addresses to EVM activity webhook

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

- [`avaxSupplyGet`](docs/sdks/avaxsupply/README.md#get) - Get AVAX supply information
- [`dataEvmAddressBalancesGetNative`](docs/sdks/addressbalances/README.md#getnative) - Get native token balance
- [`dataEvmAddressBalancesListCollectibles`](docs/sdks/addressbalances/README.md#listcollectibles) - List collectible (ERC-721/ERC-1155) balances
- [`dataEvmAddressBalancesListErc1155`](docs/sdks/addressbalances/README.md#listerc1155) - List ERC-1155 balances
- [`dataEvmAddressBalancesListErc20`](docs/sdks/addressbalances/README.md#listerc20) - List ERC-20 balances
- [`dataEvmAddressBalancesListErc721`](docs/sdks/addressbalances/README.md#listerc721) - List ERC-721 balances
- [`dataEvmAddressChainsList`](docs/sdks/addresschains/README.md#list) - List all chains associated with a given address
- [`dataEvmAddressContractsListDeployments`](docs/sdks/addresscontracts/README.md#listdeployments) - List deployed contracts
- [`dataEvmAddressTransactionsList`](docs/sdks/addresstransactions/README.md#list) - List transactions
- [`dataEvmAddressTransactionsListErc1155`](docs/sdks/addresstransactions/README.md#listerc1155) - List ERC-1155 transfers
- [`dataEvmAddressTransactionsListErc20`](docs/sdks/addresstransactions/README.md#listerc20) - List ERC-20 transfers
- [`dataEvmAddressTransactionsListErc721`](docs/sdks/addresstransactions/README.md#listerc721) - List ERC-721 transfers
- [`dataEvmAddressTransactionsListInternal`](docs/sdks/addresstransactions/README.md#listinternal) - List internal transactions
- [`dataEvmAddressTransactionsListNative`](docs/sdks/addresstransactions/README.md#listnative) - List native transactions
- [`dataEvmBlocksGet`](docs/sdks/evmblocks/README.md#get) - Get block
- [`dataEvmBlocksListLatest`](docs/sdks/evmblocks/README.md#listlatest) - List latest blocks
- [`dataEvmBlocksListLatestAllChains`](docs/sdks/evmblocks/README.md#listlatestallchains) - List latest blocks across all supported EVM chains
- [`dataEvmBlocksListTransactions`](docs/sdks/evmblocks/README.md#listtransactions) - List transactions for a block
- [`dataEvmChainsGet`](docs/sdks/evmchains/README.md#get) - Get chain information
- [`dataEvmChainsList`](docs/sdks/evmchains/README.md#list) - List chains
- [`dataEvmContractsGetDeploymentTransaction`](docs/sdks/contracts/README.md#getdeploymenttransaction) - Get deployment transaction
- [`dataEvmContractsGetMetadata`](docs/sdks/contracts/README.md#getmetadata) - Get contract metadata
- [`dataEvmContractsListTransfers`](docs/sdks/contracts/README.md#listtransfers) - List ERC transfers
- [`dataEvmTransactionsGet`](docs/sdks/evmtransactions/README.md#get) - Get transaction
- [`dataEvmTransactionsListLatest`](docs/sdks/evmtransactions/README.md#listlatest) - List latest transactions
- [`dataEvmTransactionsListLatestAllChains`](docs/sdks/evmtransactions/README.md#listlatestallchains) - List the latest transactions across all supported EVM chains
- [`dataHealthCheck`](docs/sdks/data/README.md#healthcheck) - Get the health of the service
- [`dataIcmGet`](docs/sdks/icm/README.md#get) - Get an ICM message
- [`dataIcmList`](docs/sdks/icm/README.md#list) - List ICM messages
- [`dataIcmListByAddress`](docs/sdks/icm/README.md#listbyaddress) - List ICM messages by address
- [`dataLiveCheck`](docs/sdks/data/README.md#livecheck) - Get the liveliness of the service (reads only)
- [`dataNftsGet`](docs/sdks/nfts/README.md#get) - Get token details
- [`dataNftsList`](docs/sdks/nfts/README.md#list) - List tokens
- [`dataNftsReindex`](docs/sdks/nfts/README.md#reindex) - Reindex NFT metadata
- [`dataOperationsExportTransactions`](docs/sdks/operations/README.md#exporttransactions) - Create transaction export operation
- [`dataOperationsGetResult`](docs/sdks/operations/README.md#getresult) - Get operation
- [`dataPrimaryNetworkBalancesListByAddresses`](docs/sdks/primarynetworkbalances/README.md#listbyaddresses) - Get balances
- [`dataPrimaryNetworkBlocksGet`](docs/sdks/primarynetworkblocks/README.md#get) - Get block
- [`dataPrimaryNetworkBlocksListByNodeId`](docs/sdks/primarynetworkblocks/README.md#listbynodeid) - List blocks proposed by node
- [`dataPrimaryNetworkBlocksListLatest`](docs/sdks/primarynetworkblocks/README.md#listlatest) - List latest blocks
- [`dataPrimaryNetworkGetAssetDetails`](docs/sdks/primarynetwork/README.md#getassetdetails) - Get asset details
- [`dataPrimaryNetworkGetBlockchainById`](docs/sdks/primarynetwork/README.md#getblockchainbyid) - Get blockchain details by ID
- [`dataPrimaryNetworkGetChainIdsForAddresses`](docs/sdks/primarynetwork/README.md#getchainidsforaddresses) - Get chain interactions for addresses
- [`dataPrimaryNetworkGetNetworkDetails`](docs/sdks/primarynetwork/README.md#getnetworkdetails) - Get network details
- [`dataPrimaryNetworkGetSubnetById`](docs/sdks/primarynetwork/README.md#getsubnetbyid) - Get Subnet details by ID
- [`dataPrimaryNetworkGetValidatorDetails`](docs/sdks/primarynetwork/README.md#getvalidatordetails) - Get single validator details
- [`dataPrimaryNetworkListBlockchains`](docs/sdks/primarynetwork/README.md#listblockchains) - List blockchains
- [`dataPrimaryNetworkListDelegators`](docs/sdks/primarynetwork/README.md#listdelegators) - List delegators
- [`dataPrimaryNetworkListL1Validators`](docs/sdks/primarynetwork/README.md#listl1validators) - List L1 validators
- [`dataPrimaryNetworkListSubnets`](docs/sdks/primarynetwork/README.md#listsubnets) - List subnets
- [`dataPrimaryNetworkListValidators`](docs/sdks/primarynetwork/README.md#listvalidators) - List validators
- [`dataPrimaryNetworkRewardsListHistoricalRewards`](docs/sdks/rewards/README.md#listhistoricalrewards) - List historical rewards
- [`dataPrimaryNetworkRewardsListPendingRewards`](docs/sdks/rewards/README.md#listpendingrewards) - List pending rewards
- [`dataPrimaryNetworkTransactionsGet`](docs/sdks/primarynetworktransactions/README.md#get) - Get transaction
- [`dataPrimaryNetworkTransactionsListActiveStakingTransactions`](docs/sdks/primarynetworktransactions/README.md#listactivestakingtransactions) - List staking transactions
- [`dataPrimaryNetworkTransactionsListAssetTransactions`](docs/sdks/primarynetworktransactions/README.md#listassettransactions) - List asset transactions
- [`dataPrimaryNetworkTransactionsListLatest`](docs/sdks/primarynetworktransactions/README.md#listlatest) - List latest transactions
- [`dataPrimaryNetworkUtxosListByAddresses`](docs/sdks/utxos/README.md#listbyaddresses) - List UTXOs
- [`dataPrimaryNetworkUtxosListByAddressesV2`](docs/sdks/utxos/README.md#listbyaddressesv2) - List UTXOs v2 - Supports querying for more addresses
- [`dataPrimaryNetworkVerticesGetByHash`](docs/sdks/vertices/README.md#getbyhash) - Get vertex
- [`dataPrimaryNetworkVerticesListByHeight`](docs/sdks/vertices/README.md#listbyheight) - List vertices by height
- [`dataPrimaryNetworkVerticesListLatest`](docs/sdks/vertices/README.md#listlatest) - List vertices
- [`dataSignatureAggregatorAggregate`](docs/sdks/signatureaggregator/README.md#aggregate) - Aggregate Signatures
- [`dataSignatureAggregatorGet`](docs/sdks/signatureaggregator/README.md#get) - Get Aggregated Signatures
- [`dataUsageMetricsGetLogs`](docs/sdks/usagemetrics/README.md#getlogs) - Get logs for requests made by client
- [`dataUsageMetricsGetSubnetRpcUsage`](docs/sdks/usagemetrics/README.md#getsubnetrpcusage) - Get usage metrics for the Subnet RPC
- [`dataUsageMetricsGetUsage`](docs/sdks/usagemetrics/README.md#getusage) - Get usage metrics for the Data API
- [`metricsChainsGet`](docs/sdks/metricschains/README.md#get) - Get chain information for supported blockchain
- [`metricsChainsGetICMSummary`](docs/sdks/metricschains/README.md#geticmsummary) - Get ICM summary metrics
- [`metricsChainsGetICMTimeseries`](docs/sdks/metricschains/README.md#geticmtimeseries) - Get ICM timeseries metrics
- [`metricsChainsGetMetrics`](docs/sdks/metricschains/README.md#getmetrics) - Get metrics for EVM chains
- [`metricsChainsGetRollingWindowMetrics`](docs/sdks/metricschains/README.md#getrollingwindowmetrics) - Get rolling window metrics for EVM chains
- [`metricsChainsList`](docs/sdks/metricschains/README.md#list) - Get a list of supported blockchains
- [`metricsChainsListBTCbBridgersAboveThreshold`](docs/sdks/metricschains/README.md#listbtcbbridgersabovethreshold) - Get addresses by BTCb bridged balance
- [`metricsChainsListNftHolders`](docs/sdks/metricschains/README.md#listnftholders) - Get NFT holders by contract address
- [`metricsChainsListTokenHoldersAboveThreshold`](docs/sdks/metricschains/README.md#listtokenholdersabovethreshold) - Get addresses by balance over time
- [`metricsHealthCheck`](docs/sdks/metrics/README.md#healthcheck) - Get the health of the service
- [`metricsL1ValidatorsGetMetricsByNodeId`](docs/sdks/l1validators/README.md#getmetricsbynodeid) - Get metric values with given nodeId and timestamp range
- [`metricsL1ValidatorsGetMetricsBySubnetId`](docs/sdks/l1validators/README.md#getmetricsbysubnetid) - Get metric values with given subnetId and timestamp range
- [`metricsL1ValidatorsGetMetricsByValidationId`](docs/sdks/l1validators/README.md#getmetricsbyvalidationid) - Get metric values with given validationId and timestamp range
- [`metricsL1ValidatorsListMetrics`](docs/sdks/l1validators/README.md#listmetrics) - Get given metric for all validators
- [`metricsLiveCheck`](docs/sdks/metrics/README.md#livecheck) - Get the liveliness of the service
- [`metricsNetworksGetStakingMetrics`](docs/sdks/networks/README.md#getstakingmetrics) - Get staking metrics for a given subnet
- [`metricsSubnetsGetValidators`](docs/sdks/subnets/README.md#getvalidators) - Get addresses running validators during a given time frame
- [`webhooksAddressesAdd`](docs/sdks/addresses/README.md#add) - Add addresses to EVM activity webhook
- [`webhooksAddressesList`](docs/sdks/addresses/README.md#list) - List adresses by EVM activity webhooks
- [`webhooksAddressesRemove`](docs/sdks/addresses/README.md#remove) - Remove addresses from EVM activity  webhook
- [`webhooksCreate`](docs/sdks/webhooks/README.md#create) - Create a webhook
- [`webhooksDeactivate`](docs/sdks/webhooks/README.md#deactivate) - Deactivate a webhook
- [`webhooksGenerateOrRotateSharedSecret`](docs/sdks/webhooks/README.md#generateorrotatesharedsecret) - Generate or rotate a shared secret
- [`webhooksGet`](docs/sdks/webhooks/README.md#get) - Get a webhook by ID
- [`webhooksGetSharedSecret`](docs/sdks/webhooks/README.md#getsharedsecret) - Get a shared secret
- [`webhooksList`](docs/sdks/webhooks/README.md#list) - List webhooks
- [`webhooksUpdate`](docs/sdks/webhooks/README.md#update) - Update a webhook
- ~~[`dataEvmChainsGetAddressChains`](docs/sdks/evmchains/README.md#getaddresschains)~~ - **[Deprecated]** Gets a list of all chains where the address was either a sender or receiver in a transaction or ERC transfer. The list is currently updated every 15 minutes.

⚠️ **This operation will be removed in a future release.  Please use /v1/address/:address/chains endpoint instead** . :warning: **Deprecated**
- ~~[`dataEvmChainsListAllLatestBlocks`](docs/sdks/evmchains/README.md#listalllatestblocks)~~ - **[Deprecated]** Lists the latest blocks for all supported EVM chains. Filterable by network.

⚠️ **This operation will be removed in a future release.  Please use /v1/blocks endpoint instead** . :warning: **Deprecated**
- ~~[`dataEvmChainsListAllLatestTransactions`](docs/sdks/evmchains/README.md#listalllatesttransactions)~~ - **[Deprecated]** Lists the latest transactions for all supported EVM chains. Filterable by status.

⚠️ **This operation will be removed in a future release.  Please use /v1/transactions endpoint instead** . :warning: **Deprecated**
- ~~[`dataTeleporterGetTeleporterMessage`](docs/sdks/teleporter/README.md#getteleportermessage)~~ - **[Deprecated]** Gets a teleporter message by message ID.

⚠️ **This operation will be removed in a future release.  Please use /v1/icm/messages/:messageId endpoint instead** . :warning: **Deprecated**
- ~~[`dataTeleporterListTeleporterMessages`](docs/sdks/teleporter/README.md#listteleportermessages)~~ - **[Deprecated]** Lists teleporter messages. Ordered by timestamp in  descending order.

⚠️ **This operation will be removed in a future release.  Please use /v1/icm/messages endpoint instead** . :warning: **Deprecated**
- ~~[`dataTeleporterListTeleporterMessagesByAddress`](docs/sdks/teleporter/README.md#listteleportermessagesbyaddress)~~ - **[Deprecated]** Lists teleporter messages by address. Ordered by  timestamp in descending order.

⚠️ **This operation will be removed in a future release.  Please use /v1/icm/addresses/:address/messages endpoint instead** . :warning: **Deprecated**
- ~~[`dataUsageMetricsGetRpcUsageMetrics`](docs/sdks/usagemetrics/README.md#getrpcusagemetrics)~~ - **[Deprecated]**  Gets metrics for public Subnet RPC usage over a specified time interval aggregated at the specified time-duration granularity.

⚠️ **This operation will be removed in a future release.  Please use /v1/subnetRpcUsageMetrics endpoint instead**. :warning: **Deprecated**

</details>
<!-- End Standalone functions [standalone-funcs] -->

<!-- Start Global Parameters [global-parameters] -->
## Global Parameters

Certain parameters are configured globally. These parameters may be set on the SDK client instance itself during initialization. When configured as an option during SDK initialization, These global values will be used as defaults on the operations that use them. When such operations are called, there is a place in each to override the global value, if needed.

For example, you can set `chainId` to `"43114"` at SDK initialization and then you do not have to pass the same value on calls to operations like `list`. But if you want to do so you may, which will locally override the global setting. See the example code below for a demonstration.


### Available Globals

The following global parameters are available.

| Name            | Type                          | Description                                              |
| --------------- | ----------------------------- | -------------------------------------------------------- |
| chainId         | string                        | A supported EVM chain id, chain alias, or blockchain id. |
| network         | components.GlobalParamNetwork | A supported network type mainnet or testnet/fuji.        |
| enableTelemetry | boolean                       | A flag to enable or disable telemetry                    |
| avacloud        | boolean                       | A flag to use represent a avacloud api key holder        |

### Example

```typescript
import { Avalanche } from "@avalanche-sdk/chainkit";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
  enableTelemetry: false,
  avacloud: true,
});

async function run() {
  const result = await avalanche.metrics.chains.list({
    network: "mainnet",
  });

  for await (const page of result) {
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
import { Avalanche } from "@avalanche-sdk/chainkit";

const avalanche = new Avalanche();

async function run() {
  const result = await avalanche.metrics.chains.list({
    network: "mainnet",
  });

  for await (const page of result) {
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
import { Avalanche } from "@avalanche-sdk/chainkit";

const avalanche = new Avalanche();

async function run() {
  const result = await avalanche.metrics.healthCheck({
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

  console.log(result);
}

run();

```

If you'd like to override the default retry strategy for all operations that support retries, you can provide a retryConfig at SDK initialization:
```typescript
import { Avalanche } from "@avalanche-sdk/chainkit";

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
});

async function run() {
  const result = await avalanche.metrics.healthCheck();

  console.log(result);
}

run();

```
<!-- End Retries [retries] -->

<!-- Start Error Handling [errors] -->
## Error Handling

[`AvalancheError`](./src/models/errors/avalancheerror.ts) is the base class for all HTTP error responses. It has the following properties:

| Property            | Type       | Description                                                                             |
| ------------------- | ---------- | --------------------------------------------------------------------------------------- |
| `error.message`     | `string`   | Error message                                                                           |
| `error.statusCode`  | `number`   | HTTP response status code eg `404`                                                      |
| `error.headers`     | `Headers`  | HTTP response headers                                                                   |
| `error.body`        | `string`   | HTTP body. Can be empty string if no body is returned.                                  |
| `error.rawResponse` | `Response` | Raw HTTP response                                                                       |
| `error.data$`       |            | Optional. Some errors may contain structured data. [See Error Classes](#error-classes). |

### Example
```typescript
import { Avalanche } from "@avalanche-sdk/chainkit";
import * as errors from "@avalanche-sdk/chainkit/models/errors";

const avalanche = new Avalanche({
  chainId: "43114",
});

async function run() {
  try {
    await avalanche.data.nfts.reindex({
      address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      tokenId: "145",
    });
  } catch (error) {
    // The base class for HTTP error responses
    if (error instanceof errors.AvalancheError) {
      console.log(error.message);
      console.log(error.statusCode);
      console.log(error.body);
      console.log(error.headers);

      // Depending on the method different errors may be thrown
      if (error instanceof errors.BadRequestError) {
        console.log(error.data$.message); // errors.BadRequestMessage
        console.log(error.data$.statusCode); // number
        console.log(error.data$.error); // string
      }
    }
  }
}

run();

```

### Error Classes
**Primary errors:**
* [`AvalancheError`](./src/models/errors/avalancheerror.ts): The base class for HTTP error responses.
  * [`BadRequestError`](./src/models/errors/badrequesterror.ts): Bad requests generally mean the client has passed invalid      or malformed parameters. Error messages in the response could help in      evaluating the error. Status code `400`.
  * [`UnauthorizedError`](./src/models/errors/unauthorizederror.ts): When a client attempts to access resources that require      authorization credentials but the client lacks proper authentication      in the request, the server responds with 401. Status code `401`.
  * [`ForbiddenError`](./src/models/errors/forbiddenerror.ts): When a client attempts to access resources with valid     credentials but doesn't have the privilege to perform that action,      the server responds with 403. Status code `403`.
  * [`NotFoundError`](./src/models/errors/notfounderror.ts): The error is mostly returned when the client requests     with either mistyped URL, or the passed resource is moved or deleted,      or the resource doesn't exist. Status code `404`.
  * [`TooManyRequestsError`](./src/models/errors/toomanyrequestserror.ts): This error is returned when the client has sent too many,     and has hit the rate limit. Status code `429`.
  * [`InternalServerError`](./src/models/errors/internalservererror.ts): The error is a generic server side error that is      returned for any uncaught and unexpected issues on the server side.      This should be very rare, and you may reach out to us if the problem      persists for a longer duration. Status code `500`.
  * [`BadGatewayError`](./src/models/errors/badgatewayerror.ts): This is an internal error indicating invalid response        received by the client-facing proxy or gateway from the upstream server. Status code `502`.
  * [`ServiceUnavailableError`](./src/models/errors/serviceunavailableerror.ts): The error is returned for certain routes on a particular     Subnet. This indicates an internal problem with our Subnet node, and may      not necessarily mean the Subnet is down or affected. Status code `503`.

<details><summary>Less common errors (6)</summary>

<br />

**Network errors:**
* [`ConnectionError`](./src/models/errors/httpclienterrors.ts): HTTP client was unable to make a request to a server.
* [`RequestTimeoutError`](./src/models/errors/httpclienterrors.ts): HTTP request timed out due to an AbortSignal signal.
* [`RequestAbortedError`](./src/models/errors/httpclienterrors.ts): HTTP request was aborted by the client.
* [`InvalidRequestError`](./src/models/errors/httpclienterrors.ts): Any input used to create a request is invalid.
* [`UnexpectedClientError`](./src/models/errors/httpclienterrors.ts): Unrecognised or unexpected error.


**Inherit from [`AvalancheError`](./src/models/errors/avalancheerror.ts)**:
* [`ResponseValidationError`](./src/models/errors/responsevalidationerror.ts): Type mismatch between the data returned from the server and the structure expected by the SDK. See `error.rawValue` for the raw value and `error.pretty()` for a nicely formatted multi-line string.

</details>
<!-- End Error Handling [errors] -->

<!-- Start Server Selection [server] -->
## Server Selection

### Override Server URL Per-Client

The default server can be overridden globally by passing a URL to the `serverURL: string` optional parameter when initializing the SDK client instance. For example:
```typescript
import { Avalanche } from "@avalanche-sdk/chainkit";

const avalanche = new Avalanche({
  serverURL: "https://data-api.avax.network",
});

async function run() {
  const result = await avalanche.metrics.healthCheck();

  console.log(result);
}

run();

```

### Override Server URL Per-Operation

The server URL can also be overridden on a per-operation basis, provided a server list was specified for the operation. For example:
```typescript
import { Avalanche } from "@avalanche-sdk/chainkit";

const avalanche = new Avalanche();

async function run() {
  const result = await avalanche.metrics.healthCheck({
    serverURL: "https://metrics.avax.network",
  });

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
import { Avalanche } from "@avalanche-sdk/chainkit";
import { HTTPClient } from "@avalanche-sdk/chainkit/lib/http";

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

const sdk = new Avalanche({ httpClient: httpClient });
```
<!-- End Custom HTTP Client [http-client] -->

<!-- Start Debugging [debug] -->
## Debugging

You can setup your SDK to emit debug logs for SDK requests and responses.

You can pass a logger that matches `console`'s interface as an SDK option.

> [!WARNING]
> Beware that debug logging will reveal secrets, like API tokens in headers, in log messages printed to a console or files. It's recommended to use this feature only during local development and not in production.

```typescript
import { Avalanche } from "@avalanche-sdk/chainkit";

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

[for-await-of]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
