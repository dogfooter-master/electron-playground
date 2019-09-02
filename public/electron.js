const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1152,
        height: 648,
        webPreferences: {
            nodeIntegration: true,
            webPreferences: {
                webSecurity: false
            }
        },
        resizable: true,
        // frame: false,
        title: "Pikabu",
        // transparent: true
    });
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`, {"extraHeaders" : "pragma: no-cache\n"});
    mainWindow.setMenuBarVisibility(false);
    // mainWindow.setIgnoreMouseEvents(true);
    if (isDev) {
        // Open the DevTools.
        //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
        mainWindow.webContents.openDevTools();
        mainWindow.maximize();
    }
    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});