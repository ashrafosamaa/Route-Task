import { APIFeatures } from "../../utils/api-features.js"

import Category from "../../../DB/models/category.model.js"
import Task from "../../../DB/models/task.model.js"

export const createCategory = async (req, res, next)=> {
    // destruct data from user
    const {_id} = req.authUser
    const {name} = req.body
    // check if name duplicate
    const isNameDuplicate = await Category.findOne({ name, addedBy: _id })
    if (isNameDuplicate){
        return next(new Error('Name is already exists, Please try another name', { cause: 409 }))
    }
    const category = {
        name,
        addedBy: _id
    }
    const categoryCreated = await Category.create(category)
    if (!categoryCreated) {
        return next(new Error('Error while adding Category', { cause: 500 }))
    }
    // send response
    res.status(201).json({ 
        msg: "Category created successfully",
        statusCode: 201
    })
}

export const getAllCategories = async (req, res, next)=> {
    const {page, size, sort} = req.query
    const features = new APIFeatures(req.query, Category.find().select('name addedBy'))
    .pagination({page, size})
    .sort(sort)
    const category = await features.mongooseQuery
    if (!category.length) {
        return next(new Error('No category found', { cause: 404 }))
    }
    res.status(200).json({
        msg: "Category fetched successfully",
        statusCode: 200,
        category
    })
}

export const getCategoryById = async (req, res, next)=> {
    const {categoryId} = req.params
    const category = await Category.findById(categoryId).select('name addedBy')
    if(!category){
        return next(new Error('Category not found', { cause: 404 }))
    }
    res.status(200).json({ 
        msg: "Category fetched successfully",
        statusCode: 200,
        category
    })
}

export const updateCategory = async (req, res, next)=> {
    // destruct data from user
    const {_id} = req.authUser
    const {categoryId} = req.params
    const {name} = req.body
    // check that category is found
    const category = await Category.findById(categoryId).select('name addedBy')
    if (!category){
        return next(new Error('Category not found', { cause: 404 }))
    }
    // check if name duplicate
    if (name == category.name){
        return next(new Error('Name is not changed, Please try another name', { cause: 409 }))
    }
    const isNameDuplicate = await Category.findOne({ name, addedBy: _id })
    if(isNameDuplicate){
        return next(new Error('Name is already exists, Please try another name', { cause: 409 }))
    }
    category.name = name
    // update category
    await category.save()
    res.status(200).json({ 
        msg: "Category updated successfully",
        statusCode: 200,
        category
    })
}

export const deleteCategory = async (req, res, next)=> {
    // destruct data from user
    const {categoryId} = req.params
    // check that category is found and delete
    const category = await Category.findOne({_id: categoryId, addedBy: req.authUser._id})
    if(!category){
        return next(new Error('Category not found', { cause: 404 }))
    }
    // // delete related sub categoris
    // const subCategories = await SubCategory.deleteMany({categoryId})
    // if(subCategories.deletedCount <= 0){
    //     console.log("No related Sub Categories to this Category");
    // }

    // delete category
    await category.deleteOne()
    // await Task.deleteMany({categoryId})
    // send response
    res.status(200).json({
        msg: "Category deleted successfully",
        statusCode: 200
    })
}

export const getMyTasksInCategory = async (req, res, next)=> {
    const {page, size} = req.query
    const {categoryId} = req.params
    const features = new APIFeatures(req.query, Task.find({categoryId, userId: req.authUser._id}).select('-__v -createdAt -updatedAt'))
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

export const getMyCategoriesWithTasks = async (req, res, next)=> {
    const {page, size} = req.query
    const features = new APIFeatures(req.query, Category.find({addedBy: req.authUser._id}).select('name addedBy')
    .populate([ { path: 'Tasks', select:'taskType visibility' }]))
    .pagination({page, size})
    const category = await features.mongooseQuery
    if (!category.length) {
        return next(new Error('No tasks found', { cause: 404 }))
    }
    res.status(200).json({ 
        msg: "Categories fetched successfully",
        statusCode: 200,
        category
    })
}