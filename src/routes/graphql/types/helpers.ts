import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLOutputType,
  GraphQLString,
} from 'graphql'
import { UUIDType } from './uuid.js'

export const getGraphQLRequiredType = <T extends GraphQLOutputType> (type: T) => {
  return  { type: new GraphQLNonNull(type) }
}

export const requiredStringType = getGraphQLRequiredType(GraphQLString)
export const requiredUUIDType = getGraphQLRequiredType(UUIDType)
export const requiredFloatType = getGraphQLRequiredType(GraphQLFloat)
export const requiredIntType = getGraphQLRequiredType(GraphQLInt)
export const requiredBooleanType = getGraphQLRequiredType(GraphQLBoolean)

export const listOf = <T extends GraphQLOutputType>(type: T) =>
  new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(type)))
