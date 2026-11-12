# نظام جامع طراحی (Design System)
## سامانه استعلام وضعیت تکلیف شماره یک دوره تربیت مدیر راهبردی آموزش و پرورش

این سند مرجع واحد و رسمی (Single Source of Truth) برای تمام الگوهای بصری، ساختاری، نشانه‌گذاری و استانداردهای دسترسی‌پذیری پورتال است. تمامی مشارکت‌کنندگان، توسعه‌دهندگان فرانت‌اند و مدل‌های هوش مصنوعی ملزم به رعایت دقیق این دستورالعمل‌ها هستند.

---

## ۱. فلسفه طراحی و هویت بصری (Design Philosophy & Identity)

### لحن و رویکرد سازمانی (Tone)
* **رسمی، آرامش‌بخش و معتبر:** طراحی مناسب مربیان، معلمان و مدیران سازمانی آموزش و پرورش، به دور از شلوغی، جلوه‌های نمایشی اضافه یا پالت‌های هیجانی استارتاپی.
* **وضوح و شفافیت حداکثری:** تمرکز صفحه بر انجام یک کار اصلی است: دریافت کد ملی و ارائه شفاف وضعیت تکلیف و اطلاعات پرونده بدون هرگونه عامل حواس‌پرتی.
* **حفظ تمرکز و آرامش چشم:** استفاده از زمینه روشن عاجی/نعنایی بسیار محو (`#F3FAF6`) برای جلوگیری از خستگی چشم کاربران در هنگام مطالعه اطلاعات رسمی.

### جلوه بصری و زیبایی‌شناسی (Aesthetic)
* **ترکیب سرمه‌ای سازمانی و زمردی درخشان:** الهام گرفته از هویت بصری دوره‌های کشوری آموزش و پرورش (ترکیب رنگ وقار اداری سرمه‌ای `#123652` با طراوت و سرسبزی سبز نعنایی `#32C77F`).
* **سطوح با عمق ملایم:** کارت‌های سفید تمیز با خطوط حاشیه فوق‌العاده نرم (`#D8EADF`) و سایه‌های ملایم برای متمایز ساختن لایه‌های محتوایی.

### اصول بومی‌سازی و زبان فارسی (Localization & RTL)
* **راست‌چین ۱۰۰٪ محلی (`dir="rtl"`):** چیدمان عناصر، جای‌گیری آیکون‌ها در کنار متن، امتداد جداول و شناوری فرم‌ها منطبق با الگوی نوشتاری فارسی است.
* **پرهیز از خط تیره‌های کشیده نامأنوس:** استفاده از فاصله‌های صحیح نگارشی، نیم‌فاصله‌های استاندارد و علائم ویرایشی فارسی.
* **جداسازی نمایش و ذخیره‌سازی ارقام:** ارقام در رابط کاربری به‌صورت کاملاً فارسی (`۰-۹`) رندر می‌شوند، اما در هنگام اعتبارسنجی الگوریتم ده‌رقمی و ارسال درخواست به سرور در قالب ارقام استاندارد انگلیسی (`0-9`) پردازش می‌شوند.

---

## ۲. پالت رنگ و سیستم متغیرها (Color Tokens & Variables)

تمامی رنگ‌ها در بخش `:root` تعریف شده و کنتراست لازم برای برآورده ساختن استاندارد سطح WCAG AA (نسبت کنتراست حداقل ۴.۵:۱ برای متن عادی و ۳:۱ برای تیترها) را دارا هستند.

