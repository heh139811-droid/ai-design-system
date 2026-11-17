import { type HTMLAttributes, type ButtonHTMLAttributes } from 'react';
export type Theme = 'light' | 'dark';
export declare const useBrandTheme: () => Theme;
export declare const cx: (...values: (string | undefined | false)[]) => string;
export interface BrandProviderProps extends HTMLAttributes<HTMLDivElement> {
    theme?: Theme;
}
export declare const BrandProvider: import("react").ForwardRefExoticComponent<BrandProviderProps & import("react").RefAttributes<HTMLDivElement>>;
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md';
    loading?: boolean;
}
export declare const Button: import("react").ForwardRefExoticComponent<ButtonProps & import("react").RefAttributes<HTMLButtonElement>>;
export declare const Badge: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLSpanElement> & import("react").RefAttributes<HTMLSpanElement>>;
export declare const Card: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLElement> & import("react").RefAttributes<HTMLElement>>;
