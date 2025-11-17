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
    'desktop/main.js',
    'desktop/preload.js',
    'desktop/loading.html',
    'api/**/*',
    'client/dist/**/*',
    'packages/**/*',
    '!packages/**/node_modules',
    '!packages/**/src',
    '!packages/**/*.ts',
    '!packages/**/*.map',
    'node_modules/**/*',
    'package.json',
    '.env.example',
    'librechat.example.yaml',
  ],

  extraResources: [
    {
      from: '.env.example',
      to: '.env.example',
    },
    {
      from: 'librechat.example.yaml',
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
    icon: 'desktop/build/icon.icns',
    darkModeSupport: true,
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: 'desktop/build/entitlements.mac.plist',
    entitlementsInherit: 'desktop/build/entitlements.mac.plist',
    minimumSystemVersion: '10.15.0',
    type: 'distribution',
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
    icon: 'desktop/build/icon.icns',
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
    icon: 'desktop/build/icon.ico',
  },

  // Linux configuration (for future)
  linux: {
    target: ['AppImage', 'deb'],
    icon: 'desktop/build/icon.png',
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
