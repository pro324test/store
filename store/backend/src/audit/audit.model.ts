import { ObjectType, Field, Int } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
export class AuditLog {
  @Field(() => String) // Use String for BigInt
  id: string;

  @Field()
  timestamp: Date;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field()
  action: string;

  @Field()
  entityType: string;

  @Field({ nullable: true })
  entityId?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  oldValue?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  newValue?: any;

  @Field({ nullable: true })
  ipAddress?: string;

  @Field({ nullable: true })
  requestPath?: string;

  @Field({ nullable: true })
  userAgent?: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  notes?: string;
}

@ObjectType()
export class AuditStats {
  @Field(() => Int)
  totalLogs: number;

  @Field(() => Int)
  todayLogs: number;

  @Field(() => Int)
  successfulActions: number;

  @Field(() => Int)
  failedActions: number;

  @Field(() => [AuditActionCount])
  topActions: AuditActionCount[];
}

@ObjectType()
export class AuditActionCount {
  @Field()
  action: string;

  @Field(() => Int)
  count: number;
}
