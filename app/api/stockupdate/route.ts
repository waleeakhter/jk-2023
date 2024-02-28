import dbConnect from '@/utils/dbConnect';
import ItemModal from '@/models/Item';
import { Item } from '@/types/typings';
import { NextRequest, NextResponse } from 'next/server'
import Log from '@/models/Log';

type stockProps = {
    resource: boolean; check: string, item: Item, stockUpdate: string, stock: number, purchase_price: number
}
export async function POST(req: NextRequest) {
    dbConnect()
    try {
        const body: stockProps = await req.json();
        console.log(body)
        const { check, item } = body
        const getItem = await ItemModal.findById(item._id);
        if (!getItem?._id) {
            throw new Error(`Could not find the item`)
        }

        if (check === "wearhouse") {
            const wearHouseStock = getItem.wearHouseStock ?? 0; // Get the wearHouseStock value or default to 0 if undefined
            const shopStock = getItem.stock; // Get the shop stock value

            const salePrice = getItem.purchase_price; // Get the current sale price

            // Calculate the total cost of the old stock
            const oldStockCost = (wearHouseStock + shopStock) * salePrice;
            const newStockCost = body.stock * body.purchase_price; // New items * Price per new item

            const totalItems = body.stock + wearHouseStock + shopStock; // Total items after update

            const totalCost = oldStockCost + newStockCost; // Total cost of all items after update

            const averagePrice = Number(totalCost / totalItems).toFixed(2); // Average price
            console.log(oldStockCost, getItem.wearHouseStock ?? 0, getItem.stock, getItem.purchase_price, "Average price")
            const stockUpdateItem = await ItemModal.findByIdAndUpdate(item._id,
                {
                    $set: {
                        wearhouseStockUpdated: body.stockUpdate,
                        wearHouseStock: body.stock + wearHouseStock,
                        purchase_price: averagePrice,
                    }
                })
            await Log.create({
                name: `${item.name} stock updated: Transferred to warehouse.`, source: "inventory", logType: "stockupdate",
                "details": {
                    "item": item?._id,
                    "action": "update",
                    "from": "warehouse",
                    "to": "warehouse",
                    "initialStock": item.wearHouseStock,
                    "quantityUpdated": body.stock,
                    "currentStock": item.wearHouseStock + body.stock
                }
            })


            return NextResponse.json({ status: 200, success: true, message: `Updated Successfully`, data: stockUpdateItem });
        }
        if (check === "shop") {
            // if (getItem.wearHouseStock <= 0 && getItem.wearHouseStock >= body.stock && !body.resource) {
            //     throw new Error(`Insufficient stock`)

            const wearHouseStock = getItem.wearHouseStock ?? 0; // Get the wearHouseStock value or default to 0 if undefined
            const shopStock = getItem.stock; // Get the shop stock value

            const salePrice = getItem.purchase_price; // Get the current sale price

            // Calculate the total cost of the old stock
            const oldStockCost = (wearHouseStock + shopStock) * salePrice;
            const newStockCost = body.stock * body.purchase_price; // New items * Price per new item

            const totalItems = body.stock + wearHouseStock + shopStock; // Total items after update

            const totalCost = oldStockCost + newStockCost; // Total cost of all items after update

            const averagePrice = Number(totalCost / totalItems).toFixed(2);
            // }
            const stockUpdateItem = await ItemModal.findByIdAndUpdate(item._id,
                {
                    $set: {
                        stockUpdated: body.stockUpdate,
                        stock: body.stock + (getItem.stock ?? 0),
                        purchase_price: averagePrice,
                    }
                })
            if (stockUpdateItem) {


                // if (!body.resource) {
                //     getItem.wearHouseStock = getItem.wearHouseStock - body.stock;
                // }
                getItem.save()
                await Log.create({
                    name: `${item.name} stock updated: Transferred to shop.`, source: "inventory", logType: "stockupdate",
                    "details": {
                        "item": item?._id,
                        "action": "update",
                        "from": "newstock",
                        "to": "shop",
                        "initialStock": item.stock,
                        "quantityUpdated": body.stock,
                        "currentStock": item.stock + body.stock,
                    }
                })
            }
            return NextResponse.json({ status: 200, success: true, message: `Shop Stock Updated Successfully`, data: stockUpdateItem });
        }


    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 500, data: error, message: error }, { status: 500 });

    }
}

export async function PATCH(req: NextRequest) {
    try {
        dbConnect()
        const body = await req.json();
        const item = await ItemModal.findByIdAndUpdate(body._id, { $set: { ...body } });
        return NextResponse.json({ status: 200, success: true, message: "Item Updated Successfully", data: item });

    } catch (error) {
        return NextResponse.json({ data: error, message: "Somthing went wrong" });

    }
}