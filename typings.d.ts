import { Client } from '@/typings';
import { SingleValue, Options } from 'react-select';
export interface Option {
    readonly label: string;
    readonly value: string;
}
export interface ReactSelect {
    Options: Options<Option>;
    SingleValue: SingleValue<Option>
}


export interface Item {
    name: string;
    quantity: number;
    type: 'mobile' | 'lcd';
    createdAt: Date;
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
    paidOn?: Date
}

export interface MixInterfaces extends Sale, Item, Client {
    _id: string;

}