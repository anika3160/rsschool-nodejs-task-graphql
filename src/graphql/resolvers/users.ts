import { UserEntity } from './../../utils/DB/entities/DBUsers';
import { ChangeUserInput, UnsubscribeFromInput } from './../entities/user';
import { FastifyInstance } from 'fastify';
import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Ctx,
  FieldResolver,
  Root,
} from 'type-graphql';
import UsersService from '../../services/users';
import { CreateUserInput, SubscribeToInput, User } from '../entities/user';

@Resolver((_of) => User)
export default class UsersResolver {
  @Query(() => [User])
  async getAllUsers(@Ctx() ctx: FastifyInstance) {
    return UsersService.getAllUsers(ctx);
  }

  @Query(() => User, { nullable: false })
  async returnSingleUser(@Arg('id') id: string, @Ctx() ctx: FastifyInstance) {
    return UsersService.getUserById(ctx, id);
  }

  @Mutation(() => User)
  async createUser(
    @Arg('createUserInput')
    createUserInput: CreateUserInput,
    @Ctx() ctx: FastifyInstance
  ) {
    return UsersService.createUser(ctx, createUserInput);
  }

  @Mutation(() => User)
  async deleteUser(@Arg('id') id: string, @Ctx() ctx: FastifyInstance) {
    return UsersService.deleteUser(ctx, id);
  }

  @Mutation(() => User)
  async subscribeTo(
    @Arg('subscribeToInput')
    subscribeToInput: SubscribeToInput,
    @Ctx() ctx: FastifyInstance
  ) {
    return UsersService.subscribeToUser(
      ctx,
      subscribeToInput.subscribeToId,
      subscribeToInput.userId
    );
  }

  @Mutation(() => User)
  async unsubscribeFrom(
    @Arg('unsubscribeFromInput')
    unsubscribeFromInput: UnsubscribeFromInput,
    @Ctx() ctx: FastifyInstance
  ) {
    return UsersService.unsubscribeFromUser(
      ctx,
      unsubscribeFromInput.unsubscribeFromId,
      unsubscribeFromInput.userId
    );
  }

  @Mutation(() => User)
  async changeUser(
    @Arg('changeUserInput')
    changeUserInput: ChangeUserInput,
    @Ctx() ctx: FastifyInstance
  ) {
    const { id, ...rest } = changeUserInput;
    return UsersService.updateUser(ctx, id, rest);
  }

  @FieldResolver((_type) => User)
  async subscribedToUser(
    @Root() User: UserEntity,
    @Ctx() ctx: FastifyInstance
  ) {
    return ctx.db.users.findMany({
      key: 'id',
      equalsAnyOf: User.subscribedToUserIds,
    });
  }

  @FieldResolver((_type) => User)
  async userSubscribedTo(
    @Root() User: UserEntity,
    @Ctx() ctx: FastifyInstance
  ) {
    return ctx.db.users.findMany({
      key: 'subscribedToUserIds',
      inArray: User.id,
    });
  }
}
