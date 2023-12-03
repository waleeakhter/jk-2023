import { Client } from '@/types/typings';
import { SingleValue, Options } from 'react-select';
import types from "@/app/utils/types.json"
import { Payments } from '@/models/Payments';
export interface Option {
    readonly label: string;
    readonly value: string;
}
export interface ReactSelect {
    Options: Options<Option>;
    SingleValue: SingleValue<Option>
}


export interface Item {
    _id?: string;
    name: string;
    quantity: number;
    purchase_price: number,
    stock: number,
    wearHouseStock: number,
    price: number,
    brand: string,
    stockUpdate: Date | string,
    type: string;
    createdAt: Date | string;
    stockUpdated?: Date | string,
    wearhouseStockUpdated?: Date | string,
}

export interface Client {
    name: string;
    credit: number;
    debit: number;
}


export interface Sale {
    createdAt?: Date | string;
    item: Types.ObjectId | Item | string;
    client: Types.ObjectId | Client | string;
    reference?: string;
    total_amount: number;
    sell_price: number;
    sell_quantity: number;
    status?: number;
    paidOn?: Date,
    wearhouseStock?: boolean | undefined,
    resource?: string
}

export interface MixInterfaces extends Sale, Item, Client {
    _id: string;

}

export interface SaleApiDefaultParams {
    status: string;
    brands: string;
    type: string;
    createdAt: string | null;
    endAt: string | null;
    paidOn: string | null;
    client: string;
    excludeClients: string;
    page: string;
    pageSize: string;
}

export interface LazyTableState {
    first: number;
    rows: number;
    page: number;
    sortField?: string;
    sortOrder?: number;
    filters?: DataTableFilterMeta;
}


export interface Payments {
    client: Client;
    amount: number;
    paymentDate: Date | string;
}
export interface Log {
    "name": string
    "_id"?: string;
    "source": string,
    "logType": string,
    "details": {},
    "createdAt": Date
}