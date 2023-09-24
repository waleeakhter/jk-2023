import { disabledBtns } from "@/app/components/Datatable/disableBtn";
import { onStatusChange } from "./ServerActions";

export const statusHandler = async (data: Object[] | undefined, status: number, paidOn?: Date | undefined, e?: React.SyntheticEvent,) => {
    const btn = e ? (e.target as HTMLButtonElement) : null;
    alert("")
    disabledBtns(btn, true);
    return onStatusChange(data, status, paidOn as Date).then(res => {
        setTimeout(() => {
            disabledBtns(btn, false);
        }, 1000)
        return res
    }).catch(err => {
        setTimeout(() => {
            disabledBtns(btn, false);
        }, 1000)
        console.log(err)
        return err
    })
}