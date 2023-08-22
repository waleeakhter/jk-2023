import { Schema, models, model } from 'mongoose';
const ClientSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
        uppercase: true
    },
    credit: {
        type: Number,
        required: false,
        index: true,
        default: 0
    },
    debit: {
        type: Number,
        required: false,
        index: true,
        default: 0
    }
}, { timestamps: true })

export default models.Client || model("Client", ClientSchema)