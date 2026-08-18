# 🎭 Playwright Cheatsheet & Key Commands (คู่มือคำสั่งสำคัญ)

เอกสารสรุปคำสั่งที่สำคัญและใช้งานบ่อยของ **Playwright** สำหรับการทำ Automated Testing ครอบคลุมตั้งแต่พื้นฐานจนถึงเทคนิคขั้นสูง: CLI, Locators, Actions, Assertions, Page Object Model, Fixtures, Authentication, API Testing, Visual Testing และอื่นๆ

---

## ⚡ 1. คำสั่งที่ใช้งานบ่อย (Quick Reference Commands)

### 🖥️ 1.1 คำสั่งสั่งรันผ่าน Terminal (CLI Commands)
```bash
# 1. อัดการทำงานสร้างสคริปต์อัตโนมัติ (CodeGen)
npx playwright codegen https://share-ed-frontend-gamma.vercel.app/

# 2. รันทดสอบแบบเปิดหน้าจอ Chrome ให้เห็นสดๆ (Headed Mode)
npx playwright test tests/posts/01-create-post.spec.ts --headed

# 3. รันเฉพาะ Test Case ที่ต้องการ (ใช้ flag -g หรือ --grep)
npx playwright test -g "TC-POST-01" --headed

# 4. รันทดสอบแบบเรียงลำดับทุกไฟล์ในโฟลเดอร์ (เปิดทีละ 1 หน้าต่าง ไม่ให้ข้อมูลตีกัน)
npx playwright test tests/posts/ --headed --workers=1

# 5. รันทดสอบในโหมด UI Interactive (เปิดแผงสวิตช์รันและส่องสคริปต์)
npx playwright test --ui

# 6. รันทดสอบในโหมด Debug (กด F10 เพื่อเดินสคริปต์ทีละบรรทัด)
npx playwright test tests/posts/01-create-post.spec.ts --debug

# 6. เปิดหน้ารายงานสรุปผลการทดสอบ (HTML Report)
npx playwright show-report

# 7. เปิดเครื่องมือส่องดูภาพย้อนหลังช็อตต่อช็อต (Trace Viewer)
npx playwright show-trace
```

### 📝 1.2 คำสั่งหลักที่ใช้ในโค้ด (Playwright In-Code Actions)
```typescript
// 1. เปิดไปยัง URL หน้าเว็บ
await page.goto('https://share-ed-frontend-gamma.vercel.app/');

// 2. คลิกปุ่ม / ลิงก์ / ข้อความ
await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
await page.getByText('ข้อความบนหน้าเว็บ').click();

// 3. กรอกข้อความลงในช่อง Input
await page.getByRole('textbox', { name: 'อีเมล' }).fill('user@gmail.com');

// 4. เลือกตัวเลือกใน Dropdown (Combobox)
await page.getByRole('combobox').selectOption('มัธยมศึกษาตอนต้น');

// 5. แนบไฟล์อัปโหลด (รูปภาพ / เอกสาร PDF)
const filePath = path.join(__dirname, '../../test-data/files/doc.pdf');
await page.getByLabel('อัปโหลดไฟล์ PDF').setInputFiles(filePath);
```

### 🎯 1.3 สรุปคำสั่งกลุ่ม `getBy...` (วิธีชี้หาปุ่ม/องค์ประกอบบนหน้าเว็บ)
| คำสั่ง `getBy...` | ทำหน้าที่หาอะไร | ตัวอย่างการใช้งาน |
|---|---|---|
| **`getByRole('...')`** | หาจาก**บทบาทของปุ่ม/องค์ประกอบ** (แนะนำที่สุด ⭐) | `page.getByRole('button', { name: 'เข้าสู่ระบบ' })`<br>`page.getByRole('link', { name: 'หน้าหลัก' })`<br>`page.getByRole('textbox', { name: 'อีเมล' })`<br>`page.getByRole('combobox')` *(Dropdown)*<br>`page.getByRole('dialog', { name: 'โพสต์สำเร็จ!' })` |
| **`getByText('...')`** | หาจาก**ข้อความ**ที่ลอยอยู่บนหน้าเว็บตรงๆ | `page.getByText('แพลตฟอร์มการเรียนรู้')` |
| **`getByLabel('...')`** | หาช่องกรอก/ช่องอัปโหลดจาก**ป้ายกำกับ (Label)** | `page.getByLabel('คลิกเพื่ออัปโหลดรูปปก')` |
| **`getByPlaceholder('...')`** | หาจาก**ข้อความจางๆ ในช่องพิมพ์ (Placeholder)** | `page.getByPlaceholder('เช่น สรุปสูตรฟิสิกส์ ม.4')` |
| **`getByTestId('...')`** | หาจาก attribute `data-testid="..."` | `page.getByTestId('submit-btn')` |
| **`getByAltText('...')`** | หาจาก**คำอธิบายรูปภาพ** (`<img alt="...">`) | `page.getByAltText('รูปปกบทเรียน')` |

### 🔍 1.4 สรุปคำสั่งกลุ่ม `toBe...` และ `toHave...` (วิธีตรวจสอบผลลัพธ์ Assertions)
| คำสั่ง `expect(...)` | แปลว่าอะไร / ทำหน้าที่เช็คอะไร |
|---|---|
| **`.toBeVisible()`** | ต้อง**แสดงผลและมองเห็นได้บนหน้าจอ** (ถ้าไม่เห็นจะ Fail ❌) |
| **`.toBeHidden()`** | ต้อง**ถูกซ่อนอยู่** หรือลบออกจากหน้าจอไปแล้ว |
| **`.toBeEnabled()`** | ปุ่ม/ช่องพิมพ์ ต้อง**เปิดให้ใช้งานได้** (กดได้ ไม่เป็นสีเทา) |
| **`.toBeDisabled()`** | ปุ่มต้อง**ถูกปิดกั้น** (กดไม่ได้ / ปรับเป็นสีเทา) |
| **`.toBeChecked()`** | Checkbox หรือ Radio button ต้อง**ถูกติ๊กเลือกอยู่** |
| **`.toHaveURL('...')`** | **URL ของหน้าเว็บ**ต้องเป็นลิงก์ที่กำหนด |
| **`.toHaveTitle('...')`** | **ชื่อหัวข้อแท็บเบราว์เซอร์**ต้องตรงตามกำหนด |
| **`.toHaveText('...')`** | **ข้อความภายใน** Element ต้องตรงตามกำหนด |
| **`.toHaveValue('...')`** | **ค่าที่ถูกพิมพ์อยู่ในช่อง Input** ต้องตรงตามกำหนด |

---

## 💡 2. เทคนิคและความรู้สำคัญที่ควรรู้ (Essential Tips & Tricks)

### 📌 2.1 `__dirname` และ `path.join(...)` คืออะไร? ทำไมต้องใช้? (เปรียบเทียบการใช้งาน)
- **`__dirname`**: ย่อมาจาก **Directory Name** คือตัวแปรที่เก็บ **"ที่อยู่ของโฟลเดอร์ปัจจุบันที่ไฟล์ทดสอบตั้งอยู่อยู่"** (เช่น `D:\Testing-ShareED-Automate\tests\posts`)
- **`path.join(...)`**: คือคำสั่งสำหรับ **"นำที่อยู่ไฟล์มาเชื่อมต่อกันอย่างปลอดภัย"**

#### ⚖️ เปรียบเทียบ: ไม่ใช้ `path.join` VS ใช้ `path.join`
1. **❌ แบบที่ 1: ไม่ใช้ `path.join` (เขียน Path ตรงๆ เช่น `'C:\Users\...\file.pdf'`)**:
   - **ข้อดี**: พิมพ์สั้น อ่านง่าย
   - **ข้อเสีย/ความเสี่ยงสูง 🔴**: พอส่งสคริปต์ให้อาจารย์, ให้เพื่อนรัน หรือรันบนระบบ CI/CD (GitHub Actions / Linux Server) สคริปต์จะ **พังทันที (FileNotFoundError) ❌** เพราะเครื่องคนอื่นไม่มีโฟลเดอร์ชื่อเดียวกับคอมพิวเตอร์เรา
