'use client';

import { memo, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Upload } from 'lucide-react';

import { toast, useAddAccount, useMediaMutation } from '@/hooks';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { handleErrorApi } from '@/lib';

import { CreateEmployeeAccountBody, CreateEmployeeAccountBodyType } from '@/schemaValidations';

function AddEmployee() {
    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState(false);

    const avatarInputRef = useRef<HTMLInputElement | null>(null);

    const { mutateAsync: addAccount, isPending } = useAddAccount();
    const { mutateAsync: uploadMedia } = useMediaMutation();

    const form = useForm<CreateEmployeeAccountBodyType>({
        resolver: zodResolver(CreateEmployeeAccountBody),
        defaultValues: {
            name: '',
            email: '',
            avatar: undefined,
            password: '',
            confirmPassword: '',
        },
    });
    const avatar = form.watch('avatar');
    const name = form.watch('name');

    const previewAvatarFromFile = file ? URL.createObjectURL(file) : avatar;

    const handleUploadAvatar = () => avatarInputRef.current?.click();

    const resetForm = () => {
        form.reset();
        setFile(null);
    };

    const submitForm = async (values: CreateEmployeeAccountBodyType) => {
        if (isPending) return;
        try {
            let body = values;
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                const { payload } = await uploadMedia(formData);
                const imageUrl = payload.data;
                body = {
                    ...values,
                    avatar: imageUrl,
                };
            }
            const result = await addAccount(body);

            toast({
                description: result.payload.message,
            });

            // clear data from form and close modal
            resetForm();
            setOpen(false);
        } catch (error) {
            handleErrorApi({
                error,
                setError: form.setError,
            });
        }
    };

    return (
        <Dialog
            onOpenChange={setOpen}
            open={open}
        >
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    className="h-7 gap-1"
                >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Tạo tài khoản</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
                <DialogHeader>
                    <DialogTitle>Tạo tài khoản</DialogTitle>
                    <DialogDescription>Các trường tên, email, mật khẩu là bắt buộc</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        noValidate
                        className="grid auto-rows-max items-start gap-4 md:gap-8"
                        id="add-employee-form"
                        onReset={resetForm}
                        onSubmit={form.handleSubmit(submitForm)}
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="password">Mật khẩu</Label>
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
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
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
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button
                        type="submit"
                        form="add-employee-form"
                    >
                        Thêm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default memo(AddEmployee);
