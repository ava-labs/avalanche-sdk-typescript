// 🏔️❄️🏔️

/**
 * Note: exported as public Type
 */
export type FormatAmountOptions = {
  /** User locale (default: browser locale) */
  locale?: string;
  /** Minimum fraction digits for number decimals */
  minimumFractionDigits?: number;
  /** Maximum fraction digits for number decimals */
  maximumFractionDigits?: number;
};

/**
 * Note: exported as public Type
 * See Number.prototype.toLocaleString for more info
 */
export type FormatAmountResponse = string;

/**
 * Note: exported as public Type
 */
export type Token = {
  /** The address of the token contract, this value will be empty for native AVAX */
  address: string;
  /** The chain id of the token contract */
  chainId: number | string;
  /** The number of token decimals */
  decimals: number;
  /** A string url of the token logo */
  image?: string | null;
  /** Token name */
  name: string;
  /** A ticker symbol or shorthand, up to 11 characters */
  symbol: string;
};

/**
 * Note: exported as public Type
 */
export type TokenChipProps = {
  /** Rendered token */
  token: Token;
  onClick?: (token: Token) => void;
  className?: string;
  isPressable?: boolean;
};

/**
 * Note: exported as public Type
 */
export type TokenImageProps = {
  /** Optional additional CSS class to apply to the component */
  className?: string;
  /** size of the image in px (default: 24) */
  size?: number;
  token: Token;
};

/**
 * Note: exported as public Type
 */
export type TokenRowProps = {
  /** Token amount */
  amount?: string;
  /** USD value to display below the amount */
  value?: string | number;
  /** Token reputation: 'Benign', 'Malicious', or null */
  reputation?: 'Benign' | 'Malicious' | null;
  /** Whether this is a native token */
  isNative?: boolean;
  /** Visual variant style */
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  hideImage?: boolean;
  hideSymbol?: boolean;
  /** Component on click handler */
  onClick?: (token: Token) => void;
  /** Rendered token */
  token: Token;
  as?: React.ElementType;
};

/**
 * Note: exported as public Type
 */
export type TokenSearchProps = {
  className?: string;
  /** Debounce delay in milliseconds */
  delayMs?: number;
  /** Search callback function */
  onChange: (value: string) => void;
};

/**
 * Note: exported as public Type
 */
export type TokenSelectButtonProps = {
  className?: string;
  /** Determines carot icon direction */
  isOpen: boolean;
  /** Button on click handler */
  onClick: () => void;
  /** Selected token */
  token?: Token;
};

/**
 * Note: exported as public Type
 */
export type TokenSelectDropdownProps = {
  /** List of tokens */
  options: Token[];
  /** Token setter */
  setToken: (token: Token) => void;
  /** Selected token */
  token?: Token;
  className?: string;
};

