import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function testVendorConstraint() {
  console.log('🧪 Testing vendor unique constraint...');

  // Create a test user
  const testUser = await prisma.user.create({
    data: {
      fullName: 'Test Vendor User',
      phoneNumber: '+218999999999',
      email: 'test-vendor@example.com',
      passwordHash: '$2b$12$defaulthashedpassword',
      isActive: true,
    },
  });

  console.log(`✅ Created test user: ${testUser.id}`);

  // Assign vendor role
  await prisma.userRoleAssignment.create({
    data: {
      userId: testUser.id,
      role: UserRole.VENDOR,
      isActive: true,
      isPrimary: true,
    },
  });

  console.log('✅ Assigned vendor role');

  // Create first vendor profile
  const firstProfile = await prisma.vendorProfile.create({
    data: {
      userId: testUser.id,
      storeName: 'First Store',
      storeNameEn: 'First Store',
      slug: 'first-store',
      isActive: true,
      isVerified: true,
      status: 'ACTIVE',
    },
  });

  console.log(`✅ Created first vendor profile: ${firstProfile.userId}`);

  // Try to create second vendor profile for same user (should fail)
  try {
    await prisma.vendorProfile.create({
      data: {
        userId: testUser.id,
        storeName: 'Second Store',
        storeNameEn: 'Second Store',
        slug: 'second-store',
        isActive: true,
        isVerified: true,
        status: 'ACTIVE',
      },
    });
    console.log('❌ ERROR: Second vendor profile should not have been created!');
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('✅ SUCCESS: Unique constraint prevented second vendor profile');
      console.log(`   Error message: ${error.message}`);
    } else {
      console.log('❌ Unexpected error:', error.message);
    }
  }

  // Clean up
  await prisma.vendorProfile.delete({ where: { userId: testUser.id } });
  await prisma.userRoleAssignment.deleteMany({ where: { userId: testUser.id } });
  await prisma.user.delete({ where: { id: testUser.id } });

  console.log('🧹 Cleaned up test data');
}

testVendorConstraint()
  .catch((e) => {
    console.error('❌ Error during test:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });