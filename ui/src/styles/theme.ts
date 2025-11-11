import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const text = {
  base: 'font-sans text-foreground',
  body: 'font-sans font-normal text-base text-foreground',
  caption: 'font-sans font-semibold text-xs text-foreground',
  headline: 'font-sans font-semibold text-foreground',
  label1: 'font-sans font-semibold text-sm text-foreground',
  label2: 'font-sans text-sm text-foreground',
  legal: 'font-sans text-xs text-foreground',
  title1: 'font-sans font-semibold text-2xl text-foreground',
  title3: 'font-sans font-semibold text-xl text-foreground',
} as const;

export const pressable = {
  default: 'cursor-pointer bg-background hover:bg-accent active:bg-accent focus:bg-accent text-foreground',
  alternate: 'cursor-pointer bg-muted hover:bg-accent active:bg-accent focus:bg-accent text-foreground',
  inverse: 'cursor-pointer bg-foreground hover:bg-foreground/90 active:bg-foreground/90 focus:bg-foreground/90 text-background',
  primary: 'cursor-pointer bg-primary hover:bg-primary/90 active:bg-primary/90 focus:bg-primary/90 text-primary-foreground',
  secondary: 'cursor-pointer bg-secondary hover:bg-secondary/80 active:bg-secondary/80 focus:bg-secondary/80 text-secondary-foreground',
  avalancheBranding: 'cursor-pointer bg-primary hover:bg-primary/90 active:bg-primary/90 text-primary-foreground',
  disabled: 'opacity-50 pointer-events-none',
} as const;

export const border = {
  lineDefault: 'border border-border',
} as const;