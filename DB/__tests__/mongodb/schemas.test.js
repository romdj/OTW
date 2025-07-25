/**
 * MongoDB Schema Validation Tests
 * 
 * Tests for validating MongoDB collection schemas
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemasPath = path.resolve(__dirname, '../../mongodb/schemas');

describe('MongoDB Schema Validation', () => {
  let schemaFiles;

  beforeAll(async () => {
    try {
      const files = await fs.readdir(schemasPath);
      schemaFiles = files.filter(file => file.endsWith('.json'));
    } catch (error) {
      schemaFiles = [];
    }
  });

  test('should have schema files in schemas directory', () => {
    expect(schemaFiles.length).toBeGreaterThan(0);
  });

  describe('Schema File Validation', () => {
    test.each(['events.json', 'users.json', 'reviews.json', 'lists.json'])(
      'should have %s schema file',
      (filename) => {
        expect(schemaFiles).toContain(filename);
      }
    );

    schemaFiles?.forEach(filename => {
      describe(`${filename}`, () => {
        let schema;

        beforeAll(async () => {
          const filePath = path.join(schemasPath, filename);
          const content = await fs.readFile(filePath, 'utf8');
          schema = JSON.parse(content);
        });

        test('should be valid JSON', () => {
          expect(schema).toBeDefined();
          expect(typeof schema).toBe('object');
        });

        test('should have bsonType object', () => {
          expect(schema.bsonType).toBe('object');
        });

        test('should have properties defined', () => {
          expect(schema.properties).toBeDefined();
          expect(typeof schema.properties).toBe('object');
        });

        test('should have at least one property', () => {
          expect(Object.keys(schema.properties).length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Collection-Specific Requirements', () => {
    test('events schema should have required otw.sport fields', async () => {
      const eventsPath = path.join(schemasPath, 'events.json');
      if (await fs.access(eventsPath).then(() => true).catch(() => false)) {
        const content = await fs.readFile(eventsPath, 'utf8');
        const schema = JSON.parse(content);
        
        const requiredFields = ['title', 'sport', 'date', 'participants'];
        requiredFields.forEach(field => {
          expect(schema.properties).toHaveProperty(field);
        });
      }
    });

    test('users schema should have required fields', async () => {
      const usersPath = path.join(schemasPath, 'users.json');
      if (await fs.access(usersPath).then(() => true).catch(() => false)) {
        const content = await fs.readFile(usersPath, 'utf8');
        const schema = JSON.parse(content);
        
        const requiredFields = ['username', 'email'];
        requiredFields.forEach(field => {
          expect(schema.properties).toHaveProperty(field);
        });
      }
    });
  });
});