'use client';

import { ComponentPropsWithRef, createContext, use } from 'react';

import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { VariantProps } from 'class-variance-authority';

import { cn } from '@/utilities';

import { toggleVariants } from './toggle';

const ToggleGroupContext = createContext<VariantProps<typeof toggleVariants>>({
    size: 'default',
    variant: 'default',
});

type ToggleGroupProps = ComponentPropsWithRef<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>;

const ToggleGroup = ({ className, variant, size, children, ref, ...props }: ToggleGroupProps) => (
    <ToggleGroupPrimitive.Root
        ref={ref}
        className={cn('flex items-center justify-center gap-1', className)}
        {...props}
    >
        <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
);
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

type ToggleGroupItemProps = ComponentPropsWithRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>;

const ToggleGroupItem = ({ className, children, variant, size, ref, ...props }: ToggleGroupItemProps) => {
    const context = use(ToggleGroupContext);

    return (
        <ToggleGroupPrimitive.Item
            ref={ref}
            className={cn(
                toggleVariants({
                    variant: context.variant || variant,
                    size: context.size || size,
                }),
                className
            )}
            {...props}
        >
            {children}
        </ToggleGroupPrimitive.Item>
    );
};
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
