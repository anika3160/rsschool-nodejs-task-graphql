import { ProfileEntity } from './../../utils/DB/entities/DBProfiles';
import { MemberType } from './../entities/member-type';
import { User } from './../entities/user';
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
import ProfilesService from '../../services/profiles';
import {
  ChangeProfileInput,
  CreateProfileInput,
  Profile,
} from '../entities/profile';

@Resolver((_of) => Profile)
export default class ProfileResolver {
  @Query((_returns) => Profile, { nullable: false })
  async returnSingleProfile(
    @Ctx() ctx: FastifyInstance,
    @Arg('id') id: string
  ) {
    return ProfilesService.getProfileById(ctx, id);
  }

  @Query(() => [Profile])
  async getAllProfiles(@Ctx() ctx: FastifyInstance) {
    return ProfilesService.getAllProfiles(ctx);
  }

  @Mutation(() => Profile)
  async createProfile(
    @Arg('createProfileInput')
    createProfileInput: CreateProfileInput,
    @Ctx() ctx: FastifyInstance
  ) {
    return ProfilesService.createProfile(ctx, createProfileInput);
  }

  @Mutation(() => Profile)
  async deleteProfile(@Arg('id') id: string, @Ctx() ctx: FastifyInstance) {
    return ProfilesService.deleteProfile(ctx, id);
  }

  @Mutation(() => Profile)
  async changeProfile(
    @Arg('changeProfileInput')
    changeProfileInput: ChangeProfileInput,
    @Ctx() ctx: FastifyInstance
  ) {
    const { id, ...rest } = changeProfileInput;
    return ProfilesService.updateProfile(ctx, id, rest);
  }

  @FieldResolver((_type) => MemberType)
  async memberType(
    @Root() Profile: ProfileEntity,
    @Ctx() ctx: FastifyInstance
  ) {
    return ctx.db.memberTypes.findOne({
      key: 'id',
      equals: Profile.memberTypeId,
    });
  }

  @FieldResolver((_type) => User)
  async user(@Root() Profile: ProfileEntity, @Ctx() ctx: FastifyInstance) {
    return ctx.db.profiles.findOne({
      key: 'id',
      equals: Profile.userId,
    });
  }

}
