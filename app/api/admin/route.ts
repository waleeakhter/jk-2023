import dbConnect from '@/app/utils/dbConnect';
import Admin from '@/models/Admin';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: Request) {

    try {

        await dbConnect()
        const body = request.json()
        const res = await Admin.findOne({ ...body })
        console.log(res, "dsadasdasds")
        return NextResponse.json({ data: res });

    } catch (error) {
        return NextResponse.json({ data: error, message: "Somthing went wrong" });
    }
}



