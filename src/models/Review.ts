import mongoose from 'mongoose';
import Product from './Product';

interface Review {
    text: string,
    rating: number,
    product: mongoose.Types.ObjectId,
    user: mongoose.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date
}


const ReviewSchema = new mongoose.Schema<Review>({
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
});

// Prevent user from submitting more than one review per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to get average rating and save
ReviewSchema.statics.getAverageRating = async function(productId) {
    const obj = await this.aggregate([
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
        await Product.findByIdAndUpdate(productId, {
            averageRating: obj[0].averageRating
        });
    } catch(err) {
        console.error(err);
    }
};

// Execute getAverageRating after save
ReviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.product);
});

// Execute getAverageRating before remove
ReviewSchema.pre('remove', function() {
    this.constructor.getAverageRating(this.product);
});



export default mongoose.model<Review>('Review', ReviewSchema);