const { app, BrowserWindow, dialog } = require('electron')
const path = require('path')
const url = require('url')
const log = require('electron-log');
const { autoUpdater } = require("electron-updater");

log.transports.file.level = 'info';
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function sendStatusToWindow(text) {
  log.info(text);
}
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 1200, height: 800 })

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

    // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (ev, info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (ev, info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (ev, err) => {
  sendStatusToWindow('Error in auto-updater.');
  log.info(err);
})
autoUpdater.on('download-progress', (ev, progressObj) => {
  sendStatusToWindow('Download progress...');
})
autoUpdater.on('update-downloaded', (ev, info) => {
  sendStatusToWindow('Update downloaded; will install in 5 seconds');
});

autoUpdater.on('update-downloaded', (ev, info) => {
  var choice = dialog.showMessageBox(
    win,
    {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Update available',
        message: 'Do you want to restart your application now?'
    });

  if (choice === 0) {
    autoUpdater.quitAndInstall();
  }
})


app.on('ready', function () {
  log.info((new Date()).toString() + ' : App ready...');

  createWindow();

  autoUpdater.checkForUpdates();
});

app.on('window-all-closed', () => {
  app.quit();
});


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.