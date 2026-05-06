import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { access } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const outputDir = join(root, 'previews');
const screenshotPath = join(outputDir, 'google-home.png');
const url = 'http://127.0.0.1:4173/index.html';
const browserCandidates = [
  process.env.GOOGLE_CHROME,
  'google-chrome',
  'google-chrome-stable',
  'chromium',
  'chromium-browser',
].filter(Boolean);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function commandExists(command) {
  const paths = (process.env.PATH || '').split(':');
  for (const path of paths) {
    try {
      await access(join(path, command));
      return command;
    } catch {}
  }
  return null;
}

async function findBrowser() {
  for (const candidate of browserCandidates) {
    if (candidate.includes('/')) {
      if (existsSync(candidate)) return candidate;
      continue;
    }
    const found = await commandExists(candidate);
    if (found) return found;
  }
  return null;
}

function startServer() {
  const server = spawn('python3', ['-m', 'http.server', '4173'], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return server;
}

async function main() {
  mkdirSync(outputDir, { recursive: true });
  const browser = await findBrowser();
  if (!browser) {
    console.log('╭─ Google 浏览器预览');
    console.log('│ ⚠ 未检测到 google-chrome / chromium，请先安装 Google Chrome 后重试。');
    console.log(`│   预览地址：${url}`);
    console.log('╰─ npm run start 后手动打开以上地址');
    process.exitCode = 1;
    return;
  }

  const server = startServer();
  await wait(800);

  const args = [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=1440,1100',
    `--screenshot=${screenshotPath}`,
    url,
  ];
  const browserRun = spawn(browser, args, { stdio: 'inherit' });

  browserRun.on('close', (code) => {
    server.kill('SIGTERM');
    console.log('╭─ Google 浏览器预览');
    console.log(`│ server   ${url}`);
    console.log(`│ browser  ${browser}`);
    console.log(`│ capture  ${screenshotPath}`);
    console.log(`│ status   ${code === 0 ? '预览完成 ✓' : `预览失败，退出码 ${code}`}`);
    console.log('╰────────────────────────');
    process.exitCode = code ?? 1;
  });
}

main();
