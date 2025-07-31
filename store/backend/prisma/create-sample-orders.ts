import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function createSampleOrders() {
  console.log('🛒 Creating sample orders...');

  // Get sample data
  const customer = await prisma.user.findFirst({
    where: { 
      roles: { 
        some: { role: 'CUSTOMER', isActive: true } 
      } 
    },
    include: { customerProfile: true }
  });

  const vendor = await prisma.user.findFirst({
    where: { 
      roles: { 
        some: { role: 'VENDOR', isActive: true } 
      } 
    },
    include: { vendorProfile: true }
  });

  const product = await prisma.product.findFirst({
    where: { isActive: true, isPublished: true }
  });

  if (!customer || !vendor || !product || !customer.customerProfile || !vendor.vendorProfile) {
    console.log('❌ Missing required data for creating orders');
    return;
  }

  // Create customer profile if not exists
  let customerProfile = customer.customerProfile;
  if (!customerProfile) {
    customerProfile = await prisma.customerProfile.create({
      data: {
        userId: customer.id,
        language: 'ar',
        isActive: true,
      }
    });
  }

  // Create vendor balance if not exists
  let vendorBalance = await prisma.vendorBalance.findUnique({
    where: { vendorId: vendor.id }
  });
  
  if (!vendorBalance) {
    vendorBalance = await prisma.vendorBalance.create({
      data: {
        vendorId: vendor.id,
        availableBalance: 0,
        pendingBalance: 0,
        totalSales: 0,
        totalCommission: 0,
      }
    });
  }

  // Create sample orders
  for (let i = 1; i <= 5; i++) {
    const orderTotal = parseFloat((Math.random() * 500 + 100).toFixed(2));
    const orderNumber = `ORD-${Date.now()}-${i.toString().padStart(3, '0')}`;
    const quantity = Math.floor(Math.random() * 3) + 1;
    const productPrice = parseFloat(product.price.toString());
    
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customerProfile.userId,
        vendorId: vendor.vendorProfile!.userId,
        subtotal: orderTotal * 0.9,
        shipping: orderTotal * 0.05,
        tax: orderTotal * 0.05,
        total: orderTotal,
        status: i === 1 ? OrderStatus.PENDING : 
                i === 2 ? OrderStatus.PROCESSING :
                i === 3 ? OrderStatus.SHIPPED :
                OrderStatus.DELIVERED,
        paymentStatus: i <= 3 ? PaymentStatus.PAID : PaymentStatus.UNPAID,
        paymentMethod: 'cash_on_delivery',
        shippingMethod: 'standard',
        shippingAddress: {
          name: customer.fullName,
          phone: customer.phoneNumber,
          address: 'شارع الجمهورية، طرابلس، ليبيا',
          city: 'طرابلس',
          region: 'المدينة القديمة'
        },
        placedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
      }
    });

    // Create order items
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: product.id,
        name: product.name,
        sku: product.sku || `SKU-${product.id}`,
        price: productPrice,
        quantity: quantity,
        subtotal: productPrice * quantity,
      }
    });

    console.log(`Created order ${i}: ${orderNumber}`);
  }

  console.log(`✅ Created 5 sample orders`);
}

createSampleOrders()
  .catch((e) => {
    console.error('❌ Error creating sample orders:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });