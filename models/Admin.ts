import { Schema, models, model } from 'mongoose';
const AdminSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        index: true
    },
    lastName: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        index: true
    },
    role: {
        type: String,
        default: 'admin'
    },
    token: {
        type: String
    }
})


export default models.admin || model("admin", AdminSchema)