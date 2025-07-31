import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

export enum DeliveryStatus {
  ASSIGNED = 'ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  RETURNED = 'RETURNED',
}

registerEnumType(DeliveryStatus, {
  name: 'DeliveryStatus',
});

@ObjectType()
export class DeliveryPersonProfile {
  @Field(() => Int)
  userId: number;

  @Field()
  vehicleType: string;

  @Field({ nullable: true })
  vehiclePlateNumber?: string;

  @Field({ nullable: true })
  licenseNumber?: string;

  @Field({ nullable: true })
  idNumber?: string;

  @Field(() => Int, { nullable: true })
  zoneId?: number;

  @Field(() => Int, { nullable: true })
  cityId?: number;

  @Field(() => Int, { nullable: true })
  regionId?: number;

  @Field()
  isAvailable: boolean;

  @Field()
  isVerified: boolean;

  @Field({ nullable: true })
  verificationDate?: Date;

  @Field({ nullable: true })
  rating?: number;

  @Field(() => Int)
  completedDeliveries: number;

  @Field()
  joinedAt: Date;

  @Field()
  isActive: boolean;
}

@ObjectType()
export class Delivery {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  deliveryPersonId: number;

  @Field(() => Int)
  orderId: number;

  @Field(() => DeliveryStatus)
  status: DeliveryStatus;

  @Field()
  assignedAt: Date;

  @Field({ nullable: true })
  pickedUpAt?: Date;

  @Field({ nullable: true })
  estimatedDeliveryTime?: Date;

  @Field({ nullable: true })
  actualDeliveryTime?: Date;

  @Field(() => GraphQLJSON, { nullable: true })
  pickupLocation?: any;

  @Field(() => GraphQLJSON)
  dropoffLocation: any;

  @Field(() => GraphQLJSON, { nullable: true })
  currentLocation?: any;

  @Field()
  recipientName: string;

  @Field()
  recipientPhone: string;

  @Field({ nullable: true })
  deliveryNotes?: string;

  @Field(() => Int, { nullable: true })
  rating?: number;

  @Field({ nullable: true })
  feedback?: string;

  @Field()
  deliveryFee: number;

  @Field()
  cashOnDelivery: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => DeliveryPersonProfile)
  deliveryPerson: DeliveryPersonProfile;
}
