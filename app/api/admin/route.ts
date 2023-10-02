import dbConnect from '@/app/utils/dbConnect';
import Admin from '@/models/Admin';
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        await dbConnect();
      
        const body = await request.json();

        // Modify the query based on your database schema and requirements
        const res = await Admin.findOne(body);

        if (!res) {
            return NextResponse.json({ data: null, message: "Data not found" });
        }

        return NextResponse.json({ data: res, message: "Success" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ data: null, message: "Something went wrong" });
    }
}