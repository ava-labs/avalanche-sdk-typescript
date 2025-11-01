# GetICMTimeseriesGroupBy

Group results by srcBlockchainId, destBlockchainId, or both (comma-separated)

## Example Usage

```typescript
import { GetICMTimeseriesGroupBy } from "@avalanche-sdk/chainkit/models/operations";

let value: GetICMTimeseriesGroupBy = "destBlockchainId";
```

## Values

```typescript
"srcBlockchainId" | "destBlockchainId" | "srcBlockchainId,destBlockchainId"
```