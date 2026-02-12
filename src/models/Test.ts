import mongoose, { Schema, model, models } from 'mongoose';

const TestSchema = new Schema({
    name: { type: String, required: true },
    labId: { type: Schema.Types.ObjectId, ref: 'Lab', required: true },
    category: {
        type: String,
        enum: ['blood', 'mri', 'xray', 'ct_scan', 'ultrasound', 'health_checkup', 'other'],
        required: true
    },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true }, // For calculating discounts
    currency: { type: String, default: 'INR' },
    description: { type: String },
    preparation: { type: String }, // e.g., fasting required
    tat: { type: String }, // Turnaround Time
    isPublished: { type: Boolean, default: true },
    discountPercentage: { type: Number }, // derived or static
    createdAt: { type: Date, default: Date.now },
});

// Middleware to calculate discount
TestSchema.pre('save', function (this: any, next: any) {
    if (this.price && this.originalPrice) {
        this.discountPercentage = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    next();
});

const Test = models.Test || model('Test', TestSchema);
export default Test;
