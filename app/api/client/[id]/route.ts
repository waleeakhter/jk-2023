import dbConnect from "@/app/utils/dbConnect";
import ClientModal from '@/models/Client';
import Item from "@/models/Item";
import Sale from "@/models/Sale";
import { NextResponse } from 'next/server';
export async function GET(request: Request, { params }: { params: { id: string } }) {
    await dbConnect()
    const id = params.id
    console.log(id)
    if (!id) {
        return NextResponse.json({ statusCode: 400, error: "Id is required" }, { status: 403 })
    }
    const client = await ClientModal.findById({ _id: id })
    const itemsList = await Sale.find({ client: id }).populate({ path: "item" , model : Item , select: { "name": 1, "type": 1 } }).sort({ createdAt: -1 })

    return NextResponse.json({ data: itemsList, client: client });
}