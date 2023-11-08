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


 const updateClientCredit = async (data : Array<Sale & { _id: string, status: number }> , status : number) => {
    try {
      if (!Array.isArray(data)) {
        data = [data]; // Convert a single object to an array
      }
  
      for (const item of data) {
        const saleItem = await SaleModal.findById(item._id);
        const client = await ClientModal.findById(item.client);
  
        if (saleItem && client) {
          if (saleItem.status === 2 && (status === 0 || status === 1)) {
            // Decrease client credit when the sale status changes from 2 to 0 or 1
            const creditToDeduct = saleItem.total_amount;
            client.credit -= creditToDeduct;
            await client.save();
          } else if (status === 2) {
            // Increase client credit when the status changes to 2
            const creditToAdd = item.total_amount;
            client.credit += creditToAdd;
            await client.save();
          }
  
        }
      }
    } catch (error) {
      // Handle any potential errors here
      console.error("An error occurred:", error);
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
        data: Array<Sale & { _id: string, status: number }> & { _id: string, status: number }
    }) => {
    try {
     
        if (body?.statusUpdate) {
            console.log(" in ")
            const $in = Array.isArray(body.data) ? { $in: body.data.map(el => el._id) } : body.data?._id;
            const $paidOn = (body.status === 0 || body.status === 2) ? null : body.paidOn;
           await updateClientCredit(body.data , body.status)
            // if(Array.isArray(body.data)){
            //     updateBulkClient(body.data , body.status)
            // }

            // if(!Array.isArray(body.data)){
            //     await singleClientUpdate(body.data as Sale & { _id: string, status: number } , body.status)
            // }
           
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
                if (getItem.stock >= stock) {

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