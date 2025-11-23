import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { execute, parse, specifiedRules, validate } from 'graphql'
import depthLimit from 'graphql-depth-limit'
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js'

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma, prismaStats } = fastify;

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
      const validationRules = [...specifiedRules, depthLimit(5)];

      try {
        const document = parse(req.body.query);
        const validationErrors = validate(schema, document, validationRules);

        if (validationErrors.length > 0) {
          return { errors: validationErrors };
        }

        return execute({
          schema,
          document,
          variableValues: req.body.variables,
          contextValue: { req, prisma, prismaStats },
        });
      } catch (error) {
        return { errors: [error as Error] };
      }
    },
  });
};

export default plugin;
