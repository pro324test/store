import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserNotification {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field()
  title: string;

  @Field()
  titleEn: string;

  @Field()
  message: string;

  @Field()
  messageEn: string;

  @Field()
  isRead: boolean;

  @Field()
  type: string;

  @Field({ nullable: true })
  link?: string;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class NotificationStats {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  unread: number;

  @Field(() => Int)
  read: number;
}
