import User from "../../../DB/models/user.model.js";
import Category from "../../../DB/models/category.model.js";
import Task from "../../../DB/models/task.model.js";

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const getUser = async(req, res, next)=> {
    // destruct data from user
    const {userId} = req.params
    // get user data
    const getUser = await User.findById(userId).select("firstName lastName email")
    if (!getUser) {
        return next(new Error("User not found", { cause: 404 }))
    }
    // send response
    res.status(200).json({
        msg: "User data fetched successfully",
        statusCode: 200,
        getUser
    })
}

export const getAccountData = async (req, res, next)=> {
    // destruct data from user
    const {_id} = req.authUser
    // get user data
    const getUser = await User.findById(_id).select("firstName lastName userName email")
    if (!getUser) {
        return next (new Error("User not found", { cause: 404 }))
    }
    // send response
    res.status(200).json({
        msg: "User data fetched successfully",
        statusCode: 200,
        getUser
    })
}

export const updateProfileData = async (req, res, next)=> {
    // destruct data from user
    const {_id} = req.authUser
    const{firstName, lastName, userName} = req.body
    // find user
    const user = await User.findById(_id).select("firstName lastName userName email")
    // check user
    if(!user){
        return next (new Error("User not found", { cause: 404 }))
    }
    // new phone check
    if(userName){
        const isPhoneExist = await User.findOne({userName, _id: {$ne: _id} })
        if(isPhoneExist){
            return next (new Error("User Name is already exists, Please try another one", { cause: 409 }))
        }
        user.userName = userName
    }
    // update user data
    if(firstName) user.firstName = firstName
    if(lastName) user.lastName = lastName
    await user.save()
    // send response
    res.status(200).json({
        msg: "User data updated successfully",
        statusCode: 200,
        user
    })
}

export const updatePassword = async (req, res, next)=> {
    // destruct data from user
    const {_id} = req.authUser
    const {password, oldPassword} = req.body
    // find user
    const user = await User.findById(_id)
    // check old password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
    if(!isPasswordMatch){
        return next (new Error("Invalid old password", { cause: 400 }))
    }
    // hash password
    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)
    // update user data
    user.password = hashedPassword
    user.passwordChangedAt = Date.now()
    await user.save()
    // generate token
    const userToken = jwt.sign({ id: user._id ,email: user.email , userName: user.firstName, role: user.role},
        process.env.JWT_SECRET_LOGIN,
        {
            expiresIn: "90d"
        }
    )
    // send response
    res.status(200).json({
        msg: "User password updated successfully",
        statusCode: 200,
        userToken
    })
}

export const deleteAccount = async (req, res, next)=> {
    // destruct data from user
    const {_id} = req.authUser
    // delete user data
    const deleteUser = await User.findById(_id)
    if (!deleteUser) {
        return next (new Error("User not found", { cause: 404 }))
    }
    await deleteUser.deleteOne()
    // delete tasks
    await Task.deleteMany({userId: _id})
    // delete categories
    await Category.deleteMany({addedBy: _id})
    // send response
    res.status(200).json({
        msg: "User deleted successfully",
        statusCode: 200
    })
}