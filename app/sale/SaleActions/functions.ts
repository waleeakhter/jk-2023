import { disabledBtns } from "@/app/components/Datatable/disableBtn";
import { onStatusChange } from "./ServerActions";

export const statusHandler = async (_id: string[], status: number, paidOn?: Date | undefined, e?: React.SyntheticEvent,) => {
    const btn = e ? (e.target as HTMLButtonElement) : null
    disabledBtns(btn, true);
    return onStatusChange(_id, status, paidOn as Date).then(res => {
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