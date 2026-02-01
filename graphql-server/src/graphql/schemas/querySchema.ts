import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load base schema (NHL/standings)
const baseSchema = loadSchemaSync(join(__dirname, './schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
});

// Load tennis schema
const tennisSchema = loadSchemaSync(join(__dirname, './tennis.graphql'), {
  loaders: [new GraphQLFileLoader()],
});

// Load prioritization schema
const prioritizationSchema = loadSchemaSync(join(__dirname, './prioritization.graphql'), {
  loaders: [new GraphQLFileLoader()],
});

// Merge all schemas
const typeDefs = mergeTypeDefs([baseSchema, tennisSchema, prioritizationSchema]);

export { typeDefs };
