'use client';

import {forwardRef,type ReactNode,type ReactElement,type ComponentPropsWithoutRef,type HTMLAttributes,type AnchorHTMLAttributes} from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {cx,useBrandTheme,Button} from './core.js';

export interface TabItem {value:string;label:ReactNode;content:ReactNode;disabled?:boolean}
export interface TabsProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {label:string;items:readonly TabItem[]}
export const Tabs=forwardRef<HTMLDivElement,TabsProps>(function Tabs({label,items,className,defaultValue,...props},ref) {
  return <TabsPrimitive.Root {...props} ref={ref} defaultValue={defaultValue??items.find(item=>!item.disabled)?.value} className={cx('wj-ui-tabs',className)}>
    <TabsPrimitive.List aria-label={label} className="wj-ui-tab-list">{items.map(item=><TabsPrimitive.Trigger key={item.value} value={item.value} disabled={item.disabled} className="wj-ui-tab">{item.label}</TabsPrimitive.Trigger>)}</TabsPrimitive.List>
    {items.map(item=><TabsPrimitive.Content key={item.value} value={item.value} className="wj-ui-tab-panel">{item.content}</TabsPrimitive.Content>)}
  </TabsPrimitive.Root>;
});

export interface NavigationItem extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>,'children'> {label:ReactNode;href:string;current?:boolean}
export interface NavigationProps extends Omit<HTMLAttributes<HTMLElement>,'children'> {brand?:ReactNode;items:readonly NavigationItem[];label:string}
export const Navigation=forwardRef<HTMLElement,NavigationProps>(function Navigation({brand,items,label,className,...props},ref) {
  return <nav {...props} ref={ref} aria-label={label} className={cx('wj-ui-navigation',className)}>{brand ? <div className="wj-ui-navigation-brand">{brand}</div> : null}<ul>{items.map(({label,current,className,...item},index)=><li key={`${item.href}-${index}`}><a {...item} aria-current={current?'page':undefined} className={cx('wj-link','wj-ui-navigation-link',className)}>{label}</a></li>)}</ul></nav>;
});

export interface ModalProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {
  trigger?:ReactElement;
  title:ReactNode;
  description?:ReactNode;
  children?:ReactNode;
  footer?:ReactNode;
  closeLabel?:string;
  className?:string;
  contentProps?:Omit<ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,'children'|'className'|'aria-labelledby'|'aria-describedby'>;
}
export function Modal({trigger,title,description,children,footer,closeLabel='닫기',className,contentProps,...props}:ModalProps) {
  const theme=useBrandTheme();
  return <DialogPrimitive.Root {...props}>{trigger ? <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger> : null}<DialogPrimitive.Portal>
    <div data-wj-brand="" data-wj-theme={theme} className="wj-ui-portal">
      <DialogPrimitive.Overlay className="wj-ui-modal-overlay"/>
      <DialogPrimitive.Content {...contentProps} {...(!description?{'aria-describedby':undefined}:{})} className={cx('wj-ui-modal',className)}>
        <DialogPrimitive.Title className="wj-ui-modal-title">{title}</DialogPrimitive.Title>
        {description ? <DialogPrimitive.Description className="wj-ui-hint">{description}</DialogPrimitive.Description> : null}
        <div className="wj-ui-modal-body">{children}</div>
        <div className="wj-ui-modal-footer">{footer}<DialogPrimitive.Close asChild><Button variant="secondary">{closeLabel}</Button></DialogPrimitive.Close></div>
      </DialogPrimitive.Content>
    </div>
  </DialogPrimitive.Portal></DialogPrimitive.Root>;
}
