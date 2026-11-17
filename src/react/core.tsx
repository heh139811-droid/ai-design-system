'use client';

import {createContext, forwardRef, useContext, type HTMLAttributes, type ButtonHTMLAttributes} from 'react';

export type Theme = 'light' | 'dark';
const ThemeContext = createContext<Theme>('light');
export const useBrandTheme = () => useContext(ThemeContext);
export const cx = (...values: (string | undefined | false)[]) => values.filter(Boolean).join(' ');

export interface BrandProviderProps extends HTMLAttributes<HTMLDivElement> {theme?: Theme}
export const BrandProvider = forwardRef<HTMLDivElement, BrandProviderProps>(function BrandProvider({theme='light',className,children,...props},ref) {
  return <ThemeContext.Provider value={theme}><div {...props} ref={ref} className={cx('wj-ui-root',className)} data-wj-brand="" data-wj-theme={theme}>{children}</div></ThemeContext.Provider>;
});

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  loading?: boolean;
}
export const Button = forwardRef<HTMLButtonElement,ButtonProps>(function Button({variant='primary',size='md',loading=false,disabled,type='button',className,children,...props},ref) {
  return <button {...props} ref={ref} type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={cx('wj-button','wj-ui-button',`wj-ui-button--${variant}`,`wj-ui-button--${size}`,className)}>
    {children}{loading ? <span aria-hidden="true"> …</span> : null}
  </button>;
});

export const Badge = forwardRef<HTMLSpanElement,HTMLAttributes<HTMLSpanElement>>(function Badge({className,...props},ref) {
  return <span {...props} ref={ref} className={cx('wj-badge','wj-ui-badge',className)}/>;
});
export const Card = forwardRef<HTMLElement,HTMLAttributes<HTMLElement>>(function Card({className,...props},ref) {
  return <section {...props} ref={ref} className={cx('wj-card','wj-ui-card',className)}/>;
});
