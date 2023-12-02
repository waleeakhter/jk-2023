import { Sale } from '@/typings';
import { Schema, model, models } from 'mongoose';

import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
const SaleSchema: Schema<Sale> = new Schema<Sale>(
  {

    createdAt: {
      type: Date,
      default: Date.now,
    },
    item: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Item id is required'],
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client id is required'],
    },
    reference: {
      type: String,
      required: false,
    },
    total_amount: {
      type: Number,
      required: true,
      default: 0,
    },
    sell_price: {
      type: Number,
      required: true,
      default: 0,
    },
    sell_quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: Number,
      required: true,
    },
    paidOn: {
      type: Date,
      required: false,
      default: "" as unknown as Date
    },
    resource: {
      type: String,
      required: false,
      default: "shop"
    }
  },
  { timestamps: true, strict: false, collection: "sales" }
);

SaleSchema.plugin(aggregatePaginate);
export default models.Sale || model("Sale", SaleSchema);
