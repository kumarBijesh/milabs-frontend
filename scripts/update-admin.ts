import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const targetEmail = 'brijeshraj6342@gmail.com';
    const newPassword = 'Brijesh@123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log(`🔄 Promoting user ${targetEmail} to Super Admin...`);

    try {
        // 1. Try to find the user by this email
        const user = await prisma.user.findUnique({
            where: { email: targetEmail }
        });

        if (user) {
            console.log(`✅ User found (ID: ${user.id}). Updating role to Super Admin...`);

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    role: 'super_admin',
                    isVerified: true, // Ensure they are verified
                    name: user.name || 'Brijesh Raj'
                }
            });
            console.log(`🎉 User ${targetEmail} is now a Verified Super Admin!`);
        } else {
            console.log('⚠️ User not found. Creating new Super Admin account...');

            await prisma.user.create({
                data: {
                    email: targetEmail,
                    password: hashedPassword,
                    name: 'Brijesh Raj',
                    role: 'super_admin',
                    isVerified: true
                }
            });
            console.log(`🎉 Super Admin created: ${targetEmail}`);
        }

    } catch (error) {
        console.error('❌ Error updating Super Admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
