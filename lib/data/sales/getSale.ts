"use server";
import SaleModel from "@/models/Sale";
import { Sale, SaleApiDefaultParams } from "@/types/typings";
import dbConnect from "@/utils/dbConnect";
import { PipelineStage, Types } from "mongoose";

const defaultParams: SaleApiDefaultParams = {
  status: "[0]",
  brands: "[]",
  type: "[]",
  createdAt: null,
  endAt: null,
  paidStart: null,
  paidEnd: null,
  client: "[]",
  excludeClients: "[]",
  page: "1",
  pageSize: "10",
};

const parseSearchParams = (searchParams: any[] | URLSearchParams) => {
  const params = Object.fromEntries(searchParams.entries());
  const {
    status = "[0]",
    brands = "[]",
    type = "[]",
    createdAt = null,
    endAt = null,
    paidStart = null,
    paidEnd = null,
    client = "[]",
    excludeClients = "[]",
    page = "1",
    pageSize = "10",
  } = params;

  return {
    ...defaultParams,
    ...params,
    parsedStatus: JSON.parse(status),
    parsedBrands: JSON.parse(brands),
    parsedType: JSON.parse(type),
    parsedClient: JSON.parse(client),
    parsedExcludeClients: JSON.parse(excludeClients),
    pageNumber: parseInt(page),
    pagination: parseInt(pageSize),
    paidStart: paidStart ? new Date(paidStart) : null,
    paidEnd: paidEnd ? new Date(paidEnd) : null,
    startOfDay: createdAt ? new Date(createdAt ?? "") : null,
    endOfDay: endAt ? new Date(endAt ?? "") : null,
  };
};

const getSaleList = async (searchParams: any[] | URLSearchParams) => {
  await dbConnect();

  const {
    parsedStatus,
    parsedBrands,
    parsedType,
    parsedClient,
    parsedExcludeClients,
    pageNumber,
    pagination,
    paidStart,
    paidEnd,
    startOfDay,
    endOfDay,
  } = parseSearchParams(searchParams);

  if (startOfDay && endOfDay) {
    startOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(23, 59, 59, 999);
  }
  if (paidStart && paidEnd) {
    paidStart.setHours(0, 0, 0, 0);
    paidEnd.setHours(23, 59, 59, 999);
  }
  const pipeline: PipelineStage[] = [
    {
      $match: {
        ...(parsedStatus.length > 0 ? { status: { $in: parsedStatus } } : {}),
        ...(paidStart &&
          paidEnd && { paidOn: { $gte: paidStart, $lte: paidEnd } }),
        ...(startOfDay &&
          endOfDay && { createdAt: { $gte: startOfDay, $lte: endOfDay } }),
      },
    },
    {
      $lookup: {
        from: "items",
        localField: "item",
        foreignField: "_id",
        as: "item",
      },
    },
    {
      $unwind: "$item",
    },
    {
      $match: {
        ...(parsedType.length > 0 && { "item.type": { $in: parsedType } }),
        ...(parsedBrands.length > 0 && { "item.brand": { $in: parsedBrands } }),
      },
    },
    {
      $lookup: {
        from: "clients",
        localField: "client",
        foreignField: "_id",
        as: "client",
      },
    },
    {
      $unwind: "$client",
    },
    {
      $project: {
        item: {
          _id: "$item._id",
          name: "$item.name",
          type: "$item.type",
          price: "$item.price",
          stock: "$item.stock",
          purchase_price: "$item.purchase_price",
          brand: "$item.brand",
        },
        client: {
          _id: "$client._id",
          name: "$client.name",
        },
        createdAt: 1,
        reference: 1,
        total_amount: 1,
        sell_price: 1,
        sell_quantity: 1,
        status: 1,
        resource: 1,
        paidOn: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ];

  if (parsedClient.length > 0) {
    const clientObjectIds = parsedClient.map(
      (el: string) => new Types.ObjectId(el)
    );
    pipeline.splice(10, 0, {
      $match: {
        "client._id": { $in: clientObjectIds },
      },
    });
  }

  if (parsedExcludeClients.length > 0) {
    const excludeClientObjectIds = parsedExcludeClients.map(
      (el: string) => new Types.ObjectId(el)
    );
    pipeline.splice(10, 0, {
      $match: {
        "client._id": { $nin: excludeClientObjectIds },
      },
    });
  }

  const saleList = await SaleModel.aggregate(pipeline).then((sale: Sale[]) => {
    return sale.map((sale) => {
      return {
        ...sale,
        _id: sale._id.toString(),
        item: {
          ...sale.item,
          _id: sale.item._id.toString(),
        },
        client: {
          ...sale.client,
          _id: sale.client._id.toString(),
        },
      };
    });
  });
  // .limit(pagination).skip((pageNumber - 1) * pagination)
  const totalSaleAmount = saleList.reduce(
    (total, sale) => total + sale.total_amount,
    0
  );
  const count = await SaleModel.countDocuments({});
  const totalRows = Math.floor((count - 1) / pagination) + 1;
  return { saleList, totalSaleAmount, totalRows };
};

export default getSaleList;
