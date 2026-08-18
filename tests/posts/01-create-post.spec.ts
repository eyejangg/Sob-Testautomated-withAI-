import { test, expect } from '@playwright/test';
import path from 'path';
/* cSpell:disable */

// กำหนดให้รันทดสอบเรียงลำดับทีละเคสตั้งแต่ 1 ถึง 7 (Sequential / Serial execution)
test.describe.configure({ mode: 'serial' });

/**
 * 🧹 ฟังก์ชันสำหรับเคลียร์/ลบโพสต์และแบบร่างทั้งหมดของบัญชีผู้ใช้
 * เพื่อให้ระบบพร้อมสำหรับการทดสอบรอบใหม่แบบ Clean State 100%
 */
async function cleanAllUserPostsAndDrafts(page: any) {
  try {
    // 1. นำทางไปยังหน้าโปรไฟล์
    await page.goto('https://share-ed-frontend-gamma.vercel.app/profile');
    await page.waitForTimeout(1000);

    // 2. เคลียร์แท็บ "โพสต์ของฉัน" ทั้งหมด
    const myPostsTab = page.getByRole('button', { name: /โพสต์ของฉัน/i });
    if (await myPostsTab.isVisible().catch(() => false)) {
      await myPostsTab.click();
      await page.waitForTimeout(1000);

      for (let i = 0; i < 3; i++) {
        const postLink = page.locator('a[href^="/post/"]:not([href*="/post/edit/"])').first();
        if (!(await postLink.isVisible({ timeout: 1500 }).catch(() => false))) break;

        await postLink.click();
        const deleteBtn = page.locator('button:has-text("ลบโพสต์"), a:has-text("ลบโพสต์")').first();
        if (await deleteBtn.isVisible({ timeout: 2500 }).catch(() => false)) {
          await deleteBtn.click();
          const confirmBtn = page.locator('button:has-text("ใช่, ลบเลย"), button:has-text("ใช่ ลบเลย"), button:has-text("ใช่ลบเลย")').first();
          if (await confirmBtn.isVisible({ timeout: 2500 }).catch(() => false)) {
            await confirmBtn.click();
            await page.waitForTimeout(1000);
            const okBtn = page.getByRole('button', { name: 'OK' });
            if (await okBtn.isVisible().catch(() => false)) {
              await okBtn.click();
            }
          }
          await page.goto('https://share-ed-frontend-gamma.vercel.app/profile');
          await page.getByRole('button', { name: /โพสต์ของฉัน/i }).click();
          await page.waitForTimeout(1000);
        } else {
          break;
        }
      }
    }

    // 3. เคลียร์แท็บ "แบบร่าง" ทั้งหมด
    await page.goto('https://share-ed-frontend-gamma.vercel.app/profile');
    const draftsTab = page.getByRole('button', { name: /แบบร่าง/i });
    if (await draftsTab.isVisible().catch(() => false)) {
      await draftsTab.click();
      await page.waitForTimeout(1000);

      for (let i = 0; i < 3; i++) {
        const draftLink = page.locator('a[href^="/post/"]:not([href*="/post/edit/"])').first();
        if (!(await draftLink.isVisible({ timeout: 1500 }).catch(() => false))) break;

        await draftLink.click();
        const deleteBtn = page.locator('button:has-text("ลบโพสต์"), a:has-text("ลบโพสต์"), button:has-text("ลบ")').first();
        if (await deleteBtn.isVisible({ timeout: 2500 }).catch(() => false)) {
          await deleteBtn.click();
          const confirmBtn = page.locator('button:has-text("ใช่, ลบเลย"), button:has-text("ใช่ ลบเลย"), button:has-text("ใช่ลบเลย")').first();
          if (await confirmBtn.isVisible({ timeout: 2500 }).catch(() => false)) {
            await confirmBtn.click();
            await page.waitForTimeout(1000);
            const okBtn = page.getByRole('button', { name: 'OK' });
            if (await okBtn.isVisible().catch(() => false)) {
              await okBtn.click();
            }
          }
          await page.goto('https://share-ed-frontend-gamma.vercel.app/profile');
          await page.getByRole('button', { name: /แบบร่าง/i }).click();
          await page.waitForTimeout(1000);
        } else {
          break;
        }
      }
    }
  } catch (error) {
    // หากเกิดข้อผิดพลาด ให้ข้ามไปขั้นตอนการสร้างโพสต์ทันที
  }
}

