/**
 * Tooltip Test Runner
 * 
 * This script runs the tooltip review tests and generates a report.
 * It uses Jest to run the tests and stores the results in the test-results directory.
 * 
 * Usage:
 * node scripts/run-tooltip-tests.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure test-results directory exists
const testResultsDir = path.join(__dirname, '../test-results');
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}

console.log('Running tooltip review tests...');

try {
  // Run the tooltip integration tests
  const output = execSync(
    'cd server && npx jest ../tests/integration/tooltip/TooltipReviewIntegration.test.ts --verbose',
    { stdio: 'inherit' }
  );
  
  console.log('\nTooltip tests completed successfully!');
  console.log('Test results are stored in the test-results directory.');
  
  // Check if there are any historical results
  const tooltipResultsDir = path.join(testResultsDir, 'tooltip-review');
  if (fs.existsSync(tooltipResultsDir)) {
    const indexPath = path.join(tooltipResultsDir, 'index.json');
    
    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      const index = JSON.parse(indexContent);
      
      if (index.tests && index.tests.length > 0) {
        console.log(`\nFound ${index.tests.length} historical test runs.`);
        console.log('You can view historical trends by running:');
        console.log('node scripts/view-tooltip-trends.js');
      }
    }
  }
} catch (error) {
  console.error('Error running tooltip tests:', error.message);
  process.exit(1);
} 