import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import User from '../models/User';

interface customRequest extends Request {
    user?: any
}

// Protect routes
const protect = asyncHandler(async (req: customRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if(req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if(!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }
    try {
        // Verify token
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);

        req.user = await User.findById(decoded.id);

        next();
    } catch(err) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
});

// Grant access to specific roles
const authorize = (...roles: string[]) => (req: customRequest, res: Response, next: NextFunction) => {
    if(!roles.includes(req.user.role)) {
        return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
    }
    next();
};

export {
    protect,
    authorize
}