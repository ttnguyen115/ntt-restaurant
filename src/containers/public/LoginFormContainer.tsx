'use client';

import { memo, useEffect } from 'react';

import { useForm } from 'react-hook-form';

import { useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';

import { AppNavigationRoutes } from '@/constants';

import { toast, useAuth, useLoginMutation } from '@/hooks';

import CardContainer from '@/containers/CardContainer';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { handleErrorApi } from '@/lib';

import { LoginBody, type LoginBodyType } from '@/schemaValidations';

function LoginFormContainer() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const clearTokens = searchParams.get('clearTokens');

    const { setRole } = useAuth();

    const { isPending, mutateAsync: login } = useLoginMutation();

    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginBodyType) => {
        if (isPending) return;
        try {
            const { payload } = await login(data);
            toast({
                description: payload.message,
            });
            setRole(payload.data.account.role);
            router.push(AppNavigationRoutes.MANAGE_DASHBOARD);
        } catch (error: unknown) {
            handleErrorApi({ error, setError: form.setError });
        }
    };

    useEffect(() => {
        if (clearTokens) {
            setRole(undefined);
        }
    }, [clearTokens, setRole]);

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
                        onSubmit={form.handleSubmit(onSubmit)}
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
