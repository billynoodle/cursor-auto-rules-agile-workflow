import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

interface TestFile {
  path: string;
  type: 'unit' | 'integration' | 'e2e';
  category: 'services' | 'components' | 'controllers' | 'api';
}

const determineTestType = (filePath: string): TestFile['type'] => {
  if (filePath.includes('.e2e.test.')) return 'e2e';
  if (filePath.includes('.integration.test.')) return 'integration';
  return 'unit';
};

const determineCategory = (filePath: string): TestFile['category'] => {
  if (filePath.includes('/services/')) return 'services';
  if (filePath.includes('/components/')) return 'components';
  if (filePath.includes('/controllers/')) return 'controllers';
  if (filePath.includes('/api/')) return 'api';
  return 'services'; // Default category
};

const getNewPath = (file: TestFile): string => {
  const fileName = path.basename(file.path);
  const category = file.category;
  
  switch (file.type) {
    case 'unit':
      return path.join('tests/unit', category, fileName);
    case 'integration':
      return path.join('tests/integration', category, fileName);
    case 'e2e':
      return path.join('tests/e2e/flows', fileName);
    default:
      throw new Error(`Unknown test type: ${file.type}`);
  }
};

const migrateTests = async () => {
  // Find all test files
  const testFiles: string[] = glob.sync('tests/**/*.test.{ts,tsx}', {
    ignore: ['**/node_modules/**', 'tests/scripts/**']
  });

  const migrations: TestFile[] = testFiles.map((filePath: string) => ({
    path: filePath,
    type: determineTestType(filePath),
    category: determineCategory(filePath)
  }));

  // Create directories if they don't exist
  const directories = [
    'tests/unit/services',
    'tests/unit/components',
    'tests/unit/controllers',
    'tests/integration/services',
    'tests/integration/api',
    'tests/integration/controllers',
    'tests/e2e/flows'
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Migrate files
  migrations.forEach(file => {
    const newPath = getNewPath(file);
    const newDir = path.dirname(newPath);

    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }

    if (file.path !== newPath) {
      if (fs.existsSync(file.path)) {
        fs.renameSync(file.path, newPath);
        console.log(`Migrated: ${file.path} -> ${newPath}`);
      }
    }
  });

  console.log('\nTest migration completed!');
  console.log(`Total files processed: ${migrations.length}`);
  console.log(`Unit tests: ${migrations.filter(f => f.type === 'unit').length}`);
  console.log(`Integration tests: ${migrations.filter(f => f.type === 'integration').length}`);
  console.log(`E2E tests: ${migrations.filter(f => f.type === 'e2e').length}`);
};

// Run migration
migrateTests().catch(error => {
  console.error('Error during test migration:', error);
  process.exit(1);
}); 