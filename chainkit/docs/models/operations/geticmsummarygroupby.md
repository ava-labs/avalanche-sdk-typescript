# GetICMSummaryGroupBy

Group results by srcBlockchainId, destBlockchainId, or both (comma-separated)

## Example Usage

```typescript
import { GetICMSummaryGroupBy } from "@avalanche-sdk/chainkit/models/operations";

let value: GetICMSummaryGroupBy = "destBlockchainId";
```

## Values

```typescript
"srcBlockchainId" | "destBlockchainId" | "srcBlockchainId,destBlockchainId"
```