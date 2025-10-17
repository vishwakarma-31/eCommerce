/**
 * Lighthouse Performance Monitoring Script
 * Automates Lighthouse audits for performance monitoring
 */

import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const urls = [
  'http://localhost:5173/', // Home page
  'http://localhost:5173/products', // Products page
  'http://localhost:5173/product/1', // Product detail page
  'http://localhost:5173/cart', // Cart page
  'http://localhost:5173/profile' // Profile page
];

const lighthouseConfig = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    throttlingMethod: 'simulate',
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false
    }
  }
};

/**
 * Run Lighthouse audit on a URL
 * @param {string} url - URL to audit
 * @param {Object} config - Lighthouse configuration
 * @returns {Object} Lighthouse results
 */
async function runLighthouseAudit(url, config) {
  // Launch Chrome
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  config.port = chrome.port;
  
  try {
    // Run Lighthouse
    const runnerResult = await lighthouse(url, config);
    
    // Extract results
    const { lhr } = runnerResult;
    
    return {
      url,
      timestamp: new Date().toISOString(),
      scores: {
        performance: Math.round(lhr.categories.performance.score * 100),
        accessibility: Math.round(lhr.categories.accessibility.score * 100),
        'best-practices': Math.round(lhr.categories['best-practices'].score * 100),
        seo: Math.round(lhr.categories.seo.score * 100)
      },
      metrics: {
        'first-contentful-paint': lhr.audits['first-contentful-paint'].numericValue,
        'largest-contentful-paint': lhr.audits['largest-contentful-paint'].numericValue,
        'cumulative-layout-shift': lhr.audits['cumulative-layout-shift'].numericValue,
        'speed-index': lhr.audits['speed-index'].numericValue,
        'total-blocking-time': lhr.audits['total-blocking-time'].numericValue
      }
    };
  } finally {
    // Kill Chrome
    await chrome.kill();
  }
}

/**
 * Save results to file
 * @param {Array} results - Audit results
 * @param {string} filename - Output filename
 */
async function saveResults(results, filename) {
  const outputPath = path.join(__dirname, '..', 'reports', filename);
  
  // Ensure reports directory exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  
  // Save as JSON
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
  
  // Save as HTML report
  const htmlPath = outputPath.replace('.json', '.html');
  const htmlReport = generateHtmlReport(results);
  await fs.writeFile(htmlPath, htmlReport);
  
  console.log(`Results saved to ${outputPath}`);
  console.log(`HTML report saved to ${htmlPath}`);
}

/**
 * Generate HTML report from results
 * @param {Array} results - Audit results
 * @returns {string} HTML report
 */
function generateHtmlReport(results) {
  const timestamp = new Date().toISOString();
  
  let html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Lighthouse Performance Report</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      h1 { color: #333; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
      th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
      th { background-color: #f2f2f2; }
      .metric { font-weight: bold; }
      .improvement { color: green; }
      .regression { color: red; }
    </style>
  </head>
  <body>
    <h1>Lighthouse Performance Report</h1>
    <p>Generated: ${timestamp}</p>
    
    <h2>Performance Scores</h2>
    <table>
      <tr>
        <th>URL</th>
        <th>Performance</th>
        <th>Accessibility</th>
        <th>Best Practices</th>
        <th>SEO</th>
      </tr>
  `;
  
  results.forEach(result => {
    html += `
      <tr>
        <td>${result.url}</td>
        <td>${result.scores.performance}</td>
        <td>${result.scores.accessibility}</td>
        <td>${result.scores['best-practices']}</td>
        <td>${result.scores.seo}</td>
      </tr>
    `;
  });
  
  html += `
    </table>
    
    <h2>Core Web Vitals</h2>
    <table>
      <tr>
        <th>URL</th>
        <th>First Contentful Paint (ms)</th>
        <th>Largest Contentful Paint (ms)</th>
        <th>Cumulative Layout Shift</th>
        <th>Speed Index (ms)</th>
        <th>Total Blocking Time (ms)</th>
      </tr>
  `;
  
  results.forEach(result => {
    html += `
      <tr>
        <td>${result.url}</td>
        <td>${Math.round(result.metrics['first-contentful-paint'])}</td>
        <td>${Math.round(result.metrics['largest-contentful-paint'])}</td>
        <td>${result.metrics['cumulative-layout-shift'].toFixed(3)}</td>
        <td>${Math.round(result.metrics['speed-index'])}</td>
        <td>${Math.round(result.metrics['total-blocking-time'])}</td>
      </tr>
    `;
  });
  
  html += `
    </table>
  </body>
  </html>
  `;
  
  return html;
}

/**
 * Main function
 */
async function main() {
  console.log('Starting Lighthouse performance monitoring...');
  
  const results = [];
  
  for (const url of urls) {
    console.log(`Auditing ${url}...`);
    try {
      const result = await runLighthouseAudit(url, lighthouseConfig);
      results.push(result);
      console.log(`Completed audit for ${url}`);
    } catch (error) {
      console.error(`Error auditing ${url}:`, error.message);
    }
  }
  
  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await saveResults(results, `lighthouse-report-${timestamp}.json`);
  
  console.log('Lighthouse performance monitoring completed.');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { runLighthouseAudit, saveResults, generateHtmlReport };