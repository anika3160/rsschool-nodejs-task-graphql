import type { User } from '@prisma/client'
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'
import type { GqlContext } from '../queryType.js'
import { requiredFloatType, requiredStringType, requiredUUIDType } from './helpers.js'
import { postType } from './posts.js'
import { profileType } from './profiles.js'

export const userType: GraphQLObjectType<User, GqlContext> = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: requiredUUIDType,
    name: requiredStringType,
    balance: requiredFloatType,
    profile: {
      type: profileType,
      resolve: (user, _args, { prisma }) =>
        prisma.profile.findUnique({
          where: { userId: user.id },
        }),
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(postType))),
      resolve: (user, _args, { prisma }) =>
        prisma.post.findMany({
          where: { authorId: user.id },
        }),
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
      resolve: (user, _args, { prisma }) =>
        prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: user.id,
              },
            },
          },
        }),
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
      resolve: (user, _args, { prisma }) =>
        prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: user.id,
              },
            },
          },
        }),
    },
  }),
});
