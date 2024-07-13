import { Schema, model } from "mongoose";

const taskSchema = new Schema({
    taskType: {
        type: String,
        enum: ['text', 'list'],
        default: 'text'
    },
    text: {
        title: {type: String, required: function() { return this.taskType === 'text'; }},
        body: {type: String, required: function() { return this.taskType === 'text'; }},
        deadline: { type: Date, required: function () { return this.taskType === 'text'; } },
        status: {type: String, enum: ['to-do', 'doing', 'done'], default: 'to-do'},
    },
    listItems: [{
        title: {type: String},
        deadline: {type: Date, required: true},
        status: {type: String, enum: ['to-do', 'doing', 'done'], default: 'to-do'},
    }],
    visibility:{
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    categoryId:{
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
},
    {timestamps: true})

const Task = model('Task', taskSchema)

export default Task