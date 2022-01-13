import { Request, Response, NextFunction } from 'express';
import { Error } from 'mongoose';
import { MongoError } from 'mongodb'
import ErrorResponse from '../utils/errorResponse';

interface customError extends Error {
    statusCode?: number
}


const errorHandler = async (
    err: Error.ValidationError | 
         Error.CastError | 
         MongoError |
         customError, 
    req:Request , 
    res: Response, 
    next: NextFunction) => {

        let error = { ...err };
        error.message = err.message;

        // Log to console for dev
        console.log(err.stack);

        // Mongoose bad ObjectId
        if(err.name === 'CastError') {
            const message = 'Resource not found'
            error = new ErrorResponse(message, 404)
        }

        // Mongoose duplicate key
        if((err as MongoError).code === 11000) {
            const message = 'Duplicate field value entered'
            error = new ErrorResponse(message, 400)
        }

        // Mongoose validation error
        if(err.name === 'ValidationError') {
            const message = Object.values((err as Error.ValidationError).errors).map(val => val.message);
            error = new ErrorResponse(message[0], 400)
        }

        res.status((error as customError).statusCode || 500).json({
            success: false,
            error: error.message || 'Server error'
        })
};

export default errorHandler