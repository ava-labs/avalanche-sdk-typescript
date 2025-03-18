# PlatformActivitySubEvents

## Example Usage

```typescript
import { PlatformActivitySubEvents } from "@avalanche-sdk/webhooks/models/components";

let value: PlatformActivitySubEvents = {};
```

## Fields

| Field                                                                                                              | Type                                                                                                               | Required                                                                                                           | Description                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `validatorActivitySubEvents`                                                                                       | [components.ValidatorActivitySubEvent](../../models/components/validatoractivitysubevent.md)[]                     | :heavy_minus_sign:                                                                                                 | Array of validator activity sub-event types                                                                        |
| `addressActivitySubEvents`                                                                                         | [components.PlatformAddressActivitySubEventType](../../models/components/platformaddressactivitysubeventtype.md)[] | :heavy_minus_sign:                                                                                                 | N/A                                                                                                                |