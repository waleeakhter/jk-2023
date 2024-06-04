import { Document, Schema, model, models } from 'mongoose';

const paymentSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  paymentDate: {
    type: Date,
  },
  paymentType: {
    type: String,
    // You can use enum to specify allowed values (e.g., LCD collection, mobiles collection, client credit collection)
  },
  details :{
    type: Object,
    default: {}
  }
});

export default models.Payment || model("Payment", paymentSchema);