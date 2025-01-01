'use client';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { GuestLoginBody, GuestLoginBodyType } from '@/schemaValidations/guest';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function GuestLoginForm() {
    const form = useForm<GuestLoginBodyType>({
        resolver: zodResolver(GuestLoginBody),
        defaultValues: {
            name: '',
            token: '',
            tableNumber: 1,
        },
    });

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
