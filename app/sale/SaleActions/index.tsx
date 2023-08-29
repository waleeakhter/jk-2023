import React, { useState } from 'react'
import { Button } from '../form/formik'
import { statusHandler } from './functions'
import { Sale } from '@/typings'
import { useSearchParams } from 'next/navigation'
import AlertForSaleUpdates from './Alert'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

interface Props {
    rowData?: Sale & { _id: string },
    selection: Array<{ _id: string }>, emptySelection?: Function
}
const SaleActions = ({ rowData, emptySelection, selection }: Props) => {
    const searchParams = useSearchParams().toString()!;
    const params = new URLSearchParams(searchParams);
    const status = JSON.parse(params.get("status") ?? '[0]')
    const [currentStatus, setCurrentStatus] = useState(0)
    const [visible, setVisible] = useState<boolean>(false);
    const buttons = [
        { status: 0, text: "Change to Pending ", icon: "pi-replay" },
        { status: 1, text: "Amount Recevied", icon: "pi-check-square" },
        { status: 2, text: "Credit Transfer: Add to client Account", icon: "pi-user-plus" }
    ]


    const updateHandler = (paidOn: Date) => {
        const itemsID: string[] = []
        if (rowData) {
            itemsID.push(rowData._id)
        } else if (selection) {
            selection.map((val) => itemsID.push(val._id));
        }
        statusHandler(itemsID,
            currentStatus, currentStatus === 1 ? paidOn : undefined, undefined).then((res) => {
                if (res?.acknowledged) {
                    if (emptySelection) {
                        emptySelection((prev: Object[]) => prev = [])
                    }
                }
            })
    }
    return (
        <>
            <AlertForSaleUpdates visible={visible} setVisible={setVisible} callback={updateHandler} />
            {
                buttons.map(btn => (

                    !status.includes(btn.status) ? <Button key={btn.text} icon={"pi " + btn.icon}
                        tooltip={btn.text} tooltipOptions={{ position: 'bottom' }}
                        size='small' onClick={(e) => { setCurrentStatus(btn.status); setVisible(true) }} /> : ""
                ))
            }

        </>

    )
}

export default SaleActions
function acceptFunc(): void {
    throw new Error('Function not implemented.')
}

function rejectFunc(): void {
    throw new Error('Function not implemented.')
}

