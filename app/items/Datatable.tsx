'use client'
import React, { useState } from 'react'
import ExportData from '../components/ExportData'
import { Button, Input, Tooltip } from 'antd'
import { InputText } from 'primereact/inputtext'
import { useRouter } from 'next/navigation'
import { FilterMatchMode } from 'primereact/api'
import { Item, LazyTableState } from '@/typings'
import { DataTable, DataTablePageEvent, DataTableRowEditCompleteEvent } from 'primereact/datatable'
import { updateOrder } from '../components/Datatable/serverActions'
import AddModal from '../components/Datatable/AddModal'
import { Column, ColumnProps } from 'primereact/column'
import Tooltips from '../sale/table/columns'
import { columns } from './columns'
import { exportColumns, exportData } from './exports'
import ItemForm from './itemForm'
import StockUpdate from './StockUpdate'
import { PlusOutlined, HomeOutlined, ShopOutlined, RedoOutlined } from '@ant-design/icons';
type Props = { data: Array<Item | string | any>, showPrice: number | undefined }
const Datatable = ({ data, showPrice }: Props) => {
    const [visible, setVisible] = useState(false);
    const [form, setForm] = useState("newItem");
    const router = useRouter()



    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [lazyState, setlazyState] = useState<LazyTableState>({
        first: 0,
        rows: 10,
        page: 1,
    });
    const [totalRecords, setTotalRecords] = useState(data.length ?? 0);
    const onPage = (event: DataTablePageEvent) => {
        setlazyState(prev => { return { ...prev, ...event } });
    };

    const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
        let _items = [...data];
        let { newData, index } = e;
        _items[index] = newData;
        updateOrder(newData as any, "item")
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
            <div className="flex justify-between items-center flex-wrap lg:gap:1 gap-3">

                <div className='flex  gap-3 items-center '>
                    <h5 className="m-0 text-2xl text-gray-800 ">{"Items List"}</h5>
                    <span className='flex gap-1'>
                        <Tooltip title="Add New Item" placement='bottom'>
                            <Button size='middle' type='dashed' icon={<PlusOutlined />}
                                onClick={() => { setForm(prev => prev = "newItem"); setVisible(true) }} />
                        </Tooltip>
                        <Tooltip title="Update wearhous stock" placement='bottom'>
                            <Button size='middle' onClick={() => { setForm(prev => prev = "wearhouse"); setVisible(true) }}
                                icon={<HomeOutlined />}
                            />
                        </Tooltip>
                        <Tooltip title="Update shop stock" placement='bottom'>
                            <Button size='middle' icon={<ShopOutlined />}
                                onClick={() => { setForm(prev => prev = "shop"); setVisible(true) }}
                            />
                        </Tooltip>
                    </span>
                    <ExportData data={exportData(data ?? [])} exportColumns={exportColumns} />
                </div>
                <div className='text-center'>
                    <h1 className='text-xl'>{Number(showPrice ?? 0) > 0 ? <p>Total Amount: {showPrice}<i className='pi pi-euro'></i> </p> : ""} </h1>

                </div>
                <div className='flex'>

                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <Input.Search size='large' className={" font-normal "}  value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                    </span>
                    <Button type="dashed" icon={<RedoOutlined />} onClick={refreshTable} size='large' className='h-full' />
                </div>
            </div>
        )
    }
    return (
        <div className=''>
            <AddModal visible={visible} setVisible={setVisible}
                heading={form === "newItem" ? "Add New Item" : form === "wearhouse" ? "Update Wearhouse Stock" : "Update Shop Stock"} >

                {form === "newItem" ? <ItemForm /> :
                    visible && <StockUpdate check={form} />}
            </AddModal>
            <div>
                <DataTable
                    className='data-table w-full'
                    dataKey="_id"
                    totalRecords={totalRecords}
                    scrollable
                    paginator
                    first={lazyState.first}
                    onPage={onPage}

                    editMode="row"
                    size='small'
                    rows={lazyState.rows ?? 10}
                    rowsPerPageOptions={[10, 25, 50]}
                    removableSort
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    value={data}
                    header={renderHeader}
                    globalFilterFields={['name', 'type']}
                    filters={filters}

                    filterDisplay="row"
                    emptyMessage="No Items found."

                    onRowEditComplete={onRowEditComplete}
                >
                    {
                        columns.map((col: ColumnProps, i: number) => <Column {...col} key={i.toString()} />)
                    }
                    <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>

                    {/* <Column body={(rowData) =>
                        <div className='p-buttonset'>
                            <Button severity='danger' icon="pi pi-trash"
                                size='small' tooltip='Delete Item' className='btn-delete'
                                tooltipOptions={{ position: 'bottom' }} onClick={(e) => cancelSaleItem(e, rowData)} />
                        </div>
                    }
                        header={'Action'} frozen={true} style={{ flexGrow: 1, flexBasis: '100px' }} /> */}

                </DataTable>
            </div>
            <Tooltips />
        </div>
    )
}

export default Datatable