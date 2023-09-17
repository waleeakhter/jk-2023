import React, { useState } from 'react'
import { Button } from '../form/formik'
import { statusHandler } from './functions'
import { Sale } from '@/typings'
import { useSearchParams } from 'next/navigation'
import AlertForSaleUpdates from './Alert'

interface Props {
    rowData?: Object[],
    selection?: Array<{ _id: string }>, emptySelection?: Function
}
const SaleActions = ({ rowData, emptySelection, selection }: Props) => {
    const searchParams = useSearchParams().toString()!;
    const params = new URLSearchParams(searchParams);
    const status = JSON.parse(params.get("status") ?? '[0]')
    const [currentStatus, setCurrentStatus] = useState(0)
    const [visible, setVisible] = useState<boolean>(false);
    const buttons = [
        { status: 0, text: "Change to Unpaid ", icon: "pi-replay", severity: "danger" },
        { status: 1, text: "Amount Recevied", icon: "pi-check-square", severity: "primary" },
        { status: 2, text: "Credit Transfer: Add to client Account", icon: "pi-user-plus", severity: "primary" }
    ]


    const updateHandler = (paidOn: Date) => {

        statusHandler(rowData ?? selection,
            currentStatus, currentStatus === 1 ? paidOn : undefined, undefined).then((res) => {
                if (res?.success) {
                    if (emptySelection) {
                        emptySelection((prev: Object[]) => prev = [])
                    }
                }
            })
    }
    return (
        <>
            <AlertForSaleUpdates visible={visible} setVisible={setVisible}
                callback={updateHandler} currentStatus={currentStatus} />
            {
                buttons.map(btn => (

                    !status.includes(btn.status) ?
                        <Button key={btn.text} icon={"pi " + btn.icon}
                            severity={btn.severity as "warning" | "secondary" | "success" | "info" | "danger" | "help"}
                            tooltip={btn.text} tooltipOptions={{ position: 'bottom' }}
                            size='small' onClick={(e) => { setCurrentStatus(btn.status); setVisible(true) }} /> : ""
                ))
            }

        </>

    )
}

export default SaleActions


