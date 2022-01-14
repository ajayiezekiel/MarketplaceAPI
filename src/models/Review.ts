import mongoose from 'mongoose';

interface Review {
    text: string,
    rating: number,
    // product: mongoose.Types.ObjectId,
    // user: mongoose.Types.ObjectId,
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
    // product: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Product',
    //     required: true
    // },
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
}, {
    timestamps: true
});


export default mongoose.model<Review>('Review', ReviewSchema);