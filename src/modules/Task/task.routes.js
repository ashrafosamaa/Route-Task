import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as taskController from "./task.controller.js"
import * as validator from "./task.validator.js"

import { authUser } from "../../middlewares/auth-user.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";

const router = Router();

router.post('/txt', authUser(), validationMiddleware(validator.addTextTaskValidator),
    expressAsyncHandler(taskController.addTextTask))

router.post('/list', authUser(), validationMiddleware(validator.addListTaskValidator),
    expressAsyncHandler(taskController.addListTask))

router.get('/', authUser(), validationMiddleware(validator.getMyTasksValidator),
    expressAsyncHandler(taskController.getMyTasks))

router.get('/byId/:taskId', authUser(), validationMiddleware(validator.IDValidator), 
    expressAsyncHandler(taskController.getTaskById))

router.get('/all', validationMiddleware(validator.getAllTasksValidator),
    expressAsyncHandler(taskController.getAllTasks))

router.put('/txt/:taskId', authUser(), validationMiddleware(validator.updateTextTaskValidator),
    expressAsyncHandler(taskController.updateTextTask))

router.put('/list/:taskId', authUser(), validationMiddleware(validator.updateListTaskValidator),
    expressAsyncHandler(taskController.updateListTask))

router.delete('/item/:taskId', authUser(), validationMiddleware(validator.itemDeleteValidator), 
    expressAsyncHandler(taskController.deleteItem))

router.delete('/:taskId', authUser(), validationMiddleware(validator.IDValidator), 
    expressAsyncHandler(taskController.deleteTask))


export default router;