test.describe('Scenario 2.1: สร้างและเผยแพร่โพสต์สำเร็จ', () => {

  test('[Positive] TC-POST-01: สร้างโพสต์ด้วยข้อมูลที่ถูกต้องครบถ้วน', async ({ page }) => {
    // ขยายเวลารองรับการเคลียร์ข้อมูลเดิมและสร้างโพสต์ใหม่
    test.setTimeout(90000);

    /* 📌 0. กำหนดข้อความและตำแหน่งไฟล์ที่ใช้อัปโหลดทั้งหมดไว้ด้านบนสุด (Test Data) */
    const postTitle = 'สรุปไวยากรณ์ภาษาอังกฤษ A–Z (English Grammar Essentials: A–Z Guide)';
    const shortSummary = 'สรุปเนื้อหาวิชาภาษาอังกฤษตั้งแต่ A–Z ครอบคลุมคำศัพท์ ไวยากรณ์ \nโครงสร้างประโยค กาล (Tenses) และการใช้ภาษาในชีวิตประจำวัน \nเหมาะสำหรับนักเรียนระดับมัธยมต้น ใช้ทบทวนก่อนสอบได้อย่างรวดเร็ว';
    const detailedContent = 'เอกสารสรุปเล่มนี้รวบรวมพื้นฐานภาษาอังกฤษที่สำคัญ ได้แก่ ตัวอักษรภาษาอังกฤษ\n\n (Alphabet) สระ a, e, i, o, u คำนาม (Nouns) คำสรรพนาม (Pronouns) \n\nคำกริยา (Verbs) คำคุณศัพท์ (Adjectives) คำวิเศษณ์ (Adverbs) บุพบท (Prepositions) \n\nคำสันธาน (Conjunctions) โครงสร้างประโยค (Sentence Structure) เครื่องหมายวรรคตอน (Punctuation) \n\nและการใช้ Tenses พร้อมตัวอย่างประโยคและแบบฝึกหัด เพื่อพัฒนาทักษะการฟัง พูด อ่าน และเขียนภาษาอังกฤษ';

    const coverPath = path.join(__dirname, '../../test-data/images/Gemini-cover-engAZ.png');
    const pdfPath = path.join(__dirname, '../../test-data/files/สรุปข้อมูล.pdf');
    const imagePaths = [
      path.join(__dirname, '../../test-data/images/คำนาม.png'),
      path.join(__dirname, '../../test-data/images/สระ.png')
    ];

    // 1. เข้าสู่หน้าเว็บหลัก และเข้าสู่ระบบ
    await page.goto('https://share-ed-frontend-gamma.vercel.app/');
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
    await page.getByRole('textbox', { name: 'อีเมล' }).fill('ptwptw1600@gmail.com');
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('_Eart1101');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
    await expect(page).toHaveURL(/.*home/, { timeout: 15000 });

    // 2. ล้างโพสต์เก่าและแบบร่างทั้งหมดของบัญชีก่อนเริ่มต้นการทดสอบ (Initial Cleanup)
    await cleanAllUserPostsAndDrafts(page);

    // 3. เริ่มต้นกระบวนการสร้างโพสต์ใหม่
    await page.goto('https://share-ed-frontend-gamma.vercel.app/home');
    await page.getByRole('link', { name: 'สร้างโพสต์' }).click();

    // 6. กรอกชื่อหัวข้อสรุป
    await page.getByRole('textbox', { name: 'เช่น สรุปสูตรฟิสิกส์ ม.4 เทอม' }).fill(postTitle);

    // 7. เลือกระดับชั้น "มัธยมศึกษาตอนต้น"
    await page.getByRole('combobox').selectOption('มัธยมศึกษาตอนต้น');

    // 8. อัปโหลดรูปปก
    await page.getByLabel('คลิกเพื่ออัปโหลดรูปปก').setInputFiles(coverPath);

    // 9. กรอกบทสรุปย่อ
    await page.getByRole('textbox', { name: 'อธิบายสั้นๆ เกี่ยวกับไฟล์สรุปนี้ (จะนำไปแสดงบนการ์ดในหน้ารายการ) เช่น สรุปฟิสิกส' }).fill(shortSummary);

    // 10. เลือกหมวดหมู่วิชาและแท็ก
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.getByRole('combobox').nth(1).selectOption('ภาษาอังกฤษ');
    await page.getByRole('button', { name: '#เรียนรู้ไปด้วยกัน' }).click();
    await page.getByRole('button', { name: 'ตกลง' }).click();

    // 11. กรอกรายละเอียดเพิ่มเติมใน Rich Text Editor (.ql-editor)
    await page.locator('.ql-editor').click();
    await page.locator('.ql-editor').fill(detailedContent);

    // 12. อัปโหลดไฟล์เอกสาร PDF
    await page.getByLabel('อัปโหลดไฟล์ PDF').setInputFiles(pdfPath);

    // 13. อัปโหลดไฟล์รูปภาพประกอบ
    await page.getByLabel('', { exact: true }).setInputFiles(imagePaths);

    // 14. กดปุ่ม "โพสต์สรุปความรู้"
    await page.getByRole('button', { name: 'โพสต์สรุปความรู้' }).click();

    // 15. ยืนยันผลลัพธ์ (Assertions): ตรวจสอบหน้าต่างแจ้งเตือน "โพสต์สำเร็จ!"
    await expect(page.getByRole('dialog', { name: 'โพสต์สำเร็จ!' })).toBeVisible({ timeout: 30000 });

    // 16. กดปุ่ม "OK" บนหน้าต่างแจ้งเตือน เพื่อให้ระบบเปลี่ยนหน้าไปยังหน้าแรก
    await page.getByRole('button', { name: 'OK' }).click();

    // 17. ยืนยันว่า URL เปลี่ยนไปยังหน้าแรกสำเร็จ
    // await expect(page).toHaveURL('https://share-ed-frontend-gamma.vercel.app/home');
  });

});

