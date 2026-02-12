import mongoose, { Schema, model, models } from 'mongoose';

const BookingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    labId: { type: Schema.Types.ObjectId, ref: 'Lab', required: true },
    testId: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
    bookingDate: { type: Date, required: true },
    timeSlot: { type: String, required: true }, // e.g., "10:00 AM - 11:00 AM"
    status: {
        type: String,
        enum: ['pending_payment', 'confirmed', 'collected', 'report_ready', 'completed', 'cancelled', 'refunded'],
        default: 'pending_payment'
    },
    paymentId: { type: String },
    amount: { type: Number, required: true },

    // QR Lifecycle
    qrCode: { type: String }, // Unique string or URL for QR
    qrScannedAt: { type: Date },
    qrScannedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Lab employee

    // Report
    reportUrl: { type: String },
    reportReleasedAt: { type: Date },

    // Survey
    userRating: { type: Number },
    userReview: { type: String },
    isSurveyCompleted: { type: Boolean, default: false },

    // Hold Payment Logic
    paymentReleasedToLab: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
});

const Booking = models.Booking || model('Booking', BookingSchema);
export default Booking;
