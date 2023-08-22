import { Button } from 'primereact/button'
import React, { SyntheticEvent } from 'react'
import { actionButtons } from './Datatable';
import { cancelSaleItem } from './functions';
type Props = {
    rowData: { quantity: number, _id: string, status: "" },
    prevProps: actionButtons,
    modal?: Function,
    paidOn?: Date | undefined
}

const position = { position: 'bottom' }
const ActionButtons = ({ rowData, prevProps, paidOn }: Props) => {


    return (

        <>
            {!prevProps.hideDeleteBtn && <Button severity='danger' icon="pi pi-trash" size='small' tooltip='Delete Item' className='btn-delete' tooltipOptions={{ position: 'bottom' }} onClick={(e) => cancelSaleItem(e, rowData)} />}
        </>
    )
}

export default ActionButtons