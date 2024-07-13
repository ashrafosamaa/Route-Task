import Joi from "joi";

export const IDValidator = {
    params: Joi.object({
        userId: Joi.string().length(24).hex().required()
    })
}


export const noValidator = {
    body: Joi.object({
        zaza: Joi.string().length(2).optional()
    })
}


export const updateByUserValidator = {
    body: Joi.object({
        firstName : Joi.string().optional().min(3),
        lastName : Joi.string().optional().min(3),
        userName: Joi.string().required().min(3),
    })
}


export const updatePasswordValidator = { 
    body: Joi.object({
        oldPassword: Joi.string().required().min(8),
        password: Joi.string().required().min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, "i")
        .messages({
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
        }),
        passwordConfirm: Joi.string().required().valid(Joi.ref('password')),
    })
}