2. **⭐ แบบที่ 2: ใช้ `path.join(__dirname, ...)` (วิธีมาตรฐานที่แนะนำ)**:
   - **ข้อดี 🟢**: คำนวณตำแหน่งไฟล์จากตัวโฟลเดอร์โครงการโดยตรง ทำให้ **"ย้ายไปรันบนคอมพิวเตอร์เครื่องไหนในโลก (Windows / Mac / Linux) ก็ผ่าน 100% ปลอดภัย ไม่พัง"**

#### 📊 ตารางเปรียบเทียบสรุปความแตกต่าง:
| หัวข้อเปรียบเทียบ | แบบไม่ใช้ `path.join` | แบบใช้ `path.join(__dirname, ...)` ⭐ |
|---|---|---|
| **ความยาวโค้ด** | สั้นกว่า | ยาวกว่าเล็กน้อย |
| **รันบนคอมพิวเตอร์ตัวเอง** | ผ่าน ✅ *(ถ้ารันจาก Root)* | **ผ่าน 100% ✅** |
| **ส่งงานให้อาจารย์ / เพื่อน** | **พัง ❌ (หาไฟล์ไม่เจอ)** | **ผ่าน 100% ✅** |
| **รันบน GitHub Actions / CI-CD** | **พัง ❌** | **ผ่าน 100% ✅** |
| **รองรับ Windows / Mac / Linux** | ไม่รองรับ ❌ | **รองรับ 100% ✅** |

#### 📝 ตัวอย่างโค้ดเปรียบเทียบทั้ง 2 แบบ:

```typescript
// ==============================================================================
// ❌ แบบที่ 1: ไม่ใช้ path.join (เขียน Path แบบตรงๆ หรือ Relative Path สั้นๆ)
// ==============================================================================

// ตัวอย่าง 1.1: เขียน Relative Path สั้นๆ (ไม่ต้องอิมพอร์ต path)
await page.getByLabel('คลิกเพื่ออัปโหลดรูปปก').setInputFiles('test-data/images/Gemini-cover.png');
await page.getByLabel('อัปโหลดไฟล์ PDF').setInputFiles('test-data/files/doc.pdf');

// ตัวอย่าง 1.2: เขียน Absolute Path ประจำเครื่องตัวเอง
await page.getByLabel('คลิกเพื่ออัปโหลดรูปปก').setInputFiles('C:/Users/Earth/Desktop/cover.png');


// ==============================================================================
// ⭐ แบบที่ 2: ใช้ path.join(__dirname, ...) (วิธีมาตรฐานที่แนะนำที่สุด)
// ==============================================================================
import path from 'path';

// คำนวณตำแหน่งไฟล์จากโฟลเดอร์ปัจจุบันของสคริปต์ (ถอยหลัง 2 ชั้นไปหา test-data)
const coverPath = path.join(__dirname, '../../test-data/images/Gemini-cover.png');
const pdfPath = path.join(__dirname, '../../test-data/files/doc.pdf');

await page.getByLabel('คลิกเพื่ออัปโหลดรูปปก').setInputFiles(coverPath);
await page.getByLabel('อัปโหลดไฟล์ PDF').setInputFiles(pdfPath);
```

---

### ⏸️ 2.2 `await page.pause()` คืออะไร? ใช้ตอนไหน?
- **คืออะไร?**: คำสั่ง **"หยุดพักสคริปต์กลางทาง"** พอบอทวิ่งมาถึงบรรทัดนี้ มันจะหยุดค้างไว้บนหน้าจอบราวเซอร์ทันที แล้วเปิดหน้าต่าง **Playwright Inspector (GUI)** ขึ้นมา
- **ประโยชน์**:
  1. ช่วยดักดูหน้าจอจริงและส่องหาปุ่ม/ตำแหน่ง Element บนหน้าเว็บได้สดๆ
  2. สามารถกดปุ่ม **▶️ (Resume)** ให้รันต่อ หรือ **⏭️ (Step)** เพื่อรันทีละบรรทัดได้
- **ข้อควรระวัง**: เอาไว้ใช้เฉพาะตอน **"ดักหา Element หรือแก้บั๊ก"** เท่านั้น พอใช้งานเสร็จแล้ว **ต้องลบ `await page.pause();` ออกเสมอ** ก่อนรันจริง!

---

### 💬 2.3 การจัดการ Popup & Dialog (ป๊อปอัปแจ้งเตือน / ปุ่มยืนยัน)
เวลาหน้าเว็บมี Popup หรือ Modal เด้งขึ้นมา Playwright จะมองเห็นเป็น `getByRole('dialog')` หรือ `getByRole('button')`:
```typescript
// 1. รอป๊อปอัปแจ้งเตือนแสดงผล
await expect(page.getByRole('dialog', { name: 'ลบสำเร็จ!' })).toBeVisible({ timeout: 30000 });

// 2. กดปุ่มยืนยันในป๊อปอัป
await page.getByRole('button', { name: 'ใช่, ลบเลย' }).click();

// 3. กดปุ่ม OK เพื่อปิดป๊อปอัปแจ้งเตือน
await page.getByRole('button', { name: 'OK' }).click();
```

---

### 🎲 2.4 การสร้าง Dynamic Test Data ด้วย `Date.now()` (ป้องกันข้อมูลชื่อซ้ำ)
เวลาทดสอบสร้างโพสต์หรือลบโพสต์ ถ้าใช้ชื่อเดิมซ้ำๆ สคริปต์อาจจะพังหรือแยกแยะโพสต์เดิมไม่ได้ เทคนิคที่นิยมใช้คือเติม `Date.now()` (Timestamp) เข้าไปในชื่อ:
```typescript
// ผลลัพธ์ที่ได้จะเป็น: "โพสต์สำหรับทดสอบการลบ [ID: 1740921234567]"
const timestamp = Date.now();
const postTitle = `โพสต์สำหรับทดสอบการลบ [ID: ${timestamp}]`;

// เวลาตรวจสอบการลบออกจากหน้าเว็บ สามารถอ้างอิงผ่านตัวแปรนี้ได้เลย
await expect(page.getByRole('heading', { name: postTitle })).toBeHidden();
```

---

### 🎨 2.5 การจัดวางโครงสร้างตัวแปร Test Data ไว้ด้านบนสุด (Clean Code Pattern)
เพื่อความอ่านง่ายและแก้ไขง่าย ให้ย้ายตัวแปรข้อความและ Path ไฟล์ขึ้นไปไว้ที่ส่วนหัวของ Test Case:
```typescript
test('[Positive] TC-POST-07: ลบโพสต์ของตนเองสำเร็จ', async ({ page }) => {
  /* 📌 0. กำหนดข้อความและตำแหน่งไฟล์ทั้งหมดไว้ด้านบนสุด */
  const postTitle = `โพสต์สำหรับทดสอบ [ID: ${Date.now()}]`;
  const coverPath = path.join(__dirname, '../../test-data/images/cover.png');
  const pdfPath = path.join(__dirname, '../../test-data/files/doc.pdf');

  /* 1. เริ่มสเต็ปการทำงาน... */
});
```

---

### 💬 2.6 คอมเมนต์บรรทัดว่างด้วย `/* ... */` (ป้องกัน Prettier ลบบรรทัดว่าง)
ถ้าใช้ `// ...` แล้วกด Save (Format on Save) ใน VS Code Prettier จะชอบลบบรรทัดว่างคั่นกลางออก 
การเปลี่ยนไปใช้ block comment `/* ... */` จะช่วยล็อกบรรทัดว่างให้คงอยู่ตลอดเวลาครับ!

---

### 🔢 2.7 `.nth(index)` / `.first()` / `.last()` คืออะไร? ใช้ตอนไหน?
- **คืออะไร?**: คำสั่งสำหรับ **"เลือกอันลำดับที่ต้องการ"** เมื่อ Playwright เจอปุ่ม, Dropdown, หรือข้อความที่มีชื่อหรือประเภทซ้ำกันมากกว่า 1 ตัวบนหน้าเว็บ
- **การนับลำดับ Index (เริ่มนับจาก 0)**:
  * **`.first()`** หรือ **`.nth(0)`** = เลือกอันแรกสุด (ลำดับที่ 1)
  * **`.nth(1)`** = เลือกอันที่สอง (ลำดับที่ 2)
  * **`.nth(2)`** = เลือกอันที่สาม (ลำดับที่ 3)
  * **`.last()`** = เลือกอันสุดท้ายสุด

