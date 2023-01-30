import { MemberType } from './member-type';
import { Field, ID, InputType, Int, ObjectType } from 'type-graphql';
import { User } from './user';

@ObjectType()
export class Profile {
  @Field(() => ID)
  id: string;
  @Field()
  avatar: string;
  @Field()
  sex: string;
  @Field(() => Int)
  birthday: number; // timestamp?
  @Field()
  country: string;
  @Field()
  street: string;
  @Field()
  city: string;
  @Field(() => MemberType)
  memberType: MemberType;
  @Field(() => User)
  user: User;
}

@InputType()
export class CreateProfileInput {
  @Field()
  avatar: string;
  @Field()
  sex: string;
  @Field(() => Int)
  birthday: number; // timestamp?
  @Field()
  country: string;
  @Field()
  street: string;
  @Field()
  city: string;
  @Field()
  memberTypeId: string;
  @Field()
  userId: string;
}

@InputType()
export class ChangeProfileInput {
  @Field(() => ID)
  id: string;
  @Field()
  avatar: string;
  @Field()
  sex: string;
  @Field(() => Int)
  birthday: number; // timestamp?
  @Field()
  country: string;
  @Field()
  street: string;
  @Field()
  city: string;
  @Field()
  memberTypeId: string;
}
