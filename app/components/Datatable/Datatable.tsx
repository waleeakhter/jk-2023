'use client'
import React, { ReactComponentElement, ReactNode, useEffect, useRef, useState } from 'react'
import { DataTable, DataTableRowEditCompleteEvent, DataTableStateEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import ActionButtons from './ActionButtons';
import { InputNumber } from 'primereact/inputnumber';
import AddModal from './AddModal';
import { MixInterfaces } from '@/typings';
import { Headers } from 'react-csv/components/CommonPropTypes';
import BulkUpdate from '../../sale/SaleActions/BulkUpdate';
import { useRouter } from 'next/navigation';
import { updateOrder } from './serverActions';
import DatePicker from "react-datepicker";
import ExportsButtons from './ExportsButtons';
import SaleActions from '@/app/sale/SaleActions';


type Props = {
    data: Array<MixInterfaces>, columns: Array<Object>, search: Array<string>, tableName: string,
    addComponent?: ReactNode,
    showSale?: number,
    exportData?: ReactNode,
    extraActionsButtons?: ReactNode
}

export type actionButtons = {
    hideEditBtn?: Boolean, hideDeleteBtn?: Boolean, targetRoute: string,
    buyBtn?: Boolean, hideActionCol?: Boolean, paidBtn?: Boolean, returnBtn?: Boolean,
    hideSearch?: Boolean, hideAddBtn?: Boolean, rows?: number, showSalesBtn?: Boolean
}



const Datatable = (props: Props & actionButtons) => {

    const [first, setFirst] = useState(0);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedItems, setSelectedItems] = useState<Array<MixInterfaces> | []>([]);
    const [items, setItems] = useState<Object[]>(props.data ?? [])
    const [visible, setVisible] = useState(false);
    const router = useRouter()
    const dt = useRef<DataTable<Props['data']>>(null);
    const inputsEditor = (options: any, type: string) => {

        switch (type) {
            case "number":
                return <InputNumber inputClassName=' max-w-[4rem] w-16 overflow-hidden ' step={1} type="text" mode="decimal" maxFractionDigits={2}
                    value={options.value || options.props.children || 0} onChange={(e) => options.editorCallback(e.value)} />;
            case "text":
                return <InputText step={1} type="text"
                    value={options.value || " "} onChange={(e) => options.editorCallback(e.target.value)} />;
            case "date":
                return <DatePicker name="createdAt" selected={new Date(options.value)} className=' z-[100] '
                    placeholderText="Select a date" maxDate={new Date()} showTimeInput
                    onChange={(date) => options.editorCallback(date)} />
            //  <Calendar value={options.value} onChange={(e) => options.editorCallback(e.value)} />
            default:
                break;
        }

    }

    // create columns for table
    const dynamicColumns = props.columns.length > 0 ? props.columns.map((col: any, i) => {
        if (col) {
            return <Column className='  ' editor={(options) => col.enabledEdit ? inputsEditor(options, col.type) : ""} key={col.header}
                {...col} sortable={i === 0 && true} style={{ flexGrow: 1, flexBasis: '100px' }}
            />
        }
    }) : null

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const onGlobalFilterChange = (e: any) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }



    const refreshTable = () => {
        router.refresh()
    }


    const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
        let _items = [...items];
        let { newData, index } = e;
        _items[index] = newData;
        setItems(_items);
        updateOrder(newData as any, props.targetRoute)
    };


    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center">
                <div className='flex  gap-3 items-center '>
                    <h5 className="m-0 text-2xl text-gray-800 ">{props.tableName}</h5>
                    {!props.hideAddBtn &&
                        <Button size='small' label='' text raised icon="pi pi-plus" onClick={() => setVisible(true)} />
                    }
                    {props.exportData && props.exportData}

                </div>
                <div className='text-center'>
                    <h1 className='text-xl'>{Number(props.showSale ?? 0) > 0 ? <p>Total Amount: {props.showSale}<i className='pi pi-euro'></i> </p> : ""} </h1>

                </div>
                <div className='flex gap-2'>
                    <div className=''>
                        {selectedItems.length > 0 ? (selectedItems.reduce((total, sale) => total + sale.sell_quantity, 0) + " " + selectedItems.reduce((total, sale) => total + sale.total_amount, 0)) : ""}
                    </div>
                    {selectedItems.length > 0 && <BulkUpdate selection={selectedItems} emptySelection={setSelectedItems} />}
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                    </span>
                    <Button type="button" icon="pi pi-refresh" text onClick={refreshTable} />
                </div>
            </div>
        )
    }


    const paginationHandler = (e: DataTableStateEvent) => {
        console.log(e, "DataTableStateEvent");
        setFirst(e.first)
    }

    return (
        <>

            <AddModal children={props.addComponent} visible={visible} setVisible={setVisible} />
            <DataTable ref={dt} editMode="row" selectionMode={'checkbox'} size='small'
                className='data-table' dataKey="_id" totalRecords={props.data.length}
                scrollable paginator rows={props.rows ?? 10} first={first}

                onPage={paginationHandler}
                rowsPerPageOptions={[10, 25, 50]}

                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                value={props.data} header={renderHeader}
                globalFilterFields={props.search}
                filters={filters}
                selectionPageOnly={true}
                selection={selectedItems!}
                onSelectionChange={(e) => {
                    const value = e.value as Props['data'];
                    setSelectedItems(prev => prev = value);
                }}
                onRowEditComplete={onRowEditComplete}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                {dynamicColumns}
                <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                {!props.hideActionCol && <Column body={(rowData) =>
                    <div className='p-buttonset'>
                        <SaleActions rowData={rowData} />
                        <ActionButtons rowData={rowData} prevProps={props} />
                    </div>
                }
                    header={'Action'} frozen={true} style={{ flexGrow: 1, flexBasis: '100px' }} />}
            </DataTable>
        </>

    )
}

export default Datatable