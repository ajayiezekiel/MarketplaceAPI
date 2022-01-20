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
exports.deleteReview = exports.updateReview = exports.addReview = exports.getReview = exports.getReviews = void 0;
const Review_1 = __importDefault(require("../models/Review"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const async_1 = __importDefault(require("../middleware/async"));
const Product_1 = __importDefault(require("../models/Product"));
;
;
;
// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/products/:productId/reviews
// @access  Public
const getReviews = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.productId) {
        const reviews = yield Review_1.default.find({
            product: req.params.productId
        });
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    }
    else {
        res.status(200).json(res.abstractedResults);
    }
}));
exports.getReviews = getReviews;
// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
const getReview = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield Review_1.default.findById(req.params.id).populate({
        path: 'product',
        select: 'name description'
    });
    if (!review) {
        return next(new errorResponse_1.default(`Product with the id ${req.params.id} not found`, 404));
    }
    res.status(200).json({
        success: true,
        data: review
    });
}));
exports.getReview = getReview;
// @desc    Create reviews
// @route   POST /api/v1/reviews
// @route   POST /api/v1/:productId/reviews
// @access  Private
const addReview = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.user = req.user.id;
    req.body.product = req.params.productId;
    const product = Product_1.default.findById(req.params.productId);
    if (!product) {
        return next(new errorResponse_1.default(`No product found with id ${req.params.productId}`, 404));
    }
    const review = yield Review_1.default.create(req.body);
    res.status(201).json({
        success: true,
        data: review
    });
}));
exports.addReview = addReview;
// @desc    Update review for a product
// @route   PUT /api/v1/reviews/:id
// @access  Private
const updateReview = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let review = yield Review_1.default.findById(req.params.id);
    if (!review) {
        return next(new errorResponse_1.default(`Product with the id ${req.params.id} not found`, 404));
    }
    // Check if the user is the reviewer
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to update this review`, 401));
    }
    review = yield Review_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: review
    });
}));
exports.updateReview = updateReview;
// @desc    Delete review for a product
// @route   DELETE /api/v1/products/:id
// @access  Private
const deleteReview = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield Review_1.default.findById(req.params.id);
    if (!review) {
        return next(new errorResponse_1.default(`Product with the id ${req.params.id}`, 404));
    }
    // Check if the user is reviewer
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to delete this review`, 401));
    }
    review.remove();
    res.status(200).json({
        success: true,
        data: {}
    });
}));
exports.deleteReview = deleteReview;
