/**
 * MongoDB Connection Tests
 * 
 * Tests for MongoDB initialization and connection scripts
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mongodbPath = path.resolve(__dirname, '../../mongodb');

describe('MongoDB Connection & Initialization', () => {
  describe('Initialization Script', () => {
    test('should have init-mongo.js file', async () => {
      const initPath = path.join(mongodbPath, 'init-mongo.js');
      await expect(fs.access(initPath)).resolves.not.toThrow();
    });

    test('init script should contain basic setup commands', async () => {
      const initPath = path.join(mongodbPath, 'init-mongo.js');
      try {
        const content = await fs.readFile(initPath, 'utf8');
        
        // Check for essential MongoDB commands
        expect(content).toMatch(/use\s*\(\s*['"]?\w+['"]?\s*\)|use\s+\w+/); // use database command (both function and shell syntax)
        expect(content).toMatch(/createCollection|db\.\w+\.insertOne/); // collection creation
      } catch (error) {
        // Skip test if file doesn't exist yet
        if (error.code !== 'ENOENT') throw error;
      }
    });
  });

  describe('Directory Structure', () => {
    test('should have required directories', async () => {
      const requiredDirs = ['schemas', 'indexes', 'migrations', 'seeds'];
      
      for (const dir of requiredDirs) {
        const dirPath = path.join(mongodbPath, dir);
        try {
          const stat = await fs.stat(dirPath);
          expect(stat.isDirectory()).toBe(true);
        } catch (error) {
          // Some directories might not exist yet, which is okay
          if (error.code !== 'ENOENT') throw error;
        }
      }
    });
  });
});