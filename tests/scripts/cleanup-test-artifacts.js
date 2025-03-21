const fs = require('fs');
const path = require('path');
const { format, subDays } = require('date-fns');

const RETENTION_DAYS = 7; // Keep last 7 days of metrics
const ROOT_DIR = path.join(__dirname, '..', '..');
const RESULTS_DIR = path.join(ROOT_DIR, 'tests', 'results');

// Create new directory structure
function createDirectoryStructure() {
  const dirs = [
    path.join(RESULTS_DIR, 'coverage'),
    path.join(RESULTS_DIR, 'metrics', 'raw'),
    path.join(RESULTS_DIR, 'metrics', 'reports'),
    path.join(RESULTS_DIR, 'junit')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Clean up old metrics files
function cleanupMetrics() {
  const retentionDate = subDays(new Date(), RETENTION_DAYS);
  const metricsDir = path.join(RESULTS_DIR, 'metrics', 'raw');
  
  if (fs.existsSync(metricsDir)) {
    const files = fs.readdirSync(metricsDir);
    
    files.forEach(file => {
      const filePath = path.join(metricsDir, file);
      const stats = fs.statSync(filePath);
      
      // Extract date from filename (format: metrics-YYYY-MM-DD...)
      const dateMatch = file.match(/metrics-(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) {
        const fileDate = new Date(dateMatch[1]);
        if (fileDate < retentionDate) {
          fs.unlinkSync(filePath);
          console.log(`Deleted old metrics file: ${file}`);
        }
      }
    });
  }
}

// Clean up old coverage reports
function cleanupCoverage() {
  const coverageDir = path.join(RESULTS_DIR, 'coverage');
  if (fs.existsSync(coverageDir)) {
    fs.rmSync(coverageDir, { recursive: true, force: true });
    fs.mkdirSync(coverageDir);
    console.log('Cleaned up coverage directory');
  }
}

// Clean up old JUnit reports
function cleanupJUnit() {
  const junitDir = path.join(RESULTS_DIR, 'junit');
  if (fs.existsSync(junitDir)) {
    const files = fs.readdirSync(junitDir);
    files.forEach(file => {
      const filePath = path.join(junitDir, file);
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
        console.log(`Deleted old JUnit report: ${file}`);
      }
    });
  }
}

// Main cleanup function
async function cleanup() {
  console.log('Starting cleanup...');
  
  try {
    createDirectoryStructure();
    cleanupMetrics();
    cleanupCoverage();
    cleanupJUnit();
    
    console.log('Cleanup completed successfully');
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

cleanup(); 