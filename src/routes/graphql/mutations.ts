import { GraphQLBoolean, GraphQLFloat, GraphQLInputFieldConfigMap, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { MemberTypeId } from '../member-types/schemas.js'
import { GqlContext } from './queryType.js'
import { getGraphQLRequiredType, requiredBooleanType, requiredFloatType, requiredIntType, requiredStringType, requiredUUIDType } from './types/helpers.js'
import { memberTypeIdEnum } from './types/member-types.js'
import { postType } from './types/posts.js'
import { profileType } from './types/profiles.js'
import { userType } from './types/users.js'

const OK_STRING = 'OK';


const createInputType = (name: string, fields: GraphQLInputFieldConfigMap) =>
  new GraphQLInputObjectType({ name, fields });

const createUserInput = createInputType('CreateUserInput',
  {
    name: requiredStringType,
    balance: requiredFloatType,
  }
);

const changeUserInput = createInputType('ChangeUserInput',
  {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }
);

const createProfileInput = createInputType('CreateProfileInput', {
  isMale: requiredBooleanType,
  yearOfBirth: requiredIntType,
  userId: requiredUUIDType,
  memberTypeId: getGraphQLRequiredType(memberTypeIdEnum)
});

const changeProfileInput = createInputType('ChangeProfileInput', {
  isMale: { type: GraphQLBoolean },
  yearOfBirth: { type: GraphQLInt },
  memberTypeId: { type: memberTypeIdEnum },
});

const createPostInput = createInputType('CreatePostInput', {
  title: requiredStringType,
  content: requiredStringType,
  authorId: requiredUUIDType,
});

const changePostInput = createInputType('ChangePostInput', {
  title: { type: GraphQLString },
  content: { type: GraphQLString },
});

export const mutationType = new GraphQLObjectType<unknown, GqlContext>({
  name: 'Mutations',
  fields: {
    createUser: {
      type: new GraphQLNonNull(userType),
      args: { dto: { type: new GraphQLNonNull(createUserInput) } },
      resolve: (_parent, args: { dto: { name: string; balance: number } }, { prisma }) =>
        prisma.user.create({ data: args.dto }),
    },
    changeUser: {
      type: new GraphQLNonNull(userType),
      args: {
        id: requiredUUIDType,
        dto: { type: new GraphQLNonNull(changeUserInput) },
      },
      resolve: (_parent, args: { id: string; dto: { name?: string; balance?: number } }, { prisma }) =>
        prisma.user.update({ where: { id: args.id }, data: args.dto }),
    },
    deleteUser: {
      ...requiredStringType,
      args: { id: requiredUUIDType },
      resolve: async (_parent, args: { id: string }, { prisma }) => {
        await prisma.user.delete({ where: { id: args.id } });
        return OK_STRING;
      },
    },

    createProfile: {
      type: new GraphQLNonNull(profileType),
      args: { dto: { type: new GraphQLNonNull(createProfileInput) } },
      resolve: (
        _parent,
        args: { dto: { isMale: boolean; yearOfBirth: number; userId: string; memberTypeId: MemberTypeId } },
        { prisma },
      ) => prisma.profile.create({ data: args.dto }),
    },
    changeProfile: {
      type: new GraphQLNonNull(profileType),
      args: {
        id: requiredUUIDType,
        dto: { type: new GraphQLNonNull(changeProfileInput) },
      },
      resolve: (
        _parent,
        args: { id: string; dto: { isMale?: boolean; yearOfBirth?: number; memberTypeId?: MemberTypeId } },
        { prisma },
      ) => prisma.profile.update({ where: { id: args.id }, data: args.dto }),
    },
    deleteProfile: {
      ...requiredStringType,
      args: { id: requiredUUIDType },
      resolve: async (_parent, args: { id: string }, { prisma }) => {
        await prisma.profile.delete({ where: { id: args.id } });
        return OK_STRING;
      },
    },

    createPost: {
      type: new GraphQLNonNull(postType),
      args: { dto: { type: new GraphQLNonNull(createPostInput) } },
      resolve: (_parent, args: { dto: { title: string; content: string; authorId: string } }, { prisma }) =>
        prisma.post.create({ data: args.dto }),
    },
    changePost: {
      type: new GraphQLNonNull(postType),
      args: {
        id: requiredUUIDType,
        dto: { type: new GraphQLNonNull(changePostInput) },
      },
      resolve: (_parent, args: { id: string; dto: { title?: string; content?: string } }, { prisma }) =>
        prisma.post.update({ where: { id: args.id }, data: args.dto }),
    },
    deletePost: {
      ...requiredStringType,
      args: { id: requiredUUIDType },
      resolve: async (_parent, args: { id: string }, { prisma }) => {
        await prisma.post.delete({ where: { id: args.id } });
        return OK_STRING;
      },
    },

    subscribeTo: {
      ...requiredStringType,
      args: {
        userId: requiredUUIDType,
        authorId: requiredUUIDType,
      },
      resolve: async (_parent, { userId, authorId }: { userId: string; authorId: string }, { prisma }) => {
        await prisma.subscribersOnAuthors.create({
          data: { subscriberId: userId, authorId },
        });
        return OK_STRING;
      },
    },
    unsubscribeFrom: {
      ...requiredStringType,
      args: {
        userId: requiredUUIDType,
        authorId: requiredUUIDType,
      },
      resolve: async (_parent, { userId, authorId }: { userId: string; authorId: string }, { prisma }) => {
        await prisma.subscribersOnAuthors.delete({
          where: { subscriberId_authorId: { subscriberId: userId, authorId } },
        });
        return OK_STRING;
      },
    },
  },
});