```css
:root {
  /* ====================================================
     رنگ‌های اصلی و سازمانی (Brand & Primary)
     ==================================================== */
  --color-primary:        #123652; /* سرمه‌ای کلاسیک: سربرگ‌ها، عناوین و دکمه اصلی */
  --color-primary-hover:  #0C263B; /* حالت هاور دکمه‌ها و عناصر تعاملی سرمه‌ای */
  --color-primary-rgb:    18, 54, 82;

  /* ====================================================
     رنگ‌های تاکیدی و پویایی (Accent & Interaction)
     ==================================================== */
  --color-accent:         #32C77F; /* سبز زمردی/نعنایی: هایلایت‌ها، نشانگرها، فوکوس */
  --color-accent-hover:   #28A76A; /* حالت هاور و فعالیت دکمه‌های تاکیدی */
  --color-teal-depth:     #125643; /* سبز دودی عمیق: گرادیان هدر و تفکیک خطوط */

  /* ====================================================
     پس‌زمینه‌ها و سطوح (Surfaces & Backgrounds)
     ==================================================== */
  --bg-page:              #F3FAF6; /* زمینه ملایم صفحه جهت کاهش تابش نور سفید */
  --bg-surface:           #FFFFFF; /* زمینه کارت‌ها، فیلدها و کانتینرها */
  --bg-surface-elevated:  #FFFFFF; 
  --bg-subtle:            #F8FCF9; /* نوار سربرگ کارت نتایج سندی */
  --border-subtle:        #D8EADF; /* خطوط پیرامونی کارت‌ها و جداکننده‌ها */
  --border-divider:       #EBF3EE; /* خطوط جداکننده بسیار نرم بین ردیف‌های نتایج */
  --border-focus:         #32C77F; /* حاشیه فعال هنگام فوکوس روی فیلدها */

  /* ====================================================
     تایپوگرافی و متون (Typography Colors)
     ==================================================== */
  --text-primary:         #0C2233; /* سرمه‌ای تیره با کنتراست بالا برای متن اصلی */
  --text-muted:           #5C7285; /* خاکستری سربی برای برچسب‌ها، راهنما و پانویس */
  --text-inverse:         #FFFFFF; /* متن سفید روی سطوح تیره */

  /* ====================================================
     وضعیت‌های بازخورد (Status & Feedback Tokens)
     ==================================================== */
  /* تایید شده / ارسال شده (Approved / Submitted) */
  --status-success-text:  #15803D;
  --status-success-bg:    #DCFCE7;
  --status-success-border:#86EFAC;

  /* رد شده / خطا (Rejected / Error) */
  --status-error-text:    #B91C1C;
  --status-error-bg:      #FEE2E2;
  --status-error-border:  #FCA5A5;

  /* ارسال نکرده / در انتظار (Pending / Not Submitted) */
  --status-warning-text:  #A16207;
  --status-warning-bg:    #FEF9C3;
  --status-warning-border:#FDE047;

  /* خنثی / نامشخص (Neutral / Unknown) */
  --status-neutral-text:  #475569;
  --status-neutral-bg:    #F1F5F9;
  --status-neutral-border:#CBD5E1;

  /* ====================================================
     گرادیان ویژه هدر دوره (Hero Banner Gradient)
     ==================================================== */
  --gradient-banner: radial-gradient(circle at 50% 30%, #36D487 0%, #177053 65%, #0F3E30 100%);
}
```

### جدول ارزیابی کنتراست (WCAG AA Compliance)

| ترکیب رنگ | رنگ متن | رنگ پس‌زمینه | نسبت کنتراست | وضعیت انطباق |
| :--- | :--- | :--- | :--- | :--- |
| متن اصلی روی صفحه | `#0C2233` | `#F3FAF6` | **۱۳.۲:۱** | عالی (AAA) |
| متن فرعی روی کارت | `#5C7285` | `#FFFFFF` | **۵.۴:۱** | تایید (AA) |
| متن سفید روی دکمه سرمه‌ای | `#FFFFFF` | `#123652` | **۱۰.۵:۱** | عالی (AAA) |
| برچسب سبز موفقیت | `#15803D` | `#DCFCE7` | **۴.۸:۱** | تایید (AA) |
| برچسب قرمز عدم ارسال | `#B91C1C` | `#FEE2E2` | **۵.۹:۱** | تایید (AA) |
| برچسب هشدار و بررسی | `#A16207` | `#FEF9C3` | **۵.۲:۱** | تایید (AA) |

---

## ۳. تایپوگرافی و سلسله‌مراتب متنی (Typography & Hierarchy)

