import { Request, Response, NextFunction } from 'express';


// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
const getProducts = (req: Request, res: Response, next: NextFunction) => {
    res.send("Get all products");
};

// @desc    Get single products
// @route   GET /api/v1/products/:id
// @access  Public
const getProduct = (req: Request, res: Response, next: NextFunction) => {
    res.send(`Get product id ${req.params.id}`);
};

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private
const addProduct = (req: Request, res: Response, next: NextFunction) => {
    res.send("Create product");
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
const updateProduct = (req: Request, res: Response, next: NextFunction) => {
    res.send(`Update product id ${req.params.id}`);
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
const deleteProduct = (req: Request, res: Response, next: NextFunction) => {
    res.send(`Delete product id ${req.params.id}`);
};


export {
    getProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct
};



