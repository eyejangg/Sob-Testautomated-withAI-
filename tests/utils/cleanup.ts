import { Page } from '@playwright/test';

/**
 * ฟังก์ชันเข้าสู่ระบบด้วยบัญชีผู้ใช้
 */
export async function loginUser(page: Page, email = 'ptwptw1600@gmail.com', password = '_Eart1101') {
  await page.goto('https://share-ed-frontend-gamma.vercel.app/');
  const loginLink = page.getByRole('link', { name: 'เข้าสู่ระบบ' });
  if (await loginLink.isVisible({ timeout: 3000 }).catch(() => false)) {
    await loginLink.click();
    await page.getByRole('textbox', { name: 'อีเมล' }).fill(email);
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill(password);
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
    await page.waitForURL(/.*home/, { timeout: 15000 }).catch(() => {});
  }
}

/**
 * 🧹 ฟังก์ชันสำหรับเคลียร์/ลบโพสต์และแบบร่างทั้งหมดของบัญชีผู้ใช้
 * เพื่อให้ระบบพร้อมสำหรับการทดสอบแบบ Clean State 100%
 */
export async function cleanAllUserPostsAndDrafts(page: Page) {
  try {
    // 1. นำทางไปยังหน้าโปรไฟล์
    await page.goto('https://share-ed-frontend-gamma.vercel.app/profile');
    await page.waitForLoadState('domcontentloaded');

    // 2. เคลียร์แท็บ "แบบร่าง" ทั้งหมด
    const draftsTab = page.getByRole('button', { name: /แบบร่าง/i });
    if (await draftsTab.isVisible({ timeout: 1500 }).catch(() => false)) {
      await draftsTab.click();
      await page.waitForTimeout(500);

      for (let i = 0; i < 5; i++) {
        const editDraftBtn = page.locator('button:has-text("แก้ไขโพสต์"), a:has-text("แก้ไขโพสต์"), a[href*="/post/edit/"], .grid h3, .grid .cursor-pointer').first();
        if (!(await editDraftBtn.isVisible({ timeout: 1000 }).catch(() => false))) break;

        await editDraftBtn.click();
        await page.waitForLoadState('domcontentloaded');

        const deleteBtn = page.locator('button:has-text("ลบโพสต์"), button:has-text("ลบ"), a:has-text("ลบโพสต์")').first();
        if (await deleteBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await deleteBtn.scrollIntoViewIfNeeded().catch(() => {});
          await deleteBtn.click();

          const confirmBtn = page.locator('button:has-text("ใช่, ลบเลย"), button:has-text("ใช่ ลบเลย"), button:has-text("ใช่ลบเลย"), button:has-text("ตกลง"), button:has-text("ยืนยัน")').first();
          if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await confirmBtn.click();

            const okBtn = page.getByRole('button', { name: 'OK' });
            if (await okBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
              await okBtn.click();
            }
          }
        }

        await page.goto('https://share-ed-frontend-gamma.vercel.app/profile');
        await page.getByRole('button', { name: /แบบร่าง/i }).click();
        await page.waitForTimeout(500);
      }
    }

    // 3. เคลียร์แท็บ "โพสต์ของฉัน" ทั้งหมด
    await page.goto('https://share-ed-frontend-gamma.vercel.app/profile');
    const myPostsTab = page.getByRole('button', { name: /โพสต์ของฉัน/i });
    if (await myPostsTab.isVisible({ timeout: 1500 }).catch(() => false)) {
      await myPostsTab.click();
      await page.waitForTimeout(500);

      for (let i = 0; i < 5; i++) {
        const postCard = page.locator('.grid h3, .grid .cursor-pointer').first();
        if (!(await postCard.isVisible({ timeout: 1000 }).catch(() => false))) break;

        await postCard.click();
        await page.waitForLoadState('domcontentloaded');

        const deleteBtn = page.locator('button:has-text("ลบโพสต์"), button:has-text("ลบ"), a:has-text("ลบโพสต์")').first();
        if (await deleteBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await deleteBtn.click();

          const confirmBtn = page.locator('button:has-text("ใช่, ลบเลย"), button:has-text("ใช่ ลบเลย"), button:has-text("ใช่ลบเลย"), button:has-text("ตกลง"), button:has-text("ยืนยัน")').first();
          if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await confirmBtn.click();

            const okBtn = page.getByRole('button', { name: 'OK' });
            if (await okBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
              await okBtn.click();
            }
          }
        }

        await page.goto('https://share-ed-frontend-gamma.vercel.app/profile');
        await page.getByRole('button', { name: /โพสต์ของฉัน/i }).click();
        await page.waitForTimeout(500);
      }
    }
  } catch (error) {
    // ข้ามหากเกิดข้อผิดพลาด
  }
}
