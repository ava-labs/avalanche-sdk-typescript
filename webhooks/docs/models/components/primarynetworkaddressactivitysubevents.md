# PrimaryNetworkAddressActivitySubEvents

## Example Usage

```typescript
import { PrimaryNetworkAddressActivitySubEvents } from "@avalanche-sdk/webhooks/models/components";

let value: PrimaryNetworkAddressActivitySubEvents = {
  addressActivitySubEvents: [
    "balance_threshold",
  ],
};
```

## Fields

| Field                                                                                                                          | Type                                                                                                                           | Required                                                                                                                       | Description                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `addressActivitySubEvents`                                                                                                     | [components.PrimaryNetworkAddressActivitySubEventType](../../models/components/primarynetworkaddressactivitysubeventtype.md)[] | :heavy_check_mark:                                                                                                             | N/A                                                                                                                            |