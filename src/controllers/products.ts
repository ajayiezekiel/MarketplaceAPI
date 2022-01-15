import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/async';

interface paginationInt {
    page: number,
    limit: number
};

interface customRequest extends Request {
    user?: any
};



// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
const getProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query }

    // Fields to exclude
    const removedLists: string[] = ['limit', 'select', 'sort', 'page']   

    // Loop over removeFields and delete them from reqQuery
    removedLists.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators 
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding Resource
    query = Product.find(JSON.parse(queryStr));

    // Select Fields
    if(req.query.select){
        const fields = (req.query.select as string).split(',').join(' ');
        query = query.select(fields);
    }

    if (req.query.sort) {
        const fields = (req.query.sort as string).split(',').join(' ');
        query = query.sort(fields);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt((req.query.page as string), 10) || 1;
    const limit = parseInt((req.query.limit as string), 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const results = await query;

    const pagination: {next?: paginationInt, prev?: paginationInt} = {};

    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if(startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    

    res.status(200).json({
        success: true,
        count: results.length,
        pagination,
        data: results
    });
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
const addProduct = asyncHandler(async (req: customRequest, res: Response, next: NextFunction) => {
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
const updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorResponse(`Product with the id ${req.params.id} not found`, 404));
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
const deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorResponse(`Product with the id ${req.params.id}`, 404));
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



