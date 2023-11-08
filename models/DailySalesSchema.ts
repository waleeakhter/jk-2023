import { Document, Schema, model, models } from 'mongoose';

const expenseSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const dailySalesSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  totalSales: {
    type: Number,
    required: true,
  },
  totalLCDCollections: {
    type: Number,
    required: true,
  },
  totalMobilesCollections: {
    type: Number,
    required: true,
  },
  totalClientCreditCollections: {
    type: Number,
    required: true,
  },
  expenses: [expenseSchema],
  currentCashBalance: {
    type: Number,
    required: true,
    default: 0,
  }
});

export default module.exports = models.DailySales || model("DailySales", dailySalesSchema);