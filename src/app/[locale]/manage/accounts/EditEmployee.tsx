'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';

import { Role, RoleValues } from '@/constants';

import { toast, useGetAccount, useMediaMutation, useUpdateAccount } from '@/hooks';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { handleErrorApi } from '@/lib';

import { UpdateEmployeeAccountBody, type UpdateEmployeeAccountBodyType } from '@/schemaValidations/account';

interface EditEmployeeProps {
    id?: number | undefined;
    setId: (value: number | undefined) => void;
    onSubmitSuccess?: () => void;
}

function EditEmployee({ id, setId, onSubmitSuccess }: EditEmployeeProps) {
    const [file, setFile] = useState<File | null>(null);

    const avatarInputRef = useRef<HTMLInputElement | null>(null);

    const { data } = useGetAccount({
        id: id as number,
        enabled: Boolean(id),
    });
    const { mutateAsync: editEmployee, isPending } = useUpdateAccount();
    const { mutateAsync: uploadMedia } = useMediaMutation();

    const form = useForm<UpdateEmployeeAccountBodyType>({
        resolver: zodResolver(UpdateEmployeeAccountBody),
        defaultValues: {
            name: '',
            email: '',
            avatar: undefined,
            password: undefined,
            confirmPassword: undefined,
            changePassword: false,
            role: Role.Employee,
        },
    });
    const avatar = form.watch('avatar');
    const name = form.watch('name');
    const changePassword = form.watch('changePassword');

    const previewAvatarFromFile = file ? URL.createObjectURL(file) : avatar;

    const handleUploadAvatar = useCallback(() => avatarInputRef.current?.click(), []);

    const resetForm = useCallback(() => {
        form.reset();
        setId(undefined);
        setFile(null);
    }, [form, setId]);

    const submitForm = useCallback(
        async (values: UpdateEmployeeAccountBodyType) => {
            if (isPending) return;
            try {
                let body: UpdateEmployeeAccountBodyType & { id: number } = { id: id as number, ...values };
                if (file) {
                    const formData = new FormData();
                    formData.append('file', file);
                    const { payload } = await uploadMedia(formData);
                    const imageUrl = payload.data;
                    body = {
                        ...body,
                        avatar: imageUrl,
                    };
                }
                const result = await editEmployee(body);

                toast({
                    description: result.payload.message,
                });

                // clear data from form
                resetForm();
                if (onSubmitSuccess) onSubmitSuccess();
            } catch (error) {
                handleErrorApi({
                    error,
                    setError: form.setError,
                });
            }
        },
        [editEmployee, file, form.setError, id, isPending, onSubmitSuccess, resetForm, uploadMedia]
    );

    useEffect(() => {
        if (data) {
            const { name: employeeName, avatar: avatarEmployee, email, role } = data.payload.data;
            form.reset({
                email,
                name: employeeName,
                avatar: avatarEmployee ?? undefined,
                changePassword: form.getValues('changePassword'),
                password: form.getValues('password'),
                confirmPassword: form.getValues('confirmPassword'),
                role,
            });
        }
    }, [data, form]);

    return (
        <Dialog
            open={Boolean(id)}
            onOpenChange={(value) => {
                if (!value) resetForm();
            }}
        >
            <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
                <DialogHeader>
                    <DialogTitle>Cập nhật tài khoản</DialogTitle>
                    <DialogDescription>Các trường tên, email, mật khẩu là bắt buộc</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        noValidate
                        className="grid auto-rows-max items-start gap-4 md:gap-8"
                        id="edit-employee-form"
                        onSubmit={form.handleSubmit(submitForm)}
                        onReset={resetForm}
                    >
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex gap-2 items-start justify-start">
                                            <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                                                <AvatarImage src={previewAvatarFromFile} />
                                                <AvatarFallback className="rounded-none">
                                                    {name || 'Avatar'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={avatarInputRef}
                                                onChange={(e) => {
                                                    const selectedFile = e.target.files?.[0];
                                                    if (selectedFile) {
                                                        setFile(selectedFile);
                                                        field.onChange('http://localhost:3000/' + selectedFile.name);
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                            <button
                                                className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                                                type="button"
                                                onClick={handleUploadAvatar}
                                            >
                                                <Upload className="h-4 w-4 text-muted-foreground" />
                                                <span className="sr-only">Upload</span>
                                            </button>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="name">Tên</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Input
                                                    id="name"
                                                    className="w-full"
                                                    {...field}
                                                />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="email">Email</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Input
                                                    id="email"
                                                    className="w-full"
                                                    {...field}
                                                />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="role">Vai trò</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn vai trò" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {RoleValues.map((role) => {
                                                            if (role === Role.Guest) return null;
                                                            return (
                                                                <SelectItem
                                                                    key={role}
                                                                    value={role}
                                                                >
                                                                    {role}
                                                                </SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="changePassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="email">Đổi mật khẩu</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            {changePassword && (
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                                <Label htmlFor="password">Mật khẩu mới</Label>
                                                <div className="col-span-3 w-full space-y-2">
                                                    <Input
                                                        id="password"
                                                        className="w-full"
                                                        type="password"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            )}
                            {changePassword && (
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                                                <div className="col-span-3 w-full space-y-2">
                                                    <Input
                                                        id="confirmPassword"
                                                        className="w-full"
                                                        type="password"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button
                        type="submit"
                        form="edit-employee-form"
                    >
                        Lưu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default memo(EditEmployee);
