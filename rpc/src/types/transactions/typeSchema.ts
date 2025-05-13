export type TypeSchema = {
  key: string;
  type: any & {
    fromBytes:
      | ((buf: Uint8Array, len?: number) => any)
      | ((buf: Uint8Array, ignoreTypeId?: boolean) => any);
  };
  elemByteLen?: number;
  length?: number;
  isArray?: boolean;
}[];
