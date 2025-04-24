import {
  Transport,
  Chain,
  Account,
  Address,
  RpcSchema,
  Prettify,
  ClientConfig,
  Client,
  ParseAccount,
  createClient,
  CreatePublicClientErrorType,
} from "viem";

export type Extended = Prettify<
  // disallow redefining base properties
  { [_ in keyof Client]?: undefined } & {
    [key: string]: unknown
  }
>

export type AvalancheCoreClientConfig<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined
> = Prettify<
  Pick<
    ClientConfig<transport, chain, accountOrAddress, rpcSchema>,
    | "batch"
    | "cacheTime"
    | "ccipRead"
    | "chain"
    | "key"
    | "name"
    | "pollingInterval"
    | "rpcSchema"
    | "transport"
  >
>;

export type AvalancheCoreClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  extended extends Extended | undefined = Extended | undefined,
> = Prettify<
  Omit<
    Client<
      transport,
      chain,
      account,
      rpcSchema extends RpcSchema ? [...rpcSchema] : rpcSchema,
      extended
    >,
    "extend"
  > & (extended extends Extended ? extended : unknown) & {
    extend: <const client extends Extended>(
      fn: (
        client: AvalancheCoreClient<transport, chain, account, rpcSchema, extended>
      ) => client
    ) => AvalancheCoreClient<
      transport,
      chain,
      account,
      rpcSchema,
      Prettify<client> & (extended extends Extended ? extended : unknown)
    >;
  }
>;

export type CreateAvalancheCoreClientErrorType = CreatePublicClientErrorType;

export function createAvalancheCoreClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined
>(
  parameters: AvalancheCoreClientConfig<transport, chain, accountOrAddress, rpcSchema>
): AvalancheCoreClient<transport, chain, ParseAccount<accountOrAddress>, rpcSchema> {
  const { key = "avalancheCore", name = "Avalanche Core Client" } = parameters;
  const client = createClient({
    ...parameters,
    key,
    name,
    type: "avalancheClient",
  });

  function extend(base: typeof client) {
    type ExtendFn = (base: typeof client) => unknown
    return (extendFn: ExtendFn) => {
      const extended = extendFn(base) as Extended
      for (const key in client) delete extended[key]
      const combined = { ...base, ...extended }
      return Object.assign(combined, { extend: extend(combined as any) })
    }
  }

  return Object.assign(client, { extend: extend(client) as any }) as any;
}
