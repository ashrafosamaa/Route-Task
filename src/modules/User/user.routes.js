import { Router } from "express";
import { authUser } from "../../middlewares/auth-user.middleware.js";

import { validationMiddleware } from "../../middlewares/validation.middleware.js";

import * as userController from './user.controller.js'
import * as validator from "./user.validator.js"

import expressAsyncHandler from "express-async-handler";

const router = Router();

router.get('/account/:userId', validationMiddleware(validator.IDValidator),
    expressAsyncHandler(userController.getUser))

router.get('/profiledata', authUser(), validationMiddleware(validator.noValidator),
    expressAsyncHandler(userController.getAccountData))

router.put('/updateprofile', authUser(), validationMiddleware(validator.updateByUserValidator),
    expressAsyncHandler(userController.updateProfileData))

router.patch('/updatepassword', authUser(), validationMiddleware(validator.updatePasswordValidator),
    expressAsyncHandler(userController.updatePassword))

router.delete('/deleteaccount', authUser(), validationMiddleware(validator.noValidator),
    expressAsyncHandler(userController.deleteAccount))


export default router;