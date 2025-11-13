import type { Chain, ChainIdentifier } from '../types';

const computeLabel = (option: { name?: string | null; id: ChainIdentifier }): string => {
  const name = option.name ?? option.id?.toString() ?? '';
  if (!name) {
    return '';
  }
  if (name.length <= 3) {
    return name.toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};

export function normalizeChain(input: Chain | ChainIdentifier): Chain {
  if (typeof input === 'string' || typeof input === 'number') {
    const id = input;
    const name = input.toString();
    const label = computeLabel({ id, name });
    return {
      id,
      name,
      label,
    };
  }

  return {
    ...input,
    label: input.label ?? computeLabel({ id: input.id, name: input.name }),
  };
}
