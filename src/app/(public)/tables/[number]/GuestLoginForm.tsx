'use client';

import { memo, use, useCallback, useEffect } from 'react';

import { useForm } from 'react-hook-form';

import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';

import { initSocketInstance } from '@/utilities';

import { AuthContext } from '@/contexts';

import { AppNavigationRoutes, DEFAULT_PATH } from '@/constants';

import { useGuestLogin } from '@/hooks';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { handleErrorApi } from '@/lib';

import { GuestLoginBody, GuestLoginBodyType } from '@/schemaValidations';

function GuestLoginForm() {
    const router = useRouter();

    const searchParams = useSearchParams();
    const params = useParams();

    const tableNumber = Number(params.number);
    const token = searchParams.get('token');

    const { setSocket, setRole } = use(AuthContext);

    const { mutateAsync: loginAsGuest, isPending } = useGuestLogin();

    const form = useForm<GuestLoginBodyType>({
        resolver: zodResolver(GuestLoginBody),
        defaultValues: {
            name: '',
            token: token ?? '',
            tableNumber,
        },
    });

    const onSubmit = useCallback(
        async (values: GuestLoginBodyType) => {
            if (isPending) return;
            try {
                const {
                    payload: { data },
                } = await loginAsGuest(values);
                setRole(data.guest.role);
                setSocket(initSocketInstance(data.accessToken));
                router.push(AppNavigationRoutes.GUEST_MENU);
            } catch (error) {
                handleErrorApi({ error, setError: form.setError });
            }
        },
        [isPending, router, loginAsGuest, form.setError, setRole, setSocket]
    );

    useEffect(() => {
        if (!token) router.push(DEFAULT_PATH);
    }, [token, router]);

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Đăng nhập gọi món</CardTitle>
            </CardHeader>
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
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Tên khách hàng</Label>
                                            <Input
                                                id="name"
                                                type="text"
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
                                Đăng nhập
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default memo(GuestLoginForm);
