import dbConnect from "@/utils/dbConnect";
import PaymentModal from "@/models/Payments";
import { NextResponse } from 'next/server';
export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const id = params.id
  console.log(id)
  if (!id) {
    return NextResponse.json({ statusCode: 400, error: "Id is required" }, { status: 403 })
  }
  const payments = await PaymentModal.find({ client: id }).sort({ createdAt: -1 })

  return NextResponse.json({ data: payments ?? [], success: true });
}