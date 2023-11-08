import dbConnect from '@/app/utils/dbConnect';
import fetchCall from '@/app/utils/fetch';
import ClientModal from '@/models/Client';
import { Client } from '@/typings';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
    await dbConnect()
    const res = await ClientModal.find().sort({ name: 1 }).collation({ locale: "en" })
    const totalAmount = res.reduce((total, item) => total + item.credit, 0);
    return NextResponse.json({ data: res, totalCredit: Math.round(totalAmount) });
}

export async function POST(request: Request) {
    await dbConnect()
    console.log(request)

    return NextResponse.json(request);
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const client = await ClientModal.findById(body._id);
    if(!client?.name){
      throw new Error("Client not found")
    }
    client.name = body.name;
    client.credit = body.credit;
    console.log(body)
    // when live
    // client.credit -= body.debit;
    await client.save();
    return NextResponse.json({ data: client, message: "Client Updated", status: true });
    
  } catch (error) {
    return NextResponse.json({statusCode : 500 , error : error});
  }
   
}