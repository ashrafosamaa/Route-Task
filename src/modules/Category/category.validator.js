import Joi from "joi";

export const addCategoryValidator= {
    body: Joi.object({
        name:Joi.string().required().min(3).max(20).alphanum(),
    })
}


export const getAllCategoriesValidator= { 
    query: Joi.object({
        page: Joi.number().integer().min(1).optional(),
        size: Joi.number().integer().min(1).optional(),
        sort: Joi.string().optional()
    })
}


export const IDValidator = {
    params:Joi.object({
        categoryId: Joi.string().length(24).hex().required()
    })
}


export const updateCategoryValidator= {
    body: Joi.object({
        name: Joi.string().optional().min(3).max(20).alphanum(),
    }),
    params: Joi.object({
        categoryId: Joi.string().length(24).hex().required()
    })
}


export const getTasksInCategoryValidator= {
    query:Joi.object({
        page: Joi.number().integer().min(1).optional(),
        size: Joi.number().integer().min(1).optional(),
    }),
    params:Joi.object({
        categoryId: Joi.string().length(24).hex().required()
    })
}


export const getCategoriesWithTasksValidator= {
    query:Joi.object({
        page: Joi.number().integer().min(1).optional(),
        size: Joi.number().integer().min(1).optional(),
    })
}


export const deleteCategoryValidator= {
    params:Joi.object({
        categoryId: Joi.string().length(24).hex().required()
    })
}