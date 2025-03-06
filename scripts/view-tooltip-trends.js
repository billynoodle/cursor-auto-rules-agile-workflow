/**
 * Tooltip Trends Viewer
 * 
 * This script displays historical trends from tooltip review tests.
 * It reads test results from the test-results directory and generates
 * a report showing how tooltip quality has changed over time.
 * 
 * Usage:
 * node scripts/view-tooltip-trends.js
 */

const fs = require('fs');
const path = require('path');

// Path to tooltip review test results
const tooltipResultsDir = path.join(__dirname, '../test-results/tooltip-review');
const indexPath = path.join(tooltipResultsDir, 'index.json');

// Check if results exist
if (!fs.existsSync(tooltipResultsDir) || !fs.existsSync(indexPath)) {
  console.error('No tooltip review test results found.');
  console.error('Run the tooltip tests first with: node scripts/run-tooltip-tests.js');
  process.exit(1);
}

// Read the index file
const indexContent = fs.readFileSync(indexPath, 'utf8');
const index = JSON.parse(indexContent);

// Filter for tooltip-review-results entries
const tooltipEntries = index.tests.filter(entry => entry.id === 'tooltip-review-results');

if (tooltipEntries.length === 0) {
  console.error('No tooltip review results found in the test history.');
  process.exit(1);
}

// Sort by timestamp (oldest first)
tooltipEntries.sort((a, b) => {
  return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
});

// Read each result file
const results = tooltipEntries.map(entry => {
  const resultContent = fs.readFileSync(entry.path, 'utf8');
  const result = JSON.parse(resultContent);
  return {
    timestamp: new Date(entry.timestamp).toLocaleString(),
    ...result.data
  };
});

// Display trend report
console.log('=== Tooltip Quality Trend Report ===');
console.log(`Found ${results.length} test runs\n`);

// Create a table of key metrics
console.log('Timestamp | Total | % with Metrics | % with Examples | % Needing Improvement');
console.log('----------|-------|---------------|-----------------|----------------------');

results.forEach(result => {
  console.log(
    `${result.timestamp.padEnd(10)} | ` +
    `${result.totalTooltips.toString().padEnd(5)} | ` +
    `${result.percentWithMetrics.toString().padEnd(13)}% | ` +
    `${result.percentWithExamples.toString().padEnd(15)}% | ` +
    `${result.percentNeedingImprovement.toString().padEnd(20)}%`
  );
});

// Show improvement over time
if (results.length > 1) {
  const firstRun = results[0];
  const lastRun = results[results.length - 1];
  
  console.log('\n=== Overall Improvement ===');
  
  const metricsDiff = lastRun.percentWithMetrics - firstRun.percentWithMetrics;
  const examplesDiff = lastRun.percentWithExamples - firstRun.percentWithExamples;
  const improvementDiff = firstRun.percentNeedingImprovement - lastRun.percentNeedingImprovement;
  
  console.log(`Metrics: ${metricsDiff >= 0 ? '+' : ''}${metricsDiff}%`);
  console.log(`Examples: ${examplesDiff >= 0 ? '+' : ''}${examplesDiff}%`);
  console.log(`Tooltips Needing Improvement: ${improvementDiff >= 0 ? '-' : '+'}${Math.abs(improvementDiff)}%`);
  
  // Overall quality score (simple calculation)
  const firstQuality = (firstRun.percentWithMetrics + firstRun.percentWithExamples) / 2;
  const lastQuality = (lastRun.percentWithMetrics + lastRun.percentWithExamples) / 2;
  const qualityDiff = lastQuality - firstQuality;
  
  console.log(`\nOverall Quality Score: ${lastQuality.toFixed(1)}% (${qualityDiff >= 0 ? '+' : ''}${qualityDiff.toFixed(1)}%)`);
}

// Recommendations
console.log('\n=== Recommendations ===');
if (results.length > 0) {
  const latest = results[results.length - 1];
  
  if (latest.percentWithMetrics < 80) {
    console.log('- Focus on adding specific metrics to tooltips');
  }
  
  if (latest.percentWithExamples < 80) {
    console.log('- Add more practical examples to tooltips');
  }
  
  if (latest.percentNeedingImprovement > 20) {
    console.log('- Review tooltips with high improvement scores');
  }
} else {
  console.log('- Run more tests to generate recommendations');
} 