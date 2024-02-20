import React, { useEffect, useState } from 'react'
import { statusHandler } from './functions'
import { Sale } from '@/types/typings'
import { useSearchParams } from 'next/navigation'
import AlertForSaleUpdates from './Alert'
import { Button, Tooltip } from 'antd'
import {
    CheckOutlined,
    UserAddOutlined,
    RollbackOutlined
} from '@ant-design/icons';
interface Props {
    rowData?: Sale,
    selection?: Array<Sale & { _id: string }>, emptySelection?: Function,
    startTransition: React.TransitionStartFunction
}
const SaleActions = ({ rowData, emptySelection, selection, startTransition }: Props) => {
    const searchParams = useSearchParams().toString()!;
    const params = new URLSearchParams(searchParams);
    const status = JSON.parse(params.get("status") ?? '[0]')
    const [currentStatus, setCurrentStatus] = useState<number>(0)
    const [currentRow, setCurrentRow] = useState<Sale | undefined>(rowData)
    const [visible, setVisible] = useState<boolean>(false);
    useEffect(() => {
        setCurrentRow(rowData)
    }, [rowData])

    const updateHandler = (paidOn: Date) => {
       console.log(selection,rowData, "___selection___")
        startTransition(async () => {
            
                const res = await statusHandler(rowData ?? selection,
                    currentStatus, currentStatus === 1 ? paidOn : undefined, undefined)
                if (res?.success) {
                    if (emptySelection && selection?.length) {
                        emptySelection((prev: Object[]) => prev = [])
                    }
                }
         
            return Promise.resolve();
        });
    }

    const ActionButtion = (status: number[]) => {
     
        const hasStatus = (s: number) => status.includes(s);

        return (
            <>
                {hasStatus(0) && (
                    <>
                        <Tooltip title="Amount Received" placement='bottom'>
                            <Button shape="circle" size="small" type='primary' icon={<CheckOutlined />}
                                onClick={() => { setCurrentStatus(prev => prev = 1); setVisible(true) }} ></Button>
                        </Tooltip>
                        <Tooltip title="Credit Transfer: Add to client Account" placement='bottom'>
                            <Button shape="circle" size="small" type='primary' icon={<UserAddOutlined />}
                                onClick={() => { setCurrentStatus(prev => prev = 2); setVisible(true) }} ></Button>
                        </Tooltip>
                    </>
                )}
                {hasStatus(1) && (
                    <>
                        <Tooltip title="Change to Unpaid" placement='bottom'>
                            <Button shape="circle" size="small" type='primary' danger icon={<RollbackOutlined />}
                                onClick={() => { setCurrentStatus(prev => prev = 0); setVisible(true) }} ></Button>
                        </Tooltip>
                        <Tooltip title="Credit Transfer: Add to client Account" placement='bottom'>
                            <Button shape="circle" size="small" type='primary' icon={<UserAddOutlined />}
                                onClick={() => { setCurrentStatus(prev => prev = 2); setVisible(true) }} ></Button>
                        </Tooltip>
                    </>
                )}
                {hasStatus(2) && (
                    <>
                        <Tooltip title="Change to Unpaid" placement='bottom'>
                            <Button shape="circle" size="small" type='primary' danger icon={<RollbackOutlined />}
                                onClick={() => { setCurrentStatus(prev => prev = 0); setVisible(true) }} ></Button>
                        </Tooltip>
                        <Tooltip title="Amount Received" placement='bottom'>
                            <Button shape="circle" size="small" type='primary' icon={<CheckOutlined />}
                                onClick={() => { setCurrentStatus(prev => prev = 1); setVisible(true) }} ></Button>
                        </Tooltip>
                    </>
                )}
            </>
        );
    }
    return (
        <>
            <AlertForSaleUpdates visible={visible} setVisible={setVisible}
                callback={updateHandler} currentStatus={currentStatus} />
            {ActionButtion(status)}

        </>

    )
}

export default SaleActions


