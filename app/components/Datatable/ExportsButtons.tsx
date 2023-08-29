import React, { useState } from 'react'
import autoTable, { RowInput } from 'jspdf-autotable';
import moment from 'moment';
import jsPDF from 'jspdf';
import { Sale } from '@/typings';
import { Button } from 'primereact/button';
import { useSearchParams } from 'next/navigation';
type Props = { data: Array<{}>, exportColumns: Object[] }

const ExportsButtons = (props: Props) => {
    const params = useSearchParams();
    const numberOfEmptyRows = 10;
    for (let i = 0; i < numberOfEmptyRows; i++) {
        props.data.push({} as Sale);
    }

    const getFileNameWithPrams = () => {
        let res: { type: string, client: string } = {
            type: '',
            client: ''
        }
        // for (const [key, value] of params.entries()) {
        //     return q = { ...q, [key]: value, }
        // };
        params.forEach((value, key) => {
            console.log(value)
            return res = { ...res, [key]: value, }
        });

        return "IMRAN" + res.type! + " " + " Sale List - " + moment(new Date()).subtract(1, "d").format("DD-MM-YY")
    }

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(props.data);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer);
        });
    };

    const exportPdf = async () => {
        const doc = new jsPDF({
            orientation: "p",
            unit: "pc",
            format: "A4"
        });
        doc.setFontSize(14).setFont("Times", "normal", 'bold')
        doc.text(getFileNameWithPrams().toLocaleUpperCase(), 10, 3).setFontSize(14)
        console.log(doc.getFontList())
        autoTable(doc, {
            startY: false,
            margin: { top: 5, left: 2, right: 2 },
            theme: "grid", columns: props.exportColumns ?? [], tableWidth: "auto",
            columnStyles: { 0: { overflow: 'linebreak' }, 1: { overflow: "linebreak" }, 2: { cellWidth: 4 }, 4: { cellWidth: 4 }, },
            body: props.data as unknown as RowInput[],
            pageBreak: "auto",
            styles: { cellWidth: "auto", fontSize: 12, font: "Helvetica", fontStyle: "bold", halign: "center", valign: "middle" },
        });


        doc.save(`${getFileNameWithPrams().toLocaleUpperCase()}.pdf`);
    };
    const saveAsExcelFile = (buffer: BlobPart) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, getFileNameWithPrams().toLocaleUpperCase() + EXCEL_EXTENSION);
            }
        });
    };
    return (
        <>
            <Button size='small' raised type="button" icon="pi pi-file" text onClick={exportExcel} />
            <Button size='small' raised type="button" icon="pi pi-file-pdf" text onClick={exportPdf} />
        </>
    )
}

export default ExportsButtons