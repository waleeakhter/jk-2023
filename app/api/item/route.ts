import dbConnect from '@/app/utils/dbConnect';
import ItemModal from '@/models/Item';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: Request) {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const brand = searchParams.get('brand')
    const res = await ItemModal.find(({ ...(type && { type: type }), ...(brand && { brand: brand }) })).collation({ locale: 'en', caseLevel: true })
        .sort({ name: 1 })

    const totalAmount = res.reduce((total, item) => total + (item.purchase_price * item.stock), 0);
    return NextResponse.json({ data: res, totalAmount: totalAmount });
}



export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const item = await ItemModal.findByIdAndUpdate(body._id, { $set: { ...body } });
    return NextResponse.json({ status: 200, success: true, message: "Item Updated Successfully", data: item });
}