test.describe('Scenario 2.2: ผู้ใช้งานสามารถบันทึกโพสต์เป็นฉบับร่าง (Draft) ได้สำเร็จ', () => {

  test('[Positive] TC-POST-02: ผู้ใช้งานสามารถบันทึกโพสต์เป็นฉบับร่าง (Draft) ได้สำเร็จ', async ({ page }) => {
    /* 📌 0. กำหนดข้อความและตำแหน่งไฟล์ที่ใช้ทดสอบ (Test Data) */
    const draftTitle = '[แบบร่าง / DRAFT] สรุปเนื้อหาเตรียมสอบเคมีเบื้องต้น';
    const draftSummary = '[ฉบับร่าง] สรุปเนื้อหาเตรียมสอบวิชาเคมี ม.ปลาย สำหรับบันทึกแบบร่าง (Draft Post)';
    const draftContent = 'เนื้อหาฉบับร่าง (Draft Content) โครงสร้างอะตอมและตารางธาตุ อยู่ระหว่างการรวบรวมข้อมูลเพิ่มเติม...';

    const coverPath = path.join(__dirname, '../../test-data/images/Gemini-cover-engAZ.png');
    const pdfPath = path.join(__dirname, '../../test-data/files/สรุปข้อมูล.pdf');

    // 1. เข้าสู่หน้าเว็บหลัก และเข้าสู่ระบบในสถานะ Member
    await page.goto('https://share-ed-frontend-gamma.vercel.app/');
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
    await page.getByRole('textbox', { name: 'อีเมล' }).fill('ptwptw1600@gmail.com');
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('_Eart1101');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();

    // 2. กดไอคอนปุ่มรูปดินสอ / ลิงก์ เพื่อเข้าสู่หน้าสร้างโพสต์
    await page.getByRole('link', { name: 'สร้างโพสต์' }).click();

    // 3. กรอกหัวข้อ, คำอธิบายย่อของโพสต์, รายละเอียดโพสต์ และหัวข้อบังคับให้ครบถ้วน
    await page.getByRole('textbox', { name: 'เช่น สรุปสูตรฟิสิกส์ ม.4 เทอม' }).fill(draftTitle);
    await page.getByRole('combobox').selectOption('มัธยมศึกษาตอนปลาย');
    await page.getByLabel('คลิกเพื่ออัปโหลดรูปปก').setInputFiles(coverPath);
    await page.getByRole('textbox', { name: 'อธิบายสั้นๆ เกี่ยวกับไฟล์สรุปนี้ (จะนำไปแสดงบนการ์ดในหน้ารายการ) เช่น สรุปฟิสิกส' }).fill(draftSummary);

    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.getByRole('combobox').nth(1).selectOption('วิทยาศาสตร์');
    await page.getByRole('button', { name: '#เรียนรู้ไปด้วยกัน' }).click();
    await page.getByRole('button', { name: 'ตกลง' }).click();

    await page.locator('.ql-editor').click();
    await page.locator('.ql-editor').fill(draftContent);
    await page.getByLabel('อัปโหลดไฟล์ PDF').setInputFiles(pdfPath);

    // 4. กดปุ่ม "บันทึกแบบร่าง"
    await page.getByRole('button', { name: 'บันทึกแบบร่าง' }).click();

    // 5. ยืนยันผลลัพธ์ (Assertions): ตรวจสอบ Modal "บันทึกสำเร็จ!" และข้อความ "บันทึกแบบร่างเรียบร้อยแล้ว"
    await expect(page.getByText('บันทึกสำเร็จ!')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('บันทึกแบบร่างเรียบร้อยแล้ว')).toBeVisible();

    // 6. กดปุ่ม "OK" บนหน้าต่างแจ้งเตือน
    await page.getByRole('button', { name: 'OK' }).click();

    // 7. กลับมาที่หน้าโปรไฟล์
    await page.goto('https://share-ed-frontend-gamma.vercel.app/profile');

    // 8. กดปุ่มแท็บ "แบบร่าง"
    await page.getByRole('button', { name: /แบบร่าง/i }).click();

    // 9. ยืนยันผลลัพธ์ (Assertions): ตรวจสอบว่าพบชื่อโพสต์ที่บันทึกเป็นแบบร่างอยู่ในรายการ
    await expect(page.getByText(draftTitle)).toBeVisible({ timeout: 15000 });
  });

});

