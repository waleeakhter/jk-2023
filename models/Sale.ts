import { Sale } from '@/typings';
import { Schema, model, models } from 'mongoose';



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
    }
  },
  { timestamps: true, strict: false }
);



export default models.Sale || model("Sale", SaleSchema);
