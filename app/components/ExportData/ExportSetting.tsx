import { Checkbox } from 'primereact/checkbox';
import React, { useRef, useState, useEffect } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PrimeIcons } from 'primereact/api';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { useSearchParams } from 'next/navigation';
import { createFileNameWithParams, exportExcel, exportPdf } from './functions';

type ColumnData = {
    header: string;
    dataKey: string;
    isChecked?: boolean
};

type Props = {
    columns: ColumnData[];
    dataForPreview: Array<any>;
    visible: boolean;
    setVisible: Function;
    callback: Function;
    params: ReadonlyURLSearchParams
    filetype: string
};

const ExportSetting: React.FC<Props> = ({ columns, visible, setVisible, callback, dataForPreview, filetype }) => {
    const params = useSearchParams();
    const toast = useRef<Toast>(null);

    const [_columns, setColumns] = useState<ColumnData[]>(() =>
        columns.map((column) => ({ ...column, isChecked: true }))
    );
    const [filename, setFileName] = useState("");

    useEffect(() => {
        createFileNameWithParams(params, dataForPreview.at(0).client, setFileName);
    }, [params , dataForPreview]);

    const handleCheckboxChange = (dataKey: string, isChecked: boolean | undefined) => {
        setColumns((prevColumns) =>
            prevColumns.map((column) =>
                column.dataKey === dataKey ? { ...column, isChecked } : column
            )
        );
    };

    const accept = () => {
        const selectedColumnKeys = _columns
            .filter((col) => col.isChecked)
        if (filetype === "pdf") {
            exportPdf(dataForPreview, selectedColumnKeys, filename)
        } else {

            exportExcel(dataForPreview, filename, selectedColumnKeys)
        }
        toast.current?.show({ severity: 'success', summary: 'Confirmed', detail: `Downloaded: ${filename}.${filetype}`, life: 6000 });
    };

    const reject = () => {
        toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: `Download Canceled: ${filename}.${filetype}`, life: 3000 });
    };

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog
                visible={visible}
                onHide={() => setVisible(false)}
                message={
                    <>
                        <div className="card flex flex-wrap justify-content-center border p-3">
                            <InputText className='w-full' value={filename}
                                onChange={(e) => setFileName(e.currentTarget.value)} />
                            <h3 className='w-full font-bold mb-1'>You can hide/show columns</h3>
                            <div className="flex flex-column gap-3">
                                {_columns.map((column) => (
                                    <div key={column.dataKey} className="flex align-items-center">
                                        <Checkbox
                                            inputId={column.dataKey}
                                            name="col"
                                            value={column.dataKey}
                                            onChange={(e) => handleCheckboxChange(column.dataKey, e.checked)}
                                            checked={column.isChecked ?? false}
                                        />
                                        <label htmlFor={column.dataKey} className="ml-2">
                                            {column.header}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <DataTable value={dataForPreview.slice(0, 5)} rows={5} size='small'>
                            {_columns.filter((column) => column.isChecked)
                                .map((col) => (
                                    <Column key={col.dataKey} field={col.dataKey} header={col.header} showAddButton />
                                ))}
                        </DataTable>
                    </>
                }
                header="Download PDF"
                accept={accept}
                reject={reject}
                acceptLabel='Download'
                acceptIcon={PrimeIcons.DOWNLOAD}
                rejectIcon={PrimeIcons.TIMES}

            />
        </div>
    );
};

export default ExportSetting;
