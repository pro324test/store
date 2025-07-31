// Sample data for demo purposes
// In a real app, this would come from the GraphQL API

export const sampleSlides = [
  {
    id: '1',
    title: 'الاسترخاء الصيفي',
    titleEn: 'Summer Relaxation',
    description: 'استمتعي بأجمل اللحظات في المسبح',
    descriptionEn: 'Enjoy the most beautiful moments by the pool',
    image: 'https://thumbs.dreamstime.com/b/young-sensual-lovely-woman-bikini-swimming-relaxing-swimming-pool-summer-holiday-sexy-girl-swims-pool-luxury-275017909.jpg',
    link: '/products',
    buttonText: 'تسوقي الآن',
    buttonTextEn: 'Shop Now'
  },
  {
    id: '2',
    title: 'أناقة المصايف',
    titleEn: 'Resort Elegance',
    description: 'تألقي بإطلالة صيفية مميزة وجذابة',
    descriptionEn: 'Shine with a distinctive and attractive summer look',
    image: 'https://thumbs.dreamstime.com/b/beautiful-sexy-girl-swimsuit-sunglasses-lying-down-edge-swimming-pool-sunbathing-relaxing-tropical-island-167777952.jpg',
    link: '/categories/fashion',
    buttonText: 'عرض المجموعة',
    buttonTextEn: 'View Collection'
  }
];

export const sampleCategories = [
  {
    id: 1,
    name: 'الإلكترونيات',
    nameEn: 'Electronics',
    description: 'أحدث الأجهزة الإلكترونية والتقنية',
    descriptionEn: 'Latest electronic devices and technology',
    slug: 'electronics',
    isActive: true,
    sortOrder: 1,
    subcategories: [
      { id: 1, name: 'الهواتف الذكية', nameEn: 'Smartphones', slug: 'smartphones', isActive: true, sortOrder: 1 },
      { id: 2, name: 'أجهزة الكمبيوتر', nameEn: 'Computers', slug: 'computers', isActive: true, sortOrder: 2 },
      { id: 3, name: 'الأجهزة المنزلية', nameEn: 'Home Appliances', slug: 'home-appliances', isActive: true, sortOrder: 3 }
    ]
  },
  {
    id: 2,
    name: 'الأزياء',
    nameEn: 'Fashion',
    description: 'أحدث صيحات الموضة للرجال والنساء',
    descriptionEn: 'Latest fashion trends for men and women',
    slug: 'fashion',
    isActive: true,
    sortOrder: 2,
    subcategories: [
      { id: 4, name: 'ملابس رجالية', nameEn: 'Men\'s Clothing', slug: 'mens-clothing', isActive: true, sortOrder: 1 },
      { id: 5, name: 'ملابس نسائية', nameEn: 'Women\'s Clothing', slug: 'womens-clothing', isActive: true, sortOrder: 2 },
      { id: 6, name: 'الأحذية', nameEn: 'Shoes', slug: 'shoes', isActive: true, sortOrder: 3 }
    ]
  },
  {
    id: 3,
    name: 'المنزل والحديقة',
    nameEn: 'Home & Garden',
    description: 'كل ما تحتاجه لتجهيز منزلك وحديقتك',
    descriptionEn: 'Everything you need for your home and garden',
    slug: 'home-garden',
    isActive: true,
    sortOrder: 3,
    subcategories: [
      { id: 7, name: 'الأثاث', nameEn: 'Furniture', slug: 'furniture', isActive: true, sortOrder: 1 },
      { id: 8, name: 'الديكور', nameEn: 'Decor', slug: 'decor', isActive: true, sortOrder: 2 },
      { id: 9, name: 'أدوات الحديقة', nameEn: 'Garden Tools', slug: 'garden-tools', isActive: true, sortOrder: 3 }
    ]
  },
  {
    id: 4,
    name: 'الرياضة والترفيه',
    nameEn: 'Sports & Recreation',
    description: 'معدات رياضية ومنتجات ترفيهية',
    descriptionEn: 'Sports equipment and recreational products',
    slug: 'sports-recreation',
    isActive: true,
    sortOrder: 4,
    subcategories: [
      { id: 10, name: 'أدوات اللياقة', nameEn: 'Fitness Equipment', slug: 'fitness-equipment', isActive: true, sortOrder: 1 },
      { id: 11, name: 'الرياضات المائية', nameEn: 'Water Sports', slug: 'water-sports', isActive: true, sortOrder: 2 }
    ]
  },
  {
    id: 5,
    name: 'الجمال والعناية',
    nameEn: 'Beauty & Care',
    description: 'منتجات الجمال والعناية الشخصية',
    descriptionEn: 'Beauty and personal care products',
    slug: 'beauty-care',
    isActive: true,
    sortOrder: 5,
    subcategories: [
      { id: 12, name: 'العناية بالبشرة', nameEn: 'Skincare', slug: 'skincare', isActive: true, sortOrder: 1 },
      { id: 13, name: 'المكياج', nameEn: 'Makeup', slug: 'makeup', isActive: true, sortOrder: 2 }
    ]
  },
  {
    id: 6,
    name: 'السيارات',
    nameEn: 'Automotive',
    description: 'قطع غيار وإكسسوارات السيارات',
    descriptionEn: 'Car parts and automotive accessories',
    slug: 'automotive',
    isActive: true,
    sortOrder: 6,
    subcategories: [
      { id: 14, name: 'قطع الغيار', nameEn: 'Car Parts', slug: 'car-parts', isActive: true, sortOrder: 1 },
      { id: 15, name: 'الإكسسوارات', nameEn: 'Accessories', slug: 'car-accessories', isActive: true, sortOrder: 2 }
    ]
  }
];

