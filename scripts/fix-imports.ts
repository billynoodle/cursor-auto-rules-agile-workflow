import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const IMPORT_REGEX = /^import\s+(?:(?:(?:\{[^}]*\}|\*\s+as\s+[^,]*|[^,{}\s*]+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+[^,]*|[^,{}\s*]+))*)\s+from\s+)?['"]([^'"]+)['"]/gm;

const PATH_MAPPINGS = {
  // Client-side mappings
  '../components/': '@components/',
  '../services/': '@services/',
  '../types/': '@types/',
  '../utils/': '@utils/',
  '../lib/': '@lib/',
  '../hooks/': '@/hooks/',
  '../contexts/': '@/contexts/',
  '../pages/': '@/pages/',
  // Deep imports from server
  '../../../server/src/': '@server/',
  '../../server/src/': '@server/',
  '../server/src/': '@server/',
  // Test imports
  '../../../../client/src/': '@client/',
  '../../../client/src/': '@client/',
  '../../client/src/': '@client/',
  '../client/src/': '@client/',
  '../../../../__mocks__/': '@__mocks__/',
  '../../../__mocks__/': '@__mocks__/',
  '../../__mocks__/': '@__mocks__/',
  '../__mocks__/': '@__mocks__/',
};

function shouldIgnoreFile(file: string): boolean {
  return file.includes('node_modules') || 
         file.includes('dist') || 
         file.includes('build') ||
         file.includes('.git');
}

function fixImportPath(importPath: string): string {
  // Don't modify package imports
  if (importPath.startsWith('@') && !importPath.startsWith('@/')) {
    return importPath;
  }

  // Check for each mapping
  for (const [oldPath, newPath] of Object.entries(PATH_MAPPINGS)) {
    if (importPath.startsWith(oldPath)) {
      return importPath.replace(oldPath, newPath);
    }
  }

  // Handle relative imports within same directory
  if (importPath.startsWith('./')) {
    return importPath;
  }

  return importPath;
}

function processFile(filePath: string): void {
  if (shouldIgnoreFile(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  let match;

  // Reset regex
  IMPORT_REGEX.lastIndex = 0;

  while ((match = IMPORT_REGEX.exec(content)) !== null) {
    const [fullMatch, importPath] = match;
    const fixedPath = fixImportPath(importPath);
    if (fixedPath !== importPath) {
      newContent = newContent.replace(
        new RegExp(fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
        fullMatch.replace(importPath, fixedPath)
      );
    }
  }

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated imports in ${filePath}`);
  }
}

async function main() {
  try {
    const files = await glob('**/*.{ts,tsx}', {
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.git/**']
    });

    for (const file of files) {
      processFile(file);
    }
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

main(); 