'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cx, useBrandTheme, Button } from './core.js';
export const Tabs = forwardRef(function Tabs({ label, items, className, defaultValue, ...props }, ref) {
    return _jsxs(TabsPrimitive.Root, { ...props, ref: ref, defaultValue: defaultValue ?? items.find(item => !item.disabled)?.value, className: cx('wj-ui-tabs', className), children: [_jsx(TabsPrimitive.List, { "aria-label": label, className: "wj-ui-tab-list", children: items.map(item => _jsx(TabsPrimitive.Trigger, { value: item.value, disabled: item.disabled, className: "wj-ui-tab", children: item.label }, item.value)) }), items.map(item => _jsx(TabsPrimitive.Content, { value: item.value, className: "wj-ui-tab-panel", children: item.content }, item.value))] });
});
export const Navigation = forwardRef(function Navigation({ brand, items, label, className, ...props }, ref) {
    return _jsxs("nav", { ...props, ref: ref, "aria-label": label, className: cx('wj-ui-navigation', className), children: [brand ? _jsx("div", { className: "wj-ui-navigation-brand", children: brand }) : null, _jsx("ul", { children: items.map(({ label, current, className, ...item }, index) => _jsx("li", { children: _jsx("a", { ...item, "aria-current": current ? 'page' : undefined, className: cx('wj-link', 'wj-ui-navigation-link', className), children: label }) }, `${item.href}-${index}`)) })] });
});
export function Modal({ trigger, title, description, children, footer, closeLabel = '닫기', className, contentProps, ...props }) {
    const theme = useBrandTheme();
    return _jsxs(DialogPrimitive.Root, { ...props, children: [trigger ? _jsx(DialogPrimitive.Trigger, { asChild: true, children: trigger }) : null, _jsx(DialogPrimitive.Portal, { children: _jsxs("div", { "data-wj-brand": "", "data-wj-theme": theme, className: "wj-ui-portal", children: [_jsx(DialogPrimitive.Overlay, { className: "wj-ui-modal-overlay" }), _jsxs(DialogPrimitive.Content, { ...contentProps, ...(!description ? { 'aria-describedby': undefined } : {}), className: cx('wj-ui-modal', className), children: [_jsx(DialogPrimitive.Title, { className: "wj-ui-modal-title", children: title }), description ? _jsx(DialogPrimitive.Description, { className: "wj-ui-hint", children: description }) : null, _jsx("div", { className: "wj-ui-modal-body", children: children }), _jsxs("div", { className: "wj-ui-modal-footer", children: [footer, _jsx(DialogPrimitive.Close, { asChild: true, children: _jsx(Button, { variant: "secondary", children: closeLabel }) })] })] })] }) })] });
}
