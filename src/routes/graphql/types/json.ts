import { GraphQLScalarType, valueFromASTUntyped } from 'graphql';

export const JSONType = new GraphQLScalarType({
  name: 'JSON',
  serialize: (value) => value,
  parseValue: (value) => value,
  parseLiteral: (ast) => valueFromASTUntyped(ast),
});
