'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, forwardRef, useContext } from 'react';
const ThemeContext = createContext('light');
export const useBrandTheme = () => useContext(ThemeContext);
export const cx = (...values) => values.filter(Boolean).join(' ');
export const BrandProvider = forwardRef(function BrandProvider({ theme = 'light', className, children, ...props }, ref) {
    return _jsx(ThemeContext.Provider, { value: theme, children: _jsx("div", { ...props, ref: ref, className: cx('wj-ui-root', className), "data-wj-brand": "", "data-wj-theme": theme, children: children }) });
});
export const Button = forwardRef(function Button({ variant = 'primary', size = 'md', loading = false, disabled, type = 'button', className, children, ...props }, ref) {
    return _jsxs("button", { ...props, ref: ref, type: type, disabled: disabled || loading, "aria-busy": loading || undefined, className: cx('wj-button', 'wj-ui-button', `wj-ui-button--${variant}`, `wj-ui-button--${size}`, className), children: [children, loading ? _jsx("span", { "aria-hidden": "true", children: " \u2026" }) : null] });
});
export const Badge = forwardRef(function Badge({ className, ...props }, ref) {
    return _jsx("span", { ...props, ref: ref, className: cx('wj-badge', 'wj-ui-badge', className) });
});
export const Card = forwardRef(function Card({ className, ...props }, ref) {
    return _jsx("section", { ...props, ref: ref, className: cx('wj-card', 'wj-ui-card', className) });
});
