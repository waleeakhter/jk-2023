import React, { useState } from 'react'
import { statusHandler } from './functions'
import { Sale } from '@/types/typings'
import { useSearchParams } from 'next/navigation'
import AlertForSaleUpdates from './Alert'
import { Button } from 'antd'

interface Props {
    rowData?: Sale,
    selection?: Array<Sale & { _id: string }>, emptySelection?: Function,
    startTransition: React.TransitionStartFunction
}
const SaleActions = ({ rowData, emptySelection, selection, startTransition }: Props) => {
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

        startTransition(() => statusHandler(rowData ?? selection,
            currentStatus, currentStatus === 1 ? paidOn : undefined, undefined).then((res) => {
                if (res?.success) {
                    if (emptySelection) {
                        emptySelection((prev: Object[]) => prev = [])
                    }
                }
            }))
    }
    return (
        <>
            <AlertForSaleUpdates visible={visible} setVisible={setVisible}
                callback={updateHandler} currentStatus={currentStatus} />
            {
                buttons.map(btn => (

                    !status.includes(btn?.status) ? "" : ""
                        // <Button shape="circle" size="small"  key={btn.text} 
                        //     danger={rowData?.status !== 0 ? true : false } type={rowData?.status === 1 ? 'primary' : rowData?.status === 2 : "default" }
                        //     onClick={(e) => { setCurrentStatus(btn.status); setVisible(true) }} >{rowData?.status}</Button>  : ""
                ))
            }

        </>

    )
}

export default SaleActions


