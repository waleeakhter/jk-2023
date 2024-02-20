'use client'
import { FormikHelpers } from "./formik";
import initialValues from "./initialValues";
import { submitSale } from "../serverAction";

export const onSubmit = (values: typeof initialValues, actions: FormikHelpers<typeof values>,) => {
    console.log("hello", values)


    submitSale(values).then(res => {
        console.log(res, "ahp")
        actions.setSubmitting(false)
        // actions.resetForm()
        if (!res.success) {
            alert(res.message)
        }
    })
};

export const callback = (value: { extra: number }, callback: Function) => {
    value?.extra && callback("sell_price", value.extra)
    callback("sell_quantity", 1)
}