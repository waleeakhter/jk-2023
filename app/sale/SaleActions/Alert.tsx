
import React, { useRef, useState } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import DatePicker from 'react-datepicker';

interface Props { visible: boolean, setVisible: Function, callback: Function }
const AlertForSaleUpdates = ({ visible, setVisible, callback }: Props) => {

    const [paidDate, setPaidDate] = useState<Date>(new Date())
    const toast = useRef<Toast>(null);

    const accept = () => {
        callback(paidDate)

        toast.current?.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    }

    const reject = () => {
        toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }

    const datepicker = () => {
        return <div>
            <label className='block' htmlFor='paidOn'><i className="pi pi-exclamation-triangle"></i> Paid On <small>(Select the Item Paid Date If Neended )</small></label>
            <DatePicker id='paidOn' clearButtonClassName='pi pi-times' className=' h-12 w-[20rem] z-[100]  p-2' name="createdAt" selected={paidDate}
                placeholderText="Select a date" maxDate={new Date()} showTimeInput
                onChange={(date) => setPaidDate(date ?? new Date())} />
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