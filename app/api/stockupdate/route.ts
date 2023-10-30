
import { nextAuthOptions } from '@/app/authOptions';
import dbConnect from '@/app/utils/dbConnect';
import ItemModal from '@/models/Item';
import { Item } from '@/typings';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server'

type stockProps = { check: string, item: Item, stockUpdate: string, stock: number, purchase_price: number }
export async function POST(req: NextRequest) {
    try {
        const body: stockProps = await req.json();
        console.log(body)
        const { check, item } = body
        const getItem = await ItemModal.findById(item._id);
        if (!getItem?._id) {
            throw new Error(`Could not find the item`)
        }
        if (check === "wearhouse") {
            const stockUpdateItem = await ItemModal.findByIdAndUpdate(item._id,
                {
                    $set: {
                        wearhouseStockUpdated: body.stockUpdate,
                        wearHouseStock: body.stock + (getItem.wearHouseStock ?? 0),
                        purchase_price: body.purchase_price,
                    }
                })
            console.log(stockUpdateItem)
            return NextResponse.json({ status: 200, success: true, message: `Updated Successfully`, data: stockUpdateItem });
        }
        if (check === "shop") {
            if (getItem.wearHouseStock <= 0) {
                throw new Error(`Insufficient stock`)
            }
            const stockUpdateItem = await ItemModal.findByIdAndUpdate(item._id,
                {
                    $set: {
                        stockUpdated: body.stockUpdate,
                        stock: body.stock + (getItem.stock ?? 0),
                    }
                })
            if (stockUpdateItem && getItem.wearHouseStock > 0) {
                getItem.wearHouseStock = getItem.wearHouseStock - body.stock;
                getItem.save()
            }
            return NextResponse.json({ status: 200, success: true, message: `Shop Stock Updated Successfully`, data: stockUpdateItem });
        }


    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 400, data: error, message: error });

    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const item = await ItemModal.findByIdAndUpdate(body._id, { $set: { ...body } });
        return NextResponse.json({ status: 200, success: true, message: "Item Updated Successfully", data: item });

    } catch (error) {
        return NextResponse.json({ data: error, message: "Somthing went wrong" });

    }
}