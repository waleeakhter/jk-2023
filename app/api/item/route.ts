import dbConnect from '@/app/utils/dbConnect';
import fetchCall from '@/app/utils/fetch';
import Item from '@/models/Item';
import { NextResponse } from 'next/server';
export async function GET(request: Request) {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const res = await Item.find(({ ...(type && { type: type }) }))
    const totalAmount = res.reduce((total, item) => total + (item.price * item.stock), 0);
    return NextResponse.json({ data: res, totalAmount: totalAmount });
}

export async function POST(request: Request) {
    await dbConnect()
    // const data = [
    //     {
    //         "name": "RADMI A1 32 GB",
    //         "price": 60,
    //         "stock": 500,
    //         "type": "mobile"
    //     },
    //     {
    //         "name": "REDMI A1 PLUS 32 GB",
    //         "price": 60,
    //         "stock": 500,
    //         "type": "mobile"
    //     },
    //     {
    //         "name": "REDMI A2 32 GB",
    //         "price": 64,
    //         "stock": 500,
    //         "type": "mobile"
    //     },
    //     {
    //         "name": "RADMI A2+ 32GB",
    //         "price": 65,
    //         "stock": 500,
    //         "type": "mobile"
    //     },
    //     {
    //         "name": "REDMI 12C 128GB",
    //         "price": 92,
    //         "stock": 500,
    //         "type": "mobile"
    //     },
    //     {
    //         "name": "REDMI 12C 64 GB",
    //         "price": 82,
    //         "stock": 500,
    //         "type": "mobile"
    //     },
    //     {
    //         "name": "ZTE A31 PLUS",
    //         "price": 52,
    //         "stock": 500,
    //         "type": "mobile"
    //     },
    //     {
    //         "name": "REDMI NOTE 10S 128GB WITHOUT BOX",
    //         "price": 150,
    //         "stock": 500,
    //         "type": "mobile"
    //     },
    //     {
    //         "name": "REDMI NOTE 11 PRO 6/128GB WITHOUT BOX",
    //         "price": 170,
    //         "stock": 500,
    //         "type": "mobile"
    //     },
    //     {
    //         "name": "POCO X3 PRO 6/128 WITHOUT BOX",
    //         "price": 135,
    //         "stock": 500,
    //         "type": "mobile"
    //     },
    //     {
    //         "name": "REDMI 11T PRO 256GB WITHOUT BOX",
    //         "price": 190,
    //         "stock": 500,
    //         "type": "mobile"
    //     },
    //     {
    //         "name": "ONE PLUS NORD CE2 256GB WITHOUT BOX",
    //         "price": 200,
    //         "stock": 500,
    //         "type": "mobile"
    //     },
    //     {
    //         "name": "OPPO A54S 128 GB WITHOUT BOX",
    //         "price": 160,
    //         "stock": 500,
    //         "type": "mobile"
    //     }
    // ]
    //  await Item.insertMany(data)

    return NextResponse.json(request);
}

export async function PATCH(res: Response) {
    const body = await res.json();
    const item = await Item.findById(body._id);
    item.price = body.price;
    item.stock = body.stock;
    item.name = body.name;
    await item.save()
    return NextResponse.json(item);
}
