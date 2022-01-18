import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/async';

interface UserInterface {
    name: string;
    email: string;
    password: string;
    role: string;
    phoneNumber?: string;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    createdAt: Date;
    updatedAt: Date;
    getSignedJwtToken(): string;
    matchPassword(password: string): Promise<boolean>;
    save(): void;
};

interface customRequest extends Request {
    user?: any
}



// @desc    Register user
// @route   GET /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role, phoneNumber } = req.body;

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role,
        phoneNumber
    });

    sendTokenResponse(user, 201, res)
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Check if email and password is provided
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email or password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if(!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }


    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch) {
        return next(new ErrorResponse('Invalid credentials',401));
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Get Logged in user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = asyncHandler(async (req: customRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
const updateDetails = asyncHandler(async (req: customRequest, res: Response, next: NextFunction) => {
    // Restricted the fields that can be updated
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Update user password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
const updatePassword = asyncHandler(async (req: customRequest, res: Response, next: NextFunction) => {
    let user = await User.findById(req.user.id).select('+password');

    // Check current password
    if(!(await (user as UserInterface).matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401));
    }

    (user as UserInterface).password = req.body.newPassword;

    await (user as UserInterface).save();

    sendTokenResponse(user as UserInterface, 200, res)
});

// Get token from model and send response
const sendTokenResponse = (user: UserInterface, statusCode: number, res: Response) => {
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token
    });
};


export {
    register,
    login,
    getMe,
    updateDetails,
    updatePassword
};



