import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createTestUser() {
  // Hash the test password
  const passwordHash = await bcrypt.hash('password123', 12);
  
  // Update the admin user with a proper password
  const updatedAdmin = await prisma.user.update({
    where: { phoneNumber: '+218911234567' },
    data: { passwordHash },
  });

  console.log('✅ Updated admin user with proper password:', updatedAdmin.fullName);

  // Create a test customer user
  const customerPassword = await bcrypt.hash('customer123', 12);
  
  try {
    const testCustomer = await prisma.user.upsert({
      where: { phoneNumber: '+218999123456' },
      update: { passwordHash: customerPassword },
      create: {
        fullName: 'عميل تجريبي',
        phoneNumber: '+218999123456',
        email: 'test.customer@ajjmal.ly',
        passwordHash: customerPassword,
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

    console.log('✅ Created/updated test customer:', testCustomer.fullName);
  } catch (error) {
    console.log('ℹ️ Test customer may already exist');
  }

  await prisma.$disconnect();
}

createTestUser().catch(console.error);