import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create Geographic Data for Libya
  console.log('📍 Creating geographic data...');
  
  // Create Zones
  const tripoli = await prisma.geoZone.create({
    data: {
      name: 'طرابلس',
      nameEn: 'Tripoli',
      code: 'TR',
      isActive: true,
    },
  });

  const benghazi = await prisma.geoZone.create({
    data: {
      name: 'بنغازي',
      nameEn: 'Benghazi',
      code: 'BG',
      isActive: true,
    },
  });

  // Create Cities for Tripoli Zone
  const tripoliCity = await prisma.geoCity.create({
    data: {
      name: 'طرابلس',
      nameEn: 'Tripoli City',
      code: 'TR01',
      zoneId: tripoli.id,
      isActive: true,
    },
  });

  // Create Regions for Tripoli City
  await prisma.geoRegion.createMany({
    data: [
      {
        name: 'المدينة القديمة',
        nameEn: 'Old City',
        code: 'TR01-01',
        cityId: tripoliCity.id,
        isActive: true,
      },
      {
        name: 'الدهماني',
        nameEn: 'Dahmani',
        code: 'TR01-02',
        cityId: tripoliCity.id,
        isActive: true,
      },
    ],
  });

  console.log('✅ Geographic data created successfully');

  // 2. Create Product Categories
  console.log('📦 Creating product categories...');

  const electronics = await prisma.category.create({
    data: {
      name: 'الإلكترونيات',
      nameEn: 'Electronics',
      description: 'أجهزة إلكترونية متنوعة',
      descriptionEn: 'Various electronic devices',
      slug: 'electronics',
      isActive: true,
      sortOrder: 1,
    },
  });

  // Create Subcategories
  await prisma.subcategory.create({
    data: {
      name: 'الهواتف الذكية',
      nameEn: 'Smartphones',
      description: 'هواتف ذكية وأجهزة محمولة',
      descriptionEn: 'Smartphones and mobile devices',
      slug: 'smartphones',
      categoryId: electronics.id,
      isActive: true,
      sortOrder: 1,
    },
  });

  console.log('✅ Product categories created successfully');

  // 3. Create Brands
  console.log('🏷️ Creating brands...');

  await prisma.brand.create({
    data: {
      name: 'Apple',
      nameEn: 'Apple',
      description: 'شركة أبل الأمريكية',
      descriptionEn: 'American technology company',
      slug: 'apple',
      isActive: true,
    },
  });

  console.log('✅ Brands created successfully');

  // 4. Create System Settings
  console.log('⚙️ Creating system settings...');

  await prisma.systemSetting.createMany({
    data: [
      {
        key: 'site_name',
        value: 'أجمل - منصة التجارة الإلكترونية',
        dataType: 'string',
        description: 'Site name displayed in header',
        descriptionEn: 'Site name displayed in header',
      },
      {
        key: 'default_currency',
        value: 'د.ل',
        dataType: 'string',
        description: 'Default currency for the platform',
        descriptionEn: 'Default currency for the platform',
      },
    ],
  });

  console.log('✅ System settings created successfully');

  // 5. Create Default Admin User
  console.log('👨‍💼 Creating default admin user...');

  const adminUser = await prisma.user.create({
    data: {
      fullName: 'مدير النظام',
      phoneNumber: '+218911234567',
      email: 'admin@ajjmal.ly',
      passwordHash: '$2b$12$defaulthashedpassword',
      isActive: true,
    },
  });

  // Assign admin role
  await prisma.userRoleAssignment.create({
    data: {
      userId: adminUser.id,
      role: UserRole.SYSTEM_STAFF,
      isActive: true,
      isPrimary: true,
    },
  });

  console.log('✅ Default admin user created successfully');

  // 6. Create Sample Vendor
  console.log('🏪 Creating sample vendor...');

  const vendorUser = await prisma.user.create({
    data: {
      fullName: 'تاجر تجريبي / Sample Vendor',
      phoneNumber: '+218921234567',
      email: 'vendor@ajjmal.ly',
      passwordHash: '$2b$12$defaulthashedpassword',
      isActive: true,
    },
  });

  // Assign vendor role
  await prisma.userRoleAssignment.create({
    data: {
      userId: vendorUser.id,
      role: UserRole.VENDOR,
      isActive: true,
      isPrimary: true,
    },
  });

  // Create vendor profile
  const vendor = await prisma.vendorProfile.create({
    data: {
      userId: vendorUser.id,
      storeName: 'متجر الإلكترونيات المتطورة',
      storeNameEn: 'Advanced Electronics Store',
      slug: 'advanced-electronics-store',
      description: 'متجر متخصص في بيع الأجهزة الإلكترونية',
      descriptionEn: 'Specialized store for electronic devices',
      phoneNumber: '+218921234567',
      email: 'vendor@ajjmal.ly',
      status: 'ACTIVE',
      isActive: true,
      isVerified: true,
      commissionRate: 5.0,
      zoneId: tripoli.id,
      cityId: tripoliCity.id,
    },
  });

  console.log('✅ Sample vendor created successfully');

  // 7. Create Sample Customer
  // 8. Create Sample Customer
  console.log('👤 Creating sample customer...');

  const customerUser = await prisma.user.create({
    data: {
      fullName: 'أحمد محمد',
      phoneNumber: '+218931234567',
      email: 'customer@example.ly',
      passwordHash: '$2b$12$defaulthashedpassword',
      isActive: true,
    },
  });

  // Assign customer role
  await prisma.userRoleAssignment.create({
    data: {
      userId: customerUser.id,
      role: UserRole.CUSTOMER,
      isActive: true,
      isPrimary: true,
    },
  });

  console.log('✅ Sample customer created successfully');

  // 9. Create Sample Products (now that we have vendor and categories)
  console.log('📱 Creating sample products...');

  const smartphonesSubcategory = await prisma.subcategory.findFirst({
    where: { slug: 'smartphones' },
  });

  const appleBrand = await prisma.brand.findFirst({
    where: { slug: 'apple' },
  });

  if (smartphonesSubcategory && appleBrand) {
    // Find the vendor we created
    const sampleVendor = await prisma.vendorProfile.findFirst({
      where: { userId: vendorUser.id },
    });

    if (sampleVendor) {
      await prisma.product.createMany({
        data: [
          {
            name: 'آيفون 15 برو',
            nameEn: 'iPhone 15 Pro',
            slug: 'iphone-15-pro',
            description: 'أحدث هاتف ذكي من أبل مع تقنيات متطورة وكاميرا احترافية',
            descriptionEn: 'Latest smartphone from Apple with advanced technologies and professional camera',
            sku: 'IPHONE-15-PRO-128',
            price: 3500,
            costPrice: 2800,
            stockQuantity: 50,
            lowStockAlert: 5,
            categoryId: electronics.id,
            subcategoryId: smartphonesSubcategory.id,
            brandId: appleBrand.id,
            vendorId: vendor.userId,
            isActive: true,
            isPublished: true,
            isFeatured: true,
          },
          {
            name: 'آيفون 15',
            nameEn: 'iPhone 15',
            slug: 'iphone-15',
            description: 'هاتف آيفون 15 الجديد بتصميم أنيق وأداء قوي',
            descriptionEn: 'New iPhone 15 with elegant design and powerful performance',
            sku: 'IPHONE-15-128',
            price: 2800,
            costPrice: 2200,
            stockQuantity: 75,
            lowStockAlert: 10,
            categoryId: electronics.id,
            subcategoryId: smartphonesSubcategory.id,
            brandId: appleBrand.id,
            vendorId: vendor.userId,
            isActive: true,
            isPublished: true,
            isFeatured: true,
          },
        ],
      });

      console.log('✅ Sample products created successfully');
    }
  }

  console.log('🎉 Database seeding completed successfully!');
  console.log('📊 Summary:');
  console.log('- Geographic data: 2 zones, 1 city, 2 regions');
  console.log('- Categories: 1 main category with 1 subcategory');
  console.log('- Brands: 1 sample brand');
  console.log('- Users: 1 admin, 1 customer, 1 vendor');
  console.log('- Products: 2 sample products');
  console.log('- System settings: 2 basic settings');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });