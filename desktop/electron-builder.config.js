/**
 * Electron Builder configuration for LibreChat Desktop
 * @see https://www.electron.build/configuration/configuration
 */

module.exports = {
  appId: 'ai.librechat.desktop',
  productName: 'LibreChat',
  copyright: 'Copyright © 2025 LibreChat',
  electronVersion: '32.2.8',

  directories: {
    app: '..',  // Point to parent directory (project root) where all files are
    output: 'dist-desktop',
    buildResources: 'desktop/build',
  },

  files: [
    'main.js',
    'preload.js',
    'loading.html',
    '../api/**/*',
    '../client/dist/**/*',
    '../packages/**/*',
    '!../packages/**/node_modules',
    '!../packages/**/src',
    '!../packages/**/*.ts',
    '!../packages/**/*.map',
    '../node_modules/**/*',
    '../package.json',
    '../.env.example',
    '../librechat.example.yaml',
  ],

  extraResources: [
    {
      from: '../.env.example',
      to: '.env.example',
    },
    {
      from: '../librechat.example.yaml',
      to: 'librechat.example.yaml',
    },
  ],

  // macOS specific configuration
  mac: {
    target: [
      {
        target: 'dmg',
        arch: ['arm64', 'x64'],
      },
    ],
    category: 'public.app-category.productivity',
    // icon: 'build/icon.icns', // Commented out - using default Electron icon
    darkModeSupport: true,
    hardenedRuntime: false,
    gatekeeperAssess: false,
    entitlements: 'build/entitlements.mac.plist',
    entitlementsInherit: 'build/entitlements.mac.plist',
    minimumSystemVersion: '10.15.0',
    type: 'distribution',
    identity: null, // Disable code signing
  },

  // DMG configuration
  dmg: {
    contents: [
      {
        x: 130,
        y: 220,
      },
      {
        x: 410,
        y: 220,
        type: 'link',
        path: '/Applications',
      },
    ],
    // icon: 'build/icon.icns', // Commented out - using default Electron icon
    iconSize: 128,
    title: 'Install LibreChat',
    window: {
      width: 540,
      height: 400,
    },
    backgroundColor: '#ffffff',
    sign: false,
  },

  // Windows configuration (for future)
  win: {
    target: ['nsis'],
    // icon: 'build/icon.ico', // Commented out - using default Electron icon
  },

  // Linux configuration (for future)
  linux: {
    target: ['AppImage', 'deb'],
    // icon: 'build/icon.png', // Commented out - using default Electron icon
    category: 'Office',
  },

  // Compression
  compression: 'maximum',

  // Asar archive
  asar: true,
  asarUnpack: [
    '**/node_modules/sharp/**/*',
    '**/node_modules/@img/**/*',
  ],

  // Publish configuration (optional - for auto-updates)
  publish: null,
};
