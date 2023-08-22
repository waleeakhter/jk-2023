
import * as yup from "yup";
export const validationSchema = (id: string) => {
    return yup.object().shape({
        client: yup.mixed().required("Field is required!"),
        sell_price: yup.number().min(0).positive("Value should be greater than zero").required("Field is required!"),
        item: yup.mixed().required("Field is required!"),
        sell_quantity: yup.number().min(0).positive("Value should be greater than zero").required("Field is required!"),

    });
};

