import dbConnect from '@/app/utils/dbConnect';
import Item from '@/models/Item';
import Sale from '@/models/Sale';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import getSaleList from './getData';
import createSale from './createSale';
import updateSale from './updateSale';



export async function GET(request: Request) {
try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const data = await getSaleList(searchParams)
    return NextResponse.json({ data: data.saleList, totalSale: Math.round(data.totalSaleAmount.toFixed(2)) });
} catch (error) {
    console.log(error);
    return NextResponse.json({ data: error });
}
}


export async function POST(res: NextRequest) {
    await dbConnect()

    const body = await res.json();
    const data = await createSale(body)

    return NextResponse.json({ ...data });
}



export async function PATCH(request: Request, res: NextResponse) {

        await dbConnect();
        const body = await request.json();
        const resData = await updateSale(body)
        return NextResponse.json({ ...resData });
}



export async function DELETE(request: Request, res: NextResponse) {
    try {
        await dbConnect();
        const db = await dbConnect();

        interface DeleteRequestBody {
            _id: string | string[];
        }

        const body = await request.json();

        interface DataItem {
            _id: string,
            item: { _id: string },
            sell_quantity: number
        }

        const isDataArray = (data: any): data is DataItem[] =>
            Array.isArray(data) && data.length > 0 && typeof data[0]?._id === 'string';

        const extractIds = (data: DataItem | DataItem[]): string | string[] =>
            isDataArray(data) ? data.map(({ _id }) => _id) : data._id;

        const _id = extractIds(body)

        const idsToDelete: string[] = Array.isArray(_id) ? _id : [_id];
        const objectIdsToDelete: Types.ObjectId[] = idsToDelete.map((id) => new mongoose.Types.ObjectId(id));
        const deleteItem = await Sale.deleteMany({ _id: objectIdsToDelete })

        console.log(body, "deleteItem")

        if (deleteItem.acknowledged) {
            if (isDataArray(body)) {

                for (const data of body) {
                    const item = await Item.findById(data.item._id);

                    if (item) {
                        item.stock += data.sell_quantity;
                        await item.save();
                    }

                }
                return NextResponse.json({ data: deleteItem, message: "Items Deleted", status: true });
            } else {
                const item = await Item.findById(body.item._id);

                if (item) {
                    item.stock += body.sell_quantity;
                    await item.save();
                    return NextResponse.json({ data: deleteItem, message: "Items Deleted", status: true });

                }
            }
        }


    } catch (error) {
        console.error('Error while deleting items:', error);
        return NextResponse.json({
            data: error, message: "An error occurred while deleting items."
            , status: false
        });

    }
}


