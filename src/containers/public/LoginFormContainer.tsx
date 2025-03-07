'use client';

import { memo, useEffect } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { initSocketInstance } from '@/utilities';

import { AppNavigationRoutes } from '@/constants';

import { toast, useAuth, useLoginMutation, useSearchParamsLoader } from '@/hooks';

import CardContainer from '@/containers/CardContainer';

import SearchParamsLoader from '@/components/SearchParamsLoader';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { handleErrorApi, useRouter } from '@/lib';

import { LoginBody, type LoginBodyType } from '@/schemaValidations';

function LoginFormContainer() {
    const router = useRouter();

    const t = useTranslations('Login');
    const errorMessages = useTranslations('ErrorMessage');

    const { searchParams, setSearchParams } = useSearchParamsLoader();
    const clearTokens = searchParams?.get('clearTokens');

    const { setRole, setSocket } = useAuth();

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
            setSocket(initSocketInstance(payload.data.accessToken));
            router.push(AppNavigationRoutes.MANAGE_DASHBOARD);
        } catch (error) {
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
            title={t('title')}
            description={t('cardDescription')}
            titleClassName="text-2xl"
        >
            <SearchParamsLoader onParamsReceived={setSearchParams} />
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
                                render={({ field, formState: { errors } }) => (
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
                                            <FormMessage>
                                                {!!errors.email?.message && errorMessages(errors.email.message as any)}
                                            </FormMessage>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field, formState: { errors } }) => (
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
                                            <FormMessage>
                                                {!!errors.password?.message &&
                                                    errorMessages(errors.password.message as any)}
                                            </FormMessage>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                            >
                                {isPending && <LoaderCircle className="w-6 h-6 mr-2 animate-spin" />}
                                {t('buttonLogin')}
                            </Button>
                            {/* Temporarily disabled this feature, will implement later */}
                            {/* <Button */}
                            {/*     variant="outline" */}
                            {/*     className="w-full" */}
                            {/*     type="button" */}
                            {/* > */}
                            {/*     {t('loginWithGoogle')} */}
                            {/* </Button> */}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </CardContainer>
    );
}

export default memo(LoginFormContainer);
