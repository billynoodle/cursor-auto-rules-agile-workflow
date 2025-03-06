/**
 * Test Consolidation Script
 * 
 * This script moves tests from server/src and client/src to the tests directory.
 * It preserves the directory structure and updates import paths.
 * 
 * Usage:
 * node scripts/consolidate-tests.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure directories exist
const directories = [
  'tests/unit/services',
  'tests/unit/client/components/tooltips',
  'test-results/coverage'
];

directories.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Copy server tests
console.log('\nMoving server tests...');
try {
  // Copy ModuleService test
  const moduleServiceTestSource = path.join(__dirname, '../server/src/services/__tests__/ModuleService.test.ts');
  const moduleServiceTestDest = path.join(__dirname, '../tests/unit/services/ModuleService.test.ts');
  
  if (fs.existsSync(moduleServiceTestSource)) {
    let content = fs.readFileSync(moduleServiceTestSource, 'utf8');
    
    // Update import paths
    content = content.replace(
      /from '\.\.\/(.*)'/g, 
      "from '@/services/$1'"
    );
    content = content.replace(
      /from '\.\.\/\.\.\/models\/(.*)'/g, 
      "from '@/models/$1'"
    );
    
    fs.writeFileSync(moduleServiceTestDest, content);
    console.log('Moved and updated ModuleService.test.ts');
  }
  
  // Copy ResearchDocumentationService test
  const researchServiceTestSource = path.join(__dirname, '../server/src/services/__tests__/ResearchDocumentationService.test.ts');
  const researchServiceTestDest = path.join(__dirname, '../tests/unit/services/ResearchDocumentationService.test.ts');
  
  if (fs.existsSync(researchServiceTestSource)) {
    let content = fs.readFileSync(researchServiceTestSource, 'utf8');
    
    // Update import paths
    content = content.replace(
      /from '\.\.\/(.*)'/g, 
      "from '@/services/$1'"
    );
    content = content.replace(
      /from '\.\.\/\.\.\/models\/(.*)'/g, 
      "from '@/models/$1'"
    );
    
    fs.writeFileSync(researchServiceTestDest, content);
    console.log('Moved and updated ResearchDocumentationService.test.ts');
  }
} catch (error) {
  console.error('Error moving server tests:', error.message);
}

// Copy client tests
console.log('\nMoving client tests...');
try {
  // Copy TooltipTestingDemo test
  const tooltipDemoTestSource = path.join(__dirname, '../client/src/components/tooltips/__tests__/TooltipTestingDemo.test.tsx');
  const tooltipDemoTestDest = path.join(__dirname, '../tests/unit/client/components/tooltips/TooltipTestingDemo.test.tsx');
  
  if (fs.existsSync(tooltipDemoTestSource)) {
    let content = fs.readFileSync(tooltipDemoTestSource, 'utf8');
    
    // Update import paths
    content = content.replace(
      /from '\.\.\/(.*)'/g, 
      "from '@client/components/tooltips/$1'"
    );
    content = content.replace(
      /from '\.\.\/\.\.\/\.\.\/services\/(.*)'/g, 
      "from '@client/services/$1'"
    );
    
    fs.writeFileSync(tooltipDemoTestDest, content);
    console.log('Moved and updated TooltipTestingDemo.test.tsx');
  }
  
  // Copy TooltipUserTesting test
  const tooltipUserTestSource = path.join(__dirname, '../client/src/components/tooltips/__tests__/TooltipUserTesting.test.tsx');
  const tooltipUserTestDest = path.join(__dirname, '../tests/unit/client/components/tooltips/TooltipUserTesting.test.tsx');
  
  if (fs.existsSync(tooltipUserTestSource)) {
    let content = fs.readFileSync(tooltipUserTestSource, 'utf8');
    
    // Update import paths
    content = content.replace(
      /from '\.\.\/(.*)'/g, 
      "from '@client/components/tooltips/$1'"
    );
    content = content.replace(
      /from '\.\.\/\.\.\/\.\.\/services\/(.*)'/g, 
      "from '@client/services/$1'"
    );
    
    fs.writeFileSync(tooltipUserTestDest, content);
    console.log('Moved and updated TooltipUserTesting.test.tsx');
  }
} catch (error) {
  console.error('Error moving client tests:', error.message);
}

console.log('\nTest consolidation complete!');
console.log('You can now run tests using:');
console.log('npm test');
console.log('npm run test:unit');
console.log('npm run test:integration');
console.log('npm run test:e2e');
console.log('npm run test:coverage');
console.log('npm run test:tooltip'); 