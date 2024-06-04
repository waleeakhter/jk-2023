import { Document, Schema, model, models } from 'mongoose';

const logsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  source: {
    type: String, // e.g., "Inventory", "Financial"
    required: true,
  },
  logType: {
    type: String, // e.g., "Payment", "StockUpdate"
    required: true,
  },
  details: {
    // Specific details based on the logType
  },
});


export default models.Log || model("Log", logsSchema);