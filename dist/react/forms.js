'use client';
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useId } from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cx } from './core.js';
function useField(id, describedBy, hint, error) {
    const generated = useId(), controlId = id || `wj-${generated}`;
    const invalid = error !== undefined && error !== null && error !== false && error !== '';
    return { id: controlId, invalid, description: [describedBy, hint ? `${controlId}-hint` : '', invalid ? `${controlId}-error` : ''].filter(Boolean).join(' ') || undefined };
}
function Messages({ id, hint, error, invalid }) {
    return _jsxs(_Fragment, { children: [hint ? _jsx("span", { id: `${id}-hint`, className: "wj-ui-hint", children: hint }) : null, invalid ? _jsx("span", { id: `${id}-error`, className: "wj-ui-error", role: "alert", children: error }) : null] });
}
export const Input = forwardRef(function Input({ label, hint, error, id, className, containerClassName, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...props }, ref) {
    const field = useField(id, describedBy, hint, error);
    return _jsxs("div", { className: cx('wj-ui-field', containerClassName), children: [_jsx("label", { htmlFor: field.id, className: "wj-ui-label", children: label }), _jsx("input", { ...props, ref: ref, id: field.id, "aria-describedby": field.description, "aria-invalid": field.invalid || invalid, className: cx('wj-input', className) }), _jsx(Messages, { ...field, hint: hint, error: error })] });
});
export const Textarea = forwardRef(function Textarea({ label, hint, error, id, className, containerClassName, 'aria-describedby': describedBy, 'aria-invalid': invalid, rows = 4, ...props }, ref) {
    const field = useField(id, describedBy, hint, error);
    return _jsxs("div", { className: cx('wj-ui-field', containerClassName), children: [_jsx("label", { htmlFor: field.id, className: "wj-ui-label", children: label }), _jsx("textarea", { ...props, ref: ref, rows: rows, id: field.id, "aria-describedby": field.description, "aria-invalid": field.invalid || invalid, className: cx('wj-input', 'wj-ui-textarea', className) }), _jsx(Messages, { ...field, hint: hint, error: error })] });
});
export const Select = forwardRef(function Select({ label, hint, error, id, className, containerClassName, children, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...props }, ref) {
    const field = useField(id, describedBy, hint, error);
    return _jsxs("div", { className: cx('wj-ui-field', containerClassName), children: [_jsx("label", { htmlFor: field.id, className: "wj-ui-label", children: label }), _jsx("select", { ...props, ref: ref, id: field.id, "aria-describedby": field.description, "aria-invalid": field.invalid || invalid, className: cx('wj-input', className), children: children }), _jsx(Messages, { ...field, hint: hint, error: error })] });
});
const Choice = forwardRef(function Choice({ label, hint, error, id, className, containerClassName, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...props }, ref) {
    const field = useField(id, describedBy, hint, error);
    return _jsxs("div", { className: cx('wj-ui-field', containerClassName), children: [_jsxs("label", { htmlFor: field.id, className: "wj-ui-choice", children: [_jsx("input", { ...props, ref: ref, id: field.id, "aria-describedby": field.description, "aria-invalid": field.invalid || invalid, className: cx('wj-ui-choice-input', className) }), _jsx("span", { children: label })] }), _jsx(Messages, { ...field, hint: hint, error: error })] });
});
export const Checkbox = forwardRef((props, ref) => _jsx(Choice, { ...props, type: "checkbox", ref: ref }));
Checkbox.displayName = 'Checkbox';
export const Radio = forwardRef((props, ref) => _jsx(Choice, { ...props, type: "radio", ref: ref }));
Radio.displayName = 'Radio';
export const RadioGroup = forwardRef(function RadioGroup({ legend, className, children, ...props }, ref) {
    return _jsxs("fieldset", { ...props, ref: ref, className: cx('wj-ui-radio-group', className), children: [_jsx("legend", { className: "wj-ui-label", children: legend }), children] });
});
export const Switch = forwardRef(function Switch({ label, hint, error, id, className, containerClassName, 'aria-describedby': describedBy, ...props }, ref) {
    const field = useField(id, describedBy, hint, error);
    return _jsxs("div", { className: cx('wj-ui-field', containerClassName), children: [_jsxs("label", { className: "wj-ui-choice", htmlFor: field.id, children: [_jsx(SwitchPrimitive.Root, { ...props, ref: ref, id: field.id, "aria-labelledby": `${field.id}-label`, "aria-describedby": field.description, "aria-invalid": field.invalid || props['aria-invalid'], className: cx('wj-ui-switch', className), children: _jsx(SwitchPrimitive.Thumb, { className: "wj-ui-switch-thumb" }) }), _jsx("span", { id: `${field.id}-label`, children: label })] }), _jsx(Messages, { ...field, hint: hint, error: error })] });
});
