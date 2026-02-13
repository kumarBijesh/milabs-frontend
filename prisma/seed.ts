import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { encryptData } from '../src/lib/encryption';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create Super Admin
    const superAdminPassword = process.env.ADMIN_SEED_PASSWORD || 'SuperAdmin@123';
    const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

    const superAdmin = await prisma.user.upsert({
        where: { email: 'superadmin@milabs.com' },
        update: {},
        create: {
            email: 'superadmin@milabs.com',
            name: 'Super Admin',
            password: hashedPassword,
            role: 'super_admin',
            phone: '+919876543210',
            encryptedData: encryptData(JSON.stringify({
                originalPassword: superAdminPassword,
                createdAt: new Date().toISOString()
            }))
        },
    });

    console.log('✅ Super Admin created:', superAdmin.email);

    // Create sample labs
    const labs = await Promise.all([
        prisma.lab.create({
            data: {
                name: 'City Lab Diagnostics',
                description: 'Premium diagnostic center with state-of-the-art equipment',
                address: '123 Main Street, Andheri West',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400058',
                phone: '+912212345678',
                email: 'contact@citylab.com',
                rating: 4.8,
                image: '/images/labs/citylab.jpg',
            },
        }),
        prisma.lab.create({
            data: {
                name: 'HealthCare Plus',
                description: 'Trusted healthcare diagnostics since 1995',
                address: '45 Connaught Place',
                city: 'Delhi',
                state: 'Delhi',
                pincode: '110001',
                phone: '+911112345678',
                email: 'info@healthcareplus.com',
                rating: 4.5,
                image: '/images/labs/healthcareplus.jpg',
            },
        }),
        prisma.lab.create({
            data: {
                name: 'Wellness Labs',
                description: 'Your partner in preventive healthcare',
                address: '78 Indiranagar Main Road',
                city: 'Bangalore',
                state: 'Karnataka',
                pincode: '560038',
                phone: '+918012345678',
                email: 'support@wellnesslabs.com',
                rating: 4.9,
                image: '/images/labs/wellnesslabs.jpg',
            },
        }),
    ]);

    console.log(`✅ Created ${labs.length} labs`);

    // Create tests for each lab
    const testsData = [
        {
            name: 'Complete Blood Count (CBC)',
            description: 'Comprehensive blood test to check overall health',
            category: 'Blood Tests',
            price: 299,
            originalPrice: 500,
            discount: 40,
            duration: '24 hours',
            preparation: 'No fasting required',
        },
        {
            name: 'Lipid Profile',
            description: 'Cholesterol and triglycerides test',
            category: 'Blood Tests',
            price: 499,
            originalPrice: 800,
            discount: 38,
            duration: '24 hours',
            preparation: '12 hours fasting required',
        },
        {
            name: 'Thyroid Profile (T3, T4, TSH)',
            description: 'Complete thyroid function test',
            category: 'Hormone Tests',
            price: 599,
            originalPrice: 1200,
            discount: 50,
            duration: '48 hours',
            preparation: 'No special preparation needed',
        },
        {
            name: 'Vitamin D Test',
            description: 'Check vitamin D levels',
            category: 'Vitamin Tests',
            price: 799,
            originalPrice: 1500,
            discount: 47,
            duration: '2-3 days',
            preparation: 'No fasting required',
        },
        {
            name: 'Vitamin B12 Test',
            description: 'Measure vitamin B12 levels',
            category: 'Vitamin Tests',
            price: 699,
            originalPrice: 1200,
            discount: 42,
            duration: '2-3 days',
            preparation: 'No fasting required',
        },
        {
            name: 'HbA1c (Diabetes)',
            description: 'Average blood sugar levels over 3 months',
            category: 'Diabetes',
            price: 399,
            originalPrice: 800,
            discount: 50,
            duration: '24 hours',
            preparation: 'No fasting required',
        },
    ];

    let totalTests = 0;
    for (const lab of labs) {
        for (const testData of testsData) {
            await prisma.test.create({
                data: {
                    ...testData,
                    labId: lab.id,
                },
            });
            totalTests++;
        }
    }

    console.log(`✅ Created ${totalTests} tests`);

    // Create packages
    const packagesData = [
        {
            name: 'Full Body Checkup - Platinum',
            description: 'Comprehensive health checkup with 80+ parameters',
            price: 1499,
            originalPrice: 4500,
            discount: 67,
            image: '/images/packages/platinum.jpg',
        },
        {
            name: 'Diabetes Screening Package',
            description: 'Complete diabetes monitoring package',
            price: 899,
            originalPrice: 2000,
            discount: 55,
            image: '/images/packages/diabetes.jpg',
        },
        {
            name: 'Heart Health Package',
            description: 'Comprehensive cardiac risk assessment',
            price: 1299,
            originalPrice: 3000,
            discount: 57,
            image: '/images/packages/heart.jpg',
        },
    ];

    let totalPackages = 0;
    for (const lab of labs) {
        for (const pkgData of packagesData) {
            const pkg = await prisma.package.create({
                data: {
                    ...pkgData,
                    labId: lab.id,
                },
            });

            // Add some tests to each package
            const labTests = await prisma.test.findMany({
                where: { labId: lab.id },
                take: 3,
            });

            for (const test of labTests) {
                await prisma.packageTest.create({
                    data: {
                        packageId: pkg.id,
                        testId: test.id,
                    },
                });
            }

            totalPackages++;
        }
    }

    console.log(`✅ Created ${totalPackages} packages`);

    // Create sample patient users
    const patientPassword = 'Patient@123';
    const hashedPatientPassword = await bcrypt.hash(patientPassword, 10);

    const patients = await Promise.all([
        prisma.user.create({
            data: {
                email: 'patient1@example.com',
                name: 'John Doe',
                password: hashedPatientPassword,
                role: 'patient',
                phone: '+919876543211',
                walletBalance: 500,
            },
        }),
        prisma.user.create({
            data: {
                email: 'patient2@example.com',
                name: 'Jane Smith',
                password: hashedPatientPassword,
                role: 'patient',
                phone: '+919876543212',
                walletBalance: 1000,
            },
        }),
    ]);

    console.log(`✅ Created ${patients.length} sample patients`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Super Admin:');
    console.log('  Email: superadmin@milabs.com');
    console.log('  Password: SuperAdmin@123');
    console.log('\nSample Patient:');
    console.log('  Email: patient1@example.com');
    console.log('  Password: Patient@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
