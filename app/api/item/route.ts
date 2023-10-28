import { nextAuthOptions } from '@/app/authOptions';
import dbConnect from '@/app/utils/dbConnect';
import ItemModal from '@/models/Item';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: Request) {
    // const session = await getServerSession(nextAuthOptions)
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
    try {
        // if (!session) {
        //     // User is not authenticated
        //     return NextResponse.json({ authError: true, error: "Authentication required" });
        // }
        await dbConnect()
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')
        const brand = searchParams.get('brand');
        const qty = searchParams.get('qty');
        const gte = searchParams.get('gte');
        const name = searchParams.get('name')

        const res = await ItemModal.find(({
            ...(type && { type: type }),
            ...(brand && { brand: brand }),
            ...(qty && { stock: { $gte: gte, $lte: qty } }),
            ...(name && { name: { $regex: new RegExp(name, "i") } }),
        })).sort({ name: 1 }).collation({ locale: "en" })


        const totalAmount = res.reduce((total, item) => total + (item.purchase_price * item.stock), 0);
        return NextResponse.json({ data: res.sort(customSort), totalAmount: totalAmount });

    } catch (error) {
        return NextResponse.json({ data: error, message: "Somthing went wrong" });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const name = body.name.trim().toUpperCase()

        const existingItem = await ItemModal.findOne({ name: name });
        if (existingItem) {
            throw new Error(`Item ${name} already exists`);
        }
        const newItem = await ItemModal.create({ ...body, name: name })
        console.log(newItem)
        return NextResponse.json({ status: 200, success: true, message: `${newItem?.name} Updated Successfully`, data: newItem });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 400, data: error, message: error });

    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const item = await ItemModal.findByIdAndUpdate(body._id, { $set: { ...body } });
        return NextResponse.json({ status: 200, success: true, message: "Item Updated Successfully", data: item });

    } catch (error) {
        return NextResponse.json({ data: error, message: "Somthing went wrong" });

    }
}