import dbConnect from '@/app/utils/dbConnect';
import ItemModal from '@/models/Item';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: Request) {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const brand = searchParams.get('brand')
    function customSort(a: { name: string; }, b: { name: string; }): number {
        // Compare the names of the items
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }
    const res = await ItemModal.find(({ ...(type && { type: type }), ...(brand && { brand: brand }) }))
        .sort({ name: 1 }).collation({ locale: "en" })


    const totalAmount = res.reduce((total, item) => total + (item.purchase_price * item.stock), 0);
    return NextResponse.json({ data: res.sort(customSort), totalAmount: totalAmount });
}



export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const item = await ItemModal.findByIdAndUpdate(body._id, { $set: { ...body } });
    return NextResponse.json({ status: 200, success: true, message: "Item Updated Successfully", data: item });
}