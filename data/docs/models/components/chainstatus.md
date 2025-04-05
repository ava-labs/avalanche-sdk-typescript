# ChainStatus

Status of chain nodes. Chain nodes can become temporarily `UNAVAILABLE` for several reasons, such as validator stake falling below threshold. If chain nodes are `UNAVAILABLE`, requests that rely on data from the chain nodes may return 503 errors.

## Example Usage

```typescript
import { ChainStatus } from "@avalanche-sdk/data/models/components";

let value: ChainStatus = "UNAVAILABLE";
```

## Values

```typescript
"OK" | "UNAVAILABLE"
```