import {
  Account,
  Address,
  Chain,
  Client,
  Prettify,
  PublicActions,
  PublicRpcSchema,
  RpcSchema,
  Transport,
} from "viem";
import { AdminRpcSchema } from "../../methods/admin/adminRpcSchema.js";
import { CChainRpcSchema } from "../../methods/cChain/cChainRpcSchema.js";
import { HealthRpcSchema } from "../../methods/health/healthRpcSchema.js";
import { IndexRpcSchema } from "../../methods/index/indexRpcSchema.js";
import { InfoRpcSchema } from "../../methods/info/infoRpcSchema.js";
import { PChainRpcSchema } from "../../methods/pChain/pChainRpcSchema.js";
import { ProposervmRpcSchema } from "../../methods/proposervm/proposervmRpcSchema.js";
import { AvalanchePublicRpcSchema } from "../../methods/public/avalanchePublicRpcSchema.js";
import { XChainRpcSchema } from "../../methods/xChain/xChainRpcSchema.js";
import {
  AvalancheCoreClient,
  AvalancheCoreClientConfig,
  CreateAvalancheCoreClientErrorType,
} from "../createAvalancheCoreClient.js";
import { AdminAPIActions } from "../decorators/adminApi.js";
import { AvalanchePublicActions } from "../decorators/avalanchePublic.js";
import { CChainActions } from "../decorators/cChain.js";
import { HealthAPIActions } from "../decorators/healthApi.js";
import { IndexAPIActions } from "../decorators/indexApi.js";
import { InfoAPIActions } from "../decorators/infoApi.js";
import { PChainActions } from "../decorators/pChain.js";
import { ProposervmAPIActions } from "../decorators/proposervmApi.js";
import { XChainActions } from "../decorators/xChain.js";

export type AvalancheClientConfig<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
> = Prettify<
  Omit<
    AvalancheCoreClientConfig<
      transport,
      chain,
      accountOrAddress,
      rpcSchema,
      raw
    >,
    "clientType"
  >
>;

export type AvalancheClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | undefined = undefined
> = Prettify<
  Client<
    transport,
    chain,
    accountOrAddress,
    AvalanchePublicRpcSchema & PublicRpcSchema,
    AvalanchePublicActions & PublicActions
  > &
    (chain extends { name: "Avalanche" | "Avalanche Fuji" }
      ? {
          pChain: AvalancheCoreClient<
            transport,
            chain,
            accountOrAddress,
            PChainRpcSchema,
            PChainActions
          >;

          cChain: AvalancheCoreClient<
            transport,
            chain,
            accountOrAddress,
            CChainRpcSchema,
            CChainActions
          >;

          xChain: AvalancheCoreClient<
            transport,
            chain,
            accountOrAddress,
            XChainRpcSchema,
            XChainActions
          >;

          admin: AvalancheCoreClient<
            transport,
            chain,
            accountOrAddress,
            AdminRpcSchema,
            AdminAPIActions
          >;

          info: AvalancheCoreClient<
            transport,
            chain,
            accountOrAddress,
            InfoRpcSchema,
            InfoAPIActions
          >;

          health: AvalancheCoreClient<
            transport,
            chain,
            accountOrAddress,
            HealthRpcSchema,
            HealthAPIActions
          >;

          proposervm: {
            cChain: AvalancheCoreClient<
              transport,
              chain,
              accountOrAddress,
              ProposervmRpcSchema,
              ProposervmAPIActions
            >;
            pChain: AvalancheCoreClient<
              transport,
              chain,
              accountOrAddress,
              ProposervmRpcSchema,
              ProposervmAPIActions
            >;
            xChain: AvalancheCoreClient<
              transport,
              chain,
              accountOrAddress,
              ProposervmRpcSchema,
              ProposervmAPIActions
            >;
          };

          indexBlock: {
            pChain: AvalancheCoreClient<
              transport,
              chain,
              accountOrAddress,
              IndexRpcSchema,
              IndexAPIActions
            >;
            cChain: AvalancheCoreClient<
              transport,
              chain,
              accountOrAddress,
              IndexRpcSchema,
              IndexAPIActions
            >;
            xChain: AvalancheCoreClient<
              transport,
              chain,
              accountOrAddress,
              IndexRpcSchema,
              IndexAPIActions
            >;
          };

          indexTx: {
            xChain: AvalancheCoreClient<
              transport,
              chain,
              accountOrAddress,
              IndexRpcSchema,
              IndexAPIActions
            >;
          };
        }
      : {})
>;

export type CreateAvalancheClientErrorType = CreateAvalancheCoreClientErrorType;
