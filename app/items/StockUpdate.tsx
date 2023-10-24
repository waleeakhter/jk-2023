import { useMutation, useQuery } from '@tanstack/react-query'
import React, { forwardRef, useRef } from 'react'
import AdvanceSelect from '../components/AdvanceSelect'
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Item } from '@/typings';
import { Toast } from 'primereact/toast';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Badge } from 'primereact/badge';
import ReactDatePicker from 'react-datepicker';
import { InputText } from 'primereact/inputtext';
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
    const {
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors },
    } = useForm<stockUpdate>({ resolver: yupResolver(validationSchema), })


    const { data, isLoading, status } = useQuery({
        queryKey: ["items"],
        queryFn: async () => {
            const res = await fetch(`/api/item`)
            console.log(`${process.env.API_URL}item`, "react query")
            return res.json().then(data => data?.data as Array<Item>)
        }

    })
    const { mutate: onSubmit, isLoading: isSubbmiting } = useMutation(
        async (newData: stockUpdate) => {
            const response = await fetch('http://localhost:3000/api/item', {
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

        },
    });

    const getStock = () => {
        const item = data && data?.filter(item => item?._id === watch("item") ? item.stock : "");
        return item?.at(0)?.stock
    }
    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <button className="example-custom-input" onClick={onClick} ref={ref}>
            {value}
        </button>
    ));
    return (
        <>
            <Toast ref={toast} />
            <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                <div className="grid grid-cols-1 gap-4">
                    <div className="w-full">
                        <label htmlFor="item"><strong>Item</strong></label>
                        <Controller
                            name="item"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Dropdown filter multiple={false} name={'items'} value={value ?? ""} id='item'
                                    optionLabel='name' optionValue='_id' options={data ?? []} showClear placeholder='Select an Item'
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
                                        <Badge className='ml-auto' value={<span>Available: {getStock()}</span>} />
                                    </div>
                                    <InputNumber name={'items'} value={value ?? 0}
                                        placeholder='Select an Item' min={0} id='stock'
                                        className={`w-full ${errors.stock ? 'p-invalid' : ''}`} onChange={(e) => onChange(e.value ?? 0)} />
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
                                    <ReactDatePicker customInput={ }
                                        name={'items'} value={value ?? new Date()}
                                        placeholderText='Select an Item' id='stockUpdate'
                                        className={`w-full ${errors.stock ? 'p-invalid' : ''}`} onChange={(e) => onChange(e ?? 0)} />
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
    )
}

export default StockUpdate