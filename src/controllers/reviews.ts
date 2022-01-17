import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/async';
import Product from '../models/Product';

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

interface CustomRequest extends Request {
    user?: any
}



// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/products/:productId/reviews
// @access  Public
const getReviews = asyncHandler(async (req: Request, res: customResponse, next: NextFunction) => {
    if (req.params.productId) {
        const reviews = await Review.find({
            product: req.params.productId
        });

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } else {
        res.status(200).json(res.abstractedResults)
    }
});

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
const getReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'product',
        select: 'name description'
    })

    if(!review) {
        return next(new ErrorResponse(`Product with the id ${req.params.id} not found`, 404));
    }

    res.status(200).json({
        success: true,
        data: review
    });
});

// @desc    Create reviews
// @route   POST /api/v1/reviews
// @route   POST /api/v1/:productId/reviews
// @access  Private
const addReview = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    req.body.user = req.user.id;
    req.body.product = req.params.productId;

    const product = Product.findById(req.params.productId);

    if(!product) {
        return next(new ErrorResponse(`No product found with id ${req.params.productId}`, 404));
    }

    const review = await Review.create(req.body);

    res.status(201).json({
        success: true,
        data: review
    }); 
});

// @desc    Update review for a product
// @route   PUT /api/v1/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let review = await Review.findById(req.params.id);

    if(!review) {
        return next(new ErrorResponse(`Product with the id ${req.params.id} not found`, 404));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: review
    });  
});

// @desc    Delete review for a product
// @route   DELETE /api/v1/products/:id
// @access  Private
const deleteReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const review = await Review.findById(req.params.id);

    if(!review) {
        return next(new ErrorResponse(`Product with the id ${req.params.id}`, 404));
    }

    review.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});


export {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview
};