#### 📝 ตัวอย่างการใช้งานจริง:
```typescript
// บนหน้าเว็บมี Dropdown (combobox) 2 ตัว:
// ตัวแรก (index 0) = Dropdown ระดับชั้นเรียน
// ตัวที่สอง (index 1) = Dropdown หมวดหมู่วิชา

// การใส่ .nth(1) หมายถึง เจาะจงเลือก Dropdown ตัวที่ 2 (หมวดหมู่วิชา) แล้วเลือก "ภาษาอังกฤษ"
await page.getByRole('combobox').nth(1).selectOption('ภาษาอังกฤษ');
```

---

### 📸 2.8 การตั้งค่าเปิด Screenshot และ Video (ถ่ายภาพ & บันทึกวิดีโออัตโนมัติ)

สามารถเปิดตั้งค่าได้ในไฟล์ **`playwright.config.js`** ภายใต้หัวข้อ `use: { ... }`:

```javascript
// playwright.config.js
export default defineConfig({
  use: {
    // 1. ถ่ายภาพ Screenshot อัตโนมัติ: 'on' (ทุกเคส) | 'off' | 'only-on-failure' (เฉพาะเคสพัง)
    screenshot: 'on',

    // 2. บันทึกวิดีโออัตโนมัติ: 'on' (ทุกเคส) | 'off' | 'retain-on-failure' (เฉพาะเคสพัง)
    video: 'on',
  },
});
```

#### 📸 การสั่งถ่ายภาพ Screenshot เฉพาะจุดในโค้ดสคริปต์ (In-Code Actions):
```typescript
// ถ่ายรูปหน้าจอปกติ
await page.screenshot({ path: 'screenshots/my-screen.png' });

// ถ่ายรูปหน้าจอแบบยาวเต็มหน้า (Full Page)
await page.screenshot({ path: 'screenshots/full-page.png', fullPage: true });
```

---

### 🔤 2.9 การดึงข้อความจากหน้าเว็บด้วย `.textContent()` และตัดช่องว่างด้วย `.trim()`

```typescript
// 1. ค้นหาปุ่ม/หัวข้อการ์ดโพสต์อันแรกสุดที่เจอบนหน้าจอ
const targetHeading = page.getByRole('heading', { name: targetPostPattern }).first();

// 2. ดึงข้อความชื่อโพสต์จริงออกมาจาก Element นั้น
const fetchedTitle = await targetHeading.textContent();

// 3. ตัดช่องว่างส่วนเกินหน้า-หลังออก (.trim()) แล้วเอาไปเก็บในตัวแปร
if (fetchedTitle) {
  postTitleText = fetchedTitle.trim();
}

// 4. สั่งกดคลิกที่หัวข้อนั้นเพื่อเปิดเข้าสู่หน้ารายละเอียดโพสต์
await targetHeading.click();
```

* **`.textContent()`**: ดึงตัวอักษรข้อความทั้งหมดที่แสดงอยู่ภายใน Element นั้นออกมา
* **`.trim()`**: ลบช่องว่าง (Whitespace / เว้นวรรค / ขึ้นบรรทัดใหม่) ที่ติดมาด้านหน้าและด้านหลังข้อความออก เพื่อนำไปเปรียบเทียบใน Assertion ได้เป๊ะ 100%

---

### 🖼️ 2.10 การเช็กลบรูปเดิมด้วย `.count() > 0` ก่อนอัปโหลดรูปใหม่ (Safety Check)

```typescript
// 1. หาปุ่ม "ลบรูปภาพ" ทั้งหมดบนหน้าจอ
const deleteImgBtns = page.getByRole('button', { name: 'ลบรูปภาพ' });

// 2. เช็กว่าถ้ามีปุ่มลบรูปภาพเดิม (count > 0) ให้กดลบรูปเดิมออกก่อน 1 รูป
if (await deleteImgBtns.count() > 0) {
  await deleteImgBtns.first().click();
}

// 3. อัปโหลดรูปภาพใหม่ทดแทน
await page.getByLabel('', { exact: true }).setInputFiles(imagePaths);
```

* **ทำไมต้องใส่ `if (count > 0)`?**: เพื่อความปลอดภัย เพราะบางโพสต์อาจจะมีรูปเดิมค้างอยู่ หรือบางโพสต์อาจจะไม่มีรูป การใส่ `if` ดักไว้จะช่วยให้บอทไม่พังไม่ว่าจะเจอรูปเดิมหรือไม่เจอก็ตาม!

---

### 🎯 2.11 `{ exact: true }` คืออะไร? ใช้ตอนไหน?
- **คืออะไร?**: ตัวเลือกออปชันที่บอก Playwright ว่า **"ต้องค้นหาข้อความที่ตรงเป๊ะ 100% เท่านั้น"** (Exact Match)
- **ความต่างระหว่างปกติ VS exact: true**:
  * **ไม่มี `exact: true`**: `getByText('เข้าสู่ระบบ')` จะจับคู่ทั้งคำว่า *"เข้าสู่ระบบ"*, *"กรุณาเข้าสู่ระบบก่อน"*, *"เข้าสู่ระบบด้วย Google"* (ขอแค่มีคำนี้ปนอยู่)
  * **มี `{ exact: true }`**: `getByRole('button', { name: 'เข้าสู่ระบบ', exact: true })` จะจับคู่เฉพาะปุ่มที่มีชื่อเป๊ะๆ ว่า **"เข้าสู่ระบบ"** เท่านั้น (ไม่มีคำอื่นปะปน)
- **กรณี `getByLabel('', { exact: true })`**: 
  * หมายถึง เจาะจงเลือกช่องอัปโหลดไฟล์ที่มีป้ายกำกับเป็นข้อความว่างเปล่า `""` แบบเป๊ะๆ ซึ่งตรงกับช่องอัปโหลดรูปภาพประกอบบนหน้าเว็บ Share-ED พอดี!

---

### 🎯 2.12 คำว่า `expect(...)` คืออะไร? ทำไมถ้าไม่ใช่ค่าที่ตั้งไว้จึงขึ้น FAIL?
- **คำแปล**: `expect` แปลว่า **"คาดหวังว่า..."** หรือเรียกว่าการทำ **Assertion (การยืนยันผลทดสอบ)**
- **หลักการทำงาน**: บอทจะเปรียบเทียบสิ่งที่เกิดขึ้นบนหน้าเว็บจริง กับสิ่งที่เราคาดหวังไว้ในโค้ด
  * **ตรงกัน** ➔ ผลการทดสอบ **PASS 🟢**
  * **ไม่ตรงกัน** ➔ ผลการทดสอบ **FAIL ❌** (ตรวจเจอบั๊ก/ความผิดปกติในระบบ)

```typescript
// ตัวอย่าง: คาดหวังว่า URL หลังสร้างโพสต์สำเร็จต้องเป็นหน้า /home เท่านั้น
await expect(page).toHaveURL('https://share-ed-frontend-gamma.vercel.app/home');
// 🟢 ถ้าเว็บพาไปหน้า /home จริง -> PASS
// ❌ ถ้าเว็บดันพาไปหน้า /explore -> FAIL ทันที (รายงานเจอบั๊ก!)
```

---

### 📌 2.1 วิธีการอ้างอิง Path ไฟล์อัปโหลดด้วย `path.join(__dirname, ...)`
* **ความสำคัญ**: ป้องกันปัญหา Path พังเมื่อเปลี่ยนเครื่องรัน หรือรันบน OS ที่ต่างกัน (Windows vs Mac/Linux)
* **วิธีเขียน**:
  ```typescript
  import path from 'path';
  
  // อ้างอิงโฟลเดอร์ test-data ย้อนกลับไปจากตำแหน่งไฟล์ปัจจุบัน
  const coverPath = path.join(__dirname, '../../test-data/images/Gemini-cover-engAZ.png');
  await page.getByLabel('คลิกเพื่ออัปโหลดรูปปก').setInputFiles(coverPath);
  ```

