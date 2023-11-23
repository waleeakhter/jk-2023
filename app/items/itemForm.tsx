import React, { useRef } from "react";
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Item name is required").uppercase(),
    stock: Yup.number().required().default(0).positive().min(0),
    type: Yup.string().required(),
    brand: Yup.string().required(),
    purchase_price: Yup.number().required().default(0),
    price: Yup.number().required().default(0).min(1),
    stockUpdate: Yup.string().default(new Date().toISOString()),
    createdAt: Yup.string().default(new Date().toISOString())
});

// You can import your 'types' and 'brands' here if needed
import types from "@/app/utils/types.json";
import brands from "@/app/utils/brands.json";
import { Item } from "@/typings";
import { useMutation } from "@tanstack/react-query";

function ItemForm() {
    const toast = useRef<Toast>(null);

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<Item>({ resolver: yupResolver(validationSchema), })
    // const onSubmit = handleSubmit((data) => console.log(data))


    const { mutate: onSubmit, isPending } = useMutation({
        mutationFn: async (newData: Item) => {
            const response = await fetch('/api/item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: "no-cache",
                body: JSON.stringify(newData),
            })
            return response.json().then(data => data);
        },
        onError: (error: { data: Error, message: string }) => {
            toast.current?.show({ severity: 'warn', summary: 'Error', detail: error.data.message });
            toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message });
        },
        onSuccess: (res: { data: Item, message: string }) => {
            const { data, message } = res
            // reset()
            toast.current?.show({ severity: 'success', summary: 'Info', detail: message });

        },
    });
    return (
        <>
            <Toast ref={toast} />
            <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-field ">
                        <label htmlFor="name">Name</label>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <InputText id="name" {...field} className={`w-full ${errors.name ? 'p-invalid' : ''}`} />
                            )}
                        />
                        <div className="p-message p-message-error">{errors.name?.message}</div>
                    </div>
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="stock">Stock</label>
                        <Controller
                            name="stock"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <InputNumber id="stock" value={value ?? 0} placeholder="Enter total stock" min={0}
                                    onChange={e => onChange(e.value)} className={`w-full ${errors.stock ? 'p-invalid' : ''}`} />
                            )}
                        />
                        <div className="p-message p-message-error">{errors.stock?.message}</div>
                    </div>
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="type">Type</label>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    id="type"
                                    {...field}
                                    options={types}
                                    optionLabel="name" optionValue="value"
                                    className={`w-full ${errors.type ? 'p-invalid' : ''}`}
                                />
                            )}
                        />
                        <div className="p-message p-message-error">{errors.type?.message}</div>
                    </div>
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="brand">Brand</label>
                        <Controller
                            name="brand"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    id="brand"
                                    {...field}
                                    optionValue="value"
                                    optionLabel="name"
                                    options={brands.map(brand => { return { value: brand, name: brand.toLocaleUpperCase() } })}
                                    className={`w-full ${errors.brand ? 'p-invalid' : ''}`}
                                />
                            )}
                        />
                        <div className="p-message p-message-error">{errors.brand?.message}</div>
                    </div>
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="purchase_price">Purchase Price</label>
                        <Controller
                            name="purchase_price"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <InputNumber id="purchase_price" value={value ?? 0} onChange={(e) => onChange(e.value)} min={0}
                                    className={`w-full ${errors.purchase_price ? 'p-invalid' : ''}`} />
                            )}
                        />
                        <div className="p-message p-message-error">{errors.purchase_price?.message}</div>
                    </div>
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="price">Price</label>
                        <Controller
                            name="price"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <InputNumber id="price" value={value ?? 0} onChange={(e) => onChange(e.value)}
                                    className={`w-full ${errors.price ? 'p-invalid' : ''}`} min={0} />
                            )}
                        />
                        <div className="p-message p-message-error">{errors.price?.message}</div>
                    </div>
                </div>
                <div className="p-field p-col-12 text-end ">
                    <Button type="submit" label="Submit" outlined raised loading={isPending} />
                </div>

                <div>
                    <div className={'col-12'}>
                        <code>
                            <pre>Errors: {JSON.stringify(errors, null, 2)}</pre>
                        </code>
                    </div>
                </div>
            </form>
        </>
    );
}

export default ItemForm;
