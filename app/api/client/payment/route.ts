import dbConnect from '@/app/utils/dbConnect';
import ClientModal from '@/models/Client';
import { NextResponse } from 'next/server';
import Payments from '@/models/Payments';
import Log from '@/models/Log';


export async function GET(request: Request) {
  await dbConnect()
  const res = await ClientModal.find().sort({ name: 1 }).collation({ locale: "en" })
  const totalAmount = res.reduce((total, item) => total + item.credit, 0);
  return NextResponse.json({ data: res, totalCredit: Math.round(totalAmount) });
}

export async function POST(request: Request) {
  await dbConnect()
 try{
  const body = await request.json()
  if (body?.payments) {
    const { payments } = body
    for (const payment of payments) {
      const getClient = await ClientModal.findById(payment.client);
      if (getClient) {
        getClient.credit -= payment.amount;
        const resPay = await Payments.create({ client: payment.client, amount: payment.amount, paymentDate: payment.paymentDate })
     
        if (resPay) {
          getClient.save()
          await Log.create({ name: `${getClient.name} has paid ${payment.amount}€ to ${new Date(payment.paymentDate).toDateString()}` , source : "financial" , logType : "payment" })

        }
      } else {
        return NextResponse.json({ statusCode: 500, error: "Client not found" }, { status: 500, statusText: "Client not found" });

      }
    }
    return NextResponse.json({ statusCode: 200, success : true , message : " All clients' payments have been successfully processed. " }, { status: 200, statusText: "All clients' payments have been successfully processed." });

  } else {
    return NextResponse.json({ statusCode: 400, error: "Payments variable required" }, { status: 400, statusText: "Payments variable required" });

  }
 }catch{
  return NextResponse.json({ statusCode: 500, error: "Something went wrong" }, { status: 500, statusText: "Something went wrong" });

 }

}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const client = await ClientModal.findById(body._id);
    if (!client?.name) {
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
    return NextResponse.json({ statusCode: 500, error: error });
  }

}