### 📌 2.2 ความแตกต่างระหว่าง `toBeVisible()` กับ `{ state: 'visible' }`
| คำสั่ง | ประเภท | การทำงาน |
|---|---|---|
| `await expect(locator).toBeVisible()` | **Assertion (ตรวจผล)** | ใช้ตัดสินว่า **Test Pass หรือ Fail ❌** หากไม่พบในเวลาที่กำหนดจะปรับเป็น Failed ทันที |
| `await page.waitForSelector('...', { state: 'visible' })` | **Wait Action (สั่งรอ)** | สั่งให้ระบบ **หยุดรอเฉยๆ** เพื่อให้ Element พร้อมก่อนรันบรรทัดถัดไป |

### 📌 2.3 การขยายเวลารอสำหรับการอัปโหลดเครือข่าย (`{ timeout: 30000 }`)
* ค่าเริ่มต้นของ Playwright ในการรอ Element แสดงผลคือ 5,000ms (5 วินาที)
* หากหน้าเว็บมีการอัปโหลดไฟล์ขนาดใหญ่ หรือรอผลจาก Backend API ให้ใส่ `{ timeout: 30000 }` เพื่อขยายเวลารอเป็น 30 วินาที ป้องกันปัญหา Timeout Error ก่อนอัปโหลดเสร็จ

### 📌 2.4 การรันเฉพาะเคสที่ต้องการด้วย `test.only()` หรือ `-g`
* หากมีหลายเคสในไฟล์เดียวกัน แล้วต้องการรันทดสอบแค่เคสเดียว:
  * **วิธีในโค้ด**: เปลี่ยน `test('TC-02', ...)` ➔ **`test.only('TC-02', ...)`**
  * **วิธีใน Terminal**: ใช้ flag `-g` ➔ **`npx playwright test -g "TC-02" --headed`**

### 📌 2.5 การเปิดภาพย้อนหลังช็อตต่อช็อต (Trace Recording)
* ปรับตั้งค่าใน `playwright.config.js`:
  ```javascript
  use: {
    trace: 'on', // บันทึกภาพ Screenshot + DOM Snapshot ย้อนหลังทุกการรัน
  }
  ```
* เปิดดูด้วยคำสั่ง `npx playwright show-report` หรือ `npx playwright show-trace`

---

## 🗂️ โครงสร้างโปรเจกต์ & ไฟล์ที่เกี่ยวข้อง (Project Structure)

```
📁 โปรเจกต์/
├── 📄 playwright.config.js      ← ⚙️ ไฟล์ตั้งค่าหลัก (Config กลาง)
├── 📄 package.json              ← 📦 Dependencies & scripts
├── 📄 .gitignore                ← 🚫 ไฟล์ที่ไม่ต้อง commit
│
├── 📁 tests/                    ← 🧪 ไฟล์ Test ทั้งหมด
│   ├── example.spec.js          ← ไฟล์ Test (*.spec.js)
│   ├── login.spec.js
│   └── auth.setup.js            ← 🔐 Setup Authentication (ถ้ามี)
│
├── 📁 pages/                    ← 🏛️ Page Object Model (ถ้าใช้ POM)
│   ├── login-page.js
│   └── dashboard-page.js
│
├── 📄 fixtures.js               ← 🧩 Custom Fixtures (ถ้ามี)
│
├── 📁 .auth/                    ← 🔐 Storage State (auto-generated)
│   └── user.json
│
├── 📁 playwright-report/        ← 📊 HTML Report (auto-generated)
├── 📁 test-results/             ← 📸 Screenshots, Videos, Traces (auto-generated)
│
└── 📁 .github/workflows/       ← 🤖 CI/CD Pipeline
    └── playwright.yml
```

---

## 📍 ตั้งค่าอะไร อยู่ไฟล์ไหน? (Settings Location Guide)

| ตั้งค่าอะไร | ตั้งค่าที่ไฟล์ไหน | ตัวอย่าง |
|---|---|---|
| **Base URL** ของเว็บไซต์ | `playwright.config.js` → `use.baseURL` | `'https://example.com'` |
| **Timeout** ต่อ Test | `playwright.config.js` → `timeout` | `30000` (30 วินาที) |
| **Timeout** ของ `expect()` | `playwright.config.js` → `expect.timeout` | `10000` (10 วินาที) |
| **Retry** จำนวนครั้ง | `playwright.config.js` → `retries` | `2` |
| **Workers** (Parallel) | `playwright.config.js` → `workers` | `4` หรือ `undefined` (อัตโนมัติ) |
| **Browser/Device** ที่จะทดสอบ | `playwright.config.js` → `projects` | `devices['Desktop Chrome']` |
| **Screenshot** อัตโนมัติ | `playwright.config.js` → `use.screenshot` | `'only-on-failure'` |
| **Video** อัตโนมัติ | `playwright.config.js` → `use.video` | `'retain-on-failure'` |
| **Trace** อัตโนมัติ | `playwright.config.js` → `use.trace` | `'on-first-retry'` |
| **Viewport** ขนาดหน้าจอ | `playwright.config.js` → `use.viewport` | `{ width: 1280, height: 720 }` |
| **Locale / Timezone** | `playwright.config.js` → `use.locale`, `use.timezoneId` | `'th-TH'`, `'Asia/Bangkok'` |
| **Dev Server** ก่อนรัน Test | `playwright.config.js` → `webServer` | `{ command: 'npm run dev', url: '...' }` |
| **Reporter** รูปแบบรายงาน | `playwright.config.js` → `reporter` | `'html'` หรือ `[['html'], ['list']]` |
| **Authentication Setup** | `tests/auth.setup.js` + config `projects.dependencies` | ดูหัวข้อ 14 |
| **Test Script** แต่ละ Test | `tests/*.spec.js` | ดูหัวข้อ 3 |
| **Page Object** แยก Locator | `pages/*.js` | ดูหัวข้อ 12 |
| **Custom Fixture** ใช้ซ้ำ | `fixtures.js` (หรือไฟล์ที่กำหนดเอง) | ดูหัวข้อ 13 |
| **CI/CD Pipeline** | `.github/workflows/playwright.yml` | ดูด้านล่าง |
| **ห้าม commit** test.only ใน CI | `playwright.config.js` → `forbidOnly` | `!!process.env.CI` |
| **Environment Variables** | `.env` + `dotenv` | ดู config บรรทัดที่ comment ไว้ |

---

## ⏰ ลำดับการตั้งค่า: ควรทำตั้งแต่ตอนไหน?

### 🟢 Phase 1: เริ่มต้นโปรเจกต์ (ทำทันทีหลัง `npm init playwright`)

ตั้งค่าใน **`playwright.config.js`**:

