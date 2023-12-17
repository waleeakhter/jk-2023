import { auth } from '@/app/auth';
import dbConnect from '@/app/utils/dbConnect';
import fetchCall from '@/app/utils/fetch';
import ClientModal from '@/models/Client';
import { Client } from '@/types/typings';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
  await dbConnect()
  const session = await auth()
  //  if(!session?.user.id){
  //   return NextResponse.json({ message : 'Unauthorized' } , {status : 401});

  //  }
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const res = await ClientModal.find(({ ...(id && { _id: id }) })).sort({ name: 1 }).collation({ locale: "en" })
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
    if (!client?.name) {
      throw new Error("Client not found")
    }
    console.log(client)
    client.name = body.name;
    client.credit = body.credit;
    await client.save();
    return NextResponse.json({ data: client, message: "Client Updated", status: true });

  } catch (error) {
    return NextResponse.json({ statusCode: 500, error: error });
  }

}