
import autoTable, { RowInput } from 'jspdf-autotable';
import moment from 'moment'
import jsPDF from 'jspdf';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { JSON2SheetOpts } from 'xlsx';
import { Sale } from '@/typings';
import writeXlsxFile, { SheetData } from 'write-excel-file';
import internal, { Readable } from 'stream';

export const getFileNameWithPrams = (params: ReadonlyURLSearchParams) => {
    let res: { type: string, client: string } = {
        type: '',
        client: ''
    }

    if (params) {
        params.forEach((value: any, key: any) => {
            console.log(value)
            return res = { ...res, [key]: value, }
        });
    }

    return "JOJO " + res.type! + " " + "List - " + moment(new Date("02-08-2023")).format("DD-MM-YY") + "-" + moment(new Date()).format("DD-MM-YY")
}

interface Column {
    header: string;
    dataKey: string;
}

export const exportExcel = (data: Record<string, any>[], filename: string, columns: Column[]) => {
    const style = {
        font: {
            bold: true,
            size: 18,
        },
        alignment: {
            horizontal: 'center',
        },
    };

    const sheet = [
        [
            {
                value: filename,
                fontWeight: 'bold',
                fontSize: 16,
                width: 80,
            },
        ],


        columns.map((column) => ({
            value: column.header,
            fontWeight: 'bold',
            fontSize: 14,
            width: 30
        })),
        ...data.map((item) => columns.map((column) => ({ value: item[column.dataKey] || '', width: 30 }))),
    ]

    writeXlsxFile(sheet as SheetData | SheetData[], {}).then(value => saveAsExcelFile(value, filename))

};



export const exportPdf = async (data: Object[], exportColumns: Object[], filename: string) => {
    const doc = new jsPDF({
        orientation: "p",
        unit: "pc",
        format: "A4"
    });
    doc.setFontSize(14).setFont("Times", "normal", 'bold')
    doc.text(filename, 10, 3).setFontSize(14)
    console.log(doc.getFontList())
    autoTable(doc, {
        startY: false,
        margin: { top: 5, left: 2, right: 2 },
        theme: "grid", columns: exportColumns ?? [], tableWidth: "auto",
        body: data as unknown as RowInput[],
        pageBreak: "auto",
        styles: { cellWidth: "auto", fontSize: 12, font: "Helvetica", fontStyle: "bold", halign: "center", valign: "middle" },
    });


    doc.save(`${filename}.pdf`);
};
const saveAsExcelFile = (buffer: Blob, filename: string) => {
    import('file-saver').then((module) => {
        if (module && module.default) {
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data = new Blob([buffer], {
                type: EXCEL_TYPE
            });

            module.default.saveAs(data, filename + EXCEL_EXTENSION);
        }
    });
};


export const createFileNameWithParams = (params: ReadonlyURLSearchParams, client?: string, setFileName?: Function) => {
    let name = ""
    if (params.get('client')) {
        name += client + " "
    }
    if (params.get('type')) {
        try {
            const typeValue = JSON.parse(params.get('type') ?? "");
            if (typeof typeValue === 'string') {
                name += typeValue + " ";
            }
        } catch (error) {
            name += params.get('type') + " "
        }
    }
    name += "SALES LIST FOR "
    if (params.get('createdAt') && params.get('endAt')) {
        const startDate = moment(params.get('createdAt')).format("DD-MM-YYYY")
        const endDate = moment(params.get('endAt')).format("DD-MM-YYYY")
        name += `${startDate} to ${endDate}`
    } else {
        name += moment().format("DD-MM-YYYY")
    }
    setFileName && setFileName(name.toUpperCase())
    return name.toUpperCase()
}