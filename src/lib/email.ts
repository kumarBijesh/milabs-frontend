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
            console.log('\n\x1b[33m%s\x1b[0m', '---------------------------------------------------');
            console.log('\x1b[33m%s\x1b[0m', '⚠️  Email credentials missing. Simulating email send:');
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);

            // Extract link if present for easier clicking
            const linkMatch = html.match(/href="(.*?)"/);
            if (linkMatch) {
                console.log('\x1b[36m%s\x1b[0m', `👉 Action Link: ${linkMatch[1]}`);
            }

            console.log('\x1b[33m%s\x1b[0m', '---------------------------------------------------');
            return { messageId: 'simulated' };
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

export const getOtpEmail = (name: string, otp: string) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #2563eb; text-align: center;">Admin Access Verification</h2>
            <p>Hi ${name},</p>
            <p>You are attempting to log in to the MiLabs Admin Dashboard.</p>
            <p>Please use the following OTP to complete your login:</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb;">${otp}</span>
            </div>
            
            <p style="font-size: 12px; color: #666; text-align: center;">This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
        </div>
    `;
};

export const getVerificationEmail = (name: string, token: string) => {
    const url = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;

    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2563eb;">Verify your Email</h2>
            <p>Hi ${name},</p>
            <p>Welcome to MiLabs! Please verify your email address to activate your account and access all features.</p>
            
            <a href="${url}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold;">Verify Email Address</a>
            
            <p>Or verify using this link:</p>
            <p><a href="${url}">${url}</a></p>
            
            <p style="font-size: 12px; color: #666;">This link will expire in 24 hours.</p>
        </div>
    `;
};
