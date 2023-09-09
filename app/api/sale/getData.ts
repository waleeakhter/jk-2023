import Sale from "@/models/Sale";
import { SaleApiDefaultParams } from "@/typings";
import { PipelineStage, Types } from "mongoose";

const defaultParams: SaleApiDefaultParams = {
    status: '[0]',
    brands: '[]',
    type: '[]',
    createdAt: null,
    endAt: null,
    paidOn: null,
    client: '[]',
    excludeClients: '[]'
};
  const getSaleList = async (searchParams: any[] | URLSearchParams ) => {
    const params = {
        ...defaultParams,
        ...Object.fromEntries(searchParams.entries())
    };

    const { status, brands, type, createdAt, endAt, paidOn, client,
        excludeClients } = params;
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
                    purchase_price : '$item.purchase_price',
                    brand : '$item.brand'
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

    const saleList = await Sale.aggregate(pipeline);
    const totalSaleAmount = saleList.reduce((total, sale) => total + sale.total_amount, 0);

    return {saleList , totalSaleAmount}

}

export default getSaleList