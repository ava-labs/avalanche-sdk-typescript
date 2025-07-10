import {
  Account,
  Address,
  Chain,
  Client,
  ClientConfig,
  createClient,
  CreatePublicClientErrorType,
  ParseAccount,
  Prettify,
  RpcSchema,
  Transport,
} from "viem";

export type Extended = Prettify<
  // disallow redefining base properties
  { [_ in keyof Client]?: undefined } & {
    [key: string]: unknown;
  }
>;

export type AvalancheBaseClientConfig<
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

export type AvalancheBaseClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  extended extends Extended | undefined = Extended | undefined
> = Prettify<
  Omit<Client<transport, chain, account, rpcSchema, extended>, "extend"> &
    (extended extends Extended ? extended : unknown) & {
      extend: <const client extends Extended>(
        fn: (
          client: AvalancheBaseClient<
            transport,
            chain,
            account,
            rpcSchema,
            extended
          >
        ) => client
      ) => AvalancheBaseClient<
        transport,
        chain,
        account,
        rpcSchema,
        Prettify<client> & (extended extends Extended ? extended : unknown)
      >;
    }
>;

export type CreateAvalancheBaseClientErrorType = CreatePublicClientErrorType;

export function createAvalancheBaseClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  extended extends Extended | undefined = Extended | undefined
>(
  parameters: AvalancheBaseClientConfig<
    transport,
    chain,
    accountOrAddress,
    rpcSchema
  >
): AvalancheBaseClient<
  transport,
  chain,
  ParseAccount<accountOrAddress>,
  rpcSchema,
  extended
> {
  const { key = "avalancheBase", name = "Avalanche Base Client" } = parameters;
  const client = createClient({
    ...parameters,
    key,
    name,
    type: "avalancheClient",
  });

  function extend(base: typeof client) {
    type ExtendFn = (base: typeof client) => unknown;
    return (extendFn: ExtendFn) => {
      const extended = extendFn(base) as Extended;
      for (const key in client) delete extended[key];
      const combined = { ...base, ...extended };
      return Object.assign(combined, { extend: extend(combined as any) });
    };
  }

  return Object.assign(client, { extend: extend(client) as any }) as any;
}
