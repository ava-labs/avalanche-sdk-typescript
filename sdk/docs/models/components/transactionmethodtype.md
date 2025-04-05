# TransactionMethodType

The contract call type. NATIVE_TRANSFER indicates a transfer of the native token without any smart-contract interaction. CONTRACT_CALL indicates a smart-contract interaction. CONTRACT_CREATION indicates a smart-contract creation.

## Example Usage

```typescript
import { TransactionMethodType } from "@avalanche-sdk/sdk/models/components";

let value: TransactionMethodType = "NATIVE_TRANSFER";
```

## Values

```typescript
"NATIVE_TRANSFER" | "CONTRACT_CALL" | "CONTRACT_CREATION"
```