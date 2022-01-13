import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';


// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            success: true,
            data: products
        });
    } catch(err) {
        console.log(err);
    }
};

// @desc    Get single products
// @route   GET /api/v1/products/:id
// @access  Public
const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findById(req.params.id);

        if(!product) {
            return next();
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch(err) {
       // res.status(400).json({ success: false });
       next(err)
    }
};

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private
const addProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch(err) {
        console.log(err);
    } 
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let product = await Product.findById(req.params.id);

        if(!product) {
            return next();
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: product
        });

    } catch(err) {
        console.log(err);
    }
    
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findById(req.params.id);

        if(!product) {
            return next();
        }

        product.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch(err) {
        console.log(err)
    }
};


export {
    getProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct
};



