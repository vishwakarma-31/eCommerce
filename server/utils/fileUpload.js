const fs = require('fs').promises;
const path = require('path');

/**
 * Delete a file
 * @param {string} filePath - Path to the file to delete
 * @returns {Promise<void>}
 */
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    // Ignore error if file doesn't exist
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};

/**
 * Delete multiple files
 * @param {string[]} filePaths - Array of file paths to delete
 * @returns {Promise<void>}
 */
const deleteFiles = async (filePaths) => {
  const deletePromises = filePaths.map(filePath => deleteFile(filePath));
  await Promise.all(deletePromises);
};

/**
 * Ensure directory exists
 * @param {string} dirPath - Path to directory
 * @returns {Promise<void>}
 */
const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(dirPath, { recursive: true });
    } else {
      throw error;
    }
  }
};

/**
 * Get file information
 * @param {string} filePath - Path to file
 * @returns {Promise<object>} File information
 */
const getFileInfo = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return {
      path: filePath,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    };
  } catch (error) {
    throw new Error(`Failed to get file info for ${filePath}: ${error.message}`);
  }
};

module.exports = {
  deleteFile,
  deleteFiles,
  ensureDirectoryExists,
  getFileInfo
};