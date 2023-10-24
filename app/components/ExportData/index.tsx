'use client'
import React, { useState } from 'react'

import { Button } from 'primereact/button';
import { useSearchParams } from 'next/navigation';
import { createFileNameWithParams, exportExcel, exportPdf } from './functions';
import ExportSetting from './ExportSetting';
type Props = { data: Array<{}>, exportColumns: Array<{ header: string, dataKey: string }> }

const ExportData = ({ data, exportColumns }: Props) => {
    const params = useSearchParams();
    const [visible, setVisible] = useState(false)
    const [fileType, setFileType] = useState("")
    const numberOfEmptyRows = 20;
    for (let i = 0; i < numberOfEmptyRows; i++) {
        data.push({} as any);
    }

    const letsExportPDF = (updatedColums: typeof exportColumns, filename: string) => {
        exportPdf(data, updatedColums, filename)
    }
    return (
        <>
            <ExportSetting columns={exportColumns} visible={visible} setVisible={setVisible}
                dataForPreview={data ?? []} callback={letsExportPDF} params={params} filetype={fileType} />
            <span className='p-buttonset'>
                <Button size='small' severity='success' raised type="button" icon="pi pi-file-excel" text onClick={() => { setFileType("xlxs"); setVisible(true) }} />
                <Button size='small' severity='danger' raised type="button" icon="pi pi-file-pdf" text onClick={() => { setFileType("pdf"); setVisible(true) }} />
            </span>
        </>
    )
}

export default ExportData