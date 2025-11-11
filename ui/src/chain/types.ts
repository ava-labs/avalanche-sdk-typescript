import type { ReactNode } from 'react';

export type ChainIdentifier = string | number;

export type Chain = {
  id: ChainIdentifier;
  name: string;
  /** Optional short label used for initials or fallbacks */
  label?: string;
  /** Optional url pointing to a chain icon */
  iconUrl?: string | null;
  /** Optional accent color (CSS color string) */
  color?: string | null;
  /** Optional description displayed in dropdowns */
  description?: string | null;
  /** Optional badge text displayed on top of the logo */
  badge?: string | null;
  /** Flag indicating whether the chain is a testnet */
  testnet?: boolean;
};

export type ChainOption = Chain & {
  /** Optional custom icon to render for this chain */
  icon?: ReactNode;
  /** Disable the option */
  disabled?: boolean;
  /** Optional reason shown when the option is disabled */
  disabledReason?: string;
};

export type ChainLogoProps = {
  chain: Chain | ChainIdentifier;
  size?: number | string;
  className?: string;
  showLabel?: boolean;
  labelClassName?: string;
  badge?: string | null;
};

export type ChainRowProps = {
  chain: ChainOption;
  className?: string;
  iconSize?: number;
  showDescription?: boolean;
  descriptionOverride?: string | null;
  disabled?: boolean;
};

export type ChainSelectDropdownProps = {
  options: ChainOption[];
  value?: ChainIdentifier;
  onValueChange?: (value: string, chain: ChainOption) => void;
  onSelect?: (chain: ChainOption) => void;
  placeholder?: string;
  disabled?: boolean;
  disabledOptions?: ChainIdentifier[];
  label?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  emptyStateLabel?: string;
};