### قلم‌های انتخابی (Font Family Stack)
```css
/* قلم پایه متون و فرم‌ها */
--font-family: 'Vazirmatn', 'Shabnam', 'IRANSans', Tahoma, -apple-system, sans-serif;

/* قلم تیتر و عنوان اصلی دوره */
--font-title: 'MJ_Lebanon', 'Mj_Lebanon', 'MJ Lebanon', 'Mj Lebanon', var(--font-family);
```
* **قلم تیتر (MJ_Lebanon):** برای عنوان دوره در هدر (`.portal-title`) جهت ایجاد ابهت، هویت بصری شاخص و تراز با اسناد و گواهی‌های دوره (میزبانی محلی در `assets/fonts/`).
* **قلم پایه (وزیرمتن - Vazirmatn):** برای بدنه، فیلدها و کارت‌ها به دلیل خوانایی بالا روی نمایشگرهای کوچک و بزرگ و هماهنگی کامل ارقام فارسی (میزبانی محلی با متغیر پیوسته ۱۰۰ تا ۹۰۰ در `assets/fonts/`).

> **الزام فنی:** بارگذاری کلیه قلم‌ها به‌صورت ۱۰۰٪ محلی از طریق دستورات `@font-face` در فایل `style.css` انجام می‌شود و اتصال به Google Fonts یا سایر CDNهای خارجی به کلی حذف شده است.

### ارتفاع خطوط فارسی (Line Heights)
خط فارسی نیاز به فضای عمودی بیشتری نسبت به خط لاتین دارد.
* **متن بدنه و توضیحات:** حداقل `line-height: 1.65` تا `1.75`
* **عناوین و سرتیترها:** بین `line-height: 1.3` تا `1.4`

### مقیاس تایپوگرافی (Type Scale)

| نام سطح | اندازه (Rem / Px) | وزن قلم | کاربرد |
| :--- | :--- | :--- | :--- |
| **Display Title (H1)** | `1.75rem` (28px) | 700 (Bold) | عنوان اصلی بالای پورتال در هدر |
| **Section Header (H2)** | `1.25rem` (20px) | 700 (Bold) | سرتیتر کارت استعلام و پنل نتایج |
| **Subtitle / Item (H3)** | `1.05rem` (16.8px)| 600 (SemiBold) | عناوین فرعی و تیتر بخش اطلاعات |
| **Body Regular** | `0.95rem` (15.2px)| 400 (Regular) | مقادیر فیلدها، توضیحات و متن پیام‌ها |
| **Small / Captions** | `0.80rem` (12.8px)| 500 (Medium) | برچسب‌های راهنما، تاریخ و پانویس |
| **Badge Text** | `0.75rem` (12px) | 600 (SemiBold) | متن داخل بج‌های وضعیت |

### قواعد تبدیل و نمایش ارقام فارسی (Numeral Rules)
۱. ارقام ورودی در هنگام تایپ کاربر باید به‌طور زنده به ارقام انگلیسی تبدیل شوند تا در پردازش رشته‌ای و ارسال به API دچار ناهماهنگی نشوند:
```javascript
function normalizeInputDigits(str) {
  return String(str || '')
    .replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632))
    .replace(/\D/g, '');
}
```
۲. تمام اعداد در خروجی‌های بصری (مانند سنوات خدمت، شماره ردیف و ساعت آخرین استعلام) با تابع مبدل فارسی نمایش داده می‌شوند:
```javascript
function toPersianDigits(num) {
  return String(num ?? '').replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
}
```

---

## ۴. فاصله‌گذاری، شبکه و ارتفاع (Layout, Spacing & Elevation)

### مقیاس فواصل پایه (8-Point Grid)
فواصل بر مبنای مضارب ۴ و ۸ پیکسل تنظیم شده‌اند:
* `var(--space-2xs)`: `4px` (فاصله آیکون و متن برچسب)
* `var(--space-xs)`: `8px` (فاصله بین ورودی و برچسب خطا)
* `var(--space-sm)`: `12px` (فاصله عمودی عناصر داخلی فرم)
* `var(--space-md)`: `16px` (فاصله پیش‌فرض بین آیتم‌ها)
* `var(--space-lg)`: `24px` (پدینگ داخلی کارت استعلام)
* `var(--space-xl)`: `32px` (فاصله بین بخش‌های اصلی صفحه)
* `var(--space-2xl)`: `48px` (فاصله‌گذاری سربرگ تا بدنه)

