import type { Post } from '@prisma/client'
import { GraphQLObjectType } from 'graphql'
import { requiredStringType, requiredUUIDType } from './helpers.js'


export const postType = new GraphQLObjectType<Post>({
  name: 'Post',
  fields: {
    id: requiredUUIDType,
    title: requiredStringType,
    content: requiredStringType,
    authorId: requiredUUIDType,
  }
})
