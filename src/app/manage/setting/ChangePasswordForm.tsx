'use client';

import { memo } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import CardContainer from '@/containers/CardContainer';

import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ChangePasswordBody, ChangePasswordBodyType } from '@/schemaValidations';

function ChangePasswordForm() {
    const form = useForm<ChangePasswordBodyType>({
        resolver: zodResolver(ChangePasswordBody),
        defaultValues: {
            oldPassword: '',
            password: '',
            confirmPassword: '',
        },
    });

    return (
        <Form {...form}>
            <form
                noValidate
                className="grid auto-rows-max items-start gap-4 md:gap-8"
            >
                <CardContainer
                    containerClassName="overflow-hidden"
                    title="Đổi mật khẩu"
                    x-chunk="dashboard-07-chunk-4"
                >
                    <div className="grid gap-6">
                        <FormField
                            control={form.control}
                            name="oldPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid gap-3">
                                        <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
                                        <Input
                                            id="oldPassword"
                                            type="password"
                                            className="w-full"
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
                                    <div className="grid gap-3">
                                        <Label htmlFor="password">Mật khẩu mới</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            className="w-full"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid gap-3">
                                        <Label htmlFor="confirmPassword">Nhập lại mật khẩu mới</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            className="w-full"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <div className=" items-center gap-2 md:ml-auto flex">
                            <Button
                                variant="outline"
                                size="sm"
                            >
                                Hủy
                            </Button>
                            <Button size="sm">Lưu thông tin</Button>
                        </div>
                    </div>
                </CardContainer>
            </form>
        </Form>
    );
}

export default memo(ChangePasswordForm);
