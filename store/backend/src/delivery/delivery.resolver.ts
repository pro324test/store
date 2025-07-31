import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DeliveryService } from './delivery.service';
import {
  Delivery,
  DeliveryPersonProfile,
  DeliveryStatus,
} from './delivery.model';
import { GraphQLJSON } from 'graphql-type-json';

@Resolver(() => Delivery)
export class DeliveryResolver {
  constructor(private deliveryService: DeliveryService) {}

  // Delivery Person queries
  @Query(() => [DeliveryPersonProfile], { name: 'deliveryPersons' })
  findAllDeliveryPersons() {
    return this.deliveryService.findAllDeliveryPersons();
  }

  @Query(() => [DeliveryPersonProfile], { name: 'availableDeliveryPersons' })
  findAvailableDeliveryPersons(
    @Args('zoneId', { type: () => Int, nullable: true }) zoneId?: number,
    @Args('cityId', { type: () => Int, nullable: true }) cityId?: number,
  ) {
    return this.deliveryService.findAvailableDeliveryPersons(zoneId, cityId);
  }

  @Query(() => DeliveryPersonProfile, {
    name: 'deliveryPerson',
    nullable: true,
  })
  findDeliveryPersonById(@Args('userId', { type: () => Int }) userId: number) {
    return this.deliveryService.findDeliveryPersonById(userId);
  }

  // Delivery queries
  @Query(() => [Delivery], { name: 'deliveries' })
  findAllDeliveries() {
    return this.deliveryService.findAllDeliveries();
  }

  @Query(() => [Delivery], { name: 'deliveriesByPersonId' })
  findDeliveriesByPersonId(
    @Args('deliveryPersonId', { type: () => Int }) deliveryPersonId: number,
  ) {
    return this.deliveryService.findDeliveriesByPersonId(deliveryPersonId);
  }

  @Query(() => Delivery, { name: 'delivery', nullable: true })
  findDeliveryById(@Args('id', { type: () => Int }) id: number) {
    return this.deliveryService.findDeliveryById(id);
  }

  // Delivery Person mutations
  @Mutation(() => DeliveryPersonProfile)
  createDeliveryPersonProfile(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('vehicleType') vehicleType: string,
    @Args('vehiclePlateNumber', { nullable: true }) vehiclePlateNumber?: string,
    @Args('licenseNumber', { nullable: true }) licenseNumber?: string,
    @Args('idNumber', { nullable: true }) idNumber?: string,
    @Args('zoneId', { type: () => Int, nullable: true }) zoneId?: number,
    @Args('cityId', { type: () => Int, nullable: true }) cityId?: number,
    @Args('regionId', { type: () => Int, nullable: true }) regionId?: number,
  ) {
    return this.deliveryService.createDeliveryPersonProfile({
      userId,
      vehicleType,
      vehiclePlateNumber,
      licenseNumber,
      idNumber,
      zoneId,
      cityId,
      regionId,
    });
  }

  @Mutation(() => DeliveryPersonProfile)
  updateDeliveryPersonProfile(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('vehicleType', { nullable: true }) vehicleType?: string,
    @Args('vehiclePlateNumber', { nullable: true }) vehiclePlateNumber?: string,
    @Args('licenseNumber', { nullable: true }) licenseNumber?: string,
    @Args('idNumber', { nullable: true }) idNumber?: string,
    @Args('zoneId', { type: () => Int, nullable: true }) zoneId?: number,
    @Args('cityId', { type: () => Int, nullable: true }) cityId?: number,
    @Args('regionId', { type: () => Int, nullable: true }) regionId?: number,
    @Args('isAvailable', { nullable: true }) isAvailable?: boolean,
    @Args('isVerified', { nullable: true }) isVerified?: boolean,
    @Args('rating', { nullable: true }) rating?: number,
  ) {
    return this.deliveryService.updateDeliveryPersonProfile(userId, {
      vehicleType,
      vehiclePlateNumber,
      licenseNumber,
      idNumber,
      zoneId,
      cityId,
      regionId,
      isAvailable,
      isVerified,
      rating,
    });
  }

  @Mutation(() => DeliveryPersonProfile)
  toggleDeliveryPersonAvailability(
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.deliveryService.toggleDeliveryPersonAvailability(userId);
  }

  // Delivery mutations
  @Mutation(() => Delivery)
  createDelivery(
    @Args('deliveryPersonId', { type: () => Int }) deliveryPersonId: number,
    @Args('orderId', { type: () => Int }) orderId: number,
    @Args('dropoffLocation', { type: () => GraphQLJSON }) dropoffLocation: any,
    @Args('recipientName') recipientName: string,
    @Args('recipientPhone') recipientPhone: string,
    @Args('pickupLocation', { type: () => GraphQLJSON, nullable: true })
    pickupLocation?: any,
    @Args('deliveryNotes', { nullable: true }) deliveryNotes?: string,
    @Args('deliveryFee', { nullable: true }) deliveryFee?: number,
    @Args('cashOnDelivery', { nullable: true }) cashOnDelivery?: number,
  ) {
    return this.deliveryService.createDelivery({
      deliveryPersonId,
      orderId,
      pickupLocation,
      dropoffLocation,
      recipientName,
      recipientPhone,
      deliveryNotes,
      deliveryFee,
      cashOnDelivery,
    });
  }

  @Mutation(() => Delivery)
  updateDeliveryStatus(
    @Args('id', { type: () => Int }) id: number,
    @Args('status', { type: () => DeliveryStatus }) status: DeliveryStatus,
    @Args('currentLocation', { type: () => GraphQLJSON, nullable: true })
    currentLocation?: any,
    @Args('pickedUpAt', { nullable: true }) pickedUpAt?: Date,
    @Args('actualDeliveryTime', { nullable: true }) actualDeliveryTime?: Date,
  ) {
    return this.deliveryService.updateDeliveryStatus(id, status, {
      currentLocation,
      pickedUpAt,
      actualDeliveryTime,
    });
  }

  @Mutation(() => Delivery)
  rateDelivery(
    @Args('id', { type: () => Int }) id: number,
    @Args('rating', { type: () => Int }) rating: number,
    @Args('feedback', { nullable: true }) feedback?: string,
  ) {
    return this.deliveryService.rateDelivery(id, rating, feedback);
  }
}
