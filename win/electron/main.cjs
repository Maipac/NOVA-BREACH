// Electron shell for NOVA BREACH.
//   electron .                      -> fullscreen game
//   electron . --windowed           -> windowed game
//   electron . --autotest out.png [--wave N] [--at seconds] [--mortal] [--menu] [--query "a=b&c=d"]
//       hidden window, autopilot plays, one screenshot is written, game state is printed, app exits.
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(1);
const argValue = (name) => { const i = args.indexOf(name); return i >= 0 && i + 1 < args.length ? args[i + 1] : null; };
const autotest = argValue('--autotest');
const windowed = args.includes('--windowed') || !!autotest;

app.commandLine.appendSwitch('force_high_performance_gpu');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
if (autotest) {
  app.commandLine.appendSwitch('disable-renderer-backgrounding');
  app.commandLine.appendSwitch('disable-background-timer-throttling');
  app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 960,
    minHeight: 600,
    show: !autotest,
    fullscreen: !windowed,
    backgroundColor: '#000000',
    autoHideMenuBar: true,
    title: 'NOVA BREACH',
    icon: path.join(__dirname, '../app/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
    },
  });
  if (process.platform !== 'darwin') win.setMenu(null);

  const query = {};
  if (autotest) {
    query.demo = args.includes('--menu') ? '0' : '1';
    query.mute = '1';
    query.autotest = '1';
    if (argValue('--wave')) query.wave = argValue('--wave');
    if (args.includes('--mortal')) query.mortal = '1';
    for (const kv of (argValue('--query') || '').split('&')) {
      const [k, v] = kv.split('=');
      if (k) query[k] = v ?? '1';
    }
  }
  win.loadFile(path.join(__dirname, '../app/index.html'), { query });

  ipcMain.on('nova:toggle-fullscreen', () => win.setFullScreen(!win.isFullScreen()));
  ipcMain.on('nova:quit', () => app.quit());

  if (autotest) {
    const at = Number(argValue('--at') || 12);
    win.webContents.on('console-message', (e) => {
      if (e.level === 'error' || e.level === 'warning') console.log(`[renderer ${e.level}] ${e.message} (${path.basename(e.sourceId || '')}:${e.lineNumber})`);
    });
    win.webContents.on('render-process-gone', (_e, d) => { console.log('renderer gone', d.reason); app.exit(2); });
    setTimeout(async () => {
      try {
        const img = await win.webContents.capturePage();
        fs.writeFileSync(autotest, img.toPNG());
        const state = await win.webContents.executeJavaScript('JSON.stringify(window.__nova && window.__nova.debugState ? window.__nova.debugState() : null)');
        console.log('autotest state', state);
        const size = img.getSize();
        console.log(`autotest ok ${size.width}x${size.height} -> ${autotest}`);
      } catch (err) {
        console.log('autotest failed', String(err));
        app.exit(1);
        return;
      }
      app.exit(0);
    }, at * 1000);
  }
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
