"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getProduct = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const async_1 = __importDefault(require("../middleware/async"));
;
;
;
;
// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
const getProducts = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(res.abstractedResults);
}));
exports.getProducts = getProducts;
// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
const getProduct = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_1.default.findById(req.params.id);
    if (!product) {
        return next(new errorResponse_1.default(`Product with the id ${req.params.id} not found`, 404));
    }
    res.status(200).json({
        success: true,
        data: product
    });
}));
exports.getProduct = getProduct;
// @desc    Create product
// @route   POST /api/v1/products
// @access  Private
const addProduct = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Add user to request body
    req.body.user = req.user.id;
    const product = yield Product_1.default.create(req.body);
    res.status(201).json({
        success: true,
        data: product
    });
}));
exports.addProduct = addProduct;
// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
const updateProduct = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let product = yield Product_1.default.findById(req.params.id);
    if (!product) {
        return next(new errorResponse_1.default(`Product with the id ${req.params.id} not found`, 404));
    }
    // Check if the vendor is product owner
    if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to update this product`, 401));
    }
    product = yield Product_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: product
    });
}));
exports.updateProduct = updateProduct;
// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
const deleteProduct = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_1.default.findById(req.params.id);
    if (!product) {
        return next(new errorResponse_1.default(`Product with the id ${req.params.id} not found`, 404));
    }
    // Check if the vendor is product owner
    if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to delete this product`, 401));
    }
    product.remove();
    res.status(200).json({
        success: true,
        data: {}
    });
}));
exports.deleteProduct = deleteProduct;
