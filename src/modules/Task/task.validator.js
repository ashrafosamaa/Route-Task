import Joi from "joi";

export const addTextTaskValidator= {
    body: Joi.object({
        taskType: Joi.string().required(),
        visibility: Joi.string().required().valid('private', 'public').default('public'),
        deadline: Joi.date().required(),
        title: Joi.string().required().min(3).max(50),
        body: Joi.string().optional().min(3).max(2000)
    })
}


export const addListTaskValidator= {
    body: Joi.object({
        taskType: Joi.string().required(),
        visibility: Joi.string().required().valid('private', 'public').default('public'),
        listItems: Joi.array().items(Joi.object({
            title: Joi.string().required().min(3).max(200),
            deadline: Joi.date().required()})).min(1)
    })
}


export const getMyTasksValidator= { 
    query: Joi.object({
        page: Joi.number().integer().min(1).optional(),
        size: Joi.number().integer().min(1).optional(),
        visibility: Joi.optional()
    })
}


export const IDValidator = {
    params:Joi.object({
        taskId: Joi.string().length(24).hex().required()
    })
}


export const itemDeleteValidator = {
    params:Joi.object({
        taskId: Joi.string().length(24).hex().required()
    }),
    query: Joi.object({
        itemId: Joi.string().length(24).hex().required()
    })
}


export const updateTextTaskValidator= {
    body: Joi.object({
        title: Joi.string().optional().min(3).max(200),
        status: Joi.string().optional().valid('to-do', 'doing', 'done'),
        visibility: Joi.string().optional().valid('private', 'public').default('public'),
        deadline: Joi.date().optional(),
        categoryId: Joi.string().optional().length(24).hex(),
        body: Joi.string().optional().min(3).max(2000)
    }),
    params: Joi.object({
        taskId: Joi.string().length(24).hex().required()
    })
}


export const updateListTaskValidator= {
    body: Joi.object({
        title: Joi.string().optional().min(3).max(200),
        status: Joi.string().optional().valid('to-do', 'doing', 'done'),
        visibility: Joi.string().optional().valid('private', 'public').default('public'),
        deadline: Joi.date().optional(),
        categoryId: Joi.string().optional().length(24).hex()
    }),
    params: Joi.object({
        taskId: Joi.string().length(24).hex().required()
    }),
    query: Joi.object({
        itemId: Joi.string().length(24).hex().required()
    })
}


export const getAllTasksValidator= {
    query:Joi.object({
        page: Joi.number().integer().min(1).optional(),
        size: Joi.number().integer().min(1).optional(),
    })
}