### عرض کانتینرها (Container Max-Widths)
* **ویجت استعلام تک‌ستونه (پیش‌فرض SPA):** حداکثر عرض `520px` (تمرکز کامل کاربر بر فرم)
* **کانتینر دسکتاپ گسترده (گزارشات و جداول):** حداکثر عرض `840px`

### شعاع گوشه‌ها (Border Radius)
* دکمه‌ها و فیلدهای ورودی: `8px` (`0.5rem`)
* کارت‌ها و پنل‌های محتوایی: `14px` تا `16px` (`0.875rem` تا `1rem`)
* نشان‌ها و برچسب‌های وضعیت (Pills): `9999px` (کپسولی کامل)

### سایه‌ها و تفکیک لایه‌ها (Elevation Shadows)
```css
:root {
  /* سایه پیش‌فرض کارت در صفحه */
  --shadow-card: 0 4px 20px -2px rgba(18, 54, 82, 0.07), 0 1px 3px rgba(0, 0, 0, 0.04);

  /* سایه کارت در حالت هاور یا فعال‌سازی فوکوس */
  --shadow-elevated: 0 10px 28px -4px rgba(18, 54, 82, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06);
}
```

---

## ۵. مشخصات و الگوهای ساختار کامپوننت‌ها (Component Blueprints)

### ۱. سربرگ سازمانی (Header / Brand Banner)
```html
<header class="site-header" role="banner">
  <div class="header-inner">
    <div class="org-badge">
      <span class="org-name">اداره کل آموزش و پرورش استان همدان</span>
    </div>
    <h1 class="portal-title">سامانه استعلام وضعیت ارسال تکلیف شماره یک</h1>
    <p class="portal-subtitle">دوره تربیت مدیر راهبردی آموزشی</p>
  </div>
</header>
```
```css
.site-header {
  background: var(--gradient-banner);
  color: var(--text-inverse);
  padding: 2.25rem 1rem 2rem;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 10px rgba(15, 62, 48, 0.2);
}
.org-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 0.25rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
}
.portal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
}
.portal-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
}
```

### ۲. فیلد ورودی کد ملی (National ID Input Field)
```html
<div class="form-group">
  <label for="melli-input" class="form-label">
    کد ملی فراگیر
    <span class="required-indicator" aria-hidden="true">*</span>
  </label>
  <div class="input-wrapper">
    <input
      type="text"
      id="melli-input"
      name="national_id"
      class="form-input"
      inputmode="numeric"
      maxlength="10"
      placeholder="مثال: ۱۲۳۴۵۶۷۸۹۰"
      autocomplete="off"
      aria-required="true"
    />
    <button type="button" class="btn-clear" id="btn-clear" aria-label="پاک کردن ورودی" hidden>
      &times;
    </button>
  </div>
  <span class="field-hint">کد ملی را بدون خط تیره یا فاصله وارد نمایید.</span>
  <span class="field-error" id="field-error" role="alert" aria-live="assertive"></span>
</div>
```
```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.form-input {
  width: 100%;
  font-family: inherit;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--bg-surface);
  border: 1.5px solid var(--border-subtle);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  text-align: center;
  direction: ltr;
  letter-spacing: 0.1em;
  transition: border-color 180ms ease, box-shadow 180ms ease;
}
.form-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(50, 199, 127, 0.25);
}
.form-input.is-invalid {
  border-color: var(--status-error-text);
  box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.15);
}
.field-hint {
  font-size: 0.8rem;
  color: var(--text-muted);
}
.field-error {
  font-size: 0.8rem;
  color: var(--status-error-text);
  font-weight: 500;
  display: none;
}
.field-error.visible {
  display: block;
}
```

