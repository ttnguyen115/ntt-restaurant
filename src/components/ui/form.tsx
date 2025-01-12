import { ComponentPropsWithRef, createContext, use, useId } from 'react';

import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from 'react-hook-form';

import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/utilities';

import { Label } from './label';

const Form = FormProvider;

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
    name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue);

function FormField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    );
}

type FormItemContextValue = {
    id: string;
};

const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

const useFormField = () => {
    const fieldContext = use(FormFieldContext);
    const itemContext = use(FormItemContext);
    const { getFieldState, formState } = useFormContext();

    const fieldState = getFieldState(fieldContext.name, formState);

    if (!fieldContext) {
        throw new Error('useFormField should be used within <FormField>');
    }

    const { id } = itemContext;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    };
};

const FormItem = ({ className, ref, ...props }: ComponentPropsWithRef<'div'>) => {
    const id = useId();

    return (
        <FormItemContext.Provider value={{ id }}>
            <div
                ref={ref}
                className={cn('space-y-2', className)}
                {...props}
            />
        </FormItemContext.Provider>
    );
};
FormItem.displayName = 'FormItem';

const FormLabel = ({ className, ref, ...props }: ComponentPropsWithRef<typeof LabelPrimitive.Root>) => {
    const { error, formItemId } = useFormField();

    return (
        <Label
            ref={ref}
            className={cn(error && 'text-destructive', className)}
            htmlFor={formItemId}
            {...props}
        />
    );
};
FormLabel.displayName = 'FormLabel';

const FormControl = ({ ref, ...props }: ComponentPropsWithRef<typeof Slot>) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
        <Slot
            ref={ref}
            id={formItemId}
            aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
            aria-invalid={!!error}
            {...props}
        />
    );
};
FormControl.displayName = 'FormControl';

const FormDescription = ({ className, ref, ...props }: ComponentPropsWithRef<'p'>) => {
    const { formDescriptionId } = useFormField();

    return (
        <p
            ref={ref}
            id={formDescriptionId}
            className={cn('text-[0.8rem] text-muted-foreground', className)}
            {...props}
        />
    );
};
FormDescription.displayName = 'FormDescription';

const FormMessage = ({ className, children, ref, ...props }: ComponentPropsWithRef<'p'>) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
        return null;
    }

    return (
        <p
            ref={ref}
            id={formMessageId}
            className={cn('text-[0.8rem] font-medium text-destructive', className)}
            {...props}
        >
            {body}
        </p>
    );
};
FormMessage.displayName = 'FormMessage';

export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };
