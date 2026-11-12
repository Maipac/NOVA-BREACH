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
const inputtest = args.includes('--inputtest');
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
    query.demo = (args.includes('--menu') || inputtest) ? '0' : '1';
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

  if (autotest && inputtest) {
    // real input events through Chromium (no autopilot): click to start, walk, switch weapon, fire, pause
    const wc = win.webContents;
    const state = () => wc.executeJavaScript('JSON.stringify(window.__nova.debugState())');
    const key = (keyCode, type) => wc.sendInputEvent({ type, keyCode });
    const click = (type) => wc.sendInputEvent({ type, x: 800, y: 450, button: 'left', clickCount: 1 });
    const step = (ms, fn) => new Promise((r) => setTimeout(() => { fn(); r(); }, ms));
    (async () => {
      await step(4000, () => {});
      console.log('t0 ', await state());
      await step(100, () => click('mouseDown'));
      await step(80, () => click('mouseUp'));
      await step(600, () => {});
      console.log('started', await state());
      await step(50, () => key('W', 'keyDown'));
      await step(1500, () => key('W', 'keyUp'));
      console.log('walked', await state());
      await step(50, () => key('3', 'keyDown'));
      await step(60, () => key('3', 'keyUp'));
      await step(700, () => {});
      console.log('weapon3', await state());
      await step(50, () => click('mouseDown'));
      await step(120, () => click('mouseUp'));
      await step(300, () => {});
      console.log('fired', await state());
      await step(50, () => wc.sendInputEvent({ type: 'mouseWheel', x: 800, y: 450, deltaX: 0, deltaY: -120 }));
      await step(500, () => {});
      console.log('wheel', await state());
      await step(50, () => key('Escape', 'keyDown'));
      await step(60, () => key('Escape', 'keyUp'));
      await step(400, () => {});
      console.log('esc', await state());
      const img = await wc.capturePage();
      fs.writeFileSync(autotest, img.toPNG());
      app.exit(0);
    })().catch((e) => { console.log('inputtest failed', String(e)); app.exit(1); });
  } else if (autotest) {
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
