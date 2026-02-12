import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: Number(process.env.EMAIL_PORT),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function GET() {
    try {
        const now = new Date();

        // Find orders that are:
        // 1. Paid
        // 2. Not redeemed
        // 3. Not expired (within 30 days)
        // 4. Need a reminder

        const orders = await prisma.order.findMany({
            where: {
                paymentStatus: 'paid',
                qrRedeemed: false,
                status: 'confirmed',
                qrExpiresAt: {
                    gt: now
                }
            },
            include: {
                user: true
            }
        });

        const notificationsSent = [];

        for (const order of orders) {
            const bookingDate = new Date(order.createdAt);
            const diffDays = Math.floor((now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24));

            let reminderDay = 0;
            if (diffDays >= 28 && order.lastReminderSent < 28) {
                reminderDay = 28;
            } else if (diffDays >= 25 && order.lastReminderSent < 25) {
                reminderDay = 25;
            } else if (diffDays >= 20 && order.lastReminderSent < 20) {
                reminderDay = 20;
            }

            if (reminderDay > 0 && order.user?.email) {
                // Send Email Notification
                await transporter.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: order.user.email,
                    subject: `Reminder: Your Lab Test Booking is waiting! (Day ${reminderDay})`,
                    text: `Hello ${order.user.name},\n\nThis is a reminder that your lab test booking (ID: ${order.id}) is valid for 30 days and will expire soon. Please visit the lab with your QR code.\n\nThank you,\nMiLabs Team`,
                });

                // Update Order Reminder Status
                await prisma.order.update({
                    where: { id: order.id },
                    data: { lastReminderSent: reminderDay }
                });

                notificationsSent.push({ orderId: order.id, day: reminderDay });
            }
        }

        return NextResponse.json({ success: true, sent: notificationsSent });
    } catch (error) {
        console.error('Cron Reminders Error:', error);
        return NextResponse.json({ error: 'Failed to process reminders' }, { status: 500 });
    }
}
