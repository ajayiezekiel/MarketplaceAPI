import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

interface User {
    name: string,
    email: string,
    password: string,
    role: string,
    phoneNumber: string,
    resetPasswordToken?: string,
    resetPasswordExpire?: Date,
    createdAt: Date,
    updatedAt: Date
}


const UserSchema = new mongoose.Schema<User>({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'vendor'],
        default: 'user'
    },
    phoneNumber: {
        type: String,
        match: [
            /^(\+)?(234|0)[0-9]*?.*/,
            'Please add a valid phone number'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [8, 'Password should be a least 8 characters'],
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true
});

// Encrypt password using bcript
UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model<User>('User', UserSchema);