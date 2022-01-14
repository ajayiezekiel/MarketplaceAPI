import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/async';


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
    queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    console.log(queryStr)
    // Finding Resource
    query = Product.find(JSON.parse(queryStr));

    // Select Fields
    if(req.query.select){
        const fields = (req.query.select as string).split(',').join(' ');
        query = query.select(fields);
    }

    // Executing query
    const results = await query;

    res.status(200).json({
        success: true,
        count: results.length,
        data: results
    });
});

// @desc    Get single products
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
const addProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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



