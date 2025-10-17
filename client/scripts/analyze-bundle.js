/**
 * Bundle Analysis Script
 * Analyzes the build output to identify optimization opportunities
 */

import fs from 'fs';
import path from 'path';

// Function to get file size in KB
const getFileSize = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(2);
  } catch (error) {
    return 0;
  }
};

// Function to analyze directory
const analyzeDirectory = (dirPath, prefix = '') => {
  const items = fs.readdirSync(dirPath);
  const results = [];

  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results.push({
        name: `${prefix}${item}/`,
        size: 0,
        type: 'directory',
        children: analyzeDirectory(fullPath, `${prefix}${item}/`)
      });
    } else {
      const size = getFileSize(fullPath);
      results.push({
        name: `${prefix}${item}`,
        size: parseFloat(size),
        type: 'file'
      });
    }
  });

  return results;
};

// Function to flatten results for easier analysis
const flattenResults = (results, flat = []) => {
  results.forEach(item => {
    if (item.type === 'file') {
      flat.push(item);
    }
    if (item.children) {
      flattenResults(item.children, flat);
    }
  });
  return flat;
};

// Function to get total size
const getTotalSize = (results) => {
  return results.reduce((total, item) => total + item.size, 0);
};

// Function to get largest files
const getLargestFiles = (results, limit = 10) => {
  return results
    .filter(item => item.type === 'file')
    .sort((a, b) => b.size - a.size)
    .slice(0, limit);
};

// Main analysis function
const analyzeBundle = () => {
  const distPath = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distPath)) {
    console.log('Dist directory not found. Please run "npm run build" first.');
    return;
  }

  console.log('=== Bundle Analysis Report ===\n');
  
  const results = analyzeDirectory(distPath);
  const flatResults = flattenResults(results);
  
  const totalSize = getTotalSize(flatResults);
  console.log(`Total Bundle Size: ${totalSize.toFixed(2)} KB\n`);
  
  const largestFiles = getLargestFiles(flatResults, 15);
  console.log('Largest Files:');
  largestFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file.name} - ${file.size.toFixed(2)} KB`);
  });
  
  console.log('\n=== Optimization Recommendations ===');
  
  // Check for large vendor files
  const largeVendorFiles = largestFiles.filter(file => 
    file.name.includes('vendor') || 
    file.name.includes('chunk') ||
    file.name.includes('.js')
  );
  
  if (largeVendorFiles.some(file => file.size > 100)) {
    console.log('⚠️  Consider code splitting for large vendor chunks (>100KB)');
  }
  
  // Check for large CSS files
  const largeCSSFiles = largestFiles.filter(file => file.name.endsWith('.css'));
  if (largeCSSFiles.some(file => file.size > 50)) {
    console.log('⚠️  Consider CSS optimization for large stylesheets (>50KB)');
  }
  
  // Check for unused assets
  const assetFiles = flatResults.filter(file => 
    file.name.includes('/assets/') && 
    !file.name.endsWith('.js') && 
    !file.name.endsWith('.css')
  );
  
  if (assetFiles.length > 10) {
    console.log('⚠️  Consider optimizing or removing unused assets');
  }
  
  console.log('\n=== Bundle Optimization Tips ===');
  console.log('1. Use dynamic imports for code splitting');
  console.log('2. Remove unused dependencies');
  console.log('3. Optimize images and other assets');
  console.log('4. Enable gzip/brotli compression on your server');
  console.log('5. Use tree shaking to eliminate unused code');
  console.log('6. Consider using a CDN for static assets');
};

// Run analysis
analyzeBundle();