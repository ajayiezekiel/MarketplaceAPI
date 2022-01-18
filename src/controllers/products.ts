import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/async';
 
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
};



// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
const getProducts = asyncHandler(async (req: Request, res: customResponse, next: NextFunction) => {
    res.status(200).json(res.abstractedResults)
});

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
const getProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorResponse(`Product with the id ${req.params.id} not found`, 404));
    }

    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private
const addProduct = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    // Add user to request body
    req.body.user = req.user.id

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        data: product
    }); 
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorResponse(`Product with the id ${req.params.id} not found`, 404));
    }

    // Check if the vendor is product owner
    if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this product`, 401));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: product
    });  
});

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorResponse(`Product with the id ${req.params.id} not found`, 404));
    }

    // Check if the vendor is product owner
    if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this product`, 401));
    }

    product.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});


export {
    getProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct
};



