import dbConnect from '@/utils/dbConnect';
import fetchCall from '@/utils/fetch';
import ItemType from '@/models/ItemType';
import { NextResponse } from 'next/server';
export async function GET(request: Request) {
    await dbConnect()
    const res = await ItemType.find()
    return NextResponse.json(res);
}

export async function POST(request: Request) {
    await dbConnect()
    const res = await fetchCall(
        "https://jsonplaceholder.typicode.com/posts"
    );

    return NextResponse.json(res);
}

