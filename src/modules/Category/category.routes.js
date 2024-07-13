import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as categoryController from "./category.controller.js"
import * as validator from "./category.validator.js"

import { authUser } from "../../middlewares/auth-user.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";

const router = Router();

router.post('/', authUser(), validationMiddleware(validator.addCategoryValidator),
    expressAsyncHandler(categoryController.createCategory))

router.get('/', validationMiddleware(validator.getAllCategoriesValidator), 
    expressAsyncHandler(categoryController.getAllCategories))

router.get('/byId/:categoryId', validationMiddleware(validator.IDValidator), 
    expressAsyncHandler(categoryController.getCategoryById))

router.put('/:categoryId', authUser(), validationMiddleware(validator.updateCategoryValidator),
    expressAsyncHandler(categoryController.updateCategory))

router.delete('/:categoryId', authUser(), validationMiddleware(validator.IDValidator), 
    expressAsyncHandler(categoryController.deleteCategory))

router.get('/tasks/:categoryId', authUser(), validationMiddleware(validator.getTasksInCategoryValidator),
    expressAsyncHandler(categoryController.getMyTasksInCategory))

router.get('/with-tasks', authUser(), validationMiddleware(validator.getCategoriesWithTasksValidator), 
    expressAsyncHandler(categoryController.getMyCategoriesWithTasks))


export default router;