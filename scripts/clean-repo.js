#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning repository for GitHub Actions...');

// 需要从 Git 历史中移除的文件/目录
const filesToRemove = [
  'docs/',
  'resources/',
  'build/icons/',
  'build/entitlements.mac.plist',
  'upload-missing-assets.ps1'
];

// 检查文件是否在 Git 中被跟踪
function isTracked(filePath) {
  try {
    execSync(`git ls-files --error-unmatch "${filePath}"`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

try {
  console.log('📋 Checking files to remove from Git tracking...');
  
  let hasChanges = false;
  
  filesToRemove.forEach(file => {
    if (isTracked(file)) {
      console.log(`🗑️  Removing from Git: ${file}`);
      try {
        execSync(`git rm -r --cached "${file}"`, { stdio: 'pipe' });
        hasChanges = true;
      } catch (error) {
        console.log(`⚠️  Could not remove: ${file}`);
      }
    } else {
      console.log(`ℹ️  Not tracked: ${file}`);
    }
  });
  
  if (hasChanges) {
    console.log('💾 Committing changes...');
    execSync('git commit -m "chore: remove unnecessary files from Git tracking"', { stdio: 'inherit' });
    console.log('✅ Repository cleaned successfully!');
  } else {
    console.log('✅ Repository is already clean!');
  }
  
  console.log('');
  console.log('📝 Current .gitignore will prevent these files from being tracked in the future.');
  console.log('🚀 You can now run: npm run create-release');
  
} catch (error) {
  console.error('❌ Error cleaning repository:', error.message);
  process.exit(1);
}
