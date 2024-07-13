import { Schema, model } from "mongoose"

const categorySchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

categorySchema.virtual('Tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'categoryId'
})

const Category = model('Category', categorySchema)

export default Category