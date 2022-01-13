import mongoose from 'mongoose';
 
interface Product {
    name: string,
    slug?: string,
    description: string,
    brand?: string,
    category: string,
    averageRating?: number,
    countInStock: number,
    numReviews?: number,
    photo?: string,
    // user: mongoose.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date
}

const ProductSchema = new mongoose.Schema<Product>({
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
    }
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
}, {
    timestamps: true
});



export default mongoose.model<Product>('Product', ProductSchema);
