'use client'
import React, { useRef } from 'react'
import Home from '../page';
import { useReactToPrint } from 'react-to-print';
import { Button } from 'primereact/button';
import Datatable from '../components/Datatable/Datatable';

type Props = { columns: Object[], items: Object[] }

const PrintTable = ({ items, columns }: Props) => {
    const datatableRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => datatableRef.current,
    });

    return (
        <>
            <Button onClick={handlePrint}>Print Datatable</Button>
            <div className='  ' ref={datatableRef}>
                <Datatable data={items} columns={columns} search={'name'}
                    tableName={'LCDS'} targetRoute={''} hideActionCol={true} />
            </div>
        </>
    )
}

export default PrintTable