test.describe('Scenario 2.3: ผู้ใช้งานสามารถแก้ไขโพสต์ของตนเองได้สำเร็จ', () => {

  test('[Positive] TC-POST-03: ผู้ใช้งานสามารถแก้ไขโพสต์ของตนเองได้สำเร็จ', async ({ page }) => {
    /* 📌 0. กำหนดข้อมูลที่ต้องการแก้ไข (Test Data) */
    const targetPostTitle = 'สรุปไวยากรณ์ภาษาอังกฤษ A–Z (English Grammar Essentials: A–Z Guide)';
    const updatedSummary = 'อัปเดตคำอธิบายย่อใหม่: รวบรวมสรุปไวยากรณ์ฉบับปรับปรุงใหม่ล่าสุด 2026';
    const updatedContent = 'เนื้อหาอัปเดตใหม่ทั้งหมด: สรุปหลักไวยากรณ์ โครงสร้างประโยค และแบบฝึกหัดเพิ่มเติมฉบับสมบูรณ์ 2026';

    // 1. เข้าสู่หน้าเว็บหลัก และเข้าสู่ระบบในสถานะ Member
    await page.goto('https://share-ed-frontend-gamma.vercel.app/');
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
    await page.getByRole('textbox', { name: 'อีเมล' }).fill('ptwptw1600@gmail.com');
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('_Eart1101');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
    // รอยืนยันการเข้าสู่ระบบเสร็จสิ้นสมบูรณ์ (เปลี่ยนหน้าไป /home)
    await expect(page).toHaveURL(/.*home/, { timeout: 15000 });

    // 2. ไปยังหน้าโปรไฟล์
    await page.goto('https://share-ed-frontend-gamma.vercel.app/profile');

    // 3. กดปุ่มแท็บ "โพสต์ของฉัน"
    await page.getByRole('button', { name: /โพสต์ของฉัน/i }).click();

    // 4. คลิกเข้าสู่หน้ารายละเอียดโพสต์ของตนเองจากชื่อโพสต์ (อ้างอิงจาก Scenario 2.1)
    await page.getByText(targetPostTitle).first().click();

    // 5. กดปุ่ม "แก้ไขโพสต์" (รองรับทั้ง element แบบ button และ link)
    await page.locator('button:has-text("แก้ไขโพสต์"), a:has-text("แก้ไขโพสต์")').first().click();

    // 6. ยืนยันว่าเข้าสู่หน้า "แก้ไขสรุปความรู้ของคุณ" และระบบดึงข้อมูลเดิมมาแสดง
    await expect(page.getByText('แก้ไขสรุปความรู้ของคุณ')).toBeVisible({ timeout: 15000 });

    // 7. แก้ไขคำอธิบายใหม่ทั้งหมด (คำอธิบายย่อ และเนื้อหาละเอียด) โดยไม่เปลี่ยนรูปภาพ
    await page.getByRole('textbox', { name: /อธิบายสั้นๆ เกี่ยวกับไฟล์สรุปนี้/i }).fill(updatedSummary);
    await page.locator('.ql-editor').fill(updatedContent);

    // 8. กดปุ่ม "บันทึกและโพสต์"
    await page.getByRole('button', { name: 'บันทึกและโพสต์' }).click();

    // 9. ยืนยันผลลัพธ์ (Assertions): ตรวจสอบ Modal "บันทึกการแก้ไขสำเร็จ!" และข้อความ "แก้ไขโพสต์สรุปความรู้เรียบร้อยแล้ว"
    await expect(page.getByText('บันทึกการแก้ไขสำเร็จ!')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('แก้ไขโพสต์สรุปความรู้เรียบร้อยแล้ว')).toBeVisible();

    // 10. กดปุ่ม "OK" บนหน้าต่างแจ้งเตือน
    await page.getByRole('button', { name: 'OK' }).click();

    // 11. ยืนยันข้อมูลถูกอัปเดตจริง (Data Persistence Assertion): ตรวจสอบว่าเนื้อหาหรือบทสรุปย่อที่แก้ไขใหม่แสดงผลบนหน้าจอจริง
    await expect(page.getByText(updatedSummary)).toBeVisible({ timeout: 15000 });
  });

});

