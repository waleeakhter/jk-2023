"use client"
import React, { useState } from 'react';
import Filters from './../table/filters/Filters';
import Tooltips, { columns } from './columns';
import { Client, Item, LazyTableState, MixInterfaces, Sale } from '@/typings';
import ExportData from '@/app/components/ExportData';
import { useRouter } from 'next/navigation';
import { Column, ColumnProps } from 'primereact/column';
import { DataTablePageEvent, DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { updateOrder } from '@/app/components/Datatable/serverActions';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'antd'
import BulkUpdate from '../SaleActions/BulkUpdate';
import { InputText } from 'primereact/inputtext';
import SaleActions from '../SaleActions';
import { cancelSaleItem } from '@/app/components/Datatable/functions';
import { exportColumns, exportData } from './exports';
import AddModal from '@/app/components/Datatable/AddModal';
import AddSale from '../form/AddSale';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
type Props = {
    searchParams: { type: string }
    data: Array<Sale | any>,
    clientsData: Array<Client>,
    itemsData: Array<Item>
    sale: number,
}
const SaleTable = ({ searchParams, data, clientsData, sale, itemsData }: Props) => {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedItems, setSelectedItems] = useState<Array<MixInterfaces> | []>([]);
    const [visible, setVisible] = useState(false);
    const router = useRouter()
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [lazyState, setlazyState] = useState<LazyTableState>({
        first: 0,
        rows: 10,
        page: 1,
    });
    const [totalRecords, setTotalRecords] = useState(data.length ?? 0);


    // const query = useQuery({ queryKey: ['todos'], queryFn: getItems })


    const q = new URLSearchParams(searchParams)
    const onPage = (event: DataTablePageEvent) => {
        setlazyState(prev => { return { ...prev, ...event } });
    };

    const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
        let _items = [...data];
        let { newData, index } = e;
        _items[index] = newData;
        updateOrder(newData as any, "sale")
    };

    const onGlobalFilterChange = (e: any) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;
        console.log(_filters['global'].value = value)
        setFilters(_filters);
        setGlobalFilterValue(value);
    }
    const refreshTable = () => {
        router.refresh()
    }
    const renderHeader = () => {
        return (
            <div className="flex md:justify-between justify-center items-center flex-wrap gap-2">
                <div className='flex  gap-1 items-center mr-auto '>
                    <h5 className="m-0 md:text-2xl text-lg text-gray-800 ">{"Sale"}</h5>
                    <Button size='middle' onClick={() => setVisible(true)} type='dashed' icon={<PlusOutlined />} />
                    <ExportData data={exportData(data ?? [])} exportColumns={exportColumns} />
                </div>
                <div className='text-center md:flex-1'>
                    <h1 className='md:text-xl text-base'>{Number(sale ?? 0) > 0 ? <p>T/A: {sale}<i className='pi pi-euro'></i> </p> : ""} </h1>

                </div>
                <div className='flex items-center gap-2 justify-between md:flex-none flex-1 lg:flex-nowrap flex-wrap'>
                    <div className='flex-1 md-flex-auto'>
                        {selectedItems.length > 0 ? (selectedItems.reduce((total, sale) => total + sale.sell_quantity, 0) + " " + selectedItems.reduce((total, sale) => total + sale.total_amount, 0)) : ""}
                    </div>
                    {selectedItems.length > 0 && <div className='flex-1 lg:flex-auto'><BulkUpdate selection={selectedItems} emptySelection={setSelectedItems} /></div>}
                    <div className="lg:w-auto w-full flex">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText className='' value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                        </span>
                        <Button type="dashed" size="large" className='h-[3rem_!important]' icon={<ReloadOutlined />} onClick={refreshTable} />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className=''>
            <Filters searchParams={q} clients={clientsData} />
            <AddModal visible={visible} setVisible={setVisible} >
                {<AddSale items={itemsData ?? []} clients={clientsData ?? []} />}
            </AddModal>
            <div>
                <DataTable
                    className='data-table'
                    dataKey="_id"
                    totalRecords={totalRecords}
                    scrollable
                    paginator
                    first={lazyState.first}
                    onPage={onPage}
                    editMode="row"
                    selectionMode={'checkbox'}
                    size='small'
                    rows={lazyState.rows ?? 10}
                    rowsPerPageOptions={[10, 25, 50]}
                    removableSort
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    value={data}
                    header={renderHeader}
                    globalFilterFields={['client.name', "item.type", 'item.name']}
                    filters={filters}
                    selectionPageOnly={true}
                    selection={selectedItems!}
                    filterDisplay="row"
                    emptyMessage="No sales found."
                    onSelectionChange={(e) => {
                        const value = e.value as Array<MixInterfaces>;
                        setSelectedItems(prev => prev = value);
                    }}
                    onRowEditComplete={onRowEditComplete}
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    {
                        columns.map((col: ColumnProps, i: number) => <Column {...col} key={i.toString()} />)
                    }
                    <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>

                    <Column body={(rowData) =>
                        <div className='p-buttonset'>
                            <SaleActions rowData={rowData} />
                            <Button severity='danger' icon="pi pi-trash"
                                size='small' tooltip='Delete Item' className='btn-delete'
                                tooltipOptions={{ position: 'bottom' }} onClick={(e) => cancelSaleItem(e, rowData)} />
                        </div>
                    }
                        header={'Action'} frozen={true} style={{ flexGrow: 1, flexBasis: '100px' }} />

                </DataTable>
            </div>
            <Tooltips />
        </div>
    )
}

export default SaleTable;

