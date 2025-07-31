import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  async uploadProductImage(
    productId: number,
    filename: string,
    buffer: Buffer,
    mimetype: string,
  ): Promise<string> {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads', 'products');
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const ext = path.extname(filename);
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Save file
    await fs.writeFile(filePath, buffer);

    // Save file upload record
    const fileUpload = await this.prisma.fileUpload.create({
      data: {
        originalName: filename,
        filename: uniqueFilename,
        path: `/uploads/products/${uniqueFilename}`,
        mimetype,
        size: buffer.length,
        entityType: 'PRODUCT',
        entityId: productId.toString(),
        isPublic: true,
      },
    });

    // Create product image record
    const productImage = await this.prisma.productImage.create({
      data: {
        productId,
        fileUploadId: fileUpload.id,
        alt: filename,
        sortOrder: 0,
        isDefault: false,
      },
    });

    return fileUpload.path;
  }

  async deleteProductImage(imageId: number): Promise<boolean> {
    try {
      const image = await this.prisma.productImage.findUnique({
        where: { id: imageId },
        include: { fileUpload: true },
      });

      if (!image) {
        return false;
      }

      // Delete file from filesystem
      const fullPath = path.join(
        process.cwd(),
        'uploads',
        'products',
        image.fileUpload.filename,
      );
      await fs.unlink(fullPath).catch(() => {}); // Ignore if file doesn't exist

      // Delete product image record
      await this.prisma.productImage.delete({
        where: { id: imageId },
      });

      // Delete file upload record
      await this.prisma.fileUpload.delete({
        where: { id: image.fileUploadId },
      });

      return true;
    } catch (error) {
      console.error('Error deleting product image:', error);
      return false;
    }
  }

  async getProductImages(productId: number) {
    return this.prisma.productImage.findMany({
      where: { productId },
      include: { fileUpload: true },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
