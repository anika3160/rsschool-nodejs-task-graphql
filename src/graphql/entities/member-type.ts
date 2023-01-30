import { Field, ID, InputType, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class MemberType {
  @Field(() => ID)
  id: string;
  @Field(() => Int)
  discount: number;
  @Field(() => Int)
  monthPostsLimit: number;
}

@InputType()
export class CreateMemberTypeInput {
  @Field(() => Int)
  discount: number;
  @Field(() => Int)
  monthPostsLimit: number;
}

@InputType()
export class ChangeMemberTypeInput {
  @Field(() => ID)
  id: string;
  @Field(() => Int)
  discount: number;
  @Field(() => Int)
  monthPostsLimit: number;
}
