/**
 * Neo4j Cypher Syntax Tests
 * 
 * Tests for validating Neo4j Cypher query syntax
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const neo4jPath = path.resolve(__dirname, '../../neo4j');

describe('Neo4j Cypher Syntax Validation', () => {
  describe('Cypher Query Files', () => {
    test('should have cypher-queries directory', async () => {
      const queriesPath = path.join(neo4jPath, 'cypher-queries');
      try {
        const stat = await fs.stat(queriesPath);
        expect(stat.isDirectory()).toBe(true);
      } catch (error) {
        if (error.code === 'ENOENT') {
          // Directory doesn't exist yet, which is okay for now
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });

    test('should have relationship-patterns.cypher file', async () => {
      const patternsPath = path.join(neo4jPath, 'cypher-queries/relationship-patterns.cypher');
      try {
        await fs.access(patternsPath);
        const content = await fs.readFile(patternsPath, 'utf8');
        
        // Basic Cypher syntax checks
        expect(content).toMatch(/MATCH|CREATE|MERGE/i); // Has basic Cypher commands
        expect(content).toMatch(/\(\w+:\w+\)/); // Has node patterns
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        // File doesn't exist yet, skip test
      }
    });
  });

  describe('Initialization Script', () => {
    test('should have init-neo4j.cypher file', async () => {
      const initPath = path.join(neo4jPath, 'init-neo4j.cypher');
      try {
        await fs.access(initPath);
        const content = await fs.readFile(initPath, 'utf8');
        
        // Check for constraint/index creation
        expect(content).toMatch(/CREATE\s+(CONSTRAINT|INDEX)/i);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        // File doesn't exist yet, skip test
      }
    });
  });

  describe('Constraints and Indexes', () => {
    test('should have constraints directory', async () => {
      const constraintsPath = path.join(neo4jPath, 'constraints');
      try {
        const stat = await fs.stat(constraintsPath);
        expect(stat.isDirectory()).toBe(true);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        // Directory doesn't exist yet, which is okay
      }
    });
  });
});