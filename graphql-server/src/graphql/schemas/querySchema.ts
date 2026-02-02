import { loadTypedefsSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { print } from 'graphql';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load all .graphql files as type definitions (not full schemas)
const sources = loadTypedefsSync(join(__dirname, './*.graphql'), {
  loaders: [new GraphQLFileLoader()],
});

// Extract and merge all type definitions, then convert to SDL string for Mercurius
const mergedTypeDefs = mergeTypeDefs(sources.map(source => source.document!));
const typeDefs = print(mergedTypeDefs);

export { typeDefs };
