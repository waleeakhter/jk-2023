
import React, { useRef, useState } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import DatePicker from 'react-datepicker';

interface Props { visible: boolean, setVisible: Function, callback: Function, currentStatus: number }
const AlertForSaleUpdates = ({ visible, setVisible, callback, currentStatus }: Props) => {

    const [paidDate, setPaidDate] = useState<Date>(new Date())
    const toast = useRef<Toast>(null);
    const getThingsRegardingStatus = (value: number) => {
        switch (value) {
            case 1:
                return <>
                    <label className='block' htmlFor='paidOn'><i className="pi pi-exclamation-triangle"></i> Paid On <small>(Select the Item Paid Date If Neended )</small></label>
                    <DatePicker id='paidOn' clearButtonClassName='pi pi-times' className=' h-12 w-[20rem] z-[100]  p-2' name="createdAt" selected={paidDate}
                        placeholderText="Select a date" maxDate={new Date()} showTimeInput
                        onChange={(date) => setPaidDate(date ?? new Date())} />
                </>
            case 2:
                return <p> Are you sure you want to add this item to the client&apos;s account?
                </p>
            case 0:
                return <p>
                    Are you sure this action will affect the collected amount and change the item&apos;s status to unpaid?
                </p>

            default:
                break;
        }

    }
    const accept = () => {
        callback(paidDate)

        toast.current?.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    }

    const reject = () => {
        toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }

    const datepicker = () => {
        return <div>
            {getThingsRegardingStatus(currentStatus)}
        </div>
    }

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message={datepicker}
                header="Confirmation" accept={accept} reject={reject} />

        </>
    )
}
export default AlertForSaleUpdates