import Client from "@/models/Client";
import Item from "@/models/Item";
import Sale from "@/models/Sale";
import moment from "moment";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

const createSale = async (body: {
  createdAt: Date;
  client: { __isNew__: boolean; value: string };
  item: { __isNew__: boolean; value: string };
  sell_price: number;
  sell_quantity: number;
  resource: string;
}) => {
  try {
    let newItemId: Types.ObjectId | null = null;
    let newClientId: Types.ObjectId | null = null;
    const { resource, item } = body;
    if (body.client.__isNew__) {
      const name = body.client.value.trim().toUpperCase();
      const existingClient = await Client.findOne({ name: name });
      if (existingClient) {
        return {
          status: 400,
          success: false,
          message: "Client already exists",
        };
      }
      const newClient = await Client.create({ name: name });
      newClientId = newClient._id;
    }

    if (body.item.__isNew__) {
      const name = body.item.value.trim().toUpperCase();
      const existingItem = await Item.findOne({ name: name });
      if (existingItem) {
        return { status: 400, success: false, message: "Item already exists" };
      }
      const newItem = await Item.create({
        name: name,
        stock: 100 - body.sell_quantity,
        type: "mobile",
        price: body.sell_price,
      });
      newItemId = newItem._id;
    } else {
      const item = await Item.findById(body.item.value);
      if (!item) {
        return { status: 404, success: false, message: "Item not found" };
      }

      if (body.sell_quantity > item.stock) {
        return {
          status: 404,
          success: false,
          message: `${item.name} is out of stock`,
        };
      }
      item.stock -= body.sell_quantity;
      await item.save();
    }
    const newSale = await Sale.create({
      ...body,
      createdAt: moment(body.createdAt).isSame(moment(), "day")
        ? body.createdAt
        : moment(body.createdAt).add(1, "minutes"),
      item: newItemId || body.item.value,
      client: newClientId || body.client.value,
      total_amount: body.sell_price * body.sell_quantity,
      status: 0,
    });

    return {
      data: newSale,
      success: true,
      message: "Sale Item Added Successfully",
    };
  } catch (error) {
    return { status: 500, success: false, message: "An error occurred" };
  }
};

export default createSale;
