import mongoose, { Schema, model, models } from 'mongoose';

const LabSchema = new Schema({
    name: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // lab_admin reference
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        coordinates: {
            lat: Number,
            lng: Number,
        },
    },
    contact: {
        phone: String,
        email: String,
    },
    registrationNumber: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 },
    status: { type: String, enum: ['onboarding', 'active', 'suspended'], default: 'onboarding' },
    createdAt: { type: Date, default: Date.now },
});

const Lab = models.Lab || model('Lab', LabSchema);
export default Lab;
