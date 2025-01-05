'use client';

import { type ChangeEvent, memo, useEffect, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';

import { useAccountProfile } from '@/hooks';

import CardContainer from '@/containers/CardContainer';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { UpdateMeBody, UpdateMeBodyType } from '@/schemaValidations';

function UpdateProfileForm() {
    const [file, setFile] = useState<File | null>(null);

    const avatarInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<UpdateMeBodyType>({
        resolver: zodResolver(UpdateMeBody),
        defaultValues: {
            name: '',
            avatar: '',
        },
    });
    const avatar = form.watch('avatar');
    const name = form.watch('name');

    const handleUploadAvatar = () => avatarInputRef.current?.click();

    const handleChangeAvatarInput = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        setFile(selectedFile as File);
    };

    const previewAvatar = file ? URL.createObjectURL(file) : avatar;

    const { data: myAccountProfile } = useAccountProfile();

    useEffect(() => {
        if (myAccountProfile) {
            const { name: myName, avatar: myAvatar } = myAccountProfile.payload.data;
            form.reset({
                name: myName,
                avatar: myAvatar ?? '',
            });
        }
    }, [form, myAccountProfile]);

    return (
        <Form {...form}>
            <form
                noValidate
                className="grid auto-rows-max items-start gap-4 md:gap-8"
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
                                            onChange={handleChangeAvatarInput}
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

export default memo(UpdateProfileForm);
