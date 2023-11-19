'use client'
import React, { useState } from 'react'
import { FilePdfTwoTone, FileExcelTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
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

            <Button className=' border-[#52c41a_!important] ' size='middle' type="dashed" icon={<FileExcelTwoTone twoToneColor='#52c41a' />} onClick={() => { setFileType("xlxs"); setVisible(true) }} />
            <Button size='middle' danger type="dashed" icon={<FilePdfTwoTone twoToneColor="#ff4d4f" />} onClick={() => { setFileType("pdf"); setVisible(true) }} />

        </>
    )
}

export default ExportData