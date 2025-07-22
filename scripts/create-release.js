#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 读取 package.json 获取版本号
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const version = packageJson.version
const tagName = `v${version}`

console.log(`🚀 Creating release for version ${version}`)

// GitHub Actions 需要的核心文件列表
const requiredFiles = [
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'tsconfig.node.json',
  'tsconfig.web.json',
  'electron.vite.config.ts',
  'electron-builder.yml',
  'eslint.config.mjs',
  '.prettierrc.yaml',
  '.prettierignore',
  'src/',
  '.github/',
  'scripts/',
  '.gitignore',
  '.gitattributes',
  'README.md'
]

function addRequiredFiles() {
  console.log('📁 Adding required files for GitHub Actions...')

  // 只添加必要的文件
  requiredFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      try {
        execSync(`git add "${file}"`, { stdio: 'pipe' })
        console.log(`✅ Added: ${file}`)
      } catch (error) {
        console.log(`⚠️  Could not add: ${file}`)
      }
    }
  })
}

try {
  // 检查是否有未提交的更改
  try {
    execSync('git diff --exit-code', { stdio: 'pipe' })
    execSync('git diff --cached --exit-code', { stdio: 'pipe' })
    console.log('✅ No uncommitted changes found')
  } catch (error) {
    console.log('📝 Found uncommitted changes, adding required files...')
    addRequiredFiles()

    // 检查是否有文件被添加到暂存区
    try {
      const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
      if (stagedFiles.trim()) {
        execSync(`git commit -m "release: v${version}"`, { stdio: 'inherit' })
        console.log('✅ Committed required files')
      } else {
        console.log('ℹ️  No required files to commit')
      }
    } catch (commitError) {
      console.log('⚠️  Nothing to commit')
    }
  }

  // 检查标签是否已存在
  try {
    execSync(`git rev-parse ${tagName}`, { stdio: 'pipe' })
    console.log(`⚠️  Tag ${tagName} already exists, deleting it...`)
    execSync(`git tag -d ${tagName}`, { stdio: 'inherit' })
  } catch (error) {
    // 标签不存在，这是正常的
  }

  // 创建新标签
  console.log(`🏷️  Creating tag ${tagName}...`)
  execSync(`git tag -a ${tagName} -m "Release ${version}"`, { stdio: 'inherit' })

  // 推送代码和标签
  console.log('📤 Preparing to push to GitHub...')

  // 获取当前分支名
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim()
  console.log(`📤 Current branch: ${currentBranch}`)

  // 检查远程默认分支
  try {
    const remoteHead = execSync('git ls-remote --symref origin HEAD', { encoding: 'utf8' })
    const defaultBranch = remoteHead.match(/ref: refs\/heads\/(\w+)/)?.[1] || 'main'
    console.log(`📤 Remote default branch: ${defaultBranch}`)

    // 如果当前分支与远程默认分支不同，给出提示
    if (currentBranch !== defaultBranch) {
      console.log(
        `⚠️  Warning: Local branch '${currentBranch}' differs from remote default '${defaultBranch}'`
      )
      console.log(`📤 Will push to current branch: ${currentBranch}`)
    }
  } catch {
    console.log('⚠️  Could not determine remote default branch, using current branch')
  }

  // 先拉取远程更改
  console.log('📥 Fetching remote changes...')
  try {
    execSync('git fetch origin', { stdio: 'pipe' })
    console.log('✅ Fetch completed')

    // 检查是否需要合并
    try {
      const status = execSync(`git status --porcelain -b`, { encoding: 'utf8' })
      if (status.includes('behind')) {
        console.log('📥 Remote has new commits, pulling changes...')
        execSync(`git pull origin ${currentBranch}`, { stdio: 'inherit' })
      }
    } catch (pullError) {
      console.log('⚠️  Could not pull automatically, you may need to resolve conflicts manually')
      console.log('💡 Try running: git pull origin ' + currentBranch)
      throw pullError
    }
  } catch {
    console.log('⚠️  Network error: Could not fetch remote changes')
    console.log('🔄 Attempting to push without fetch...')
    console.log('💡 If push fails, check your network connection and try again')
    // 不抛出错误，继续尝试推送
  }

  // 推送代码和标签
  console.log('📤 Pushing to GitHub...')
  try {
    execSync(`git push origin ${currentBranch}`, { stdio: 'inherit' })
    console.log('✅ Branch pushed successfully')

    execSync(`git push origin ${tagName}`, { stdio: 'inherit' })
    console.log('✅ Tag pushed successfully')
  } catch (pushError) {
    console.log('❌ Push failed.')

    // 检查是否是网络问题
    if (
      pushError.message.includes('unable to access') ||
      pushError.message.includes('Failed to connect') ||
      pushError.message.includes('Connection was reset')
    ) {
      console.log('🌐 Network connection issue detected')
      console.log('💡 Please check your internet connection and try again')
      console.log('💡 You can also try using a VPN or different network')
    } else if (
      pushError.message.includes('non-fast-forward') ||
      pushError.message.includes('fetch first')
    ) {
      console.log('🔄 Remote has newer commits')
      console.log('💡 Try running: git pull origin ' + currentBranch)
    } else if (pushError.message.includes('already exists')) {
      console.log('🏷️  Tag already exists on remote')
      console.log('💡 Delete remote tag first: git push origin --delete ' + tagName)
    }

    throw pushError
  }

  console.log('✅ Release created successfully!')
  console.log(`🔗 GitHub Actions will automatically build and publish the release.`)
  console.log(`📦 Check the Actions tab: https://github.com/ccrc001/diy-electron-doro/actions`)
  console.log('')
  console.log('📋 Files pushed to GitHub:')
  requiredFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      console.log(`   ✓ ${file}`)
    }
  })
} catch (error) {
  console.error('❌ Error creating release:', error.message)
  process.exit(1)
}
