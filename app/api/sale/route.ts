import dbConnect from '@/app/utils/dbConnect';
import Client from '@/models/Client';
import Item from '@/models/Item';
import Sale from '@/models/Sale';
import { AggregateOptions, ObjectId, PipelineStage, Types } from 'mongoose';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

interface DefaultParams {
    status: string;
    brands: string;
    type: string;
    createdAt: string | null;
    endAt: string | null;
    paidOn: string | null;
    client: string;
    excludeClients: string;
}
const defaultParams: DefaultParams = {
    status: '[0]',
    brands: '[]',
    type: '[]',
    createdAt: null,
    endAt: null,
    paidOn: null,
    client: '[]',
    excludeClients: '[]'
};
export async function GET(request: Request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);


    const params = {
        ...defaultParams,
        ...Object.fromEntries(searchParams.entries())
    };
    const { status, brands, type, createdAt, endAt, paidOn, client,
        excludeClients } = params;
    console.log(createdAt, endAt)
    const parsedStatus = JSON.parse(status);
    const parsedBrands = JSON.parse(brands);
    const parsedType = JSON.parse(type);
    const parsedClient = JSON.parse(client)
    const parsedExcludeClients = JSON.parse(excludeClients);

    const getDate = new Date(paidOn ?? new Date());
    getDate.setHours(0o0, 0, 0, 0);

    const startOfDay = new Date(createdAt ?? "");
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(endAt ?? new Date());
    endOfDay.setHours(23, 59, 59, 999);
    console.log(parsedBrands)
    const pipeline: PipelineStage[] = [
        {
            $match: {
                status: { $in: parsedStatus },
                ...(paidOn && { paidOn: { $gte: getDate } }),
                ...(createdAt && { createdAt: { $gte: startOfDay, $lte: endOfDay } }),
            },
        },
        {
            $lookup: {
                from: 'items',
                localField: 'item',
                foreignField: '_id',
                as: 'item',
            },
        },
        {
            $unwind: '$item',
        },
        {
            $match: {
                ...(parsedType.length > 0 && { 'item.type': { $in: parsedType } }),
                ...(parsedBrands.length > 0 && { 'item.brand': { $in: parsedBrands } })
            }
        },
        {
            $lookup: {
                from: 'clients',
                localField: 'client',
                foreignField: '_id',
                as: 'client',
            },
        },
        {
            $unwind: '$client',
        },
        {
            $project: {
                item: {
                    _id: '$item._id',
                    name: '$item.name',
                    type: '$item.type',
                    price: '$item.price',
                    stock: '$item.stock',
                },
                client: {
                    _id: '$client._id',
                    name: '$client.name',
                },
                createdAt: 1,
                reference: 1,
                total_amount: 1,
                sell_price: 1,
                sell_quantity: 1,
                status: 1,
            },
        },
        {
            $sort: { createdAt: -1 },
        },
    ];

    if (parsedClient.length > 0) {
        const clientObjectIds = parsedClient.map((el: string) => new Types.ObjectId(el));
        pipeline.splice(10, 0, {
            $match: {
                'client._id': { $in: clientObjectIds },
            },
        });
    }

    if (parsedExcludeClients.length > 0) {
        const excludeClientObjectIds = parsedExcludeClients.map((el: string) => new Types.ObjectId(el));
        pipeline.splice(10, 0, {
            $match: {
                'client._id': { $nin: excludeClientObjectIds },
            },
        });
    }

    const res = await Sale.aggregate(pipeline);
    const totalSaleAmount = res.reduce((total, sale) => total + sale.total_amount, 0);

    return NextResponse.json({ data: res, totalSale: Math.round(totalSaleAmount.toFixed(2)) });
}


export async function POST(res: NextRequest) {
    await dbConnect()

    const body = await res.json();
    let newItem: { _id: Types.ObjectId } = {
        _id: new Types.ObjectId
    };
    let newClient: { _id: Types.ObjectId } = {
        _id: new Types.ObjectId
    };

    if (body.client.__isNew__) {
        //create new client
        newClient = await Client.create({ name: body.client.value });
    }
    if (body.item.__isNew__) {
        //create new item
        newItem = await Item.create({ name: body.item.value, stock: 100, type: "mobile", price: body.sell_price });

    }

    if (!body.item.__isNew__) {
        const item = await Item.findById(body.item.value);
        // Check if there is enough stock to sell
        if (body.sell_quantity > item.stock) {
            return NextResponse.json({ status: 404, error: 'Insufficient stock' });
        }

        item.stock -= body.sell_quantity;
        await item.save();
    }

    const newSale = await Sale.create({
        ...body,
        item: body.item.__isNew__ ? newItem._id : body.item.value,
        client: body.client.__isNew__ ? newClient?._id : body.client.value,
        total_amount: body.sell_price * body.sell_quantity,
        status: 0
    })
    console.log(newSale, "newSale")
    const tag = res.nextUrl.searchParams.get('getItems')
    revalidateTag(tag as string)

    return NextResponse.json({ revalidated: true, now: Date.now(), data: newSale });
}



export async function PATCH(request: Request, res: NextResponse) {
    try {
        await dbConnect();

        // Get the request body
        const body = await request.json();
        console.log(body.paidOn, "body.paidOn")
        if (!body?.sell_price) {
            const idsToUpdate = body._id;
            console.log(idsToUpdate)
            const updateSaleItem = await Sale.updateMany(
                { _id: { $in: idsToUpdate } },
                { $set: { status: body.status, ...(body.paidOn && { paidOn: body.paidOn }) } }
            );
            return NextResponse.json(updateSaleItem);
        } else {
            const updateSaleItem = await Sale.findById(body._id);
            const getItem = await Item.findById(body.item._id)
            updateSaleItem.sell_price = body.sell_price;
            updateSaleItem.total_amount = body.sell_quantity * body.sell_price;
            updateSaleItem.createdAt = body.createdAt;

            if (body.sell_quantity > updateSaleItem.sell_quantity) {
                const stock = body.sell_quantity - updateSaleItem.sell_quantity
                if (getItem.stock > stock) {

                    getItem.stock -= stock
                } else {
                    return NextResponse.json({ status: 404, error: 'Insufficient stock' });
                }
                await getItem.save()
            } else if (body.sell_quantity < updateSaleItem.sell_quantity) {
                getItem.stock += updateSaleItem.sell_quantity - body.sell_quantity
                await getItem.save()
            }
            updateSaleItem.sell_quantity = body.sell_quantity;
            await updateSaleItem.save()
            return NextResponse.json(updateSaleItem);
        }


    } catch (error) {
        // Handle any errors that occur during the update process
        console.error("Error updating documents:", error);
        return NextResponse.json({ status: 404, error: 'An error occurred while updating the documents.' });
    }
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