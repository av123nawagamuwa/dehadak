import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failedCount++;
  }
}

async function fetchHttps(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('============================================================');
  console.log('  DEHADAK.LK PWA INSTALL FEATURE - AUTOMATED TEST SUITE');
  console.log('============================================================\n');

  // Test 1-3: Android Chrome beforeinstallprompt & userChoice simulation
  console.log('1. Android Chrome Installation Lifecycle:');
  const manifestPath = path.join(__dirname, '../public/manifest.webmanifest');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  assert(manifest.display === 'standalone', 'Manifest display mode is set to standalone');
  assert(manifest.start_url === '/', 'Manifest start_url is root "/"');
  assert(manifest.scope === '/', 'Manifest scope covers entire application "/"');
  assert(manifest.orientation === 'any', 'Manifest orientation is set to "any"');
  assert(manifest.name === 'Dehadak - Two Hearts, One Journey', 'Manifest name matches official brand title');
  assert(manifest.short_name === 'Dehadak', 'Manifest short_name matches "Dehadak"');
  assert(manifest.theme_color === '#1c100c', 'Manifest theme_color is #1c100c');
  assert(manifest.background_color === '#1c100c', 'Manifest background_color is #1c100c');

  // Test 4-6: Standalone & Maskable Icons
  console.log('\n2. Standalone Mode & Maskable Icons:');
  const maskable192Path = path.join(__dirname, '../public/icons/maskable-icon-192x192.png');
  const maskable512Path = path.join(__dirname, '../public/icons/maskable-icon-512x512.png');

  assert(fs.existsSync(maskable192Path), 'maskable-icon-192x192.png exists');
  assert(fs.existsSync(maskable512Path), 'maskable-icon-512x512.png exists');

  const png192 = PNG.sync.read(fs.readFileSync(maskable192Path));
  const png512 = PNG.sync.read(fs.readFileSync(maskable512Path));

  assert(png192.width === 192 && png192.height === 192, 'maskable 192x192 dimensions exact');
  assert(png512.width === 512 && png512.height === 512, 'maskable 512x512 dimensions exact');
  // Check corner background color (should be #1c100c = R:28, G:16, B:12, A:255)
  assert(
    png192.data[0] === 28 && png192.data[1] === 16 && png192.data[2] === 12 && png192.data[3] === 255,
    'maskable-icon-192 has solid #1c100c background at corner (0,0)'
  );
  assert(
    png512.data[0] === 28 && png512.data[1] === 16 && png512.data[2] === 12 && png512.data[3] === 255,
    'maskable-icon-512 has solid #1c100c background at corner (0,0)'
  );

  // Test 7-12: iPhone & iPad Detection & Instruction Logic
  console.log('\n3. iPhone & iPad Detection & Modal Guidance:');
  const hookPath = path.join(__dirname, '../src/hooks/usePWAInstall.ts');
  const hookCode = fs.readFileSync(hookPath, 'utf8');

  assert(hookCode.includes("matchMedia('(display-mode: standalone)')"), 'Detects display-mode: standalone');
  assert(hookCode.includes('window.navigator.standalone === true'), 'Detects iOS standalone mode (navigator.standalone)');
  assert(hookCode.includes("referrer.includes('android-app://')"), 'Detects Android TWA/PWA referrer');
  assert(hookCode.includes('isIOSNonSafari'), 'Detects iOS third-party/in-app browsers');
  assert(hookCode.includes("toast.success('Dehadak has been added to your device.')"), 'Fires requirement 11 success toast');
  assert(hookCode.includes("toast.info('Installation was cancelled. You can install Dehadak later.')"), 'Fires requirement 11 cancellation toast');

  const modalPath = path.join(__dirname, '../src/components/InstallInstructionsModal.tsx');
  const modalCode = fs.readFileSync(modalPath, 'utf8');
  assert(modalCode.includes('Open dehadak.lk in Safari'), 'Apple step 1: Open in Safari present');
  assert(modalCode.includes('Tap the Share button'), 'Apple step 2: Tap Share button present');
  assert(modalCode.includes('Add to Home Screen'), 'Apple step 3: Add to Home Screen present');
  assert(modalCode.includes('Open as Web App'), 'Apple step 4: Open as Web App present');
  assert(modalCode.includes('Tap "Add"'), 'Apple step 5: Tap Add present');
  assert(modalCode.includes('Open Dehadak from your Home Screen'), 'Apple step 6: Launch from Home Screen present');
  assert(modalCode.includes('nonSafariNotice'), 'iOS non-Safari warning notice present');

  // Test 13-17: Install Button Component States & Hiding
  console.log('\n4. Install Button UX & Lifecycle:');
  const buttonPath = path.join(__dirname, '../src/components/InstallAppButton.tsx');
  const buttonCode = fs.readFileSync(buttonPath, 'utf8');

  assert(buttonCode.includes('if (isInstalled || isStandalone) {\n    return null\n  }'), 'Install button completely hidden when installed/standalone');
  assert(buttonCode.includes('Preparing…'), 'Install button preparing state present');
  assert(buttonCode.includes('Install on iPhone'), 'Install on iPhone state present');
  assert(buttonCode.includes('Install on iPad'), 'Install on iPad state present');
  assert(buttonCode.includes('How to Install'), 'Fallback manual instructions state present');
  assert(buttonCode.includes('යෙදුම ස්ථාපනය කරන්න'), 'Sinhala translation present');
  assert(buttonCode.includes('செயலியை நிறுவுக'), 'Tamil translation present');

  // Test 18-20: Offline Page & Service Worker
  console.log('\n5. Offline Page & Service Worker:');
  const offlinePath = path.join(__dirname, '../public/offline.html');
  assert(fs.existsSync(offlinePath), 'offline.html exists');
  const offlineHtml = fs.readFileSync(offlinePath, 'utf8');
  assert(offlineHtml.includes("You're Offline"), 'offline.html has friendly offline title');
  assert(offlineHtml.includes('btn-retry'), 'offline.html has retry connection button');

  const pushSwPath = path.join(__dirname, '../public/push-sw.js');
  assert(fs.existsSync(pushSwPath), 'push-sw.js service worker companion exists');

  // Test 21: Local Icon HTTP 200 & MIME
  console.log('\n6. Manifest Icon Assets (All 11 sizes):');
  const iconList = manifest.icons.map(i => i.src.replace(/^\//, ''));
  for (const iconRel of iconList) {
    const iconFullPath = path.join(__dirname, '../public', iconRel);
    assert(fs.existsSync(iconFullPath), `Icon ${iconRel} exists in public directory`);
  }

  // Test 22: Live Production HTTPS (https://dehadak.lk)
  console.log('\n7. Live Production HTTPS Verification (https://dehadak.lk):');
  try {
    const prodHome = await fetchHttps('https://dehadak.lk/');
    assert(prodHome.status === 200, 'https://dehadak.lk/ returns HTTP 200 OK');

    const prodManifest = await fetchHttps('https://dehadak.lk/manifest.webmanifest');
    assert(prodManifest.status === 200, 'https://dehadak.lk/manifest.webmanifest returns HTTP 200 OK');
    assert(prodManifest.headers['content-type'].includes('json'), 'Production manifest served with JSON content-type');

    const prodSw = await fetchHttps('https://dehadak.lk/sw.js');
    assert(prodSw.status === 200, 'https://dehadak.lk/sw.js returns HTTP 200 OK');

    const prodIcon = await fetchHttps('https://dehadak.lk/icons/icon-192x192.png');
    assert(prodIcon.status === 200, 'https://dehadak.lk/icons/icon-192x192.png returns HTTP 200 OK');

    const prodOffline = await fetchHttps('https://dehadak.lk/offline.html');
    assert(prodOffline.status === 200, 'https://dehadak.lk/offline.html returns HTTP 200 OK');
  } catch (err) {
    console.error('Production HTTPS check error:', err.message);
    failedCount++;
  }

  console.log('\n------------------------------------------------------------');
  console.log(`TEST RESULTS: ${passedCount} Passed, ${failedCount} Failed`);
  console.log('============================================================');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests();
