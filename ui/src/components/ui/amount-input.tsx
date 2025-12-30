import * as React from "react"
import { cn, text } from "../../styles/theme"
import { Input } from "./input"
import { Button } from "./button"
import { Label } from "./label"

export interface AmountInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  symbol?: string
  showMax?: boolean
  showUSD?: boolean
  showBalance?: boolean
  usdRate?: number
  maxValue?: string
  onMaxClick?: () => void
  containerClassName?: string
}

const AmountInput = React.forwardRef<HTMLInputElement, AmountInputProps>(
  ({ 
    className, 
    label = "Amount", 
    symbol = "AVAX",
    showMax = true,
    showUSD = false,
    showBalance = false,
    usdRate = 0,
    maxValue,
    onMaxClick,
    containerClassName,
    value,
    onChange,
    disabled,
    ...props 
  }, ref) => {
    const handleAmountChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      // Allow only numbers and decimal points
      if (/^\d*\.?\d*$/.test(inputValue)) {
        onChange?.(e);
      }
    }, [onChange]);

    const handleMaxClick = React.useCallback(() => {
      if (onMaxClick) {
        onMaxClick();
      } else if (maxValue && onChange) {
        // Create synthetic event for maxValue
        const syntheticEvent = {
          target: { value: maxValue },
          currentTarget: { value: maxValue },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    }, [onMaxClick, maxValue, onChange]);

    const numericValue = React.useMemo(() => {
      const val = typeof value === 'string' ? value : String(value || '');
      return parseFloat(val) || 0;
    }, [value]);

    const usdValue = React.useMemo(() => {
      if (!showUSD || !usdRate || numericValue === 0) return null;
      return (numericValue * usdRate).toFixed(2);
    }, [showUSD, usdRate, numericValue]);

    const formatBalance = React.useCallback((balance: string) => {
      const num = parseFloat(balance);
      if (num === 0) return '0';
      if (num < 0.0001) return '<0.0001';
      if (num < 1) return num.toFixed(4);
      if (num < 1000) return num.toFixed(2);
      return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }, []);

    const formattedBalance = React.useMemo(() => {
      if (!showBalance || !maxValue) return null;
      return formatBalance(maxValue);
    }, [showBalance, maxValue, formatBalance]);

    return (
      <div className={cn('flex flex-col gap-2', containerClassName)}>
        <div className="flex items-center justify-between">
          <Label htmlFor={props.id} className={cn(text.label1, 'text-foreground')}>
            {label}
          </Label>
          {formattedBalance && (
            <span className="text-xs text-muted-foreground">
              Max: {formattedBalance}
            </span>
          )}
        </div>

        <div className="relative">
          <Input
            ref={ref}
            type="text"
            value={value}
            onChange={handleAmountChange}
            disabled={disabled}
            placeholder="0.0"
            className={cn(
              "pr-20 h-12 text-base",
              "border border-input bg-background",
              showMax && "rounded-r-none",
              className
            )}
            {...props}
          />
          
          {showMax && (
              <Button
                type="button"
                onClick={handleMaxClick}
                disabled={disabled || (!onMaxClick && !maxValue)}
                variant="default"
              className="absolute right-0 top-0 h-12 px-4 text-xs font-semibold rounded-l-none border-l-0 rounded-r-md !h-12"
              >
                MAX
              </Button>
          )}
        </div>

        {usdValue && (
          <div className="text-xs text-muted-foreground">
            ≈ ${usdValue} USD
          </div>
        )}
      </div>
    )
  }
)
AmountInput.displayName = "AmountInput"

export { AmountInput }
