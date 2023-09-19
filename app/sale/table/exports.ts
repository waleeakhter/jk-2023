
import { Sale } from "@/typings"
import moment from "moment"

export const exportColumns = [
    { header: "Client", dataKey: "client" },
    { header: "Item", dataKey: "item" },
    { header: "Type", dataKey: "type" },
    { header: "Price", dataKey: "sell_price" },
    { header: "Purchase Price", dataKey: "purchase_price" },
    { header: "QTY", dataKey: "sell_quantity" },
    { header: "T/A", dataKey: "total_amount" },
    { header: "Total P/Price", dataKey: "p_total_amount" },
    { header: "Date", dataKey: "createdAt" },
    { header: "Dis", dataKey: "dis" },
    { header: "Check", dataKey: "check" }
]



export const exportData = (data: Array<Sale>) => {

    return data.map(el => {
        return {
            client: el.client.name,
            item: el.item['name'],
            type: el.item['type'],
            sell_price: el.sell_price,
            purchase_price: el.item["purchase_price"],
            sell_quantity: el.sell_quantity,
            total_amount: el.total_amount,
            p_total_amount: el.item["purchase_price"] * el.sell_quantity,

            createdAt: moment(el.createdAt).format("DD-MM-YY"),
        }
    }).sort((a, b) => a.client.localeCompare(b.client))
        .sort((a, b) => {
            const dateA: Date = moment(a.createdAt, "DD-MM-YY").toDate();
            const dateB: Date = moment(b.createdAt, "DD-MM-YY").toDate();
            return dateA.getTime() - dateB.getTime();
        }).sort((a, b) => a.type.localeCompare(b.type))
}
