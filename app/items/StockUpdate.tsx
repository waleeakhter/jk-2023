import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useRef, useState } from 'react'
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Item } from '@/typings';
import { Toast } from 'primereact/toast';
import moment from "moment";
import { InputNumber, DatePicker, Select, Badge, Tag, Radio } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEuro } from "@fortawesome/free-solid-svg-icons";
import types from '@/app/utils/types.json';
import { type } from 'os';
type Props = { check: string }
type stockUpdate = {
    item: string,
    stock: number,
    stockUpdate: string,
    purchase_price: number
}
const validationSchema = Yup.object().shape({
    item: Yup.string().required("Item name is required").uppercase(),
    stock: Yup.number().required().default(0).positive().min(1),
    purchase_price: Yup.number().required().default(0),
    stockUpdate: Yup.string().default(new Date().toISOString()),
});

const StockUpdate = ({ check }: Props) => {
    const toast = useRef<Toast>(null);
    const [fillObject, setFilters] = useState({
        type: ''
    })
    const {
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors },
    } = useForm<stockUpdate>({ resolver: yupResolver(validationSchema), })


    const { data, isLoading, status } = useQuery({
        queryKey: ["items", { fillObject }],
        queryFn: async () => {
            const res = await fetch(`/api/item?${fillObject.type && "type=" + fillObject.type}`)
            console.log(`${process.env.API_URL}item`, "react query")
            return res.json().then(data => data?.data as Array<Item>)
        }

    })
    const { mutate: onSubmit, isLoading: isSubbmiting } = useMutation(
        async (newData: stockUpdate) => {
            const response = await fetch('http://localhost:3000/api/item?', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: "no-cache",
                body: JSON.stringify(newData),
            })
            return response.json().then(data => data);
        }, {
        onError: (error: { data: Error, message: string }) => {
            toast.current?.show({ severity: 'warn', summary: 'Error', detail: error.data.message });
            toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message });
        },
        onSuccess: (res: { data: stockUpdate, message: string }) => {
            const { data, message } = res
            reset()
            toast.current?.show({ severity: 'success', summary: 'Info', detail: message });

        }
    });

    const getStock = () => {
        const item = data && data?.filter(item => item?._id === watch("item") ? item.stock : "");
        return item?.at(0)?.stock ?? 0
    }

    return (
        <div>
            <>
                <Toast ref={toast} />
                <div className='my-5 w-48 ml-auto'>
                    <label htmlFor="item"><strong>Select Type</strong></label>
                    <Select showSearch value={fillObject.type} id='item' size='large' className='w-full'
                        filterOption={(input, option) =>
                            (option?.name?.toLocaleLowerCase() ?? '').includes(input.toLocaleLowerCase())}
                        options={types ?? []} placeholder='Select an type'
                        onChange={(e) => setFilters(prev => { return { ...prev, type: e ?? "" } })} />
                </div>
                <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="w-full">
                            <label htmlFor="item"><strong>Item</strong></label>
                            <Controller
                                name="item"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Select showSearch value={value ?? ""} id='item' size='large' loading={isLoading} disabled={isLoading}
                                        filterOption={(input, option) =>
                                            (option?.name?.toLocaleLowerCase() ?? '').includes(input.toLocaleLowerCase())}
                                        fieldNames={{ label: "name", value: "_id" }}
                                        options={data ?? []} placeholder='Select an Item'
                                        className={`w-full ${errors.item ? 'p-invalid' : ''}`} onChange={onChange} />

                                )}
                            />
                            <div className="p-message p-message-error">{errors.item?.message}</div>
                        </div>
                        <div className="w-full">
                            <Controller
                                name="stock"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <>
                                        <div className='flex mb-2'>
                                            <label htmlFor="stock"><strong>Stock</strong></label>
                                            <Tag className='ml-auto'> <Badge status="success" text={<span>Available: {getStock()}</span>} /> </Tag>
                                        </div>
                                        <InputNumber name={'items'} value={value ?? 0} size='large'
                                            parser={(value) => value ? parseInt(value) : 0}
                                            placeholder='Select an Item' min={0} id='stock' addonBefore={<FontAwesomeIcon icon={faEuro} />}
                                            className={`w-full ${errors.stock ? 'p-invalid' : ''}`} onChange={(e) => onChange(e ?? 0)} />
                                    </>

                                )}
                            />
                            <div className="p-message p-message-error">{errors.stock?.message}</div>
                        </div>
                        <div className="w-full">
                            <Controller
                                name="stockUpdate"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <>
                                        <label htmlFor="stock"><strong>Stock Update Date</strong></label>
                                        <DatePicker size='large' className='w-full'
                                            onChange={(date, dateString) =>
                                                onChange(moment(dateString).add(1, "h"))} format="YYYY-MM-D HH:m:s" />

                                    </>

                                )}
                            />
                            <div className="p-message p-message-error">{errors.stock?.message}</div>
                        </div>
                    </div>

                    <div>
                        <div className={'col-12'}>
                            <code>
                                <pre>Errors: {JSON.stringify(watch(), null, 2)}</pre>
                            </code>
                            <code>
                                <pre>Errors: {JSON.stringify(errors, null, 2)}</pre>
                            </code>
                        </div>
                    </div>
                </form>
            </>

        </div>
    )
}

export default StockUpdate