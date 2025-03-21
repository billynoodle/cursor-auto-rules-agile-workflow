const jest = require('jest');
const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

async function runUnitTests() {
  const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm');
  const resultsDir = path.join(__dirname, '..', 'results');
  const coverageDir = path.join(resultsDir, 'coverage', timestamp);
  const metricsDir = path.join(resultsDir, 'metrics');
  const junitDir = path.join(resultsDir, 'junit');
  
  // Ensure directories exist
  [coverageDir, metricsDir, junitDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Configure Jest options
  const jestConfig = {
    projects: [path.join(__dirname, '..')],
    testMatch: [
      '**/unit/**/*.test.[jt]s?(x)',
      '**/unit/**/*.spec.[jt]s?(x)'
    ],
    collectCoverage: true,
    coverageDirectory: coverageDir,
    reporters: [
      'default',
      ['jest-junit', {
        outputDirectory: junitDir,
        outputName: `junit-${timestamp}.xml`,
        includeConsoleOutput: true
      }]
    ],
    json: true,
    outputFile: path.join(resultsDir, `results-${timestamp}.json`),
  };

  try {
    // Run tests
    const results = await jest.runCLI(jestConfig, jestConfig.projects);
    
    // Save test metrics
    const metrics = {
      timestamp,
      testSuite: 'unit-tests',
      status: 'completed',
      results: {
        numTotalTests: results.results.numTotalTests,
        numPassedTests: results.results.numPassedTests,
        numFailedTests: results.results.numFailedTests,
        numPendingTests: results.results.numPendingTests,
        startTime: results.results.startTime,
        endTime: results.results.endTime
      },
      coverage: results.results.coverageMap ? {
        statements: results.results.coverageMap.getCoverageSummary().statements.pct,
        branches: results.results.coverageMap.getCoverageSummary().branches.pct,
        functions: results.results.coverageMap.getCoverageSummary().functions.pct,
        lines: results.results.coverageMap.getCoverageSummary().lines.pct
      } : null
    };

    // Save metrics to raw and create summary report
    fs.writeFileSync(
      path.join(metricsDir, 'raw', `metrics-${timestamp}.json`),
      JSON.stringify(metrics, null, 2)
    );

    // Create/update summary report
    const summaryPath = path.join(metricsDir, 'reports', 'summary.json');
    let summary = [];
    if (fs.existsSync(summaryPath)) {
      summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
    }
    summary.push(metrics);
    // Keep only last 30 days of summary data
    summary = summary.slice(-30);
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    console.log(`✅ Unit tests completed. Results stored in: ${resultsDir}`);
    console.log(`Coverage report: ${coverageDir}`);
    console.log(`Metrics report: ${path.join(metricsDir, 'reports', 'summary.json')}`);
  } catch (error) {
    console.error('❌ Error running unit tests:', error);
    process.exit(1);
  }
}

runUnitTests(); 