```javascript
// playwright.config.js — ตั้งค่าพื้นฐานเหล่านี้ก่อนเลย
export default defineConfig({
  testDir: './tests',                    // 1. กำหนดโฟลเดอร์ Test
  
  use: {
    baseURL: 'https://your-app.com',     // 2. ตั้ง Base URL ของแอปที่จะทดสอบ
    trace: 'on-first-retry',             // 3. เปิด Trace เพื่อ Debug
    screenshot: 'only-on-failure',       // 4. ถ่ายภาพเมื่อ Test Fail
  },

  projects: [                            // 5. เลือก Browser ที่จะทดสอบ
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

ตั้งค่าใน **`package.json`** (เพิ่ม scripts ให้สะดวก):

```json
{
  "scripts": {
    "test": "npx playwright test",
    "test:headed": "npx playwright test --headed",
    "test:ui": "npx playwright test --ui",
    "test:debug": "npx playwright test --debug",
    "test:report": "npx playwright show-report",
    "test:codegen": "npx playwright codegen"
  }
}
```

ตั้งค่าใน **`.gitignore`** (เพิ่มไฟล์ที่ไม่ควร commit):

```
# Playwright
test-results/
playwright-report/
blob-report/
.auth/
```

### 🟡 Phase 2: เริ่มเขียน Test จริง (หลังเข้าใจพื้นฐาน)

| ทำอะไร | ไฟล์ | เมื่อไหร่ |
|---|---|---|
| เขียน Test แรก | `tests/*.spec.js` | ทันทีที่พร้อม |
| ตั้ง `beforeEach` สำหรับ navigate | `tests/*.spec.js` ภายใน `test.describe` | เมื่อมี Test หลายตัวที่เริ่มต้นเหมือนกัน |
| ตั้ง Timeout ให้เหมาะสม | `playwright.config.js` → `timeout` | เมื่อพบว่า default 30 วินาทีไม่พอ |
| เปิด Video recording | `playwright.config.js` → `use.video` | เมื่อต้องการเห็น visual ของ Test ที่ Fail |
| ใช้ Tags (`@smoke`, `@regression`) | ในชื่อ Test: `test('ชื่อ @smoke', ...)` | เมื่อมี Test มากขึ้นและต้องจัดกลุ่ม |

### 🟠 Phase 3: โปรเจกต์เริ่มใหญ่ (Test > 10 ตัว)

| ทำอะไร | ไฟล์ | ทำไม |
|---|---|---|
| สร้าง **Page Object Model** | `pages/*.js` | แยก Locator ออกจาก Test → ดูแลง่ายเมื่อ UI เปลี่ยน |
| สร้าง **Custom Fixtures** | `fixtures.js` | ลด code ซ้ำซ้อน (เช่น login setup) |
| ตั้ง **Authentication (Storage State)** | `tests/auth.setup.js` + config `projects` | Login ครั้งเดียวแทนทุก Test → เร็วขึ้น 5-10 เท่า |
| เพิ่ม **Retry** | `playwright.config.js` → `retries` | จัดการ Flaky tests |
| ตั้ง **Parallel workers** | `playwright.config.js` → `workers` | รัน Test เร็วขึ้นบน Local |
| เพิ่ม Browser/Device | `playwright.config.js` → `projects` | ทดสอบ Cross-browser & Mobile |

### 🔴 Phase 4: ขึ้น CI/CD (Deploy to production)

ตั้งค่าใน **`.github/workflows/playwright.yml`**:

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps    # ← ใช้ --with-deps บน CI
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v4           # ← อัปโหลด Report
      if: ${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

ตั้งค่าที่ต้องเพิ่มใน **`playwright.config.js`** สำหรับ CI:

```javascript
// เพิ่มตอนขึ้น CI
export default defineConfig({
  forbidOnly: !!process.env.CI,           // ป้องกัน test.only หลุดเข้า CI
  retries: process.env.CI ? 2 : 0,        // Retry 2 ครั้งบน CI
  workers: process.env.CI ? 1 : undefined, // CI ใช้ 1 worker (เสถียรกว่า)
});
```

### 🟣 Phase 5: ขั้นสูง (ทีมใหญ่ / ระบบซับซ้อน)

| ทำอะไร | ไฟล์ | เมื่อไหร่ |
|---|---|---|
| **Visual Comparison** (เทียบ Screenshot) | `tests/*.spec.js` + `toHaveScreenshot()` | เมื่อต้องการตรวจจับ UI Regression |
| **API Testing** | `tests/api/*.spec.js` | เมื่อต้องทดสอบ Backend API |
| **Global Setup/Teardown** | `global-setup.js` + config `globalSetup` | เมื่อต้องเตรียม DB/Environment ก่อนรัน |
| **Multiple Reporters** | `playwright.config.js` → `reporter` | เมื่อต้องส่ง Report หลายรูปแบบ |
| **Sharding** (แบ่ง Test ข้าม machines) | CI config: `--shard=1/3` | เมื่อ Test Suite ใช้เวลานานมาก |

---


## 📌 1. การติดตั้งและตั้งค่าเริ่มต้น (Setup & Installation)

```bash
# สร้างโปรเจกต์ Playwright ใหม่แบบเริ่มต้น
npm init playwright@latest

# ติดตั้ง Browser ที่จำเป็น (Chromium, Firefox, WebKit)
npx playwright install

# ติดตั้งเฉพาะ Browser ที่ต้องการ
npx playwright install chromium

# ติดตั้งระบบ Browser และ Dependencies ของระบบปฎิบัติการ (เหมาะสำหรับ CI/CD)
npx playwright install --with-deps
```

---

## 🚀 2. คำสั่งรัน Test ผ่าน Command Line (CLI)

### พื้นฐาน
```bash
# รัน Test ทั้งหมดในโหมด Headless (ไม่มี UI browser ขึ้นมา)
npx playwright test

# รันเฉพาะไฟล์ที่ต้องการ
npx playwright test tests/example.spec.js

# รัน Test โดยแสดงหน้าจอ Browser (Headed Mode)
npx playwright test --headed

# รันเฉพาะ Browser ที่กำหนด (chromium, firefox, webkit)
npx playwright test --project=chromium

# รันเฉพาะ Test ที่มีชื่อหรือ Tag ตรงกับคำค้นหา
npx playwright test -g "login"

# เปิด Playwright UI Mode (Interactive runner เหมาะสำหรับ Debug และพัฒนา)
npx playwright test --ui

# เปิดโหมด Debug พร้อม Playwright Inspector
npx playwright test --debug

# เปิดดูรายงานผลการทดสอบ (HTML Report)
npx playwright show-report

# เปิดระบบบันทึกคำสั่งอัตโนมัติ (Codegen Generator)
npx playwright codegen https://example.com
```

### ขั้นสูง
```bash
# กำหนดจำนวน Worker สำหรับรัน Test แบบ Parallel
npx playwright test --workers=4

# รันแบบ Worker เดียว (เรียงลำดับ, เหมาะกับ Debug)
npx playwright test --workers=1

# รันพร้อม Retry เมื่อ Test ล้มเหลว
npx playwright test --retries=2

# รันเฉพาะ Test ที่เคย Fail จากรอบก่อนหน้า
npx playwright test --last-failed

# อัปเดต Screenshot Snapshots (Visual Comparison)
npx playwright test --update-snapshots

# เลือก Reporter สำหรับแสดงผลรายงาน
npx playwright test --reporter=list          # แสดงผลแบบ List
npx playwright test --reporter=dot           # แสดงผลแบบสั้น (จุด)
npx playwright test --reporter=html          # สร้าง HTML Report

# รัน Test พร้อมบันทึก Trace ทุก Test
npx playwright test --trace on

# รัน Test ที่มี Tag เฉพาะเจาะจง
npx playwright test --grep @smoke
npx playwright test --grep-invert @slow      # ข้ามทุก Test ที่มี Tag @slow
```

---

## 🏗️ 3. โครงสร้างไฟล์ Test พื้นฐาน (Test Structure)

```javascript
const { test, expect } = require('@playwright/test');

test.describe('ฟีเจอร์ Login', () => {
  
  test.beforeEach(async ({ page }) => {
    // ทำงานก่อนเปิดแต่ละ test เช่น เข้าหน้าเว็บหลัก
    await page.goto('https://example.com/login');
  });

  test('ล็อกอินสำเร็จเมื่อกรอกข้อมูลถูกต้อง', async ({ page }) => {
    await page.getByLabel('Username').fill('user1');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page).toHaveURL(/dashboard/);
  });

});
```

---

## 🏷️ 4. Test Annotations & Tags (การจัดการ Test ด้วย Annotations)

```javascript
// test.only - รันเฉพาะ Test นี้ตัวเดียว (เหมาะตอน Debug)
test.only('รันเฉพาะตัวนี้', async ({ page }) => { /* ... */ });

// test.skip - ข้ามไม่รัน Test นี้
test.skip('ข้ามไปก่อน', async ({ page }) => { /* ... */ });

// test.skip แบบมีเงื่อนไข - ข้ามเฉพาะบาง Browser หรือ Environment
test('ข้ามบาง Browser', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'ยังไม่รองรับ Firefox');
  // ...
});

// test.fixme - ทำเครื่องหมายว่ารู้แล้วว่าพัง จะแก้ทีหลัง (ข้ามเหมือน skip)
test.fixme('ฟีเจอร์นี้มีบัก ต้องแก้', async ({ page }) => { /* ... */ });

// test.slow - เพิ่ม Timeout ให้ Test นี้เป็น 3 เท่า
test('Test ที่ใช้เวลานาน', async ({ page }) => {
  test.slow();
  // ...
});

// test.fail - คาดว่า Test นี้จะ Fail (ถ้า Pass แล้วจะ Error แทน)
test.fail('คาดว่าจะพัง', async ({ page }) => { /* ... */ });

