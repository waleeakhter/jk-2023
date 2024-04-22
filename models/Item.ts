import { Schema, models, model } from "mongoose";
import brands from "@/utils/brands.json"
import types from "@/utils/types.json"
// Creating a Schema for uploaded files
const ItemSchema = new Schema({
    name: {
        type: String,
        required: [true, "Item name is required"],
        index: true,
        uppercase: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    wearHouseStock: {
        type: Number,
        required: true,
        default: 0,
    },
    type: {
        type: String,
        enum: types.map(type => type.value),
        required: true,
    },
    brand: {
        type: String,
        enum: brands,
        required: true
    },
    purchase_price: {
        type: Number,
        required: false,
    },

    price: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    stockUpdated: {
        type: Date,
    },
    wearhouseStockUpdated: {
        type: Date,
    },
}, { timestamps: true });

// Creating a Model from that Schema
export default models.Item || model("Item", ItemSchema);