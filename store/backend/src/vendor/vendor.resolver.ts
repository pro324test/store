import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { VendorService } from './vendor.service';

@Resolver()
export class VendorResolver {
  constructor(private vendorService: VendorService) {}

  @Mutation(() => Boolean)
  async applyToBeVendor(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('applicationData', { type: () => String }) applicationData: string,
  ): Promise<boolean> {
    try {
      const data = JSON.parse(applicationData);
      await this.vendorService.applyToBeVendor(userId, data);
      return true;
    } catch (error) {
      throw new Error(`Failed to submit vendor application: ${error.message}`);
    }
  }

  @Mutation(() => Boolean)
  async approveVendorApplication(
    @Args('applicationId', { type: () => Int }) applicationId: number,
    @Args('adminId', { type: () => Int }) adminId: number,
  ): Promise<boolean> {
    try {
      await this.vendorService.approveVendorApplication(applicationId, adminId);
      return true;
    } catch (error) {
      throw new Error(`Failed to approve vendor application: ${error.message}`);
    }
  }

  @Mutation(() => Boolean)
  async rejectVendorApplication(
    @Args('applicationId', { type: () => Int }) applicationId: number,
    @Args('adminId', { type: () => Int }) adminId: number,
    @Args('reason', { type: () => String }) reason: string,
  ): Promise<boolean> {
    try {
      await this.vendorService.rejectVendorApplication(
        applicationId,
        adminId,
        reason,
      );
      return true;
    } catch (error) {
      throw new Error(`Failed to reject vendor application: ${error.message}`);
    }
  }

  @Query(() => String)
  async getPendingVendorApplications(
    @Args('limit', { type: () => Int, defaultValue: 50 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ): Promise<string> {
    const applications = await this.vendorService.getPendingApplications(
      limit,
      offset,
    );
    return JSON.stringify(applications);
  }

  @Query(() => String, { nullable: true })
  async getVendorProfile(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<string | null> {
    const profile = await this.vendorService.getVendorProfile(userId);
    return profile ? JSON.stringify(profile) : null;
  }

  @Mutation(() => Boolean)
  async updateVendorProfile(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('data', { type: () => String }) data: string,
  ): Promise<boolean> {
    try {
      const updateData = JSON.parse(data);
      await this.vendorService.updateVendorProfile(userId, updateData);
      return true;
    } catch (error) {
      throw new Error(`Failed to update vendor profile: ${error.message}`);
    }
  }
}
