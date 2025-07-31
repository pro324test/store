import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Category, Brand, Product, Subcategory, ProductImage, ProductAttribute, ProductVariation } from './product.model';
import { 
  CreateProductImageInput, 
  UpdateProductImageInput,
  CreateProductAttributeInput,
  UpdateProductAttributeInput,
  CreateProductVariationInput,
  UpdateProductVariationInput
} from './dto/product-advanced.dto';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query(() => [Category], { name: 'categories' })
  findAllCategories() {
    return this.productService.findAllCategories();
  }

  @Query(() => [Brand], { name: 'brands' })
  findAllBrands() {
    return this.productService.findAllBrands();
  }

  @Query(() => [Product], { name: 'products' })
  findAllProducts(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 20 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ) {
    return this.productService.findAllProducts(limit, offset);
  }

  @Query(() => [Product], { name: 'featuredProducts' })
  findFeaturedProducts(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
  ) {
    return this.productService.findFeaturedProducts(limit);
  }

  @Query(() => Product, { name: 'product', nullable: true })
  findProductById(@Args('id', { type: () => Int }) id: number) {
    return this.productService.findProductById(id);
  }

  @Query(() => Product, { name: 'productWithDetails', nullable: true })
  findProductByIdWithDetails(@Args('id', { type: () => Int }) id: number) {
    return this.productService.findProductByIdWithDetails(id);
  }

  @Query(() => [Product], { name: 'productsWithDetails' })
  findAllProductsWithDetails(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 20 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ) {
    return this.productService.findAllProductsWithDetails(limit, offset);
  }

  @Query(() => [Product], { name: 'productsByCategory' })
  findProductsByCategory(
    @Args('categoryId', { type: () => Int }) categoryId: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 20 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ) {
    return this.productService.findProductsByCategory(
      categoryId,
      limit,
      offset,
    );
  }

  @Query(() => [Product], { name: 'productsByBrand' })
  findProductsByBrand(
    @Args('brandId', { type: () => Int }) brandId: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 20 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ) {
    return this.productService.findProductsByBrand(brandId, limit, offset);
  }

  // Category mutations
  @Mutation(() => Category)
  createCategory(
    @Args('name') name: string,
    @Args('nameEn') nameEn: string,
    @Args('slug') slug: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('descriptionEn', { nullable: true }) descriptionEn?: string,
    @Args('imageUrl', { nullable: true }) imageUrl?: string,
    @Args('iconUrl', { nullable: true }) iconUrl?: string,
    @Args('bannerUrl', { nullable: true }) bannerUrl?: string,
    @Args('sortOrder', { type: () => Int, nullable: true }) sortOrder?: number,
    @Args('isActive', { nullable: true }) isActive?: boolean,
    @Args('showInMenu', { nullable: true }) showInMenu?: boolean,
    @Args('isFeatured', { nullable: true }) isFeatured?: boolean,
  ) {
    return this.productService.createCategory({
      name,
      nameEn,
      slug,
      description,
      descriptionEn,
      imageUrl,
      iconUrl,
      bannerUrl,
      sortOrder,
      isActive,
      showInMenu,
      isFeatured,
    });
  }

  @Mutation(() => Category)
  updateCategory(
    @Args('id', { type: () => Int }) id: number,
    @Args('name', { nullable: true }) name?: string,
    @Args('nameEn', { nullable: true }) nameEn?: string,
    @Args('slug', { nullable: true }) slug?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('descriptionEn', { nullable: true }) descriptionEn?: string,
    @Args('imageUrl', { nullable: true }) imageUrl?: string,
    @Args('iconUrl', { nullable: true }) iconUrl?: string,
    @Args('bannerUrl', { nullable: true }) bannerUrl?: string,
    @Args('sortOrder', { type: () => Int, nullable: true }) sortOrder?: number,
    @Args('isActive', { nullable: true }) isActive?: boolean,
    @Args('showInMenu', { nullable: true }) showInMenu?: boolean,
    @Args('isFeatured', { nullable: true }) isFeatured?: boolean,
  ) {
    return this.productService.updateCategory(id, {
      name,
      nameEn,
      slug,
      description,
      descriptionEn,
      imageUrl,
      iconUrl,
      bannerUrl,
      sortOrder,
      isActive,
      showInMenu,
      isFeatured,
    });
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Args('id', { type: () => Int }) id: number) {
    await this.productService.deleteCategory(id);
    return true;
  }

  // Subcategory queries and mutations
  @Query(() => [Subcategory], { name: 'subcategories' })
  findAllSubcategories() {
    return this.productService
      .findAllCategories()
      .then((categories) => categories.flatMap((cat) => cat.subcategories));
  }

  @Query(() => [Subcategory], { name: 'subcategoriesByCategory' })
  findSubcategoriesByCategory(
    @Args('categoryId', { type: () => Int }) categoryId: number,
  ) {
    return this.productService.findSubcategoriesByCategory(categoryId);
  }

  @Mutation(() => Subcategory)
  createSubcategory(
    @Args('name') name: string,
    @Args('nameEn') nameEn: string,
    @Args('slug') slug: string,
    @Args('categoryId', { type: () => Int }) categoryId: number,
    @Args('description', { nullable: true }) description?: string,
    @Args('descriptionEn', { nullable: true }) descriptionEn?: string,
    @Args('imageUrl', { nullable: true }) imageUrl?: string,
    @Args('iconUrl', { nullable: true }) iconUrl?: string,
    @Args('bannerUrl', { nullable: true }) bannerUrl?: string,
    @Args('sortOrder', { type: () => Int, nullable: true }) sortOrder?: number,
    @Args('isActive', { nullable: true }) isActive?: boolean,
    @Args('showInMenu', { nullable: true }) showInMenu?: boolean,
    @Args('isFeatured', { nullable: true }) isFeatured?: boolean,
  ) {
    return this.productService.createSubcategory({
      name,
      nameEn,
      slug,
      categoryId,
      description,
      descriptionEn,
      imageUrl,
      iconUrl,
      bannerUrl,
      sortOrder,
      isActive,
      showInMenu,
      isFeatured,
    });
  }

  @Mutation(() => Subcategory)
  updateSubcategory(
    @Args('id', { type: () => Int }) id: number,
    @Args('name', { nullable: true }) name?: string,
    @Args('nameEn', { nullable: true }) nameEn?: string,
    @Args('slug', { nullable: true }) slug?: string,
    @Args('categoryId', { type: () => Int, nullable: true })
    categoryId?: number,
    @Args('description', { nullable: true }) description?: string,
    @Args('descriptionEn', { nullable: true }) descriptionEn?: string,
    @Args('imageUrl', { nullable: true }) imageUrl?: string,
    @Args('iconUrl', { nullable: true }) iconUrl?: string,
    @Args('bannerUrl', { nullable: true }) bannerUrl?: string,
    @Args('sortOrder', { type: () => Int, nullable: true }) sortOrder?: number,
    @Args('isActive', { nullable: true }) isActive?: boolean,
    @Args('showInMenu', { nullable: true }) showInMenu?: boolean,
    @Args('isFeatured', { nullable: true }) isFeatured?: boolean,
  ) {
    return this.productService.updateSubcategory(id, {
      name,
      nameEn,
      slug,
      categoryId,
      description,
      descriptionEn,
      imageUrl,
      iconUrl,
      bannerUrl,
      sortOrder,
      isActive,
      showInMenu,
      isFeatured,
    });
  }

  @Mutation(() => Boolean)
  async deleteSubcategory(@Args('id', { type: () => Int }) id: number) {
    await this.productService.deleteSubcategory(id);
    return true;
  }

  // Brand mutations
  @Mutation(() => Brand)
  createBrand(
    @Args('name') name: string,
    @Args('nameEn') nameEn: string,
    @Args('slug') slug: string,
    @Args('logoUrl', { nullable: true }) logoUrl?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('descriptionEn', { nullable: true }) descriptionEn?: string,
    @Args('websiteUrl', { nullable: true }) websiteUrl?: string,
    @Args('featured', { nullable: true }) featured?: boolean,
    @Args('isActive', { nullable: true }) isActive?: boolean,
  ) {
    return this.productService.createBrand({
      name,
      nameEn,
      slug,
      logoUrl,
      description,
      descriptionEn,
      websiteUrl,
      featured,
      isActive,
    });
  }

  @Mutation(() => Brand)
  updateBrand(
    @Args('id', { type: () => Int }) id: number,
    @Args('name', { nullable: true }) name?: string,
    @Args('nameEn', { nullable: true }) nameEn?: string,
    @Args('slug', { nullable: true }) slug?: string,
    @Args('logoUrl', { nullable: true }) logoUrl?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('descriptionEn', { nullable: true }) descriptionEn?: string,
    @Args('websiteUrl', { nullable: true }) websiteUrl?: string,
    @Args('featured', { nullable: true }) featured?: boolean,
    @Args('isActive', { nullable: true }) isActive?: boolean,
  ) {
    return this.productService.updateBrand(id, {
      name,
      nameEn,
      slug,
      logoUrl,
      description,
      descriptionEn,
      websiteUrl,
      featured,
      isActive,
    });
  }

  @Mutation(() => Boolean)
  async deleteBrand(@Args('id', { type: () => Int }) id: number) {
    await this.productService.deleteBrand(id);
    return true;
  }

  // === PRODUCT IMAGE OPERATIONS ===

  @Query(() => [ProductImage], { name: 'productImages' })
  getProductImages(@Args('productId', { type: () => Int }) productId: number) {
    return this.productService.getProductImages(productId);
  }

  @Mutation(() => ProductImage)
  createProductImage(@Args('input') input: CreateProductImageInput) {
    return this.productService.createProductImage(input);
  }

  @Mutation(() => ProductImage)
  updateProductImage(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateProductImageInput,
  ) {
    return this.productService.updateProductImage(id, input);
  }

  @Mutation(() => Boolean)
  async deleteProductImage(@Args('id', { type: () => Int }) id: number) {
    await this.productService.deleteProductImage(id);
    return true;
  }

  @Mutation(() => ProductImage)
  setDefaultProductImage(@Args('imageId', { type: () => Int }) imageId: number) {
    return this.productService.setDefaultProductImage(imageId);
  }

  // === PRODUCT ATTRIBUTE OPERATIONS ===

  @Query(() => [ProductAttribute], { name: 'productAttributes' })
  getProductAttributes(@Args('productId', { type: () => Int }) productId: number) {
    return this.productService.getProductAttributes(productId);
  }

  @Mutation(() => ProductAttribute)
  createProductAttribute(@Args('input') input: CreateProductAttributeInput) {
    return this.productService.createProductAttribute(input);
  }

  @Mutation(() => ProductAttribute)
  updateProductAttribute(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateProductAttributeInput,
  ) {
    return this.productService.updateProductAttribute(id, input);
  }

  @Mutation(() => Boolean)
  async deleteProductAttribute(@Args('id', { type: () => Int }) id: number) {
    await this.productService.deleteProductAttribute(id);
    return true;
  }

  // === PRODUCT VARIATION OPERATIONS ===

  @Query(() => [ProductVariation], { name: 'productVariations' })
  getProductVariations(@Args('productId', { type: () => Int }) productId: number) {
    return this.productService.getProductVariations(productId);
  }

  @Mutation(() => ProductVariation)
  createProductVariation(@Args('input') input: CreateProductVariationInput) {
    return this.productService.createProductVariation(input);
  }

  @Mutation(() => ProductVariation)
  updateProductVariation(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateProductVariationInput,
  ) {
    return this.productService.updateProductVariation(id, input);
  }

  @Mutation(() => Boolean)
  async deleteProductVariation(@Args('id', { type: () => Int }) id: number) {
    await this.productService.deleteProductVariation(id);
    return true;
  }

  @Mutation(() => ProductVariation)
  updateVariationStock(
    @Args('variationId', { type: () => Int }) variationId: number,
    @Args('stockQuantity', { type: () => Int }) stockQuantity: number,
  ) {
    return this.productService.updateVariationStock(variationId, stockQuantity);
  }
}
