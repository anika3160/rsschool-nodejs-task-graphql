import { User } from './user';
import { Field, ID, ObjectType, InputType } from 'type-graphql';

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;
  @Field()
  title: string;
  @Field()
  content: string;
  @Field(() => User)
  user: User;
}

@InputType()
export class CreatePostInput {
  @Field()
  title: string;
  @Field()
  content: string;
  @Field()
  userId: string;
}

@InputType()
export class ChangePostInput {
  @Field(() => ID)
  id: string;
  @Field()
  title: string;
  @Field()
  content: string;
}
