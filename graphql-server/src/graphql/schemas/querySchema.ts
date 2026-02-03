import { loadTypedefsSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { print } from 'graphql';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load core .graphql files from schemas directory
const coreSources = loadTypedefsSync(join(__dirname, './*.graphql'), {
  loaders: [new GraphQLFileLoader()],
});

// Load sport-specific .graphql files from sports directory structure
const sportsSources = loadTypedefsSync(
  join(__dirname, '../../sports/**/*.graphql'),
  { loaders: [new GraphQLFileLoader()] }
);

// Combine all sources
const allSources = [...coreSources, ...sportsSources];

// Extract and merge all type definitions, then convert to SDL string for Mercurius
const mergedTypeDefs = mergeTypeDefs(allSources.map(source => source.document!));
const typeDefs = print(mergedTypeDefs);

export { typeDefs };
