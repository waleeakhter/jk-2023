"use server";
import ClientModel from "@/models/Client";
import { Client } from "@/types/typings";
import dbConnect from "@/utils/dbConnect";

const getClients = async (searchParams?: any[] | URLSearchParams) => {
  const params = searchParams ? Object.fromEntries(searchParams.entries()) : {};
  await dbConnect();
  const { id, client } = params;
  const res = await ClientModel.find({
    ...(id && { _id: id }),
    ...(client && { name: { $regex: client, $options: "i" } }),
  })
    .sort({ name: 1 })
    .collation({ locale: "en" })
    .lean();
  const clients = res.length
    ? (res.map((item) => ({
        ...item,
        _id: (item._id as string).toString(),
      })) as Client[])
    : [];
  const totalAmount = res.reduce((total, item) => total + item.credit, 0);
  return { data: clients, totalCredit: Math.round(totalAmount) };
};

export default getClients;
