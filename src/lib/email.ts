import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
            console.log('---------------------------------------------------');
            console.log('⚠️ Email credentials missing. Logging email content:');
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log('---------------------------------------------------');
            return null;
        }

        const info = await transporter.sendMail({
            from: `"MiLabs Health" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        return null;
    }
};

export const getBookingSuccessEmail = (orderId: string, name: string, amount: string, items: any[]) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2563eb;">Booking Confirmed!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for choosing MiLabs. Your booking has been successfully confirmed.</p>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Order ID:</strong> #${orderId.slice(-6).toUpperCase()}</p>
                <p><strong>Total Amount:</strong> ${amount}</p>
                <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">Confirmed</span></p>
            </div>

            <h3>Booking Details:</h3>
            <ul>
                ${items.map(item => `<li>${item.title || 'Test/Package'} (Qty: ${item.quantity})</li>`).join('')}
            </ul>

            <p>You can view your full booking details and download reports from your dashboard.</p>
            
            <a href="${process.env.NEXTAUTH_URL}/patient/bookings" style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View My Bookings</a>
            
            <p style="margin-top: 30px; font-size: 12px; color: #666;">If you have any questions, please contact our support.</p>
        </div>
    `;
};