// Tag Tests - ใช้ Tag เพื่อจัดหมวดหมู่และเลือกรัน
test('สร้าง Order ใหม่ @smoke @order', async ({ page }) => { /* ... */ });
test('ดูรายงาน @regression', async ({ page }) => { /* ... */ });
// รัน: npx playwright test --grep @smoke
```

---

## 🪝 5. Test Hooks (ชุดคำสั่งที่รันก่อน/หลัง Test)

```javascript
test.describe('ชุดทดสอบ', () => {

  // รันครั้งเดียวก่อน Test ทั้งหมดใน describe (ใช้สำหรับ setup ที่ช้า เช่น สร้าง DB)
  test.beforeAll(async () => {
    console.log('เตรียม Environment');
  });

  // รันก่อนแต่ละ Test (เหมาะสำหรับ navigate ไปหน้าที่ต้องการ)
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.com');
  });

  // รันหลังแต่ละ Test (เหมาะสำหรับ cleanup)
  test.afterEach(async ({ page }, testInfo) => {
    // ถ่ายภาพเก็บเมื่อ Test Fail
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: `failed-${testInfo.title}.png` });
    }
  });

  // รันครั้งเดียวหลัง Test ทั้งหมดใน describe
  test.afterAll(async () => {
    console.log('ทำความสะอาด Environment');
  });

  test('ตัวอย่าง test', async ({ page }) => { /* ... */ });
});
```

---

## 🎯 6. การเลือก Element (Locators)

แนะนำให้ใช้ **Recommended Locators** ซึ่งเลียนแบบการใช้งานของผู้ใช้จริง:

```javascript
// 1. getByRole - เลือกตาม Role ของ HTML Element (แนะนำที่สุด)
page.getByRole('button', { name: 'Submit' })
page.getByRole('heading', { name: 'Welcome' })
page.getByRole('checkbox', { name: 'Subscribe' })
page.getByRole('link', { name: 'Read more' })
page.getByRole('textbox', { name: 'Search' })

// 2. getByText - เลือกจากข้อความที่แสดงบนหน้าจอ
page.getByText('Welcome back')
page.getByText('Welcome', { exact: true }) // ตรงกันแบบ Exact match

// 3. getByLabel - เลือก Input จากข้อความใน <label>
page.getByLabel('Email Address')

// 4. getByPlaceholder - เลือก Input จากข้อความ Placeholder
page.getByPlaceholder('name@example.com')

// 5. getByAltText - เลือก Image จาก alt attribute
page.getByAltText('Profile picture')

// 6. getByTitle - เลือกจาก title attribute
page.getByTitle('Close modal')

// 7. getByTestId - เลือกจาก data-testid attribute
page.getByTestId('submit-btn')

// 8. locator (CSS / XPath) - กรณีที่วิธีข้างต้นไม่ครอบคลุม
page.locator('css=.submit-button')
page.locator('xpath=//button[@id="submit"]')
```

### 🔗 Locator Chaining & Filtering (ค้นหาซ้อนเพื่อระบุ Element ให้แม่นยำขึ้น)
```javascript
// Chaining - ค้นหา Element ย่อยภายใน Element หลัก
const productCard = page.locator('.product-card');
await productCard.getByRole('button', { name: 'Buy' }).click();

// Filter - กรองด้วยเงื่อนไข hasText หรือ has
page.getByRole('listitem')
  .filter({ hasText: 'JavaScript' })     // กรองเฉพาะ item ที่มีข้อความนี้
  .getByRole('button', { name: 'Add' })
  .click();

// filter({ has: locator }) - กรองด้วย Locator ย่อย
page.getByRole('listitem')
  .filter({ has: page.getByRole('heading', { name: 'Sale' }) });

// nth() - เลือกตามลำดับ (0-indexed)
page.getByRole('button').nth(2);          // ปุ่มที่ 3

// first() / last()
page.getByRole('listitem').first();
page.getByRole('listitem').last();
```

---

## 👆 7. การโต้ตอบกับ Element (User Actions)

### 🌐 Navigation (การเดินทางไปยัง URL)
```javascript
await page.goto('https://example.com');
await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
await page.reload();                    // รีเฟรชหน้า
await page.goBack();                    // ย้อนกลับ
await page.goForward();                 // ไปข้างหน้า
```

### 🖱️ Mouse & Click (การคลิกและเมาส์)
```javascript
await locator.click();                  // คลิกซ้าย
await locator.dblclick();               // ดับเบิ้ลคลิก
await locator.click({ button: 'right' });// คลิกขวา
await locator.hover();                  // เลื่อนเมาส์ไปชี้ (Hover)
await locator.click({ force: true });   // บังคับคลิก (ข้าม Actionability checks)
await locator.click({ modifiers: ['Shift'] }); // คลิกพร้อมกด Shift
```

### ⌨️ Typing & Inputs (การพิมพ์และกรอกข้อมูล)
```javascript
await locator.fill('ข้อความที่ต้องการพิมพ์');  // กรอกข้อมูลแบบล้างค่าเก่าก่อน
await locator.pressSequentially('Hello'); // พิมพ์ทีละอักขระ (เหมือนคนพิมพ์จริง)
await locator.clear();                    // ล้างข้อความใน Input
await locator.press('Enter');             // กดปุ่มคีย์บอร์ด เช่น Enter, Tab, Escape
await page.keyboard.press('Control+A');   // กดปุ่มลัดคีย์บอร์ด
```

### ☑️ Checkbox / Radio & Dropdown
```javascript
await locator.check();                   // ติ๊กเลือก Checkbox/Radio
await locator.uncheck();                 // ยกเลิกการติ๊ก
await locator.selectOption('value1');    // เลือก Dropdown ตาม value
await locator.selectOption({ label: 'ตัวเลือกที่ 1' }); // เลือกตาม label
await locator.selectOption(['value1', 'value2']);         // Multi-select
```

### 📁 File Upload & Drag and Drop
```javascript
// อัปโหลดไฟล์
await page.getByLabel('Upload file').setInputFiles('path/to/file.pdf');

// อัปโหลดหลายไฟล์
await page.getByLabel('Upload').setInputFiles(['file1.pdf', 'file2.pdf']);

// ล้างไฟล์ที่เลือก
await page.getByLabel('Upload file').setInputFiles([]);

// ลากและวาง (Drag & Drop)
await page.locator('#item').dragTo(page.locator('#destination'));
```

---

## ✅ 8. การตรวจสอบผลลัพธ์ (Assertions)

Playwright จะทำการ **Auto-wait** (รอจนกว่าเงื่อนไขจะเป็นจริงตาม Timeout) โดยอัตโนมัติ:

```javascript
// ตรวจสอบการแสดงผล
await expect(locator).toBeVisible();          // มองเห็นบนหน้าจอ
await expect(locator).toBeHidden();           // ซ่อนอยู่หรือไม่มีในหน้าจอ
await expect(locator).toBeEnabled();          // ใช้งานได้ (ไม่ถูก disable)
await expect(locator).toBeDisabled();         // ถูก Disable อยู่
await expect(locator).toBeFocused();          // กำลังถูก Focus อยู่
await expect(locator).toBeEditable();         // แก้ไขข้อมูลได้
await expect(locator).toBeEmpty();            // ไม่มีข้อความ / ค่าว่าง
await expect(locator).toBeInViewport();       // อยู่ในพื้นที่มองเห็นของหน้าจอ

// ตรวจสอบสถานะและข้อความ
await expect(locator).toBeChecked();          // ถูกเช็คเลือกอยู่
await expect(locator).toHaveText('ข้อความ');   // ข้อความตรงกันเป๊ะ
await expect(locator).toContainText('ข้อความ'); // มีข้อความนี้เป็นส่วนหนึ่ง
await expect(locator).toHaveValue('input_val');// ค่าใน input ตรงกัน
await expect(locator).toHaveAttribute('type', 'submit'); // Attribute ตรงกัน
await expect(locator).toHaveCount(3);          // จำนวน Element เท่ากับ 3
await expect(locator).toHaveClass(/active/);   // มี CSS class ตรงกัน
await expect(locator).toHaveCSS('color', 'rgb(0, 0, 0)'); // CSS property ตรงกัน

// ตรวจสอบข้อมูลระดับ Page
await expect(page).toHaveURL('https://example.com/dashboard'); // URL ตรงกัน
await expect(page).toHaveURL(/dashboard/);                    // URL ตรง Regex
await expect(page).toHaveTitle('Dashboard');                   // Title ตรงกัน

// Negation (ตรวจสอบว่า "ไม่ใช่")
await expect(locator).not.toBeVisible();
await expect(locator).not.toHaveText('error');

