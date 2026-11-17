'use client';

import {forwardRef,useId,type ReactNode,type InputHTMLAttributes,type TextareaHTMLAttributes,type SelectHTMLAttributes,type FieldsetHTMLAttributes,type ComponentPropsWithoutRef,type ComponentRef} from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import {cx} from './core.js';

export interface FieldProps {label:ReactNode;hint?:ReactNode;error?:ReactNode;containerClassName?:string}
function useField(id:string|undefined,describedBy:string|undefined,hint:ReactNode,error:ReactNode) {
  const generated=useId(),controlId=id || `wj-${generated}`;
  const invalid=error!==undefined&&error!==null&&error!==false&&error!=='';
  return {id:controlId,invalid,description:[describedBy,hint ? `${controlId}-hint` : '',invalid?`${controlId}-error`:''].filter(Boolean).join(' ')||undefined};
}
function Messages({id,hint,error,invalid}:{id:string;hint:ReactNode;error:ReactNode;invalid:boolean}) {
  return <>{hint ? <span id={`${id}-hint`} className="wj-ui-hint">{hint}</span> : null}{invalid ? <span id={`${id}-error`} className="wj-ui-error" role="alert">{error}</span> : null}</>;
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>,'size'>,FieldProps {}
export const Input=forwardRef<HTMLInputElement,InputProps>(function Input({label,hint,error,id,className,containerClassName,'aria-describedby':describedBy,'aria-invalid':invalid,...props},ref) {
  const field=useField(id,describedBy,hint,error);
  return <div className={cx('wj-ui-field',containerClassName)}><label htmlFor={field.id} className="wj-ui-label">{label}</label><input {...props} ref={ref} id={field.id} aria-describedby={field.description} aria-invalid={field.invalid||invalid} className={cx('wj-input',className)}/><Messages {...field} hint={hint} error={error}/></div>;
});
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>,FieldProps {}
export const Textarea=forwardRef<HTMLTextAreaElement,TextareaProps>(function Textarea({label,hint,error,id,className,containerClassName,'aria-describedby':describedBy,'aria-invalid':invalid,rows=4,...props},ref) {
  const field=useField(id,describedBy,hint,error);
  return <div className={cx('wj-ui-field',containerClassName)}><label htmlFor={field.id} className="wj-ui-label">{label}</label><textarea {...props} ref={ref} rows={rows} id={field.id} aria-describedby={field.description} aria-invalid={field.invalid||invalid} className={cx('wj-input','wj-ui-textarea',className)}/><Messages {...field} hint={hint} error={error}/></div>;
});
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>,FieldProps {}
export const Select=forwardRef<HTMLSelectElement,SelectProps>(function Select({label,hint,error,id,className,containerClassName,children,'aria-describedby':describedBy,'aria-invalid':invalid,...props},ref) {
  const field=useField(id,describedBy,hint,error);
  return <div className={cx('wj-ui-field',containerClassName)}><label htmlFor={field.id} className="wj-ui-label">{label}</label><select {...props} ref={ref} id={field.id} aria-describedby={field.description} aria-invalid={field.invalid||invalid} className={cx('wj-input',className)}>{children}</select><Messages {...field} hint={hint} error={error}/></div>;
});

export interface ChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>,'type'|'size'>,FieldProps {}
const Choice=forwardRef<HTMLInputElement,ChoiceProps&{type:'checkbox'|'radio'}>(function Choice({label,hint,error,id,className,containerClassName,'aria-describedby':describedBy,'aria-invalid':invalid,...props},ref) {
  const field=useField(id,describedBy,hint,error);
  return <div className={cx('wj-ui-field',containerClassName)}><label htmlFor={field.id} className="wj-ui-choice"><input {...props} ref={ref} id={field.id} aria-describedby={field.description} aria-invalid={field.invalid||invalid} className={cx('wj-ui-choice-input',className)}/><span>{label}</span></label><Messages {...field} hint={hint} error={error}/></div>;
});
export const Checkbox=forwardRef<HTMLInputElement,ChoiceProps>((props,ref)=><Choice {...props} type="checkbox" ref={ref}/>);
Checkbox.displayName='Checkbox';
export const Radio=forwardRef<HTMLInputElement,ChoiceProps>((props,ref)=><Choice {...props} type="radio" ref={ref}/>);
Radio.displayName='Radio';
export interface RadioGroupProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {legend:ReactNode}
export const RadioGroup=forwardRef<HTMLFieldSetElement,RadioGroupProps>(function RadioGroup({legend,className,children,...props},ref) {
  return <fieldset {...props} ref={ref} className={cx('wj-ui-radio-group',className)}><legend className="wj-ui-label">{legend}</legend>{children}</fieldset>;
});

export interface SwitchProps extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,FieldProps {}
export const Switch=forwardRef<ComponentRef<typeof SwitchPrimitive.Root>,SwitchProps>(function Switch({label,hint,error,id,className,containerClassName,'aria-describedby':describedBy,...props},ref) {
  const field=useField(id,describedBy,hint,error);
  return <div className={cx('wj-ui-field',containerClassName)}><label className="wj-ui-choice" htmlFor={field.id}>
    <SwitchPrimitive.Root {...props} ref={ref} id={field.id} aria-labelledby={`${field.id}-label`} aria-describedby={field.description} aria-invalid={field.invalid||props['aria-invalid']} className={cx('wj-ui-switch',className)}><SwitchPrimitive.Thumb className="wj-ui-switch-thumb"/></SwitchPrimitive.Root>
    <span id={`${field.id}-label`}>{label}</span></label><Messages {...field} hint={hint} error={error}/></div>;
});
