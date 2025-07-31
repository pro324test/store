import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/user.model';

@ObjectType()
export class AuthResult {
  @Field(() => User)
  user: User;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@ObjectType()
export class TokenResult {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@ObjectType()
export class OtpResult {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