// Soft Assertion (ตรวจสอบเงื่อนไขแต่ไม่หยุดรันทันทีหากพัง - รวบรวม error ไว้ท้ายสุด)
await expect.soft(locator).toBeVisible();
await expect.soft(locator).toHaveText('ข้อความ');
// Test ยังรันต่อไปแม้ Assertion ข้างบนพัง
```

### 🔄 Polling & Retry Assertions (ตรวจสอบแบบรอจนสำเร็จ)
```javascript
// expect.poll() - รันฟังก์ชันซ้ำจนกว่าผลลัพธ์จะตรง (เหมาะสำหรับค่า dynamic)
await expect.poll(async () => {
  const response = await page.request.get('/api/status');
  return response.status();
}, { message: 'รอ API พร้อมใช้งาน', timeout: 30000 }).toBe(200);

// toPass() - รัน Block ซ้ำจนกว่าจะผ่านทั้ง Block (เหมาะสำหรับ assertions หลายตัว)
await expect(async () => {
  const response = await page.request.get('/api/data');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.items.length).toBeGreaterThan(0);
}).toPass({ intervals: [1000, 2000, 5000], timeout: 30000 });
```

---

## 🛑 9. การรอคอยและการจับจังหวะ (Waiting & Timeouts)

```javascript
// รอ Element ปรากฏตามสภาวะที่กำหนด
await locator.waitFor({ state: 'visible' }); // 'attached' | 'detached' | 'visible' | 'hidden'

// รอโครงสร้าง Network โหลดเสร็จสิ้น
await page.waitForLoadState('networkidle');
await page.waitForLoadState('domcontentloaded');

// รอ Request เฉพาะเจาะจง
const requestPromise = page.waitForRequest('**/api/users');
await page.getByRole('button', { name: 'Load' }).click();
const request = await requestPromise;

// รอ Response เฉพาะเจาะจง
const responsePromise = page.waitForResponse(
  resp => resp.url().includes('/api/users') && resp.status() === 200
);
await page.getByRole('button', { name: 'Load' }).click();
const response = await responsePromise;

// รอ URL เปลี่ยน
await page.waitForURL('**/dashboard');

// หน่วงเวลาแบบระบุวินาที (⚠️ หลีกเลี่ยงหากไม่จำเป็น ทำให้ Test ช้าและไม่เสถียร)
await page.waitForTimeout(3000); // 3 วินาที
```

---

## 🪟 10. การจัดการ Popups, Frames, และ Multiple Tabs

### 💬 Dialogs (Alert / Confirm / Prompt)
```javascript
// ยอมรับ (OK) ทุก Dialog ที่เกิดขึ้น
page.on('dialog', async dialog => {
  console.log(dialog.message());
  await dialog.accept(); // หรือ dialog.dismiss()
});

// ตอบกลับ Prompt Dialog
page.on('dialog', async dialog => {
  await dialog.accept('คำตอบจากผู้ใช้');
});
```

### 🖼️ iFrames
```javascript
const frame = page.frameLocator('iframe#my-frame');
await frame.getByRole('button', { name: 'Submit' }).click();

// Nested iFrame (iFrame ซ้อน iFrame)
const nested = page.frameLocator('#outer').frameLocator('#inner');
await nested.getByText('Hello').click();
```

### 📑 Multiple Tabs / Pages (เปิดแท็บใหม่)
```javascript
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.getByText('Open new tab').click() // ปุ่มที่ทำให้เปิดแท็บใหม่
]);

await newPage.waitForLoadState();
await expect(newPage).toHaveTitle('New Page Title');
```

---

## 📸 11. การจับภาพ / วิดีโอ และ Network Mocking

### 📷 Screenshot & Tracing
```javascript
// ถ่ายภาพหน้าจอ
await page.screenshot({ path: 'screenshot.png', fullPage: true });

// ถ่ายภาพเฉพาะ Element
await locator.screenshot({ path: 'element.png' });

// ดู Trace log (กรณีบันทึก trace ไว้)
// npx playwright show-trace trace.zip
```

### 🌐 Network Interception (Mock API)
```javascript
// ดักจับและแกล้งตอบกลับ API (Mock Response)
await page.route('**/api/users', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'Mock User' }])
  });
});

// ดัก Request แล้วแก้ไขก่อนส่งต่อ (Modify Request)
await page.route('**/api/data', async route => {
  const headers = { ...route.request().headers(), 'x-custom': 'value' };
  await route.continue({ headers });
});

// ดัก Response แล้วแก้ไขก่อนส่งให้หน้าเว็บ (Modify Response)
await page.route('**/api/users', async route => {
  const response = await route.fetch();    // เรียก API จริง
  const json = await response.json();
  json.push({ id: 999, name: 'Injected' });
  await route.fulfill({ response, json }); // ส่ง Response ที่แก้แล้ว
});

// ยกเลิก Request (Block Request)
await page.route('**/*.{png,jpg,jpeg}', route => route.abort()); // บล็อกรูปทั้งหมด
```

---

## 🏛️ 12. Page Object Model - POM (Design Pattern สำหรับ Test ที่ดูแลง่าย)

POM คือรูปแบบการเขียน Test ที่แยก **การค้นหา Element** และ **การกระทำ** ออกจากไฟล์ Test ช่วยให้ดูแลรักษา Test ได้ง่ายเมื่อ UI เปลี่ยนแปลง

### สร้าง Page Object Class
```javascript
// pages/login-page.js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton  = page.getByRole('button', { name: 'Log in' });
    this.errorMessage  = page.getByTestId('error-msg');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

module.exports = { LoginPage };
```

### ใช้งานใน Test
```javascript
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/login-page');

test('ล็อกอินสำเร็จ', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user1', 'password123');
  await expect(page).toHaveURL(/dashboard/);
});

test('แสดง Error เมื่อรหัสผิด', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user1', 'wrong');
  await expect(loginPage.errorMessage).toBeVisible();
});
```

---

## 🧩 13. Custom Fixtures (สร้าง Fixture ใช้ซ้ำข้าม Test)

Fixture ช่วยให้เตรียม "ของที่ต้องใช้ซ้ำ" (เช่น Page Object, ข้อมูล) ได้โดยไม่ต้องเขียน setup ซ้ำในทุก Test

```javascript
// fixtures.js
const { test: base, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login-page');
const { DashboardPage } = require('./pages/dashboard-page');

// ขยาย test ด้วย Fixture ที่สร้างขึ้นเอง
const test = base.extend({
  // Fixture: loginPage - สร้าง LoginPage ให้อัตโนมัติ
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage); // ส่ง loginPage ให้ Test ใช้
    // cleanup หลัง Test จบ (ถ้าจำเป็น)
  },

  // Fixture: authenticatedPage - ล็อกอินให้เรียบร้อยก่อนเข้า Test
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin123');
    await use(page);
  },
});

module.exports = { test, expect };
```

```javascript
// tests/dashboard.spec.js
const { test, expect } = require('../fixtures');

test('หน้า Dashboard โหลดได้', async ({ authenticatedPage }) => {
  // ล็อกอินเรียบร้อยแล้ว! ใช้งานได้เลย
  await expect(authenticatedPage).toHaveURL(/dashboard/);
});
```

---

## 🔐 14. Authentication & Storage State (จัดการ Login ข้าม Test)

แทนที่จะล็อกอินในทุก Test ให้ล็อกอินครั้งเดียวแล้วบันทึก **Storage State** (cookies + localStorage) ไว้ใช้ซ้ำ

### Global Setup - ล็อกอินครั้งเดียว
```javascript
// auth.setup.js
const { test: setup } = require('@playwright/test');

setup('ล็อกอินและบันทึก State', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Log in' }).click();

  // รอจนล็อกอินสำเร็จ
  await page.waitForURL('**/dashboard');

  // บันทึก cookies + localStorage ลงไฟล์
  await page.context().storageState({ path: '.auth/user.json' });
});
```

### ใช้งานใน playwright.config.js
```javascript
// playwright.config.js
module.exports = {
  projects: [
    // 1. รัน Setup ก่อน (ล็อกอินและบันทึก state)
    { name: 'setup', testMatch: /.*\.setup\.js/ },

    // 2. รัน Test โดยใช้ state ที่บันทึกไว้ (ไม่ต้องล็อกอินใหม่)
    {
      name: 'chromium',
      use: { storageState: '.auth/user.json' },
      dependencies: ['setup'],
    },
  ],
};
```

---

## 🌐 15. API Testing (ทดสอบ REST API โดยตรง)

Playwright สามารถทดสอบ API ได้โดยไม่ต้องเปิด Browser ผ่าน `request` fixture

```javascript
const { test, expect } = require('@playwright/test');

