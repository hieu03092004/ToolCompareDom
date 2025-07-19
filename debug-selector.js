const puppeteer = require('puppeteer-core');

async function debugModules(url) {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: false, // Show browser để debug
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log(`🔍 Đang load: ${url}`);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
  
  // Chờ và cuộn trang để load hết content
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 500));
    }
    window.scrollTo(0, 0);
  });
  
  await new Promise(r => setTimeout(r, 3000));
  
  // Kiểm tra tất cả các selector có thể
  const selectors = [
    'div[class*="mod_"]',
    'div[class*="mod"]', 
    '[class*="mod"]',
    'div[data-s3-module]',
    '.mod_column',
    '.mod_hero',
    '.mod_index'
  ];
  
  for (const selector of selectors) {
    try {
      const elements = await page.$$(selector);
      console.log(`\n📊 Selector: "${selector}" → Tìm thấy ${elements.length} elements`);
      
      if (elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
          const className = await elements[i].evaluate(el => el.className);
          const tagName = await elements[i].evaluate(el => el.tagName);
          console.log(`  ${i + 1}. ${tagName}.${className}`);
        }
      }
    } catch (error) {
      console.log(`❌ Selector "${selector}" failed: ${error.message}`);
    }
  }
  
  // Kiểm tra cụ thể mod_column
  try {
    const columnElements = await page.$$('div[class*="mod_column"]');
    console.log(`\n🔍 Cụ thể mod_column: ${columnElements.length} elements`);
    
    for (let i = 0; i < columnElements.length; i++) {
      const outerHTML = await columnElements[i].evaluate(el => el.outerHTML.substring(0, 200));
      console.log(`  ${i + 1}. ${outerHTML}...`);
    }
  } catch (error) {
    console.log(`❌ mod_column check failed: ${error.message}`);
  }

  await browser.close();
}

// Test với URL hiện tại
debugModules('https://www.nybgplasticsurgery.com/breast/gender-affirmation-top-surgery/'); 