export const sampleProducts = [
  {
    id: 1,
    name: 'هاتف ذكي متطور',
    nameEn: 'Advanced Smartphone',
    slug: 'advanced-smartphone',
    price: 2999,
    comparePrice: 3499,
    stockQuantity: 15,
    isFeatured: true,
    category: {
      id: 1,
      name: 'الإلكترونيات',
      nameEn: 'Electronics',
      slug: 'electronics'
    },
    brand: {
      id: 1,
      name: 'تقنية عصرية',
      nameEn: 'Modern Tech',
      slug: 'modern-tech'
    },
    images: [
      {
        id: 1,
        alt: 'هاتف ذكي متطور',
        title: 'هاتف ذكي متطور',
        isDefault: true,
        sortOrder: 1,
        fileUpload: {
          id: 1,
          filename: 'smartphone.jpg',
          path: '/images/products/smartphone.jpg',
          mimetype: 'image/jpeg'
        }
      }
    ]
  },
  {
    id: 2,
    name: 'حذاء رياضي أنيق',
    nameEn: 'Elegant Sports Shoes',
    slug: 'elegant-sports-shoes',
    price: 549,
    comparePrice: 699,
    stockQuantity: 25,
    isFeatured: true,
    category: {
      id: 2,
      name: 'الأزياء',
      nameEn: 'Fashion',
      slug: 'fashion'
    },
    brand: {
      id: 2,
      name: 'رياضة مثلى',
      nameEn: 'Prime Sports',
      slug: 'prime-sports'
    },
    images: [
      {
        id: 2,
        alt: 'حذاء رياضي أنيق',
        title: 'حذاء رياضي أنيق',
        isDefault: true,
        sortOrder: 1,
        fileUpload: {
          id: 2,
          filename: 'sports-shoes.jpg',
          path: '/images/products/sports-shoes.jpg',
          mimetype: 'image/jpeg'
        }
      }
    ]
  },
  {
    id: 3,
    name: 'كرسي مكتب مريح',
    nameEn: 'Comfortable Office Chair',
    slug: 'comfortable-office-chair',
    price: 1299,
    comparePrice: null,
    stockQuantity: 8,
    isFeatured: true,
    category: {
      id: 3,
      name: 'المنزل والحديقة',
      nameEn: 'Home & Garden',
      slug: 'home-garden'
    },
    brand: {
      id: 3,
      name: 'أثاث عصري',
      nameEn: 'Modern Furniture',
      slug: 'modern-furniture'
    },
    images: [
      {
        id: 3,
        alt: 'كرسي مكتب مريح',
        title: 'كرسي مكتب مريح',
        isDefault: true,
        sortOrder: 1,
        fileUpload: {
          id: 3,
          filename: 'office-chair.jpg',
          path: '/images/products/office-chair.jpg',
          mimetype: 'image/jpeg'
        }
      }
    ]
  },
  {
    id: 4,
    name: 'ساعة ذكية',
    nameEn: 'Smart Watch',
    slug: 'smart-watch',
    price: 1599,
    comparePrice: 1899,
    stockQuantity: 3,
    isFeatured: false,
    category: {
      id: 1,
      name: 'الإلكترونيات',
      nameEn: 'Electronics',
      slug: 'electronics'
    },
    brand: {
      id: 1,
      name: 'تقنية عصرية',
      nameEn: 'Modern Tech',
      slug: 'modern-tech'
    },
    images: [
      {
        id: 4,
        alt: 'ساعة ذكية',
        title: 'ساعة ذكية',
        isDefault: true,
        sortOrder: 1,
        fileUpload: {
          id: 4,
          filename: 'smart-watch.jpg',
          path: '/images/products/smart-watch.jpg',
          mimetype: 'image/jpeg'
        }
      }
    ]
  },
  {
    id: 5,
    name: 'حقيبة يد نسائية',
    nameEn: 'Women\'s Handbag',
    slug: 'womens-handbag',
    price: 899,
    comparePrice: null,
    stockQuantity: 12,
    isFeatured: false,
    category: {
      id: 2,
      name: 'الأزياء',
      nameEn: 'Fashion',
      slug: 'fashion'
    },
    brand: {
      id: 4,
      name: 'أناقة المرأة',
      nameEn: 'Women\'s Elegance',
      slug: 'womens-elegance'
    },
    images: [
      {
        id: 5,
        alt: 'حقيبة يد نسائية',
        title: 'حقيبة يد نسائية',
        isDefault: true,
        sortOrder: 1,
        fileUpload: {
          id: 5,
          filename: 'handbag.jpg',
          path: '/images/products/handbag.jpg',
          mimetype: 'image/jpeg'
        }
      }
    ]
  },
  {
    id: 6,
    name: 'سماعات لاسلكية',
    nameEn: 'Wireless Headphones',
    slug: 'wireless-headphones',
    price: 799,
    comparePrice: 999,
    stockQuantity: 20,
    isFeatured: true,
    category: {
      id: 1,
      name: 'الإلكترونيات',
      nameEn: 'Electronics',
      slug: 'electronics'
    },
    brand: {
      id: 5,
      name: 'صوت نقي',
      nameEn: 'Pure Audio',
      slug: 'pure-audio'
    },
    images: [
      {
        id: 6,
        alt: 'سماعات لاسلكية',
        title: 'سماعات لاسلكية',
        isDefault: true,
        sortOrder: 1,
        fileUpload: {
          id: 6,
          filename: 'headphones.jpg',
          path: '/images/products/headphones.jpg',
          mimetype: 'image/jpeg'
        }
      }
    ]
  }
];