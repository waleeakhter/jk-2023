import { Document, Schema, model, models } from 'mongoose';

interface ItemType extends Document {
    type: 'mobile' | 'lcd';
}

const ItemTypeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

export default module.exports = models.Type || model("Type", ItemTypeSchema);
