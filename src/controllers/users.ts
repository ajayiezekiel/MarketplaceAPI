import { Request, Response, NextFunction } from 'express'
import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "../middleware/async";
import User from "../models/User";
import abstractedResults from "../middleware/abstractedResults";

interface PaginationInt {
    page: number;
    limit: number;
};

interface AbstractedRes {
    success: boolean;
    count: number;
    pagination?: {next?: PaginationInt, prev?: PaginationInt}
    data: any
};

interface customResponse extends Response {
    abstractedResults?: AbstractedRes
};



// @desc    Get all users
// @route   GET api/v1/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req: Request, res: customResponse, next: NextFunction) => {
    res.status(200).json(res.abstractedResults);
});


// @desc    Get single user
// @route   GET api/v1/users/:id
// @access  Private/Admin
const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: user
    });
});


// @desc    Create user
// @route   POST api/v1/users
// @access  Private/Admin
const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.create(req.body);

    res.status(201).json({
        success: true,
        data: user
    });
});


// @desc    Update user
// @route   PUT api/v1/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: user
    });
});


// @desc    Delete user
// @route   DELETE api/v1/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        data: {}
    });
});
    

export {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};