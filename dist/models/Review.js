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
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = __importDefault(require("./Product"));
const ReviewSchema = new mongoose_1.default.Schema({
    text: {
        type: String,
        required: [true, 'Please add a review for the product'],
        maxlength: [500, 'You cannot write more than 500 words']
    },
    rating: {
        type: Number,
        min: [1, 'It cannot be less than one'],
        max: [10, 'It cannnot be more than ten']
    },
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
});
// Prevent user from submitting more than one review per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
// Static method to get average rating and save
ReviewSchema.statics.getAverageRating = function (productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const obj = yield this.aggregate([
            {
                $match: { product: productId }
            },
            {
                $group: {
                    _id: '$product',
                    averageRating: { $avg: '$rating' }
                }
            }
        ]);
        try {
            yield Product_1.default.findByIdAndUpdate(productId, {
                averageRating: obj[0].averageRating
            });
        }
        catch (err) {
            console.error(err);
        }
    });
};
// Execute getAverageRating after save
ReviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.product);
});
// Execute getAverageRating before remove
ReviewSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.product);
});
exports.default = mongoose_1.default.model('Review', ReviewSchema);