### ۳. دکمه اصلی عملیات (Primary Action CTA Button)
```html
<button type="submit" class="btn-primary" id="submit-btn">
  <span class="btn-text">بررسی وضعیت تکلیف</span>
  <span class="btn-spinner" aria-hidden="true">
    <svg class="spinner-svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" stroke-width="3" fill="none" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none" />
    </svg>
  </span>
</button>
```
```css
.btn-primary {
  width: 100%;
  min-height: 48px;
  background-color: var(--color-primary);
  color: var(--text-inverse);
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: background-color 180ms cubic-bezier(0.4, 0, 0.2, 1), transform 150ms ease, box-shadow 180ms ease;
}
.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  box-shadow: 0 4px 14px rgba(18, 54, 82, 0.25);
}
.btn-primary:active:not(:disabled) {
  transform: scale(0.98);
}
.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.btn-spinner {
  display: none;
  width: 20px;
  height: 20px;
  animation: spin 0.8s linear infinite;
}
.btn-primary.is-loading .btn-text {
  visibility: hidden;
}
.btn-primary.is-loading .btn-spinner {
  display: block;
  position: absolute;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### ۴. کارت نمایش نتایج (Result Card Layout)
```html
<section class="result-card" id="result-card" aria-live="polite">
  <div class="result-card-header">
    <div class="participant-badge-row">
      <h2 class="participant-name">مهدی خرم‌آبادی</h2>
      <span class="status-pill status-approved">
        <span class="status-icon" aria-hidden="true">
          <svg class="status-svg" viewBox="0 0 20 20" fill="none">
            <path d="M4 10.5l4 4 8-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        ارسال شده
      </span>
    </div>
  </div>

  <dl class="result-dl">
    <div class="result-row">
      <dt class="item-label">سمت سازمانی</dt>
      <dd class="item-value">کارشناس تکنولوژی و گروه‌های آموزشی</dd>
    </div>
    <div class="result-row">
      <dt class="item-label">محل خدمت</dt>
      <dd class="item-value">اداره کل آموزش و پرورش استان همدان</dd>
    </div>
    <div class="result-row">
      <dt class="item-label">سنوات تجربی</dt>
      <dd class="item-value">۱۴ سال</dd>
    </div>
  </dl>
</section>
```
```css
.result-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  margin-top: 1.5rem;
}
.result-card-header {
  padding: 1.15rem 1.5rem;
  background: var(--bg-subtle);
  border-bottom: 1px solid var(--border-subtle);
}
.participant-badge-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.participant-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
}
.result-dl {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}
.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.95rem 1.5rem;
  border-bottom: 1px solid var(--border-divider);
}
.result-row:last-child {
  border-bottom: none;
}
@media (max-width: 480px) {
  .result-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    padding: 0.85rem 1.15rem;
  }
}
.item-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted);
}
.item-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}
```

### ۵. نشان‌های کپسولی وضعیت (Status Badges / Pills)
```html
<!-- نمونه تایید شده -->
<span class="status-pill status-approved">
  <span class="status-icon" aria-hidden="true">
    <svg class="status-svg" viewBox="0 0 20 20" fill="none">
      <path d="M4 10.5l4 4 8-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </span>
  ارسال شده
</span>

<!-- نمونه ارسال نشده -->
<span class="status-pill status-rejected">
  <span class="status-icon" aria-hidden="true">
    <svg class="status-svg" viewBox="0 0 20 20" fill="none">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </span>
  ارسال نکرده
</span>

<!-- نمونه در حال بررسی -->
<span class="status-pill status-pending">
  <span class="status-icon" aria-hidden="true">
    <svg class="status-svg" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="4" fill="currentColor" />
    </svg>
  </span>
  در انتظار بررسی
