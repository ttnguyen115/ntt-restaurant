'use client';

import { memo, useEffect, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';

import { toast, useMediaMutation, useMyAccount, useMyAccountMutation } from '@/hooks';

import CardContainer from '@/containers/CardContainer';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { handleErrorApi } from '@/lib';

import { UpdateMeBody, UpdateMeBodyType } from '@/schemaValidations';

function UpdateProfileFormContainer() {
    const [file, setFile] = useState<File | null>(null);

    const avatarInputRef = useRef<HTMLInputElement>(null);

    const { data: myAccountProfile, refetch } = useMyAccount();
    const { mutateAsync: updateMyAccount, isPending } = useMyAccountMutation();
    const { mutateAsync: uploadMedia } = useMediaMutation();

    const form = useForm<UpdateMeBodyType>({
        resolver: zodResolver(UpdateMeBody),
        defaultValues: {
            name: '',
            avatar: undefined,
        },
    });
    const avatar = form.watch('avatar');
    const name = form.watch('name');

    const previewAvatar = file ? URL.createObjectURL(file) : avatar;

    const handleUploadAvatar = () => avatarInputRef.current?.click();

    const resetForm = () => {
        form.reset();
        setFile(null);
    };

    const submitForm = async (values: UpdateMeBodyType) => {
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
            const result = await updateMyAccount(body);

            toast({
                description: result.payload.message,
            });

            // refetch to update new avatar for top navbar
            await refetch();
        } catch (error) {
            handleErrorApi({
                error,
                setError: form.setError,
            });
        }
    };

    useEffect(() => {
        if (myAccountProfile) {
            const { name: myName, avatar: myAvatar } = myAccountProfile.payload.data;
            form.reset({
                name: myName,
                avatar: myAvatar ?? undefined,
            });
        }
    }, [form, myAccountProfile]);

    return (
        <Form {...form}>
            <form
                noValidate
                className="grid auto-rows-max items-start gap-4 md:gap-8"
                id="update-profile-form"
                onReset={resetForm}
                onSubmit={form.handleSubmit(submitForm)}
            >
                <CardContainer
                    title="Thông tin cá nhân"
                    x-chunk="dashboard-07-chunk-0"
                >
                    <div className="grid gap-6">
                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex gap-2 items-start justify-start">
                                        <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                                            <AvatarImage src={previewAvatar} />
                                            <AvatarFallback className="rounded-none">{name}</AvatarFallback>
                                        </Avatar>
                                        <input
                                            {...field}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const selectedFile = e.target.files?.[0];
                                                if (selectedFile) {
                                                    setFile(selectedFile);
                                                    field.onChange(`http://localhost:3000/${field.name}`);
                                                }
                                            }}
                                            value=""
                                            ref={avatarInputRef}
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
                                    <div className="grid gap-3">
                                        <Label htmlFor="name">Tên</Label>
                                        <Input
                                            id="name"
                                            type="text"
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
                                type="reset"
                            >
                                Hủy
                            </Button>
                            <Button
                                size="sm"
                                type="submit"
                            >
                                Lưu thông tin
                            </Button>
                        </div>
                    </div>
                </CardContainer>
            </form>
        </Form>
    );
}

export default memo(UpdateProfileFormContainer);
