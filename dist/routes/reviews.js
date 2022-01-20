"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviews_1 = require("../controllers/reviews");
const Review_1 = __importDefault(require("../models/Review"));
const abstractedResults_1 = __importDefault(require("../middleware/abstractedResults"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)({ mergeParams: true });
router
    .route('/')
    .get((0, abstractedResults_1.default)(Review_1.default, {
    path: 'product',
    select: 'name description'
}), reviews_1.getReviews)
    .post(auth_1.protect, (0, auth_1.authorize)('user', 'admin'), reviews_1.addReview);
router
    .route('/:id')
    .get(reviews_1.getReview)
    .put(auth_1.protect, (0, auth_1.authorize)('user', 'admin'), reviews_1.updateReview)
    .delete(auth_1.protect, (0, auth_1.authorize)('user', 'admin'), reviews_1.deleteReview);
exports.default = router;
