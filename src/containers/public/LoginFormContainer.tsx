'use client';

import { memo, useCallback } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { toast, useLoginMutation } from '@/hooks';

import CardContainer from '@/containers/CardContainer';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { handleErrorApi } from '@/lib';

import { LoginBody, type LoginBodyType } from '@/schemaValidations';

function LoginFormContainer() {
    const { isPending, mutateAsync: login } = useLoginMutation();

    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = useCallback(
        async (data: LoginBodyType) => {
            if (isPending) return;

            try {
                const result = await login(data);
                toast({
                    description: result.payload.message,
                });
            } catch (error: unknown) {
                handleErrorApi({ error, setError: form.setError });
            }
        },
        [isPending, login]
    );

    return (
        <CardContainer
            containerClassName="mx-auto max-w-sm"
            title="Sign In"
            description="Please provide email and password to login"
            titleClassName="text-2xl"
        >
            <CardContent>
                <Form {...form}>
                    <form
                        className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
                        noValidate
                        onSubmit={form.handleSubmit(onSubmit, (error) => {
                            console.error(error);
                        })}
                    >
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="m@example.com"
                                                required
                                                {...field}
                                            />
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid gap-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">Password</Label>
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                required
                                                {...field}
                                            />
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                            >
                                Log In
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                type="button"
                            >
                                Login by Google SSO
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </CardContainer>
    );
}

export default memo(LoginFormContainer);
