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
    token: {
        type: String
    }
})

export default module.exports = models.admin || model("admin", AdminSchema)