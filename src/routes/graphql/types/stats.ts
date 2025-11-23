import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { getGraphQLRequiredType, requiredStringType } from './helpers.js';
import { JSONType } from './json.js';

const operationHistoryItemType = new GraphQLObjectType({
  name: 'OperationHistoryItem',
  fields: {
    model: requiredStringType,
    operation: requiredStringType,
    args: getGraphQLRequiredType(JSONType),
  },
});

export const prismaStatsType = new GraphQLObjectType({
  name: 'PrismaStats',
  fields: {
    operationHistory: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(operationHistoryItemType))),
    },
  },
});