test.describe('Scenario 2.4: ผู้ใช้งานสามารถลบโพสต์ของตนเองได้สำเร็จ', () => {

  test('[Positive] TC-POST-04: ผู้ใช้งานสามารถลบโพสต์ของตนเองได้สำเร็จ', async ({ page }) => {
    /* 📌 0. กำหนดชื่อโพสต์ที่ต้องการลบ (อ้างอิงจาก Scenario 2.1 และ 2.3) */
    const targetPostTitle = 'สรุปไวยากรณ์ภาษาอังกฤษ A–Z (English Grammar Essentials: A–Z Guide)';

    // 1. เข้าสู่หน้าเว็บหลัก และเข้าสู่ระบบในสถานะ Member
    await page.goto('https://share-ed-frontend-gamma.vercel.app/');
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
    await page.getByRole('textbox', { name: 'อีเมล' }).fill('ptwptw1600@gmail.com');
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('_Eart1101');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
    // รอยืนยันการเข้าสู่ระบบเสร็จสิ้นสมบูรณ์ (เปลี่ยนหน้าไป /home)
    await expect(page).toHaveURL(/.*home/, { timeout: 15000 });

    // 2. ไปยังหน้าโปรไฟล์ของฉัน และเลือกแท็บ "โพสต์ของฉัน"
    await page.goto('https://share-ed-frontend-gamma.vercel.app/profile');
    await page.getByRole('button', { name: /โพสต์ของฉัน/i }).click();

    // 3. คลิกเข้าสู่หน้ารายละเอียดโพสต์ของตนเองจากชื่อโพสต์
    await page.getByText(targetPostTitle).first().click();

    // 4. กดเลือกปุ่ม "ลบโพสต์"
    await page.locator('button:has-text("ลบโพสต์"), a:has-text("ลบโพสต์")').first().click();

    // 5. กดยืนยันในหน้าต่างแจ้งเตือน -> กดปุ่ม "ใช่, ลบเลย" / "ใช่ ลบเลย"
    const confirmDeleteBtn = page.locator('button:has-text("ใช่, ลบเลย"), button:has-text("ใช่ ลบเลย"), button:has-text("ใช่ลบเลย")');
    await expect(confirmDeleteBtn).toBeVisible({ timeout: 10000 });
    await confirmDeleteBtn.click();

    // 6. ตรวจสอบหน้าต่างแจ้งเตือน SweetAlert "ลบสำเร็จ!" และ "โพสต์ของคุณถูกลบเรียบร้อยแล้ว"
    await expect(page.getByRole('heading', { name: 'ลบสำเร็จ!' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('โพสต์ของคุณถูกลบเรียบร้อยแล้ว')).toBeVisible();

    // 7. กดปุ่ม "OK" บนหน้าต่างแจ้งเตือน
    await page.getByRole('button', { name: 'OK' }).click();

    // 8. ยืนยันผลลัพธ์ (Assertions): ตรวจสอบว่าชื่อโพสต์นั้นถูกถอนออกและไม่มีแสดงอยู่แล้ว
    await expect(page.getByText(targetPostTitle)).toBeHidden({ timeout: 15000 });
  });

});

test.describe('Scenario 2.5: ระบบปฏิเสธการอัปโหลดไฟล์เมื่อประเภทไฟล์ไม่ถูกต้อง', () => {

  test('[Negative] TC-POST-05: ระบบปฏิเสธการอัปโหลดไฟล์เมื่อประเภทไฟล์ไม่ถูกต้อง (.DOCX หรือ .GIF)', async ({ page }) => {
    /* 📌 0. กำหนดไฟล์ที่ไม่รองรับ (Invalid Files: .docx, .gif) */
    const invalidDocPath = path.join(__dirname, '../../test-data/files/sample-invalid.docx');
    const invalidGifPath = path.join(__dirname, '../../test-data/images/sample-invalid.gif');

    // 1. เข้าสู่ระบบในสถานะ Member
    await page.goto('https://share-ed-frontend-gamma.vercel.app/');
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
    await page.getByRole('textbox', { name: 'อีเมล' }).fill('ptwptw1600@gmail.com');
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('_Eart1101');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();

    // 2. เข้าสู่หน้าสร้างโพสต์
    await page.getByRole('link', { name: 'สร้างโพสต์' }).click();

    // 3. กรอกข้อมูลบังคับ
    await page.getByRole('textbox', { name: 'เช่น สรุปสูตรฟิสิกส์ ม.4 เทอม' }).fill('ทดสอบอัปโหลดไฟล์ประเภทที่ไม่รองรับ');
    await page.getByRole('combobox').selectOption('มัธยมศึกษาตอนต้น');

    // 4. ทดสอบที่ 1: อัปโหลดไฟล์ไม่ถูกต้องที่ช่อง "รูปปก" (.docx / .gif)
    await page.getByLabel('คลิกเพื่ออัปโหลดรูปปก').setInputFiles(invalidGifPath);
    // ยืนยันผลลัพธ์แจ้งเตือนรูปปก: "สามารถอัปโหลดไฟล์ .jpg,.jpeg,.png เท่านั้น"
    await expect(page.getByText('สามารถอัปโหลดไฟล์ .jpg,.jpeg,.png เท่านั้น').first()).toBeVisible({ timeout: 10000 });

    // 5. ทดสอบที่ 2: อัปโหลดไฟล์ไม่ถูกต้องที่ช่อง "ไฟล์เอกสาร PDF" (.docx)
    await page.getByLabel('อัปโหลดไฟล์ PDF').setInputFiles(invalidDocPath);
    // ยืนยันผลลัพธ์แจ้งเตือนเอกสาร PDF: "สามารถอัปโหลดไฟล์ .pdf เท่านั้น"
    await expect(page.getByText('สามารถอัปโหลดไฟล์ .pdf เท่านั้น')).toBeVisible({ timeout: 10000 });

    // 6. ทดสอบที่ 3: อัปโหลดไฟล์ไม่ถูกต้องที่ช่อง "รูปภาพประกอบ" (.docx / .gif)
    await page.getByLabel('', { exact: true }).setInputFiles([invalidGifPath]);
    // ยืนยันผลลัพธ์แจ้งเตือนรูปภาพประกอบ: "สามารถอัปโหลดไฟล์ .jpg,.jpeg,.png เท่านั้น"
    await expect(page.getByText('สามารถอัปโหลดไฟล์ .jpg,.jpeg,.png เท่านั้น').last()).toBeVisible({ timeout: 10000 });
  });

});

test.describe('Scenario 2.6: ระบบไม่อนุญาตให้แก้ไขหรือลบโพสต์ของบุคคลอื่น', () => {

  test('[Negative] TC-POST-06: ระบบไม่อนุญาตให้แก้ไขหรือลบโพสต์ของบุคคลอื่น', async ({ page }) => {
    // 1. เข้าสู่ระบบด้วย Member A
    await page.goto('https://share-ed-frontend-gamma.vercel.app/');
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
    await page.getByRole('textbox', { name: 'อีเมล' }).fill('ptwptw1600@gmail.com');
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('_Eart1101');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
    // รอยืนยันการเข้าสู่ระบบเสร็จสิ้นสมบูรณ์ (เปลี่ยนหน้าไป /home)
    await expect(page).toHaveURL(/.*home/, { timeout: 15000 });

    // 2. Member A พยายามเข้าถึง URL สำหรับแก้ไขโพสต์ที่เป็นของ Member B โดยตรง (ID โพสต์ของผู้อื่น)
    const otherUserPostId = '76d3a817-c3b0-45bb-8b51-8d658b2c5246';
    await page.goto(`https://share-ed-frontend-gamma.vercel.app/post/edit/${otherUserPostId}`);

    // 3. ยืนยันผลลัพธ์ (Assertions):
    // - กรณีที่ 1: ระบบแสดงข้อความแจ้งเตือนข้อผิดพลาดเรื่องสิทธิ์การเข้าถึง
    // - หรือกรณีที่ 2: ระบบ Redirect ออกจากหน้าแก้ไข (ไม่ยอมให้คงอยู่ที่หน้าแก้ไข /post/edit/...)
    const errorAlert = page.getByText(/ไม่มีสิทธิ์|คุณไม่มีสิทธิ์ในการแก้ไขโพสต์นี้|Access Denied|Unauthorized|403|เกิดข้อผิดพลาด/i);
    const hasErrorAlert = await errorAlert.isVisible({ timeout: 5000 }).catch(() => false);

    if (hasErrorAlert) {
      await expect(errorAlert).toBeVisible();
    } else {
      // ตรวจสอบว่าระบบ Redirect ออกไปยังหน้าอื่น (เช่น /home, /explore, /404) และไม่อนุญาตให้อยู่ในหน้าแก้ไขโพสต์
      await expect(page).not.toHaveURL(new RegExp(`/post/edit/${otherUserPostId}`));
    }

    // ยืนยันว่าไม่พบปุ่ม "บันทึกและโพสต์" ของโพสต์ผู้อื่น
    await expect(page.getByRole('button', { name: 'บันทึกและโพสต์' })).toBeHidden();
  });

});

test.describe('Scenario 2.7: ระบบปฏิเสธการสร้างโพสต์เมื่อผู้ใช้งานโพสต์เกินโควตาที่กำหนดให้', () => {

  test('[Negative] TC-POST-07: ระบบปฏิเสธการสร้างโพสต์เมื่อผู้ใช้งานโพสต์เกินโควตาที่กำหนดให้ (สร้างครบ 4 ครั้งเพื่อตรวจสอบขีดจำกัด 3 โพสต์/24 ชั่วโมง)', async ({ page }) => {
    // ขยายเวลาสำหรับการสร้างโพสต์ครบ 4 ครั้ง (3 นาที)
    test.setTimeout(180000);

    const coverPath = path.join(__dirname, '../../test-data/images/Gemini-cover-engAZ.png');
    const pdfPath = path.join(__dirname, '../../test-data/files/สรุปข้อมูล.pdf');

    // 1. เข้าสู่หน้าเว็บหลัก และเข้าสู่ระบบในสถานะ Member
    await page.goto('https://share-ed-frontend-gamma.vercel.app/');
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
    await page.getByRole('textbox', { name: 'อีเมล' }).fill('ptwptw1600@gmail.com');
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('_Eart1101');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
    await expect(page).toHaveURL(/.*home/, { timeout: 15000 });

    // 2. ไปยังหน้าโปรไฟล์ เปิดดูแท็บ "แบบร่าง" และลบโพสต์ในแบบร่างทิ้งก่อนสร้างโพสต์
    await page.goto('https://share-ed-frontend-gamma.vercel.app/profile');
    await page.getByRole('button', { name: /แบบร่าง/i }).click();
    await page.waitForTimeout(1500);

    // ตรวจหาโพสต์แบบร่างจากชื่อหัวข้อ [แบบร่าง / DRAFT] หรือการ์ดแบบร่าง
    const draftCard = page.getByText(/\[แบบร่าง \/ DRAFT\]|สรุปเนื้อหาเตรียมสอบเคมีเบื้องต้น/i).first();
    if (await draftCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      // คลิกเข้าสู่หน้าโพสต์แบบร่าง
      await draftCard.click();
      await page.waitForTimeout(1500);

      // ค้นหาและกดปุ่มลบโพสต์
      const deleteBtn = page.locator('button:has-text("ลบโพสต์"), a:has-text("ลบโพสต์"), button:has-text("ลบ")').first();
      if (await deleteBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await deleteBtn.click();
        const confirmDeleteBtn = page.locator('button:has-text("ใช่, ลบเลย"), button:has-text("ใช่ ลบเลย"), button:has-text("ใช่ลบเลย")').first();
        if (await confirmDeleteBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
          await confirmDeleteBtn.click();
          await page.waitForTimeout(1500);
          const okBtn = page.getByRole('button', { name: 'OK' });
          if (await okBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await okBtn.click();
          }
        }
      }
    }

    // ==========================================
    // 📌 โพสต์ครั้งที่ 1
    // ==========================================
    await page.goto('https://share-ed-frontend-gamma.vercel.app/home');
    await page.getByRole('link', { name: 'สร้างโพสต์' }).click();
    await page.getByRole('textbox', { name: 'เช่น สรุปสูตรฟิสิกส์ ม.4 เทอม' }).fill('[Quota Test 1] สรุปบทเรียนประจำวันชุดที่ 1');
    await page.getByRole('combobox').selectOption('มัธยมศึกษาตอนต้น');
    await page.getByLabel('คลิกเพื่ออัปโหลดรูปปก').setInputFiles(coverPath);
    await page.getByRole('textbox', { name: /อธิบายสั้นๆ เกี่ยวกับไฟล์สรุปนี้/i }).fill('สรุปบทเรียนชุดที่ 1 สำหรับทดสอบโควตารายวัน');

    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.getByRole('combobox').nth(1).selectOption('ภาษาอังกฤษ');
    await page.getByRole('button', { name: '#เรียนรู้ไปด้วยกัน' }).click();
    await page.getByRole('button', { name: 'ตกลง' }).click();

    await page.locator('.ql-editor').fill('เนื้อหาสำหรับทดสอบโควตาโพสต์ที่ 1');
    await page.getByLabel('อัปโหลดไฟล์ PDF').setInputFiles(pdfPath);
    await page.getByRole('button', { name: 'โพสต์สรุปความรู้' }).click();

    // รอ Modal และกด OK เพื่อกลับสู่หน้าแรก
    await page.waitForTimeout(2000);
    const dialogPost1 = page.getByRole('dialog');
    if (await dialogPost1.isVisible().catch(() => false)) {
      await page.getByRole('button', { name: 'OK' }).click().catch(() => { });
    }
    await page.goto('https://share-ed-frontend-gamma.vercel.app/home');

    // ==========================================
    // 📌 โพสต์ครั้งที่ 2
    // ==========================================
    await page.getByRole('link', { name: 'สร้างโพสต์' }).click();
    await page.getByRole('textbox', { name: 'เช่น สรุปสูตรฟิสิกส์ ม.4 เทอม' }).fill('[Quota Test 2] สรุปบทเรียนประจำวันชุดที่ 2');
    await page.getByRole('combobox').selectOption('มัธยมศึกษาตอนต้น');
    await page.getByLabel('คลิกเพื่ออัปโหลดรูปปก').setInputFiles(coverPath);
    await page.getByRole('textbox', { name: /อธิบายสั้นๆ เกี่ยวกับไฟล์สรุปนี้/i }).fill('สรุปบทเรียนชุดที่ 2 สำหรับทดสอบโควตารายวัน');

    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.getByRole('combobox').nth(1).selectOption('ภาษาอังกฤษ');
    await page.getByRole('button', { name: '#เรียนรู้ไปด้วยกัน' }).click();
    await page.getByRole('button', { name: 'ตกลง' }).click();

    await page.locator('.ql-editor').fill('เนื้อหาสำหรับทดสอบโควตาโพสต์ที่ 2');
    await page.getByLabel('อัปโหลดไฟล์ PDF').setInputFiles(pdfPath);
    await page.getByRole('button', { name: 'โพสต์สรุปความรู้' }).click();

    // รอ Modal และกด OK เพื่อกลับสู่หน้าแรก
    await page.waitForTimeout(2000);
    const dialogPost2 = page.getByRole('dialog');
    if (await dialogPost2.isVisible().catch(() => false)) {
      await page.getByRole('button', { name: 'OK' }).click().catch(() => { });
    }
    await page.goto('https://share-ed-frontend-gamma.vercel.app/home');

    // ==========================================
    // 📌 โพสต์ครั้งที่ 3
    // ==========================================
    await page.getByRole('link', { name: 'สร้างโพสต์' }).click();
    await page.getByRole('textbox', { name: 'เช่น สรุปสูตรฟิสิกส์ ม.4 เทอม' }).fill('[Quota Test 3] สรุปบทเรียนประจำวันชุดที่ 3');
    await page.getByRole('combobox').selectOption('มัธยมศึกษาตอนต้น');
    await page.getByLabel('คลิกเพื่ออัปโหลดรูปปก').setInputFiles(coverPath);
    await page.getByRole('textbox', { name: /อธิบายสั้นๆ เกี่ยวกับไฟล์สรุปนี้/i }).fill('สรุปบทเรียนชุดที่ 3 สำหรับทดสอบโควตารายวัน');

    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.getByRole('combobox').nth(1).selectOption('ภาษาอังกฤษ');
    await page.getByRole('button', { name: '#เรียนรู้ไปด้วยกัน' }).click();
    await page.getByRole('button', { name: 'ตกลง' }).click();

    await page.locator('.ql-editor').fill('เนื้อหาสำหรับทดสอบโควตาโพสต์ที่ 3');
    await page.getByLabel('อัปโหลดไฟล์ PDF').setInputFiles(pdfPath);
    await page.getByRole('button', { name: 'โพสต์สรุปความรู้' }).click();

    // รอ Modal และกด OK เพื่อกลับสู่หน้าแรก
    await page.waitForTimeout(2000);
    const dialogPost3 = page.getByRole('dialog');
    if (await dialogPost3.isVisible().catch(() => false)) {
      await page.getByRole('button', { name: 'OK' }).click().catch(() => { });
    }
    await page.goto('https://share-ed-frontend-gamma.vercel.app/home');

    // ==========================================
    // 📌 โพสต์ครั้งที่ 4 (ต้องถูกระบบปฏิเสธเนื่องจากเกินโควตา)
    // ==========================================
    await page.getByRole('link', { name: 'สร้างโพสต์' }).click();
    await page.getByRole('textbox', { name: 'เช่น สรุปสูตรฟิสิกส์ ม.4 เทอม' }).fill('[Quota Test 4] สรุปบทเรียนชุดที่ 4 (เกินโควตา 3 โพสต์/วัน)');
    await page.getByRole('combobox').selectOption('มัธยมศึกษาตอนต้น');
    await page.getByLabel('คลิกเพื่ออัปโหลดรูปปก').setInputFiles(coverPath);
    await page.getByRole('textbox', { name: /อธิบายสั้นๆ เกี่ยวกับไฟล์สรุปนี้/i }).fill('ทดสอบการจำกัดโควตาการสร้างโพสต์ 3 โพสต์ต่อ 24 ชั่วโมง');

    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.getByRole('combobox').nth(1).selectOption('ภาษาอังกฤษ');
    await page.getByRole('button', { name: '#เรียนรู้ไปด้วยกัน' }).click();
    await page.getByRole('button', { name: 'ตกลง' }).click();

    await page.locator('.ql-editor').fill('ทดสอบการสร้างโพสต์ครั้งที่ 4 ซึ่งต้องถูกระบบปฏิเสธเนื่องจากครบขีดจำกัด');
    await page.getByLabel('อัปโหลดไฟล์ PDF').setInputFiles(pdfPath);

    // กดปุ่ม "โพสต์สรุปความรู้"
    await page.getByRole('button', { name: 'โพสต์สรุปความรู้' }).click();

    // 5. ยืนยันผลลัพธ์ (Assertions): ตรวจสอบหัวข้อ "เกิดข้อผิดพลาด" และข้อความแจ้งเตือน "คุณสร้างโพสต์ครบขีดจำกัด 3 โพสต์ในรอบ 24 ชั่วโมงแล้ว"
    await expect(page.getByRole('heading', { name: 'เกิดข้อผิดพลาด' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('คุณสร้างโพสต์ครบขีดจำกัด 3 โพสต์ในรอบ 24 ชั่วโมงแล้ว')).toBeVisible();

    // 6. กดปุ่ม "OK" เพื่อปิดหน้าต่างแจ้งเตือน
    await page.getByRole('button', { name: 'OK' }).click();
  });

});
