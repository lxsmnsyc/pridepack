import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../graphql/types';

const ENDPOINT = 'https://gql.trylyon.com/v1/graphql'; // TODO: Change GraphQL Endpoint if needed

const client = new GraphQLClient(ENDPOINT, {
  headers: {
    'content-type': 'application/json',
    'Accept-Encoding': 'br, gzip',
    'X-Hasura-Admin-Secret': String(process.env.HASURA_ADMIN_SECRET),
  },
});

export const CLIENT = getSdk(client);
