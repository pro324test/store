import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { UserNotification, NotificationStats } from './notification.model';

@Resolver(() => UserNotification)
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}

  @Query(() => [UserNotification], { name: 'userNotifications' })
  getUserNotifications(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ) {
    return this.notificationService.getUserNotifications(userId, limit, offset);
  }

  @Query(() => NotificationStats, { name: 'notificationStats' })
  async getNotificationStats(
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const [unread, all] = await Promise.all([
      this.notificationService.getUnreadCount(userId),
      this.notificationService.getUserNotifications(userId, 999999, 0),
    ]);

    return {
      total: all.length,
      unread,
      read: all.length - unread,
    };
  }

  @Mutation(() => Boolean)
  async markNotificationAsRead(
    @Args('notificationId', { type: () => Int }) notificationId: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    await this.notificationService.markAsRead(notificationId, userId);
    return true;
  }

  @Mutation(() => Boolean)
  async markAllNotificationsAsRead(
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    await this.notificationService.markAllAsRead(userId);
    return true;
  }

  @Mutation(() => UserNotification)
  createNotification(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('title') title: string,
    @Args('titleEn') titleEn: string,
    @Args('message') message: string,
    @Args('messageEn') messageEn: string,
    @Args('type') type: string,
    @Args('actionUrl', { nullable: true }) actionUrl?: string,
  ) {
    return this.notificationService.createNotification({
      userId,
      title,
      titleEn,
      message,
      messageEn,
      type: type as any,
      actionUrl,
    });
  }
}
