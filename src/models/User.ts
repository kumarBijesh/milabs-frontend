import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional if Google Auth only
    googleId: { type: String },
    role: {
        type: String,
        enum: ['patient', 'lab_admin', 'admin', 'super_admin', 'affiliate'],
        default: 'patient'
    },
    phone: { type: String },
    isVerified: { type: Boolean, default: false },
    walletBalance: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' }, // Auto-currency by timezone
    createdAt: { type: Date, default: Date.now },
});

const User = models.User || model('User', UserSchema);
export default User;
