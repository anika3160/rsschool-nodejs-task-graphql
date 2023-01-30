import 'reflect-metadata';
import { ApolloServer, BaseContext } from '@apollo/server';
import {
  fastifyApolloHandler,
  fastifyApolloDrainPlugin,
} from '@as-integrations/fastify';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import UsersResolver from '../../graphql/resolvers/users';
import { buildSchema } from 'type-graphql';
import ProfileResolver from '../../graphql/resolvers/profiles';
import PostResolver from '../../graphql/resolvers/posts';
import MemberTypeResolver from '../../graphql/resolvers/member-types';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  const schema = await buildSchema({
    resolvers: [
      UsersResolver,
      ProfileResolver,
      PostResolver,
      MemberTypeResolver,
    ],
    validate: false,
  });
  const apollo = new ApolloServer<BaseContext>({
    schema,
    plugins: [fastifyApolloDrainPlugin(fastify)],
  });

  await apollo.start();

  fastify.get('/', fastifyApolloHandler(apollo));
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    fastifyApolloHandler(apollo, {
      context: async () => fastify,
    })
  );
};

export default plugin;
