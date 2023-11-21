import { nextAuthOptions } from '@/app/authOptions';
import dbConnect from '@/app/utils/dbConnect';
import ItemModal from '@/models/Item';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: Request) {
    await dbConnect()
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

        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')
        const brand = searchParams.get('brand');
        const qty = searchParams.get('qty');
        const gte = searchParams.get('gte');
        const name = searchParams.get('name')

        const res = await ItemModal.find({}, { name: 1, _id: 1 })
            .sort({ name: 1 })
            .collation({ locale: "en" });
        return NextResponse.json({ data: res.sort(customSort), success: true });

    } catch (error) {
        return NextResponse.json({ data: error, message: "Somthing went wrong" });
    }
}
