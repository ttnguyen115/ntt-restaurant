'use client';

import { ComponentPropsWithRef } from 'react';

import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utilities';

const labelVariants = cva('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70');

type LabelProps = ComponentPropsWithRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>;

const Label = ({ className, ref, ...props }: LabelProps) => (
    <LabelPrimitive.Root
        ref={ref}
        className={cn(labelVariants(), className)}
        {...props}
    />
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
