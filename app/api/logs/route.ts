import dbConnect from "@/app/utils/dbConnect";
import LogModal from '@/models/Log';
import { NextResponse } from 'next/server';
export async function GET(request: Request, { params }: { params: { id: string } }) {
    await dbConnect()
    try {
        const logsList = await LogModal.find().sort({ createdAt: -1 })
        return NextResponse.json({ data: logsList ?? [] });
    } catch (error) {
        return NextResponse.json({ data: error }, { status: 500 });
    }

}