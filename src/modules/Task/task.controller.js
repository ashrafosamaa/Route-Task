import { APIFeatures } from "../../utils/api-features.js"

import Task from "../../../DB/models/task.model.js"
import Category from "../../../DB/models/category.model.js"

export const addTextTask = async (req, res, next)=> {
    const {_id} = req.authUser
    const {taskType, visibility, deadline, title, body} = req.body
    const { categoryId } = req.query
    const category = await Category.findById({_id: categoryId})
    if(!category){
        return next (new Error('Category not found', { cause: 404 }))
    }
    if(taskType != "text"){
        return next (new Error('Task type is not text', { cause: 400 }))
    }
    const text = {title, deadline, body, status: "to-do"}
    const newTask = await Task.create({taskType, text, userId: _id, visibility, categoryId})
    await Task.findByIdAndUpdate(newTask._id, { $unset: { listItems: 1 } });
    if(!newTask){
        return next (new Error('Task creation failed', { cause: 500 }))
    }
    return res.status(201).json({
        msg: "Task added successfully",
        statusCode: 201
    })
}

export const addListTask = async (req, res, next)=> {
    const {_id} = req.authUser
    const {taskType, visibility, listItems} = req.body
    const { categoryId } = req.query
    const category = await Category.findById({_id: categoryId})
    if(!category){
        return next (new Error('Category not found', { cause: 404 }))
    }
    if(taskType != "list"){
        return next (new Error('Task type is not list', { cause: 400 }))
    }
    const newTask = await Task.create({taskType, listItems:listItems.map(item => ({
        title: item.title,
        deadline: item.deadline,
        status: 'to-do'})), userId: _id, visibility, categoryId})
    await Task.findByIdAndUpdate(newTask._id, { $unset: { text: 1 } });
    if(!newTask){
        return next (new Error('Task creation failed', { cause: 500 }))
    }
    return res.status(201).json({
        msg: "Tasks added successfully",
        statusCode: 201
        })
}

export const getMyTasks = async (req, res, next)=>{
    const {page, size, ...filter} = req.query
    const features = new APIFeatures(req.query, Task.find({userId: req.authUser._id}).select('-__v -createdAt -updatedAt'))
    .pagination({page, size})
    .filter(filter)
    const tasks = await features.mongooseQuery
    const processedTasks = tasks.map(task => {
        const taskObj = task.toObject();
        if (task.taskType === 'text') {
            delete taskObj.listItems;
        } else if (task.taskType === 'list') {
            delete taskObj.text;
        }
        return taskObj;
    });
    if (!tasks.length) {
        return next(new Error('No tasks found', { cause: 404 }))
    }
    res.status(200).json({
        msg: "Tasks fetched successfully",
        statusCode: 200,
        processedTasks
    })
}

export const getAllTasks = async (req, res, next)=>{
    const {page, size} = req.query
    const features = new APIFeatures(req.query, Task.find({visibility: 'public'}).select('-__v -createdAt -updatedAt'))
    .pagination({page, size})
    const tasks = await features.mongooseQuery
    const processedTasks = tasks.map(task => {
        const taskObj = task.toObject();
        if (task.taskType === 'text') {
            delete taskObj.listItems;
        } else if (task.taskType === 'list') {
            delete taskObj.text;
        }
        return taskObj;
    });
    if (!tasks.length) {
        return next(new Error('No tasks found', { cause: 404 }))
    }
    res.status(200).json({
        msg: "Tasks fetched successfully",
        statusCode: 200,
        processedTasks
    })
}

export const getTaskById = async (req, res, next)=>{
    const {taskId} = req.params
    const task = await Task.findById(taskId)
    if(!task){
        return next(new Error('Task not found', { cause: 404 }))
    }
    if(task.visibility == 'private'){
        if(task.userId.toString() != req.authUser._id.toString()){
            return next(new Error('You can not access this task', { cause: 404 }))
        }
    }
    const taskObj = task.toObject()
    if (task.taskType === 'text') {
        delete taskObj.listItems
    } else if (task.taskType === 'list') {
        delete taskObj.text
    }
    res.status(200).json({
        msg: "Task fetched successfully",
        statusCode: 200,
        taskObj
    })
}

