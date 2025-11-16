const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const { fork } = require('child_process');
const fs = require('fs');

let mainWindow;
let serverProcess;
const SERVER_PORT = 3080;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;

// Configuration paths
const isDev = process.env.NODE_ENV === 'development';
const resourcesPath = isDev
  ? path.join(__dirname, '..')
  : process.resourcesPath;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 10, y: 10 },
    backgroundColor: '#000000',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  });

  // Create application menu
  const template = [
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            await shell.openExternal('https://librechat.ai');
          },
        },
        {
          label: 'Documentation',
          click: async () => {
            await shell.openExternal('https://docs.librechat.ai');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Load the app - show loading screen first
  mainWindow.loadFile(path.join(__dirname, 'loading.html'));

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startBackendServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting LibreChat backend server...');

    const serverPath = isDev
      ? path.join(__dirname, '..', 'api', 'server', 'index.js')
      : path.join(resourcesPath, 'api', 'server', 'index.js');

    const envPath = isDev
      ? path.join(__dirname, '..', '.env')
      : path.join(resourcesPath, '.env');

    // Check if server file exists
    if (!fs.existsSync(serverPath)) {
      return reject(new Error(`Server file not found: ${serverPath}`));
    }

    // Start the Node.js backend process
    serverProcess = fork(serverPath, [], {
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: SERVER_PORT.toString(),
        HOST: 'localhost',
        // Add any other required environment variables
      },
      stdio: 'pipe',
    });

    serverProcess.stdout.on('data', (data) => {
      console.log(`Backend: ${data}`);
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`Backend Error: ${data}`);
    });

    serverProcess.on('error', (error) => {
      console.error('Failed to start backend server:', error);
      reject(error);
    });

    serverProcess.on('exit', (code, signal) => {
      console.log(`Backend server exited with code ${code} and signal ${signal}`);
      if (code !== 0 && code !== null) {
        reject(new Error(`Backend server exited with code ${code}`));
      }
    });

    // Wait for server to be ready
    let attempts = 0;
    const maxAttempts = 30;
    const checkServer = setInterval(async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/health`);
        if (response.ok) {
          clearInterval(checkServer);
          console.log('Backend server is ready!');
          resolve();
        }
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(checkServer);
          reject(new Error('Backend server failed to start within timeout'));
        }
      }
    }, 1000);
  });
}

async function initializeApp() {
  try {
    // Start backend server
    await startBackendServer();

    // Load the main application
    setTimeout(() => {
      mainWindow.loadURL(SERVER_URL);
    }, 1000);
  } catch (error) {
    console.error('Failed to initialize app:', error);

    dialog.showErrorBox(
      'Startup Error',
      `Failed to start LibreChat:\n\n${error.message}\n\nPlease check the logs and try again.`
    );

    app.quit();
  }
}

// App lifecycle events
app.whenReady().then(() => {
  createWindow();
  initializeApp();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // On macOS, keep app running until explicit quit
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Kill backend server when app quits
  if (serverProcess) {
    serverProcess.kill();
  }
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  dialog.showErrorBox('Unexpected Error', error.message);
});
