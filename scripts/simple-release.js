#!/usr/bin/env node

// 简化版发布脚本 - 用于网络不稳定的情况
const { execSync } = require('child_process')
const fs = require('fs')

// 读取 package.json 获取版本号
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const version = packageJson.version
const tagName = `v${version}`

console.log(`🚀 Simple release for version ${version}`)

try {
  // 检查是否有未提交的更改
  try {
    execSync('git diff --exit-code', { stdio: 'pipe' })
    execSync('git diff --cached --exit-code', { stdio: 'pipe' })
    console.log('✅ No uncommitted changes found')
  } catch {
    console.log('📝 Found uncommitted changes, committing them...')
    execSync('git add .', { stdio: 'inherit' })
    execSync(`git commit -m "release: v${version}"`, { stdio: 'inherit' })
  }

  // 检查标签是否已存在
  try {
    execSync(`git rev-parse ${tagName}`, { stdio: 'pipe' })
    console.log(`⚠️  Tag ${tagName} already exists, deleting it...`)
    execSync(`git tag -d ${tagName}`, { stdio: 'inherit' })
  } catch {
    // 标签不存在，这是正常的
  }

  // 创建新标签
  console.log(`🏷️  Creating tag ${tagName}...`)
  execSync(`git tag -a ${tagName} -m "Release ${version}"`, { stdio: 'inherit' })

  // 获取当前分支名
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim()
  console.log(`📤 Current branch: ${currentBranch}`)

  // 简单推送（不进行 fetch 检查）
  console.log('📤 Pushing to GitHub (simple mode)...')

  // 尝试推送分支
  try {
    execSync(`git push origin ${currentBranch}`, { stdio: 'inherit' })
    console.log('✅ Branch pushed successfully')
  } catch (error) {
    console.log('❌ Branch push failed')
    if (error.message.includes('unable to access') || error.message.includes('Failed to connect')) {
      console.log('🌐 Network connection issue detected')
      console.log('💡 Please check your internet connection and try again')
    }
    throw error
  }

  // 尝试推送标签
  try {
    execSync(`git push origin ${tagName}`, { stdio: 'inherit' })
    console.log('✅ Tag pushed successfully')
  } catch (error) {
    console.log('❌ Tag push failed')
    if (error.message.includes('already exists')) {
      console.log('🏷️  Tag already exists on remote')
      console.log('💡 Delete remote tag first: git push origin --delete ' + tagName)
    }
    throw error
  }

  console.log('✅ Release created successfully!')
  console.log(`🔗 GitHub Actions will automatically build and publish the release.`)
  console.log(`📦 Check the Actions tab: https://github.com/ccrc001/diy-electron-doro/actions`)
} catch (error) {
  console.error('❌ Error creating release:', error.message)
  console.log('')
  console.log('💡 Troubleshooting tips:')
  console.log('   - Check your internet connection')
  console.log('   - Try using a VPN or different network')
  console.log('   - Wait a moment and try again')
  console.log('   - Use: npm run simple-release')
  process.exit(1)
}
