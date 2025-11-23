import type { Profile } from '@prisma/client'
import { GraphQLNonNull, GraphQLObjectType } from 'graphql'
import type { GqlContext } from '../queryType.js'
import { requiredBooleanType, requiredIntType, requiredUUIDType } from './helpers.js'
import { memberTypeType } from './member-types.js'

export const profileType = new GraphQLObjectType<Profile, GqlContext>({
  name: 'Profile',
  fields: {
    id: requiredUUIDType,
    isMale: requiredBooleanType,
    yearOfBirth: requiredIntType,
    userId: requiredUUIDType,
    memberType: {
      type: new GraphQLNonNull(memberTypeType),
      resolve: (profile, _args, { prisma }) =>
        prisma.memberType.findUnique({ where: { id: profile.memberTypeId } }),
    },
  },
});
