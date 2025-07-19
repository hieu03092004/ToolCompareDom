const puppeteer = require('puppeteer-core');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

(async () => {
  // 1. Khởi Puppeteer
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // 2. Giả lập desktop
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) ' +
    'Chrome/114.0.0.0 Safari/537.36'
  );

  console.log('Đang mở trang...');
  await page.goto('https://www.nybgplasticsurgery.com/', {
    waitUntil: 'networkidle2',
    timeout: 0
  });
  console.log('Trang đã load (networkidle2)');

  // 3. Cuộn trang để trigger lazy-load
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 500));
    }
    window.scrollTo(0, 0);
  });
  console.log('Đã cuộn hết trang');

  // 4. Chờ tĩnh thêm
  await new Promise(r => setTimeout(r, 5000));
  console.log('Chờ tĩnh 5s xong');

  // 5. Chụp fullpage vào buffer
  const fullBuffer = await page.screenshot({ fullPage: true });
  console.log('Đã chụp fullPage');

  // 6. Tìm tất cả div.class*="mod"
  await page.waitForSelector('div[class*="mod"]', { timeout: 60000 });
  const divs = await page.$$('div[class*="mod"]');
  console.log(`Tìm thấy ${divs.length} khối mod`);

  // 7. Duyệt từng div, lấy bounding box và crop
  for (let i = 0; i < divs.length; i++) {
    const el = divs[i];
    const box = await el.boundingBox();
    if (!box) continue;

    const { x, y, width, height } = box;

    // Crop và lưu bằng sharp
    const outPath = path.join(__dirname, `mod_block_${i + 1}.png`);
    await sharp(fullBuffer)
      .extract({
        left: Math.floor(x),
        top: Math.floor(y),
        width:  Math.ceil(width),
        height: Math.ceil(height)
      })
      .toFile(outPath);

    console.log(`✅ Đã crop và lưu: ${outPath}`);
  }

  await browser.close();
  console.log('Hoàn thành!');
})();
