import { type ReactNode, type ReactElement, type ComponentPropsWithoutRef, type HTMLAttributes, type AnchorHTMLAttributes } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as DialogPrimitive from '@radix-ui/react-dialog';
export interface TabItem {
    value: string;
    label: ReactNode;
    content: ReactNode;
    disabled?: boolean;
}
export interface TabsProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
    label: string;
    items: readonly TabItem[];
}
export declare const Tabs: import("react").ForwardRefExoticComponent<TabsProps & import("react").RefAttributes<HTMLDivElement>>;
export interface NavigationItem extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
    label: ReactNode;
    href: string;
    current?: boolean;
}
export interface NavigationProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    brand?: ReactNode;
    items: readonly NavigationItem[];
    label: string;
}
export declare const Navigation: import("react").ForwardRefExoticComponent<NavigationProps & import("react").RefAttributes<HTMLElement>>;
export interface ModalProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {
    trigger?: ReactElement;
    title: ReactNode;
    description?: ReactNode;
    children?: ReactNode;
    footer?: ReactNode;
    closeLabel?: string;
    className?: string;
    contentProps?: Omit<ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, 'children' | 'className' | 'aria-labelledby' | 'aria-describedby'>;
}
export declare function Modal({ trigger, title, description, children, footer, closeLabel, className, contentProps, ...props }: ModalProps): import("react").JSX.Element;
