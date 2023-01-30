import { Field, ID, InputType, ObjectType } from 'type-graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  email: string;
  @Field(() => [User])
  subscribedToUser: User[];
  @Field(() => [User])
  userSubscribedTo: User[];
}

@InputType()
export class CreateUserInput {
  @Field({ nullable: true })
  firstName: string;
  @Field({ nullable: true })
  lastName: string;
  @Field({ nullable: true })
  email: string;
}

@InputType()
export class ChangeUserInput {
  @Field(() => ID)
  id: string;
  @Field({ nullable: true })
  firstName: string;
  @Field({ nullable: true })
  lastName: string;
  @Field({ nullable: true })
  email: string;
}

@InputType()
export class SubscribeToInput {
  @Field(() => ID)
  userId: string;
  @Field(() => ID)
  subscribeToId: string;
}

@InputType()
export class UnsubscribeFromInput {
  @Field(() => ID)
  userId: string;
  @Field(() => ID)
  unsubscribeFromId: string;
}
