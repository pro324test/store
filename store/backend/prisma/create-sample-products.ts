import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSampleProducts() {
  console.log('🛍️ Creating sample products...');

  // First, check if we have vendors (we need vendor profiles for products)
  const vendors = await prisma.vendorProfile.findMany();
  if (vendors.length === 0) {
    console.log('Creating a sample vendor...');
    
    // Create a vendor user first
    const vendorUser = await prisma.user.findFirst({
      where: { phoneNumber: '+218921234567' }
    });

    let vendorId: number;
    if (!vendorUser) {
      const newVendorUser = await prisma.user.create({
        data: {
          fullName: 'تاجر تجريبي',
          phoneNumber: '+218921234567',
          email: 'vendor@ajjmal.ly',
          passwordHash: '$2b$12$defaulthashedpassword',
          isActive: true,
          roles: {
            create: {
              role: 'VENDOR',
              isActive: true,
              isPrimary: true,
            },
          },
        },
      });
      vendorId = newVendorUser.id;
    } else {
      vendorId = vendorUser.id;
    }

    // Create vendor profile
    await prisma.vendorProfile.upsert({
      where: { userId: vendorId },
      update: {},
      create: {
        userId: vendorId,
        storeName: 'متجر الإلكترونيات',
        storeNameEn: 'Electronics Store',
        slug: 'electronics-store',
        isActive: true,
        isVerified: true,
        status: 'ACTIVE',
      },
    });
  }

  // Get vendor ID
  const vendor = await prisma.vendorProfile.findFirst();
  const vendorId = vendor!.userId;

  // Get category and brand IDs
  const electronicsCategory = await prisma.category.findFirst({
    where: { nameEn: 'Electronics' }
  });
  const smartphoneSubcategory = await prisma.subcategory.findFirst({
    where: { nameEn: 'Smartphones' }
  });
  const appleBrand = await prisma.brand.findFirst({
    where: { name: 'Apple' }
  });

  if (!electronicsCategory || !smartphoneSubcategory || !appleBrand) {
    console.log('Missing category/subcategory/brand data. Please run the main seed first.');
    return;
  }

  // Create sample products
  const products = [
    {
      name: 'آيفون 15 برو',
      nameEn: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      sku: 'IPH15PRO128',
      description: 'هاتف ذكي متطور من Apple مع شرائح A17 Pro وكاميرا محسنة',
      descriptionEn: 'Advanced smartphone from Apple with A17 Pro chip and enhanced camera',
      shortDesc: 'آيفون 15 برو - 128 جيجابايت',
      shortDescEn: 'iPhone 15 Pro - 128GB',
      price: 1299.99,
      comparePrice: 1399.99,
      costPrice: 1100.00,
      stockQuantity: 25,
      lowStockAlert: 5,
      isFeatured: true,
      metaTitle: 'آيفون 15 برو - متجر أجمال',
      metaDescription: 'اشتري آيفون 15 برو بأفضل الأسعار في ليبيا',
    },
    {
      name: 'آيفون 14',
      nameEn: 'iPhone 14',
      slug: 'iphone-14',
      sku: 'IPH14128',
      description: 'هاتف ذكي من Apple مع شرائح A15 Bionic وكاميرا مطورة',
      descriptionEn: 'Smartphone from Apple with A15 Bionic chip and advanced camera',
      shortDesc: 'آيفون 14 - 128 جيجابايت',
      shortDescEn: 'iPhone 14 - 128GB',
      price: 999.99,
      comparePrice: 1099.99,
      costPrice: 850.00,
      stockQuantity: 15,
      lowStockAlert: 3,
      isFeatured: true,
      metaTitle: 'آيفون 14 - متجر أجمال',
      metaDescription: 'اشتري آيفون 14 بأفضل الأسعار في ليبيا',
    },
    {
      name: 'آيفون SE',
      nameEn: 'iPhone SE',
      slug: 'iphone-se',
      sku: 'IPHSE64',
      description: 'هاتف ذكي اقتصادي من Apple مع أداء قوي',
      descriptionEn: 'Affordable smartphone from Apple with powerful performance',
      shortDesc: 'آيفون SE - 64 جيجابايت',
      shortDescEn: 'iPhone SE - 64GB',
      price: 429.99,
      comparePrice: 499.99,
      costPrice: 350.00,
      stockQuantity: 30,
      lowStockAlert: 8,
      isFeatured: false,
      metaTitle: 'آيفون SE - متجر أجمال',
      metaDescription: 'اشتري آيفون SE بأفضل الأسعار في ليبيا',
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        vendorId,
        categoryId: electronicsCategory.id,
        subcategoryId: smartphoneSubcategory.id,
        brandId: appleBrand.id,
        ...productData,
      },
    });
  }

  console.log('✅ Sample products created successfully');
  
  // Also create Samsung brand and products
  const samsungBrand = await prisma.brand.upsert({
    where: { slug: 'samsung' },
    update: {},
    create: {
      name: 'Samsung',
      nameEn: 'Samsung',
      slug: 'samsung',
      description: 'شركة سامسونج الكورية للإلكترونيات',
      descriptionEn: 'Korean electronics company Samsung',
      isActive: true,
    },
  });

  const samsungProducts = [
    {
      name: 'جالكسي S24 الترا',
      nameEn: 'Galaxy S24 Ultra',
      slug: 'galaxy-s24-ultra',
      sku: 'GXS24U256',
      description: 'هاتف ذكي متطور من Samsung مع قلم S Pen',
      descriptionEn: 'Advanced smartphone from Samsung with S Pen',
      shortDesc: 'جالكسي S24 الترا - 256 جيجابايت',
      shortDescEn: 'Galaxy S24 Ultra - 256GB',
      price: 1199.99,
      comparePrice: 1299.99,
      costPrice: 1000.00,
      stockQuantity: 20,
      lowStockAlert: 5,
      isFeatured: true,
      metaTitle: 'جالكسي S24 الترا - متجر أجمال',
      metaDescription: 'اشتري جالكسي S24 الترا بأفضل الأسعار في ليبيا',
    },
    {
      name: 'جالكسي A54',
      nameEn: 'Galaxy A54',
      slug: 'galaxy-a54',
      sku: 'GXA54128',
      description: 'هاتف ذكي متوسط الفئة من Samsung',
      descriptionEn: 'Mid-range smartphone from Samsung',
      shortDesc: 'جالكسي A54 - 128 جيجابايت',
      shortDescEn: 'Galaxy A54 - 128GB',
      price: 349.99,
      comparePrice: 399.99,
      costPrice: 280.00,
      stockQuantity: 40,
      lowStockAlert: 10,
      isFeatured: false,
      metaTitle: 'جالكسي A54 - متجر أجمال',
      metaDescription: 'اشتري جالكسي A54 بأفضل الأسعار في ليبيا',
    },
  ];

  for (const productData of samsungProducts) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        vendorId,
        categoryId: electronicsCategory.id,
        subcategoryId: smartphoneSubcategory.id,
        brandId: samsungBrand.id,
        ...productData,
      },
    });
  }

  console.log('✅ Samsung products created successfully');
  await prisma.$disconnect();
}

createSampleProducts().catch(console.error);