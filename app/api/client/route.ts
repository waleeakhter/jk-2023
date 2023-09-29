import dbConnect from '@/app/utils/dbConnect';
import fetchCall from '@/app/utils/fetch';
import Client from '@/models/Client';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
    await dbConnect()
    const res = await Client.find().sort({ name: 1 }).collation({ locale: "en" })
    const totalAmount = res.reduce((total, item) => total + item.credit, 0);
    return NextResponse.json({ data: res, totalCredit: Math.round(totalAmount) });
}

export async function POST(request: Request) {
    await dbConnect()
    console.log(request)

    return NextResponse.json(request);
}

