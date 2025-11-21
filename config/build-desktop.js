#!/usr/bin/env node

/**
 * Build script for LibreChat Desktop Application
 * This script orchestrates the entire build process:
 * 1. Builds all packages
 * 2. Builds the frontend
 * 3. Packages the Electron app for macOS
 */

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, args, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    log(`\n${colors.blue}► Running: ${command} ${args.join(' ')}${colors.reset}`, colors.blue);

    const proc = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true,
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        resolve();
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

async function checkPrerequisites() {
  log('\n📋 Checking prerequisites...', colors.bright);

  // Check if node_modules exists
  if (!fs.existsSync(path.join(__dirname, '..', 'node_modules'))) {
    log('⚠️  node_modules not found. Please run "npm install" first.', colors.yellow);
    process.exit(1);
  }

  // Detect architecture
  const arch = os.arch();
  const platform = os.platform();

  log(`Platform: ${platform}`, colors.blue);
  log(`Architecture: ${arch}`, colors.blue);

  if (platform !== 'darwin') {
    log('⚠️  Warning: This script is optimized for macOS. Building may not work on other platforms.', colors.yellow);
  }

  return { arch, platform };
}

async function buildPackages() {
  log('\n📦 Building packages...', colors.bright);

  const rootDir = path.join(__dirname, '..');

  try {
    await runCommand('npm', ['run', 'build:packages'], rootDir);
    log('✅ Packages built successfully', colors.green);
  } catch (error) {
    log('❌ Failed to build packages', colors.red);
    throw error;
  }
}

async function buildFrontend() {
  log('\n🎨 Building frontend...', colors.bright);

  const rootDir = path.join(__dirname, '..');

  try {
    await runCommand('npm', ['run', 'build:client'], rootDir);
    log('✅ Frontend built successfully', colors.green);
  } catch (error) {
    log('❌ Failed to build frontend', colors.red);
    throw error;
  }
}

async function installDesktopDependencies() {
  log('\n📥 Installing desktop dependencies...', colors.bright);

  const desktopDir = path.join(__dirname, '..', 'desktop');
  const nodeModulesDir = path.join(desktopDir, 'node_modules');

  // Check if dependencies are already installed
  if (fs.existsSync(nodeModulesDir)) {
    log('✅ Desktop dependencies already installed (skipping)', colors.green);
    return;
  }

  try {
    // Install with ELECTRON_SKIP_BINARY_DOWNLOAD to avoid download issues
    // electron-builder will download Electron when needed
    const env = {
      ...process.env,
      ELECTRON_SKIP_BINARY_DOWNLOAD: '1',
    };

    const proc = spawn('npm', ['install', '--no-optional'], {
      cwd: desktopDir,
      stdio: 'inherit',
      shell: true,
      env,
    });

    await new Promise((resolve, reject) => {
      proc.on('close', (code) => {
        if (code !== 0) {
          // Non-fatal error - electron-builder can handle it
          log('⚠️  Some dependencies may not be installed, but continuing...', colors.yellow);
          log('   electron-builder will download Electron during build', colors.blue);
          resolve();
        } else {
          log('✅ Desktop dependencies installed', colors.green);
          resolve();
        }
      });

      proc.on('error', (err) => {
        log('⚠️  Error installing dependencies, but continuing...', colors.yellow);
        log(`   ${err.message}`, colors.yellow);
        resolve(); // Don't fail the build
      });
    });
  } catch (error) {
    log('⚠️  Failed to install desktop dependencies, but continuing...', colors.yellow);
    log('   electron-builder will download necessary files during build', colors.blue);
    // Don't throw - let electron-builder handle it
  }
}

async function buildElectronApp(arch) {
  log('\n🖥️  Building Electron app...', colors.bright);

  const desktopDir = path.join(__dirname, '..', 'desktop');

  // Determine target architecture
  let target = '--arm64'; // Default to Apple Silicon

  if (process.argv.includes('--x64')) {
    target = '--x64';
  } else if (process.argv.includes('--universal')) {
    target = '--universal';
  } else if (arch === 'x64') {
    log('Detected x64 architecture, building for x64', colors.yellow);
    target = '--x64';
  }

  try {
    await runCommand(
      'npx',
      ['electron-builder', '--mac', target, '--config', 'electron-builder.config.js'],
      desktopDir
    );
    log('✅ Electron app built successfully', colors.green);
  } catch (error) {
    log('❌ Failed to build Electron app', colors.red);
    throw error;
  }
}

async function showBuildInfo() {
  const distDir = path.join(__dirname, '..', 'dist-desktop');

  if (fs.existsSync(distDir)) {
    log('\n📂 Build output:', colors.bright);
    log(`   ${distDir}`, colors.blue);

    const files = fs.readdirSync(distDir);
    const dmgFiles = files.filter(f => f.endsWith('.dmg'));

    if (dmgFiles.length > 0) {
      log('\n📀 DMG files created:', colors.green);
      dmgFiles.forEach(file => {
        const filePath = path.join(distDir, file);
        const stats = fs.statSync(filePath);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        log(`   • ${file} (${sizeMB} MB)`, colors.blue);
      });
    }
  }
}

async function main() {
  const startTime = Date.now();

  log('\n╔════════════════════════════════════════════╗', colors.bright);
  log('║   LibreChat Desktop Build Script          ║', colors.bright);
  log('╚════════════════════════════════════════════╝', colors.bright);

  try {
    // Check prerequisites
    const { arch } = await checkPrerequisites();

    // Build steps
    await buildPackages();
    await buildFrontend();
    await installDesktopDependencies();
    await buildElectronApp(arch);

    // Show build info
    await showBuildInfo();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    log('\n╔════════════════════════════════════════════╗', colors.green);
    log('║   ✅ Build completed successfully!        ║', colors.green);
    log(`║   ⏱️  Time: ${duration}s${' '.repeat(30 - duration.length)}║`, colors.green);
    log('╚════════════════════════════════════════════╝', colors.green);

    log('\n💡 Next steps:', colors.bright);
    log('   1. Find your DMG in the dist-desktop/ folder', colors.blue);
    log('   2. Double-click to mount the DMG', colors.blue);
    log('   3. Drag LibreChat to Applications', colors.blue);
    log('   4. Launch LibreChat from Applications', colors.blue);

  } catch (error) {
    log('\n❌ Build failed:', colors.red);
    log(error.message, colors.red);
    process.exit(1);
  }
}

// Run the build
main();