test.describe('API Tests', () => {

  test('GET /api/users ส่งค่ากลับมาถูกต้อง', async ({ request }) => {
    const response = await request.get('https://api.example.com/users');

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('name');
  });

  test('POST /api/users สร้างผู้ใช้ใหม่', async ({ request }) => {
    const response = await request.post('https://api.example.com/users', {
      data: { name: 'Test User', email: 'test@test.com' }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.name).toBe('Test User');
  });

  test('PUT /api/users/:id แก้ไขผู้ใช้', async ({ request }) => {
    const response = await request.put('https://api.example.com/users/1', {
      data: { name: 'Updated Name' }
    });
    expect(response.ok()).toBeTruthy();
  });

  test('DELETE /api/users/:id ลบผู้ใช้', async ({ request }) => {
    const response = await request.delete('https://api.example.com/users/1');
    expect(response.status()).toBe(204);
  });

});
```

---

## 🖼️ 16. Visual Comparison Testing (เทียบภาพ Screenshot อัตโนมัติ)

ตรวจจับการเปลี่ยนแปลง UI โดยเทียบ Screenshot กับภาพ Baseline ที่บันทึกไว้

```javascript
test('หน้า Homepage ไม่เปลี่ยนแปลง', async ({ page }) => {
  await page.goto('https://example.com');

  // เทียบ Screenshot ทั้งหน้า (รอบแรกจะสร้าง Baseline อัตโนมัติ)
  await expect(page).toHaveScreenshot('homepage.png');

  // เทียบเฉพาะ Element
  await expect(page.getByTestId('header')).toHaveScreenshot('header.png');

  // กำหนด Threshold ยอมรับความต่างของ Pixel (0-1)
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixelRatio: 0.05, // ยอมรับ pixel ต่างได้ 5%
  });
});
```

```bash
# อัปเดต Baseline Screenshots ใหม่ (เมื่อ UI เปลี่ยนแปลงโดยตั้งใจ)
npx playwright test --update-snapshots
```

---

## ⚡ 17. Parallel & Serial Execution (ควบคุมลำดับการรัน)

```javascript
// Parallel (ค่า default) - Test ทุกตัวรันพร้อมกัน (เร็วกว่า)
test.describe('Parallel tests', () => {
  test('Test A', async ({ page }) => { /* ... */ });
  test('Test B', async ({ page }) => { /* ... */ }); // รันพร้อม A
});

// Serial - Test รันเรียงลำดับ (ถ้าตัวหนึ่งพัง ตัวที่เหลือจะ Skip)
test.describe.serial('ขั้นตอนที่ต้องรันเรียงกัน', () => {
  test('Step 1: สร้าง Order', async ({ page }) => { /* ... */ });
  test('Step 2: ชำระเงิน', async ({ page }) => { /* ... */ });  // ต้องรอ Step 1 เสร็จ
  test('Step 3: ยืนยัน', async ({ page }) => { /* ... */ });    // ต้องรอ Step 2 เสร็จ
});

// Configure mode ใน describe
test.describe.configure({ mode: 'parallel' }); // หรือ 'serial'
```

---

## 🔍 18. Trace Viewer (Debug ขั้นสูง)

Trace Viewer บันทึกทุกอย่างที่เกิดขึ้น: screenshots แต่ละ step, DOM snapshots, network, console log

### ตั้งค่าบันทึก Trace ใน Config
```javascript
// playwright.config.js
module.exports = {
  use: {
    // 'on' = บันทึกทุก Test | 'retain-on-failure' = เฉพาะ Test ที่ Fail | 'on-first-retry' = เฉพาะตอน Retry
    trace: 'retain-on-failure',
  },
};
```

### เปิดดู Trace
```bash
# เปิด Trace Viewer จากไฟล์ trace.zip ที่ถูกบันทึกไว้
npx playwright show-trace test-results/example-test/trace.zip

# หรือเปิดผ่าน URL (Trace Viewer Online)
# https://trace.playwright.dev
```

Trace Viewer จะแสดง:
- 📸 **Screenshots** ของแต่ละ Action
- 🌐 **Network requests** ทั้งหมด
- 📝 **Console logs**
- 🏗️ **DOM snapshot** (Inspect element ได้ย้อนหลัง)
- ⏱️ **Timeline** ลำดับเหตุการณ์ทั้งหมด

---

## ⚙️ 19. การตั้งค่าสำคัญใน playwright.config.js

```javascript
// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // โฟลเดอร์ที่เก็บไฟล์ Test
  testDir: './tests',

  // จำนวน Worker (thread) สำหรับรัน Parallel
  workers: process.env.CI ? 1 : undefined,  // CI ใช้ 1 worker, local ใช้ตามจำนวน CPU

  // จำนวนครั้งที่ Retry เมื่อ Test Fail
  retries: process.env.CI ? 2 : 0,

  // Timeout ต่อ Test (default: 30 วินาที)
  timeout: 30000,

  // Timeout เฉพาะ expect() (default: 5 วินาที)
  expect: { timeout: 10000 },

  // ตัวเลือก Reporter
  reporter: [
    ['html', { open: 'never' }],  // สร้าง HTML report แต่ไม่เปิดอัตโนมัติ
    ['list'],                       // แสดง list ใน terminal
  ],

  // Shared settings สำหรับทุก Project
  use: {
    // URL หลักของเว็บไซต์ (ใช้กับ page.goto('/path') ได้เลย)
    baseURL: 'https://example.com',

    // ถ่ายภาพอัตโนมัติ
    screenshot: 'only-on-failure',    // 'on' | 'off' | 'only-on-failure'

    // บันทึกวิดีโอ
    video: 'retain-on-failure',       // 'on' | 'off' | 'retain-on-failure' | 'on-first-retry'

    // บันทึก Trace
    trace: 'retain-on-failure',       // 'on' | 'off' | 'retain-on-failure' | 'on-first-retry'

    // ขนาดหน้าจอ
    viewport: { width: 1280, height: 720 },

    // ตัวเลือกเพิ่มเติม
    ignoreHTTPSErrors: true,          // ยอมรับ HTTPS ที่ไม่ valid
    locale: 'th-TH',                 // ภาษาของ Browser
    timezoneId: 'Asia/Bangkok',       // Timezone
  },

  // ตั้งค่าแต่ละ Browser/Device
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },

    // ทดสอบบน Mobile
    { name: 'mobile-chrome',  use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari',  use: { ...devices['iPhone 12'] } },
  ],

  // เปิด Dev Server ก่อนรัน Test (เหมาะกับ Local development)
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
```

---

## 📝 20. เคล็ดลับเพิ่มเติม (Pro Tips)

| เคล็ดลับ | คำสั่ง / วิธี |
|---|---|
| 🎯 Debug เร็วที่สุด | `npx playwright test --ui` (Visual timeline + DOM inspector) |
| 🔧 สร้าง Test อัตโนมัติ | `npx playwright codegen URL` (คลิกแล้ว generate code ให้) |
| 📊 รันเฉพาะที่เคย Fail | `npx playwright test --last-failed` |
| 🎥 ดู Trace ย้อนหลัง | `npx playwright show-trace trace.zip` |
| ⏱️ หา Test ที่ช้า | ใช้ `--reporter=list` จะแสดงเวลาแต่ละ Test |
| 🔄 Retry อัตโนมัติ | ตั้ง `retries: 2` ใน config |
| 📱 ทดสอบ Mobile | ใช้ `devices['iPhone 12']` ใน projects |
| 🚫 หลีกเลี่ยง | `waitForTimeout()` – ใช้ Assertions หรือ `waitFor()` แทน |
| 🏗️ ดูแลง่าย | ใช้ **Page Object Model** แยก Locator ออกจาก Test |
| 🔐 Login ครั้งเดียว | ใช้ **Storage State** เก็บ session ไว้ใช้ซ้ำ |

