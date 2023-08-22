"use client"
import React from 'react';
import { Skeleton } from 'primereact/skeleton';
import { DataTable, DataTableValueArray } from 'primereact/datatable';
import { Column } from 'primereact/column';
interface Props { columns: any }
export default function DataTableLoading(props: Props) {
    const items: number[] = Array.from({ length: 10 }, (v, i) => i);

    function bodyTemplate(): JSX.Element {
        return <Skeleton></Skeleton>
    }

    return (
        <div className="card">
            <DataTable value={items as unknown as DataTableValueArray} className="p-datatable-striped">
                {props.columns.map((col: { header: string }) =>
                    <Column field="code" header={col.header} style={{ width: '15%' }} body={bodyTemplate}></Column>

                )}
            </DataTable>
        </div>
    );
}
