import { chromium, FullConfig } from '@playwright/test';
import { loginUser, cleanAllUserPostsAndDrafts } from './utils/cleanup';

/**
 * 🧹 Playwright Global Teardown:
 * รันอัตโนมัติ 1 ครั้งหลังจากการทดสอบทั้งหมดใน Test Suite สิ้นสุดลง
 * ไม่ว่าจะผ่านหรือพัง จะทำการเก็บกวาดโพสต์และแบบร่างทดสอบทิ้งทั้งหมดเสมอ
 */
async function globalTeardown(config: FullConfig) {
  console.log('\n======================================================');
  console.log('🧹 [Global Teardown] เริ่มต้นเก็บกวาดข้อมูลทดสอบทั้งหมดหลังจบการทดสอบ...');
  console.log('======================================================');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await loginUser(page);
    await cleanAllUserPostsAndDrafts(page);
    console.log('✅ [Global Teardown] เก็บกวาดและลบข้อมูลทดสอบทั้งหมดเรียบร้อย คืน Clean State 100%!\n');
  } catch (error) {
    console.error('⚠️ [Global Teardown] เกิดข้อผิดพลาด:', error);
  } finally {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

export default globalTeardown;
