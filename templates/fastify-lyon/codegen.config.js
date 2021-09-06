require('dotenv').config();

module.exports = {
  schema: [
    {
      // Add GraphQL Schema here
    }
  ],
  documents: "src/graphql/documents/**/*.gql",
  overwrite: true,
  generates: {
    'src/graphql/types.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
      config: {
        avoidOptionals: false,
        immutableTypes: true,
      },
    },
  },
}

