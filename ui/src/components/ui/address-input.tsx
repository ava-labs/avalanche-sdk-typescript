import * as React from "react"
import { cn, text } from "../../styles/theme"
import { Input } from "./input"
import { Label } from "./label"
import { validateAddress, detectChainType, type ChainType, type AddressValidationResult } from "../../utils/addressValidation"

export interface AddressInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  chainType: ChainType
  value: string
  onChange: (value: string, validation: AddressValidationResult) => void
  showValidation?: boolean
  containerClassName?: string
}

const AddressInput = React.forwardRef<HTMLInputElement, AddressInputProps>(
  ({ 
    className, 
    label = "Address", 
    chainType,
    value,
    onChange,
    showValidation = true,
    containerClassName,
    disabled,
    ...props 
  }, ref) => {
    const [validation, setValidation] = React.useState<AddressValidationResult>({ isValid: true });
    const [isTouched, setIsTouched] = React.useState(false);

    // Validate address whenever value or chainType changes
    React.useEffect(() => {
      if (value) {
        const result = validateAddress(value, chainType);
        setValidation(result);
      } else {
        setValidation({ isValid: true });
      }
    }, [value, chainType]);

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      const result = validateAddress(newValue, chainType);
      setValidation(result);
      onChange(newValue, result);
    }, [chainType, onChange]);

    const handleBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsTouched(true);
      props.onBlur?.(e);
    }, [props]);

    const getPlaceholder = () => {
      switch (chainType) {
        case 'C':
          return '0x...';
        case 'P':
          return 'P-...';
        case 'X':
          return 'X-...';
        default:
          return 'Enter address';
      }
    };

    const getChainName = () => {
      switch (chainType) {
        case 'C': return 'C-Chain';
        case 'P': return 'P-Chain';
        case 'X': return 'X-Chain';
        default: return 'Chain';
      }
    };

    const shouldShowError = showValidation && isTouched && !validation.isValid && value;
    const shouldShowSuggestion = shouldShowError && validation.suggestion;

    // Detect if user is entering wrong chain address
    const detectedChain = detectChainType(value);
    const isWrongChain = detectedChain && detectedChain !== chainType;

    return (
      <div className={cn('flex flex-col gap-2', containerClassName)}>
        <Label htmlFor={props.id} className={cn(text.label1, 'text-foreground')}>
          {label}
          <span className={cn(text.legal, 'text-muted-foreground ml-2')}>
            ({getChainName()})
          </span>
        </Label>
        
        <div className="relative">
          <Input
            ref={ref}
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={getPlaceholder()}
            className={cn(
              "font-mono",
              shouldShowError && "border-destructive focus:border-destructive",
              isWrongChain && "border-orange-500 focus:border-orange-500",
              className
            )}
            {...props}
          />
          
          {/* Validation indicator */}
          {showValidation && value && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {validation.isValid ? (
                <div className="w-2 h-2 rounded-full bg-green-500" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-red-500" />
              )}
            </div>
          )}
        </div>

        {/* Error message */}
        {shouldShowError && (
          <div className="flex flex-col gap-1">
            <p className={cn(text.legal, 'text-destructive')}>
              {validation.error}
            </p>
            {shouldShowSuggestion && (
              <p className={cn(text.legal, 'text-orange-600 dark:text-orange-400')}>
                💡 {validation.suggestion}
              </p>
            )}
          </div>
        )}

        {/* Wrong chain warning */}
        {isWrongChain && !shouldShowError && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
            <span className="text-orange-500">⚠️</span>
            <div className="flex flex-col gap-1">
              <p className={cn(text.legal, 'text-orange-700 dark:text-orange-300 font-medium')}>
                Wrong chain detected
              </p>
              <p className={cn(text.legal, 'text-orange-600 dark:text-orange-400')}>
                You entered a {detectedChain}-Chain address, but this field expects a {getChainName()} address.
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }
)
AddressInput.displayName = "AddressInput"

export { AddressInput }

