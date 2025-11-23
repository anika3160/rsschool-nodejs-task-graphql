import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { graphql } from 'graphql'
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js'

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      return graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: {
          req,
          prisma,
        }
      });
    },
  });
};

export default plugin;
