'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';

import { getVietnameseDishStatus } from '@/utilities';

import { DishStatus, DishStatusValues } from '@/constants';

import { toast, useGetDish, useMediaMutation, useUpdateDish } from '@/hooks';

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
import { Textarea } from '@/components/ui/textarea';

import { handleErrorApi } from '@/lib';

import { UpdateDishBody, UpdateDishBodyType } from '@/schemaValidations';

interface EditDishProps {
    id?: number | undefined;
    setId: (value: number | undefined) => void;
    onSubmitSuccess?: () => void;
}

function EditDish({ id, setId, onSubmitSuccess }: EditDishProps) {
    const [file, setFile] = useState<File | null>(null);

    const imageInputRef = useRef<HTMLInputElement | null>(null);

    const { data: dish } = useGetDish(id as number);
    const { mutateAsync: updateDish, isPending } = useUpdateDish();
    const { mutateAsync: uploadMedia } = useMediaMutation();

    const form = useForm<UpdateDishBodyType>({
        resolver: zodResolver(UpdateDishBody),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            image: undefined,
            status: DishStatus.Unavailable,
        },
    });
    const image = form.watch('image');
    const name = form.watch('name');

    const previewAvatarFromFile = file ? URL.createObjectURL(file) : image;

    const handleUploadDishImage = () => imageInputRef.current?.click();

    const resetForm = useCallback(() => {
        form.reset();
        setId(undefined);
        setFile(null);
    }, [form, setId]);

    const submitForm = useCallback(
        async (values: UpdateDishBodyType) => {
            if (isPending) return;
            try {
                let body: UpdateDishBodyType & { id: number } = { id: id as number, ...values };
                if (file) {
                    const formData = new FormData();
                    formData.append('file', file);
                    const { payload } = await uploadMedia(formData);
                    const imageUrl = payload.data;
                    body = {
                        ...body,
                        image: imageUrl,
                    };
                }
                const result = await updateDish(body);

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
        [updateDish, file, form.setError, id, isPending, onSubmitSuccess, resetForm, uploadMedia]
    );

    useEffect(() => {
        if (dish) {
            const { name: dishName, image: dishImage, price, description, status } = dish.payload.data;
            form.reset({
                name: dishName,
                image: dishImage,
                price,
                description,
                status,
            });
        }
    }, [dish, form]);

    return (
        <Dialog
            open={Boolean(id)}
            onOpenChange={(value) => {
                if (!value) resetForm();
            }}
        >
            <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
                <DialogHeader>
                    <DialogTitle>Cập nhật món ăn</DialogTitle>
                    <DialogDescription>Các trường sau đây là bắt buộc: Tên, ảnh</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        noValidate
                        className="grid auto-rows-max items-start gap-4 md:gap-8"
                        id="edit-dish-form"
                        onSubmit={form.handleSubmit(submitForm)}
                        onReset={resetForm}
                    >
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex gap-2 items-start justify-start">
                                            <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                                                <AvatarImage src={previewAvatarFromFile} />
                                                <AvatarFallback className="rounded-none">
                                                    {name || 'Dish image'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={imageInputRef}
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
                                                onClick={handleUploadDishImage}
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
                                            <Label htmlFor="name">Tên món ăn</Label>
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
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="price">Giá</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Input
                                                    id="price"
                                                    className="w-full"
                                                    {...field}
                                                    type="number"
                                                />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="description">Mô tả sản phẩm</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Textarea
                                                    id="description"
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
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="description">Trạng thái</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn trạng thái" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {DishStatusValues.map((status) => (
                                                            <SelectItem
                                                                key={status}
                                                                value={status}
                                                            >
                                                                {getVietnameseDishStatus(status)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <FormMessage />
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
                        form="edit-dish-form"
                    >
                        Lưu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default memo(EditDish);
