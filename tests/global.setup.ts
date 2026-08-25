import { chromium, FullConfig } from '@playwright/test';
import { loginUser, cleanAllUserPostsAndDrafts } from './utils/cleanup';

/**
 * 🚀 Playwright Global Setup:
 * รันอัตโนมัติ 1 ครั้งก่อนเริ่มต้นรันการทดสอบทั้งหมดใน Test Suite
 * เพื่อล้างข้อมูลเก่าทั้งหมด คืนสถานะ Clean State 100%
 */
async function globalSetup(config: FullConfig) {
  console.log('\n======================================================');
  console.log('🚀 [Global Setup] เริ่มต้นเคลียร์สถานะระบบก่อนเริ่มการทดสอบ...');
  console.log('======================================================');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await loginUser(page);
    await cleanAllUserPostsAndDrafts(page);
    console.log('✅ [Global Setup] เคลียร์โพสต์และแบบร่างเดิมทั้งหมดเรียบร้อย พร้อมเริ่มรันชุดทดสอบ!\n');
  } catch (error) {
    console.error('⚠️ [Global Setup] เกิดข้อผิดพลาด:', error);
  } finally {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

export default globalSetup;
