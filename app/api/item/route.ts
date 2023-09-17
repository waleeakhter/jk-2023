import dbConnect from '@/app/utils/dbConnect';
import fetchCall from '@/app/utils/fetch';
import ItemModal from '@/models/Item';
import { NextResponse } from 'next/server'
import brands from "@/app/utils/brands.json"
import xlsx from 'xlsx';
import { Item } from '@/typings';

function extractBrandName(name: string) {
    const brandNames = brands // Add more brand names as needed
    const lowerCaseName = name.toLowerCase();
    const matchingBrand = brandNames.find(brand => lowerCaseName.includes(brand));
    return matchingBrand || "unknown";
}
interface ExcelEntry {
    Name: string;
    Price: string;
}

async function updatePurchasePricesFromExcel(data: ExcelEntry[]): Promise<void> {
    console.log(data, "data")
    for (const entry of data) {
        const { Name, Price } = entry;
        console.log(Name, Price, " Name, Price")
        const regex = new RegExp(Name, "i");
        const updateResult = await ItemModal.updateMany({ name: regex }, { $set: { purchase_price: Price } });
        console.log(` documents updated for ${Name}.`);
    }

    console.log("All updates completed.");
}

export async function GET(request: Request) {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const brand = searchParams.get('brand')
    const res = await ItemModal.find(({ ...(type && { type: type }) , ...(brand && {brand : brand}) })).collation({ locale: 'en', caseLevel: true })
    .sort({ name: 1 })

    // for (const item of res) {
    //     if (!item?.brand && !item.purchase_price) {
    //         const brand = extractBrandName(item.name);
    //         await Item.updateOne({ _id: item._id }, { $set: { brand, purchase_price: 0 } });
    //     }
    // }


    const totalAmount = res.reduce((total, item) => total + (item.purchase_price  * item.stock), 0);
    return NextResponse.json({ data: res, totalAmount: totalAmount });
}

// export async function POST(request: Request) {
//     await dbConnect()
//     const body = await request.formData()
//     const file: File | null = body.get('file') as unknown as File

//     if (!file) {
//         return NextResponse.json({ error: 'No file provided.' });
//     }

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);
//     const worksheetName = 'Price List';

//     const workbook = xlsx.read(buffer, { type: 'buffer' });
//     const worksheet = workbook.Sheets[worksheetName];
//     // console.log('Worksheet Data:', worksheet);
//     const columnHeaders = ['Product Code', 'Name', 'Quantity', 'Price', 'Order', 'Total'];
//     const data: ExcelEntry[] = xlsx.utils.sheet_to_json(worksheet, { header: columnHeaders });
//     // console.log('Converted Data:', data);
//     const clonedData = data
//     const updates = [];
//     for (const entry of clonedData) {
//         const productName = entry['Name'];
//         const productPriceString = entry['Price'];
//         console.log(typeof productPriceString, "hell")
//         const regex = new RegExp(productName.toUpperCase())
//         const test = await ItemModal.find({ name: { $regex: regex } })
//         const updatedItems = test.map(item => ({
//             ...item.toObject(), // Convert Mongoose document to plain object
//             purchase_price: Number(productPriceString ?? 0)

//         }));

//         updates.push(...updatedItems);


//     }

//     // console.log(updates)

//     if (updates.length > 0) {
//         for (const item of updates) {

//             const tss = await ItemModal.updateOne({ _id: item?._id }, { $set: { purchase_price: Number(item.purchase_price) } })
//             // console.log(tss)
//         }
//         // const filters = updates.map(update => update.filter);
//         // const updatesToApply = updates.map(update => update.update);

//         // await Item.updateMany({ naem : { $re : filters} }, { $set: updatesToApply }, { multi: true });
//         // console.log(`${updates.length} documents updated.`);
//     } else {
//         console.log('No updates to perform.');
//     }

//     console.log("All updates completed.");
//     return NextResponse.json(request);
// }

export async function PATCH(res: Response) {
    const body = await res.json();
    const item = await ItemModal.findByIdAndUpdate(body._id , {$set : {...body}});
    // item.price = body.price;
    // item.stock = body.stock;
    // item.name = body.name;
    // await item.save()
    return NextResponse.json({ status: 200, success: true, message: "Item Updated Successfully" , data : item  }); 
}