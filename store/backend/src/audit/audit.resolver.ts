import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuditService } from './audit.service';
import { AuditLog, AuditStats } from './audit.model';
import { GraphQLJSON } from 'graphql-type-json';

@Resolver(() => AuditLog)
export class AuditResolver {
  constructor(private auditService: AuditService) {}

  @Query(() => [AuditLog], { name: 'auditLogs' })
  findAllLogs(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 100 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ) {
    return this.auditService.findAllLogs(limit, offset);
  }

  @Query(() => [AuditLog], { name: 'auditLogsByUser' })
  findLogsByUser(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ) {
    return this.auditService.findLogsByUser(userId, limit, offset);
  }

  @Query(() => [AuditLog], { name: 'auditLogsByEntity' })
  findLogsByEntity(
    @Args('entityType') entityType: string,
    @Args('entityId', { nullable: true }) entityId?: string,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 })
    limit?: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset?: number,
  ) {
    return this.auditService.findLogsByEntity(
      entityType,
      entityId,
      limit,
      offset,
    );
  }

  @Query(() => [AuditLog], { name: 'auditLogsByAction' })
  findLogsByAction(
    @Args('action') action: string,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ) {
    return this.auditService.findLogsByAction(action, limit, offset);
  }

  @Query(() => [AuditLog], { name: 'auditLogsByDateRange' })
  findLogsByDateRange(
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 100 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ) {
    return this.auditService.findLogsByDateRange(
      startDate,
      endDate,
      limit,
      offset,
    );
  }

  @Query(() => AuditStats, { name: 'auditStats' })
  getAuditStats() {
    return this.auditService.getAuditStats();
  }

  @Mutation(() => AuditLog)
  createAuditLog(
    @Args('action') action: string,
    @Args('entityType') entityType: string,
    @Args('userId', { type: () => Int, nullable: true }) userId?: number,
    @Args('entityId', { nullable: true }) entityId?: string,
    @Args('oldValue', { type: () => GraphQLJSON, nullable: true })
    oldValue?: any,
    @Args('newValue', { type: () => GraphQLJSON, nullable: true })
    newValue?: any,
    @Args('ipAddress', { nullable: true }) ipAddress?: string,
    @Args('requestPath', { nullable: true }) requestPath?: string,
    @Args('userAgent', { nullable: true }) userAgent?: string,
    @Args('status', { nullable: true, defaultValue: 'SUCCESS' })
    status?: string,
    @Args('notes', { nullable: true }) notes?: string,
  ) {
    return this.auditService.createAuditLog({
      userId,
      action,
      entityType,
      entityId,
      oldValue,
      newValue,
      ipAddress,
      requestPath,
      userAgent,
      status,
      notes,
    });
  }

  @Mutation(() => AuditLog)
  logUserAction(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('action') action: string,
    @Args('entityType') entityType: string,
    @Args('entityId', { nullable: true }) entityId?: string,
    @Args('oldValue', { type: () => GraphQLJSON, nullable: true })
    oldValue?: any,
    @Args('newValue', { type: () => GraphQLJSON, nullable: true })
    newValue?: any,
    @Args('ipAddress', { nullable: true }) ipAddress?: string,
    @Args('userAgent', { nullable: true }) userAgent?: string,
  ) {
    return this.auditService.logUserAction(
      userId,
      action,
      entityType,
      entityId,
      oldValue,
      newValue,
      ipAddress,
      userAgent,
    );
  }

  @Mutation(() => AuditLog)
  logSystemAction(
    @Args('action') action: string,
    @Args('entityType') entityType: string,
    @Args('entityId', { nullable: true }) entityId?: string,
    @Args('details', { type: () => GraphQLJSON, nullable: true }) details?: any,
    @Args('notes', { nullable: true }) notes?: string,
  ) {
    return this.auditService.logSystemAction(
      action,
      entityType,
      entityId,
      details,
      notes,
    );
  }

  @Mutation(() => AuditLog)
  logFailedAction(
    @Args('action') action: string,
    @Args('entityType') entityType: string,
    @Args('error') error: string,
    @Args('userId', { type: () => Int, nullable: true }) userId?: number,
    @Args('ipAddress', { nullable: true }) ipAddress?: string,
    @Args('userAgent', { nullable: true }) userAgent?: string,
  ) {
    return this.auditService.logFailedAction(
      userId,
      action,
      entityType,
      error,
      ipAddress,
      userAgent,
    );
  }
}
