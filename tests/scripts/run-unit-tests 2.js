const jest = require('jest');
const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

async function runUnitTests() {
  const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm');
  const resultsDir = path.join(__dirname, '..', 'test-results', 'unit-review');
  
  // Ensure results directory exists
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  // Configure Jest options
  const jestConfig = {
    projects: [path.join(__dirname, '..')],
    testMatch: [
      '**/unit/**/*.test.[jt]s?(x)',
      '**/unit/**/*.spec.[jt]s?(x)'
    ],
    collectCoverage: true,
    coverageDirectory: path.join(resultsDir, timestamp, 'coverage'),
    json: true,
    outputFile: path.join(resultsDir, timestamp, 'results.json'),
  };

  try {
    // Run tests
    await jest.runCLI(jestConfig, jestConfig.projects);

    // Create summary file
    const summary = {
      timestamp,
      testSuite: 'unit-tests',
      status: 'completed',
      resultsFile: `results.json`,
      coverageDir: 'coverage'
    };

    fs.writeFileSync(
      path.join(resultsDir, timestamp, 'summary.json'),
      JSON.stringify(summary, null, 2)
    );

    console.log(`✅ Unit tests completed. Results stored in: ${path.join(resultsDir, timestamp)}`);
  } catch (error) {
    console.error('❌ Error running unit tests:', error);
    process.exit(1);
  }
}

runUnitTests(); 