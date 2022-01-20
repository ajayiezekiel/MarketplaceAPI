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
const slugify_1 = __importDefault(require("slugify"));
const ProductSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    brand: String,
    category: {
        // Array of strings
        type: String,
        required: [true, 'Please provide the category of the goods'],
        enum: [
            'Supermarket',
            'Health & Beauty',
            'Home & Office',
            'Phones & Tablets',
            'Computing',
            'Electronics',
            'Fashion',
            'Baby Products',
            'Gaming',
            'Sporting Goods',
            'Automobile',
            'Other categories'
        ],
        default: 'Other categories'
    },
    averageRating: Number,
    countInStock: {
        type: Number,
        min: [0, 'countInStock must not be less than 0']
    },
    numReviews: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Create Product slug from the name
ProductSchema.pre('save', function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
// Cascade delete courses when a product is deleted
ProductSchema.pre('remove', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Reviews being removed from product ${this._id}`);
        yield this.model('Review').deleteMany({ product: this._id });
        next();
    });
});
// Reverse populate with virtuals
ProductSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false
});
exports.default = mongoose_1.default.model('Product', ProductSchema);
