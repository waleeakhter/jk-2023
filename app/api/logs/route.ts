import dbConnect from "@/utils/dbConnect";
import LogModal from '@/models/Log';
import { NextResponse } from 'next/server';
export async function GET(request: Request) {
    await dbConnect()
    const { searchParams } = new URL(request.url);
    const { name } = Object.fromEntries(searchParams.entries())
    console.log(name, "name")
    try {

        const logsList = await LogModal.find({
            ...(name && { "name": { $regex: name, $options: "i" } })
        }).sort({ paymentDate: -1 })
        return NextResponse.json({ data: logsList ?? [] });
    } catch (error) {
        return NextResponse.json({ data: error }, { status: 500 });
    }

}