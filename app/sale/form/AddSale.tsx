"use client"
import { Client, Item } from '@/typings';
import { ErrorMessage, Formik, Field, FormikHelpers } from 'formik';
import { Button } from "primereact/button"
import React, { useState } from 'react'
import AdvanceSelect from '../../components/AdvanceSelect';
import { validationSchema } from './validationSchema';
import initialValues from './initialValues';
// import { getClients, getItems } from './serverAction';
import { callback, onSubmit } from "./submit"
import DatePicker from "react-datepicker";


type Props = { items: Item[], clients: Client[] }

const AddSale = ({ items, clients }: Props) => {
    const [startDate, setStartDate] = useState(new Date());


    const onDateChange = (date: Date, setFieldValue: Function) => {
        console.log(new Date(date).toLocaleString())
        setStartDate(prev => prev = date)
        setFieldValue('createdAt', new Date(date))
    }

    return <React.Fragment>
        <Formik
            validationSchema={validationSchema("1")}
            initialValues={initialValues}
            onSubmit={(values, actions) =>
                onSubmit(values as typeof initialValues, actions as FormikHelpers<typeof initialValues>)
            }
            enableReinitialize={true}
        >
            {({ values, errors, touched, setFieldValue, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                    <h1 className='text-theme text-3xl'>Add Item</h1>
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-5">
                        <div className='from-group'>
                            <label>Item Name</label>
                            <AdvanceSelect name={"item"} value={"name"} lableValue={"name"}
                                options={items} extra={"price"} callback={callback} setFieldValue={setFieldValue} />
                            <span className=' text-red-600 '><ErrorMessage name="item" /></span>
                        </div>
                        <div className='from-group'>
                            <label>Client</label>
                            <AdvanceSelect name={"client"} value={"name"} lableValue={"name"} options={clients} setFieldValue={setFieldValue} />
                            <span className=' text-red-600 '><ErrorMessage name="client" /></span>
                        </div>
                        <div className='from-group'>
                            <label className='block w-full'>Sell Quantity</label>
                            <Field type="number" name="sell_quantity"
                                placeholder="Selling Quantity" min="0"
                                className=" min-h-[50px] focus:outline-none border w-full p-3 rounded-md  " />
                            <span className=' text-red-600 '><ErrorMessage name="sell_quantity" /></span>
                        </div>
                        <div className='from-group '>
                            <label className='block w-full'>Sell Price</label>
                            <Field type="number" name="sell_price" placeholder="Selling Price"
                                className=" min-h-[50px] focus:outline-none border w-full p-3 rounded-md  " />
                            <span className=' text-red-600 '><ErrorMessage name="sell_price" /></span>
                        </div>
                        <div className='from-group '>
                            <label className='block w-full'>Reference</label>
                            <Field type="text" name="reference" placeholder="Reference..." min="0"
                                className=" min-h-[50px] focus:outline-none border w-full p-3 rounded-md  " />
                            <span className=' text-red-600 '><ErrorMessage name="reference" /></span>
                        </div>
                        <div className='form-group'>
                            <label className='block w-full'>Date</label>
                            <DatePicker name="createdAt" selected={startDate} className=' z-[100] '
                                placeholderText="Select a date" maxDate={new Date()} showTimeInput
                                onChange={(date: Date) => onDateChange(date, setFieldValue)} />
                        </div>
                    </div>


                    <div className='from-group w-full mt-5'>
                        <Button disabled={isSubmitting} loading={isSubmitting} label="Save" icon=" pi pi-arrow-up-right " iconPos='right' />
                    </div>

                    {true && (
                        <div className={'row mt-5'}>
                            <div className={'col-12'}>
                                <code>
                                    <pre>Values: {JSON.stringify(values, null, 2)}</pre>
                                </code>
                            </div>
                            <div className={'col-12'}>
                                <pre>Errors: {JSON.stringify(errors, null, 2)}</pre>
                            </div>
                            <div className={'col-12'}>
                                <pre>Touched: {JSON.stringify(touched, null, 2)}</pre>
                            </div>
                        </div>
                    )}
                </form>
            )}
        </Formik>

    </React.Fragment>
}

export default AddSale