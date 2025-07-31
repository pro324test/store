import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { UploadService } from './upload.service';

@Resolver()
export class UploadResolver {
  constructor(private uploadService: UploadService) {}

  @Query(() => [String])
  async getProductImages(
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<string[]> {
    const images = await this.uploadService.getProductImages(productId);
    return images.map((img) => img.fileUpload.path);
  }

  @Mutation(() => Boolean)
  async deleteProductImage(
    @Args('imageId', { type: () => Int }) imageId: number,
  ): Promise<boolean> {
    return this.uploadService.deleteProductImage(imageId);
  }
}
