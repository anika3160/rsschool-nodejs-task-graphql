import { FastifyInstance } from 'fastify';
import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Ctx
} from 'type-graphql';
import MemberTypesService from '../../services/member-types';
import { ChangeMemberTypeInput, MemberType } from '../entities/member-type';

@Resolver((_of) => MemberType)
export default class MemberTypeResolver {
  @Query((_returns) => MemberType, { nullable: false })
  async returnSingleMemberType(
    @Ctx() ctx: FastifyInstance,
    @Arg('id') id: string
  ) {
    return MemberTypesService.getMemberTypeById(ctx, id);
  }

  @Query(() => [MemberType])
  async returnAllMemberTypes(@Ctx() ctx: FastifyInstance) {
    return MemberTypesService.getAllMemberTypes(ctx);
  }

  @Mutation(() => MemberType)
  async changeMemberType(
    @Arg('changeMemberTypeInput')
    changeMemberTypeInput: ChangeMemberTypeInput,
    @Ctx() ctx: FastifyInstance
  ) {
    const { id, ...rest } = changeMemberTypeInput;
    return MemberTypesService.updateMemberType(ctx, id, rest);
  }
}
