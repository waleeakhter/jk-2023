import ClientModal from "@/models/Client";
import Item from "@/models/Item";
import SaleModal from "@/models/Sale";
import { Client, Sale } from "@/typings";
import { Types } from "mongoose";
const messages = (id: number) => {
    switch (id) {
        case 0:
            return "Sale Item return to pending status"
        case 1:
            return "Sale Item amount recevied"
        case 2:
            return "Sale Item added to client account"

        default:
            break;
    }
}

const creditClient = async (data: Array<Sale> | Sale, status: number) => {
    const isArrayData = Array.isArray(data);

    // Check if the status is 2 or if the first sale item has a status of 2
    if (
        status === 2 ||
        (isArrayData && data[0]?.status === 2) ||
        (data && data.hasOwnProperty("status")) ||
        (status === 2 && data && data.hasOwnProperty("status"))
    ) {
        const clientIds = isArrayData
            ? data.map((el) => el.client._id)
            : data && data.client
                ? [data.client._id]
                : [];

        try {
            const clients = await ClientModal.find({ _id: clientIds });
            console.log(clients, status);

            const updatedClients = clients.map((client) => {
                let totalAmount = 0;

                if (isArrayData) {
                    totalAmount = data.reduce((total, sale) => {
                        if (sale.client._id === String(client._id)) {
                            return total + sale.total_amount;
                        } else {
                            return total;
                        }
                    }, 0);
                } else if (data && data.hasOwnProperty("status") && data.status === 2) {
                    totalAmount = data.total_amount;
                }

                if (status === 2) {
                    client.credit += totalAmount;
                } else {
                    client.credit -= totalAmount;
                }

                // Save the updated client data
                console.log(clients, status);
                return client.save(); // Return the promise returned by .save()
            });

            // Wait for all the save operations to complete
            await Promise.all(updatedClients);

            return updatedClients; // Return the updated clients
        } catch (error) {
            console.error("Error updating client credit:", error);
            throw error;
        }
    }

};

const updateSale = async (body:
    {
        sell_price: number;
        _id: any;
        status: any;
        paidOn: any;
        item: { _id: any; };
        sell_quantity: number;
        createdAt: any;
        statusUpdate: boolean,
        data: Array<Sale & { _id: string, status: number }> | Sale & { _id: string, status: number }
    }) => {
    try {
        console.log(body)
        if (body?.statusUpdate) {
            console.log(" in ")
            const $in = Array.isArray(body.data) ? { $in: body.data.map(el => el._id) } : body.data?._id;
            const $paidOn = (body.status === 0 || body.status === 2) ? null : body.paidOn;
            await creditClient(body.data, body.status)
            const updateSaleItem = await SaleModal.updateMany(
                { _id: $in },
                { $set: { status: body.status, paidOn: $paidOn } }
            );

            return { status: 200, success: true, message: messages(body.status), data: updateSaleItem };
        } else {
            //  update sale item information 
            console.log(" // update single item")
            const updateSaleItem = await SaleModal.findById(body._id);
            const getItem = await Item.findById(body.item._id)
            updateSaleItem.sell_price = body.sell_price;
            updateSaleItem.total_amount = Math.round(body.sell_quantity * body.sell_price);
            updateSaleItem.createdAt = body.createdAt;

            if (body.sell_quantity > updateSaleItem.sell_quantity) {
                const stock = body.sell_quantity - updateSaleItem.sell_quantity
                if (getItem.stock > stock) {

                    getItem.stock -= stock
                } else {
                    return { status: 404, success: false, message: "Insufficient stock" };
                }
                await getItem.save()
            } else if (body.sell_quantity < updateSaleItem.sell_quantity) {
                getItem.stock += updateSaleItem.sell_quantity - body.sell_quantity
                await getItem.save()
            }
            updateSaleItem.sell_quantity = body.sell_quantity;
            await updateSaleItem.save()
            return { status: 200, success: true, message: "Sale Item Updated Successfully", data: updateSaleItem };
        }


    } catch (error) {
        // Handle any errors that occur during the update process
        console.error("Error updating documents:", error);
        return { status: 404, success: false, message: 'An error occurred while updating the documents.' }
    }
}
export default updateSale