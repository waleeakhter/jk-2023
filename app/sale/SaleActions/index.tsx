import React from 'react'
import { Button } from '../form/formik'
import { statusHandler } from './functions'
import { Sale } from '@/typings'
import { useSearchParams } from 'next/navigation'

interface Props { rowData: Sale & { _id: string }, paidOn: Date }
const SaleActions = ({ rowData, paidOn }: Props) => {
    const searchParams = useSearchParams().toString()!;
    const params = new URLSearchParams(searchParams);
    const status = params.get("status")
    const buttons = [
        { status: 0, text: "Change to Pending ", icon: "pi-replay" },
        { status: 1, text: "Amount Recevied", icon: "pi-check-square" },
        { status: 2, text: "Credit Transfer: Add to client Account", icon: "pi-user-plus" }
    ]

    return (
        <>
            {
                buttons.map(btn => (

                    btn.status !== Number(status) ? <Button key={btn.text} icon={"pi " + btn.icon}
                        tooltip={btn.text} tooltipOptions={{ position: 'bottom' }}
                        size='small' onClick={(e) => statusHandler(e, [rowData._id],
                            btn.status, btn.status === 1 ? paidOn : undefined)} /> : ""
                ))
            }

        </>

    )
}

export default SaleActions
