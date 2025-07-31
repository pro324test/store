import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createTestData() {
  console.log('🌱 Creating test data...');

  try {
    // Create test users
    const hashedPassword = await bcrypt.hash('123456', 12);

    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { phoneNumber: '+218911111111' },
      update: {},
      create: {
        phoneNumber: '+218911111111',
        passwordHash: hashedPassword,
        fullName: 'Admin User',
        email: 'admin@ajjmal.ly',
        isActive: true,
        roles: {
          create: {
            role: UserRole.SYSTEM_STAFF,
            isActive: true,
            isPrimary: true,
          },
        },
      },
    });

    // Create customer user
    const customerUser = await prisma.user.upsert({
      where: { phoneNumber: '+218912222222' },
      update: {},
      create: {
        phoneNumber: '+218912222222',
        passwordHash: hashedPassword,
        fullName: 'محمد أحمد',
        email: 'customer@ajjmal.ly',
        isActive: true,
        roles: {
          create: {
            role: UserRole.CUSTOMER,
            isActive: true,
            isPrimary: true,
          },
        },
      },
    });

    // Create vendor user
    const vendorUser = await prisma.user.upsert({
      where: { phoneNumber: '+218913333333' },
      update: {},
      create: {
        phoneNumber: '+218913333333',
        passwordHash: hashedPassword,
        fullName: 'فاطمة سالم',
        email: 'vendor@ajjmal.ly',
        isActive: true,
        roles: {
          create: [
            {
              role: UserRole.CUSTOMER,
              isActive: true,
              isPrimary: false,
            },
            {
              role: UserRole.VENDOR,
              isActive: true,
              isPrimary: true,
            },
          ],
        },
      },
    });

    // Create vendor profile
    await prisma.vendorProfile.upsert({
      where: { userId: vendorUser.id },
      update: {},
      create: {
        userId: vendorUser.id,
        storeName: 'متجر فاطمة للأزياء',
        storeNameEn: 'Fatima Fashion Store',
        slug: 'fatima-fashion-store',
        description: 'متجر متخصص في الأزياء النسائية والإكسسوارات',
        descriptionEn: 'Specialized store for women\'s fashion and accessories',
        phoneNumber: '+218913333333',
        email: 'vendor@ajjmal.ly',
        isActive: true,
        isVerified: true,
        status: 'ACTIVE',
      },
    });

    // Create vendor balance
    await prisma.vendorBalance.upsert({
      where: { vendorId: vendorUser.id },
      update: {},
      create: {
        vendorId: vendorUser.id,
        availableBalance: 1500.00,
        pendingBalance: 500.00,
        totalSales: 2000.00,
        totalCommission: 200.00,
      },
    });

    // Create customer profile
    await prisma.customerProfile.upsert({
      where: { userId: customerUser.id },
      update: {},
      create: {
        userId: customerUser.id,
        isActive: true,
      },
    });

    // Create sample products
    const category = await prisma.category.findFirst({
      where: { isActive: true },
    });

    if (category) {
      const products = [
        {
          name: 'فستان صيفي أنيق',
          nameEn: 'Elegant Summer Dress',
          slug: 'elegant-summer-dress',
          description: 'فستان صيفي أنيق مناسب لجميع المناسبات',
          descriptionEn: 'Elegant summer dress suitable for all occasions',
          price: 150.00,
          stockQuantity: 10,
        },
        {
          name: 'حقيبة يد جلدية',
          nameEn: 'Leather Handbag',
          slug: 'leather-handbag',
          description: 'حقيبة يد جلدية عالية الجودة',
          descriptionEn: 'High-quality leather handbag',
          price: 200.00,
          stockQuantity: 5,
        },
        {
          name: 'حذاء رياضي مريح',
          nameEn: 'Comfortable Sports Shoes',
          slug: 'comfortable-sports-shoes',
          description: 'حذاء رياضي مريح للاستخدام اليومي',
          descriptionEn: 'Comfortable sports shoes for daily use',
          price: 120.00,
          stockQuantity: 15,
        },
      ];

      for (const productData of products) {
        await prisma.product.upsert({
          where: { slug: productData.slug },
          update: {},
          create: {
            ...productData,
            vendorId: vendorUser.id,
            categoryId: category.id,
            costPrice: productData.price * 0.7, // 70% of selling price
            isActive: true,
            isPublished: true,
          },
        });
      }
    }

    console.log('✅ Test data created successfully!');
    console.log('🔑 Test accounts:');
    console.log('   Admin: +218911111111 / 123456');
    console.log('   Customer: +218912222222 / 123456');
    console.log('   Vendor: +218913333333 / 123456');

  } catch (error) {
    console.error('❌ Error creating test data:', error);
  }
}

async function main() {
  await createTestData();
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});