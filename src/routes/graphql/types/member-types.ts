import type { MemberType } from '@prisma/client'
import {
  GraphQLEnumType,
  GraphQLObjectType
} from 'graphql'
import { MemberTypeId } from '../../member-types/schemas.js'
import { getGraphQLRequiredType, requiredFloatType, requiredIntType } from './helpers.js'

const memberTypeIdValues = Object.fromEntries(
  Object.values(MemberTypeId).map((id) => [id, { value: id }]),
) as Record<MemberTypeId, { value: MemberTypeId }>;

export const memberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: memberTypeIdValues,
});

export const memberTypeType = new GraphQLObjectType<MemberType>({
  name: 'MemberType',
  fields: {
    id: getGraphQLRequiredType(memberTypeIdEnum),
    discount: requiredFloatType,
    postsLimitPerMonth: requiredIntType,
  },
});