export const updateTextTask = async (req, res, next)=>{
    const {visibility, deadline, status, title, body, categoryId} = req.body
    const { taskId } = req.params
    const {_id} = req.authUser
    const taskUpdate = await Task.findOne({_id: taskId, userId: _id}).select('-__v -createdAt -updatedAt -listItems')
    if(!taskUpdate){
        return next (new Error('Task not found', { cause: 404 }))
    }
    if(taskUpdate.taskType != "text"){
        return next (new Error('Task type is not text', { cause: 400 }))
    }
    if(categoryId){
        const category = await Category.findById({_id: categoryId})
        if(!category){
            return next (new Error('Category not found', { cause: 404 }))
        }
        taskUpdate.categoryId = categoryId
    }
    if(visibility) taskUpdate.visibility = visibility
    if(deadline) taskUpdate.deadline = deadline
    if(title) taskUpdate.text.title = title
    if(body) taskUpdate.text.body = body
    if(status) taskUpdate.text.status = status
    await taskUpdate.save()
    return res.status(200).json({
        msg: "Task update done", 
        statusCode: 200,
        taskUpdate
    })
}

export const updateListTask = async (req, res, next)=>{
    const {visibility, deadline, status, title, categoryId} = req.body
    const { taskId } = req.params
    const { itemId } = req.query
    const {_id} = req.authUser
    const taskUpdate = await Task.findOne({_id: taskId, userId: _id}).select('-__v -createdAt -updatedAt -text')
    if(!taskUpdate){
        return next (new Error('Task not found', { cause: 404 }))
    }
    if(taskUpdate.taskType != "list"){
        return next (new Error('Task type is not list', { cause: 400 }))
    }
    const itemIndex = taskUpdate.listItems.findIndex(item => item._id.toString() === itemId.toString());
    if (itemIndex === -1) {
        return next(new Error('Task item not found', { cause: 404 }));
    }
    if (categoryId){
        const category = await Category.findById({_id: categoryId})
        if(!category){
            return next (new Error('Category not found', { cause: 404 }))
        }
        taskUpdate.categoryId = categoryId
    } 
    if (visibility) taskUpdate.visibility = visibility
    if (deadline) taskUpdate.listItems[itemIndex].deadline = deadline;
    if (title) taskUpdate.listItems[itemIndex].title = title;
    if (status) taskUpdate.listItems[itemIndex].status = status;
    await Task.findByIdAndUpdate(taskUpdate._id, { $unset: { text: 1 } });
    await taskUpdate.save()
    return res.status(200).json({
        msg: "Task update done", 
        statusCode: 200,
        taskUpdate
    })
}

export const deleteItem= async (req, res, next)=>{
    const {_id} = req.authUser
    const {taskId} = req.params
    const {itemId} = req.query
    const taskUpdate = await Task.findOne({_id: taskId, userId: _id})
    .select('-__v -createdAt -updatedAt -text')
    if(!taskUpdate){
        return next (new Error('Task not found', { cause: 404 }))
    }
    if(taskUpdate.taskType != "list"){
        return next (new Error('Task type is not list', { cause: 400 }))
    }
    const itemIndex = taskUpdate.listItems.findIndex(item => item._id.toString() === itemId.toString());
    if (itemIndex === -1) {
        return next(new Error('Task item not found', { cause: 404 }));
    }
    const itemDelete = await Task.findByIdAndUpdate(taskUpdate._id, {$pull: {listItems: {_id: itemId} }}, {new: true})
    .select('-__v -createdAt -updatedAt -text')
    return res.status(200).json({
        msg: "Item deleted done", 
        statusCode: 200,
        itemDelete
    })
}

export const deleteTask = async (req, res, next)=>{
    const {_id} = req.authUser
    const {taskId} = req.params
    const taskDelete = await Task.findOneAndDelete({_id: taskId, userId: _id})
    if(!taskDelete){
        return next (new Error('Task not found', { cause: 404 }))
    }
    res.status(200).json({
        msg: "task deleted done",
        statusCode: 200
    })
}