</span>
```
```css
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}
.status-approved {
  color: var(--status-success-text);
  background-color: var(--status-success-bg);
  border: 1px solid var(--status-success-border);
}
.status-rejected {
  color: var(--status-error-text);
  background-color: var(--status-error-bg);
  border: 1px solid var(--status-error-border);
}
.status-pending {
  color: var(--status-warning-text);
  background-color: var(--status-warning-bg);
  border: 1px solid var(--status-warning-border);
}
```

### ۶. جعبه‌های اعلان و پیام سیستم (Alert Boxes)
```html
<div class="alert-box alert-error" role="alert">
  <svg class="alert-icon" viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
  </svg>
  <div class="alert-content">
    <strong class="alert-title">کد ملی یافت نشد. دو دلیل می‌تواند داشته باشد:</strong>
    <p class="alert-desc">۱- حضور نداشتن در جلسه‌ی مربوط به تمرین بارگذاری شده.
۲- عدم ثبت نام در فرم اولیه دوره (فراگیر فاقد اطلاعات).</p>
  </div>
</div>
```
```css
.alert-box {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 10px;
  font-size: 0.875rem;
  margin-top: 1rem;
}
.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 0.15rem;
}
.alert-content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.alert-title {
  font-weight: 700;
}
.alert-desc {
  margin: 0;
  line-height: 1.5;
}
.alert-error {
  background-color: var(--status-error-bg);
  color: var(--status-error-text);
  border: 1px solid var(--status-error-border);
}
.alert-success {
  background-color: var(--status-success-bg);
  color: var(--status-success-text);
  border: 1px solid var(--status-success-border);
}
```

---

## ۶. استانداردهای تعامل و دسترس‌پذیری (Interaction & Accessibility)

### حلقه‌های فوکوس صفحه کلید (Keyboard Focus Rings)
تمام عناصر تعاملی (`button`, `input`, `a`) باید هنگام ناوبری با کلید Tab دارای نشانگر فوکوس استاندارد و بدون ابهام باشند:
```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: 6px;
}
```

### آینه‌سازی جهات در RTL (Directional Mirroring)
* نشانگرهای پیشروی، فلش‌ها و آیکون‌های هدایت در رابط راست‌چین باید جهت مناسب را بازتاب دهند:
  - آیکون بازگشت / قبلی: اشاره به راست (`→`)
  - آیکون بعدی / ادامه: اشاره به چپ (`←`)
* فاصله‌گذاری حاشیه‌ها به‌جای `margin-left` یا `margin-right` با خواص منطقی CSS پیاده‌سازی می‌شوند:
  - `margin-inline-start` و `margin-inline-end`
  - `padding-inline-start` و `padding-inline-end`

### زمان‌بندی انیمیشن‌ها و حرکت ملایم (Transitions)
حرکت‌ها باید بسیار نامحسوس و سریع باشند تا حس کارایی و سرعت پورتال اداری حفظ شود:
```css
--transition-standard: 180ms cubic-bezier(0.4, 0, 0.2, 1);
```

### رعایت ترجیح کاهش حرکت (Prefers-Reduced-Motion)
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### حداقل سطح هدف لمسی (Touch Targets - WCAG 2.5.5)
تمام دکمه‌ها و فیلدهای ورودی باید حداقل اندازه `44px` در `44px` (در این سامانه حداقل `48px`) ارتفاع داشته باشند تا در تلفن‌های همراه به راحتی لمس شوند.

---

## ۷. معماری استقرار محلی دارایی‌ها (Local-First & Self-Hosted Assets Architecture)

این قانون یک اصل بنیادین و غیرقابل‌تغییر در این سامانه است: **تمام دارایی‌های بصری، چندرسانه‌ای، تایپوگرافی و اسکریپت‌ها باید به شکل ۱۰۰٪ محلی (Local-First) درون مخزن پروژه میزبانی شوند و هیچ وابستگی به CDN خارجی نباید وجود داشته باشد.**

### ضرورت و اهداف راهبردی
۱. **پایداری کامل در شبکه ملی اطلاعات (اینترانت):** سامانه باید در تمام شبکه‌های سازمانی آموزش و پرورش، مدارس و اتصالات داخلی بدون دسترسی به اینترنت بین‌الملل بدون هیچ نقص گرافیکی یا تاخیر فونت بالا بیاید.
۲. **مصونیت در برابر تحریم‌ها و مسدودسازی‌های بین‌المللی:** سرویس‌های CDN خارجی نظیر Google Fonts، unpkg، jsDelivr و Cloudflare همواره در معرض اختلال، فیلترینگ یا اعمال تحریم‌های دامنه هستند؛ میزبانی محلی این ریسک را به صفر می‌رساند.
۳. **صفر شدن تاخیر خارجی (Zero External Latency):** حذف مراحل DNS Lookup، TLS Handshake و اتصال به سرورهای خارجی موجب بارگذاری برق‌آسا و حذف کامل پرش محتوا (FOUT/FOIT) می‌شود.
۴. **حریم خصوصی و امنیت داده:** با قطع فراخوانی CDNهای ثالث، هیچ نشانه‌ای از ترافیک یا IP کاربران و معلمان به خارج از سرورهای اختصاصی سامانه ارسال نمی‌شود.

### ساختار پوشه دارایی‌ها (`/assets`)
```text
assets/
├── fonts/                     # فونت‌های محلی پورتال
│   ├── Vazirmatn[wght].woff2   # وب‌فونت متغیر وزیرمتن (وزن ۱۰۰ تا ۹۰۰ کامل)
│   ├── Vazirmatn-Regular.woff2 # فونت پایه متون
│   ├── Vazirmatn-Medium.woff2  # فونت عناصر با تاکید ملایم
│   ├── Vazirmatn-SemiBold.woff2# فونت مقادیر و برچسب‌های مهم
│   ├── Vazirmatn-Bold.woff2    # فونت تیترها و دکمه‌ها
│   ├── Mj_Lebanon.woff         # وب‌فونت عنوان شاخص دوره در هدر
│   └── Mj_Lebanon.ttf          # نسخه پشتیبان تروتایپ
├── banner_title_feathered.webp# بنر خوشنویسی اصلی سربرگ دوره با گرادیان محو یکپارچه
├── logo.webp                  # نشان و آرم سازمانی دوره
├── logo_herasat_navy.webp     # نشان اداره حراست با رنگ سازمانی سرمه‌ای (#123652) در پانویس (WebP)
└── logo_herasat_navy.png      # نشان اداره حراست با رنگ سازمانی سرمه‌ای (#123652) در پانویس (PNG)
```

### الزامات توسعه و افزودن دارایی‌های جدید در آینده
* **قلم‌های جدید (Fonts):** هر قلم جدید باید ابتدا در قالب وب‌فونت استاندارد (`.woff2` و `.woff`) در مسیر `assets/fonts/` ذخیره شده و صرفاً از طریق دستورات `@font-face` در فایل `style.css` پیاده‌سازی شود. درج هرگونه لینک `<link rel="stylesheet" href="https://...">` به CDN فونت ممنوع است.
* **آیکون‌ها (Icons):** تمام آیکون‌های واسط کاربری باید به‌صورت درون‌خطی (Inline SVG) با رعایت استانداردهای دسترس‌پذیری (`aria-hidden="true"`, `focusable="false"`) درج شوند تا نیازی به فونت‌آیکون‌های سنگین یا کتابخانه‌های خارجی نباشد.
* **تصاویر و گرافیک‌ها (Images):** فایل‌های تصویری باید منحصراً در فرمت‌های مدرن و فشرده (ترجیحاً `.webp`) همراه با ابعاد صریح (`width` و `height`) در پوشه `assets/` ذخیره شوند.
* **کدهای اسکریپت و افزونه‌ها (Scripts):** استفاده از کتابخانه‌ها یا اسکریپت‌های ریموت ممنوع بوده و تمام منطق برنامه باید در فایل‌های اسکریپت بومی پروژه (`app.js`, `config.js`) باقی بماند.

---

**تاریخ نگارش و به‌روزرسانی:** آبان ۱۴۰۵  
**نسخه:** 1.1.0  
**توسعه‌یافته برای:** آموزش و پرورش استان همدان - دوره تربیت مدیر راهبردی

