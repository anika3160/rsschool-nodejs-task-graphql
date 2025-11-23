import { Static } from '@fastify/type-provider-typebox'
import type { FastifyInstance, FastifyRequest } from 'fastify'
import {
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'
import { MemberTypeId } from '../member-types/schemas.js'
import { createGqlResponseSchema } from './schemas.js'
import { listOf, requiredUUIDType } from './types/helpers.js'
import { memberTypeIdEnum, memberTypeType } from './types/member-types.js'
import { postType } from './types/posts.js'
import { profileType } from './types/profiles.js'
import { userType } from './types/users.js'

type GqlBody = Static<(typeof createGqlResponseSchema)['body']>;

export type GqlContext = {
  req: FastifyRequest<{ Body: GqlBody }>;
  prisma: FastifyInstance['prisma'];
};

export const queryType = new GraphQLObjectType<unknown, GqlContext>({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: listOf(memberTypeType),
      resolve: (_parent, _args, { prisma }) => prisma.memberType.findMany(),
    },
    memberType: {
      type: memberTypeType,
      args: {
        id: { type: new GraphQLNonNull(memberTypeIdEnum) },
      },
      resolve: (_parent, args: { id: MemberTypeId }, { prisma }) =>
        prisma.memberType.findUnique({ where: { id: args.id } }),
    },
    posts: {
      type: listOf(postType),
      resolve: (_parent, _args, { prisma }) => prisma.post.findMany(),
    },
    post: {
      type: postType,
      args: {
        id: requiredUUIDType,
      },
      resolve: (_parent, args: { id: string }, { prisma }) =>
        prisma.post.findUnique({ where: { id: args.id } }),
    },
    profiles: {
      type: listOf(profileType),
      resolve: (_parent, _args, { prisma }) => prisma.profile.findMany(),
    },
    profile: {
      type: profileType,
      args: {
        id: requiredUUIDType,
      },
      resolve: (_parent, args: { id: string }, { prisma }) =>
        prisma.profile.findUnique({ where: { id: args.id } }),
    },
    users: {
      type: listOf(userType),
      resolve: (_parent, _args, { prisma }) => prisma.user.findMany(),
    },
    user: {
      type: userType,
      args: {
        id: requiredUUIDType,
      },
      resolve: (_parent, args: { id: string }, { prisma }) =>
        prisma.user.findUnique({ where: { id: args.id } }),
    },
  },
});


