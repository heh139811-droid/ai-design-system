import { type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type FieldsetHTMLAttributes, type ComponentPropsWithoutRef } from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
export interface FieldProps {
    label: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    containerClassName?: string;
}
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, FieldProps {
}
export declare const Input: import("react").ForwardRefExoticComponent<InputProps & import("react").RefAttributes<HTMLInputElement>>;
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldProps {
}
export declare const Textarea: import("react").ForwardRefExoticComponent<TextareaProps & import("react").RefAttributes<HTMLTextAreaElement>>;
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, FieldProps {
}
export declare const Select: import("react").ForwardRefExoticComponent<SelectProps & import("react").RefAttributes<HTMLSelectElement>>;
export interface ChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>, FieldProps {
}
export declare const Checkbox: import("react").ForwardRefExoticComponent<ChoiceProps & import("react").RefAttributes<HTMLInputElement>>;
export declare const Radio: import("react").ForwardRefExoticComponent<ChoiceProps & import("react").RefAttributes<HTMLInputElement>>;
export interface RadioGroupProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
    legend: ReactNode;
}
export declare const RadioGroup: import("react").ForwardRefExoticComponent<RadioGroupProps & import("react").RefAttributes<HTMLFieldSetElement>>;
export interface SwitchProps extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, FieldProps {
}
export declare const Switch: import("react").ForwardRefExoticComponent<SwitchProps & import("react").RefAttributes<HTMLButtonElement>>;
