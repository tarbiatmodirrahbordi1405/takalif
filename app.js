/**
 * app.js — سامانه استعلام وضعیت ارسال تکلیف شماره یک آموزش و پرورش استان همدان
 * پیاده‌سازی منطبق بر DESIGN_SYSTEM.md
 * ویژگی‌ها:
 *  - استعلام اختصاصی تکلیف شماره یک
 *  - ساختار سندی کارت نتایج با نشانه‌گذاری معنایی <dl>
 *  - طبقه‌بندی قطعی و دقیق وضعیت تکلیف (Deterministic Status Classification)
 *  - آیکون‌های وکتوری SVG هم‌وزن
 *  - ثبت تاریخ و ساعت جلالی (هجری شمسی) با اعداد فارسی
 *  - انیمیشن مورف دکمه استعلام و اسکلتون لودینگ
 *  - اعتبارسنجی الگوریتم کد ملی ۱۰ رقمی
 */

(() => {
  'use strict';

  // ── ۰. مدیریت پرده بارگذاری اولیه (App Initial Loader) ──
  // توجه: زمان ۵ ثانیه‌ای قبلی جهت ارتقای اساسی سرعت لودینگ به ۶۰۰ میلی‌ثانیه کاهش یافت (قابل تنظیم توسط مدیر)
  const LOADER_MIN_DISPLAY_MS = 5000;
  const LOADER_MAX_FALLBACK_MS = 2500;
  const pageNavStart = performance.now();

  function initAppLoader() {
    const loader = document.getElementById('app-loader');
    if (!loader) return;

    // قفل اسکرول برای جلوگیری از جابجایی در زمان نمایش لودینگ
    document.body.classList.add('app-loading');

    function dismissLoader() {
      if (loader.dataset.dismissed === 'true') return;
      loader.dataset.dismissed = 'true';

      const elapsed = performance.now() - pageNavStart;
      const remainingWait = Math.max(0, LOADER_MIN_DISPLAY_MS - elapsed);

      setTimeout(() => {
        loader.classList.add('fade-out');
        document.body.classList.remove('app-loading');
        loader.setAttribute('aria-hidden', 'true');

        // توقف انیمیشن‌های مداد جهت آزادسازی پردازنده در زمان محو شدن پرده لودر
        const animatedEls = loader.querySelectorAll('.pencil, [class*="pencil__"], .app-loader-pulse-dots span');
        animatedEls.forEach((el) => {
          el.style.animationPlayState = 'paused';
        });

        // حذف ایمن عنصر از درخت DOM پس از تکمیل ترنزیشن محو شدن
        setTimeout(() => {
          if (loader.parentNode) {
            loader.hidden = true;
            loader.remove();
          }
        }, 550);
      }, remainingWait);
    }

    // لغو لودر به محض آماده بودن فونت‌ها و دیکود تصویر هدر اصلی
    const fontsPromise = (document.fonts && document.fonts.ready)
      ? document.fonts.ready
      : Promise.resolve();

    const bannerImg = document.querySelector('.portal-banner-img');
    const imgPromise = (bannerImg && bannerImg.decode)
      ? bannerImg.decode().catch(() => { })
      : Promise.resolve();

    Promise.all([fontsPromise, imgPromise]).then(dismissLoader).catch(dismissLoader);

    // زمان‌سنج اطمینان اضطراری (Fallback Safety)
    setTimeout(dismissLoader, LOADER_MAX_FALLBACK_MS);
  }

  initAppLoader();

  // بهینه‌سازی رندرینگ: توقف انیمیشن‌های پس‌زمینه در زمان غیرفعال بودن تب مرورگر
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('tab-hidden', document.hidden);
  });

  // ── ۱. توابع کمکی تبدیل ارقام و اعتبارسنجی ───────────────────────────────

  /** تبدیل ارقام فارسی و عربی به انگلیسی جهت پردازش عددی */
  function normalizeInputDigits(str) {
    return String(str || '')
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
      .replace(/\D/g, '');
  }

  /** تبدیل ارقام انگلیسی به فارسی جهت رندر در واسط کاربری */
  function toPersianDigits(num) {
    return String(num ?? '').replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
  }

  function formatExperience(val) {
    if (val === undefined || val === null) return '---';
    let str = String(val).trim();
    if (!str || str === '---') return '---';

    str = str.replace(/سال\s+سال/g, 'سال').trim();
    const formatted = toPersianDigits(str);
    return formatted.includes('سال') ? formatted : `${formatted} سال`;
  }

  /**
   * اعتبارسنجی دقیق کد ملی ۱۰ رقمی با تفکیک دقیق انواع خطا
   * @param {string|number} code - مقدار ورودی
   * @returns {{ isValid: boolean, errorCode: string, message: string, normalized: string, details: Object }}
   */
  function validateMelliCode(code) {
    const normalized = normalizeInputDigits(code);

    if (!normalized) {
      return {
        isValid: false,
        errorCode: 'EMPTY',
        message: 'لطفاً کد ملی را وارد نمایید.',
        normalized: '',
        details: {},
      };
    }

    if (!/^\d+$/.test(normalized)) {
      return {
        isValid: false,
        errorCode: 'INVALID_CHARS',
        message: 'کد ملی تنها باید شامل ارقام عددی (۰ تا ۹) باشد.',
        normalized,
        details: {},
      };
    }

    if (normalized.length < 10) {
      const hint = normalized.length >= 8
        ? ' (در صورت وجود صفر در ابتدای کد ملی، حتماً صفر اول را وارد فرمایید)'
        : '';
      return {
        isValid: false,
        errorCode: 'INCOMPLETE_LENGTH',
        message: `کد ملی باید ۱۰ رقم باشد (در حال حاضر ${toPersianDigits(normalized.length)} رقم وارد شده است)${hint}.`,
        normalized,
        details: { length: normalized.length },
      };
    }

    if (normalized.length > 10) {
      return {
        isValid: false,
        errorCode: 'EXCESS_LENGTH',
        message: `طول کد ملی نمی‌تواند بیشتر از ۱۰ رقم باشد (${toPersianDigits(normalized.length)} رقم وارد شده است).`,
        normalized,
        details: { length: normalized.length },
      };
    }

    // بررسی کدهای تکراری یکنواخت (مانند ۱۱۱۱۱۱۱۱۱۱ یا ۰۰۰۰۰۰۰۰۰۰)
    if (/^(\d)\1{9}$/.test(normalized)) {
      return {
        isValid: false,
        errorCode: 'REPEATED_DIGITS',
        message: 'کد ملی نامعتبر است (ارقام یکسان و تکراری مجاز نمی‌باشد).',
        normalized,
        details: {},
      };
    }

    // الگوریتم توازن رقم کنترلی (Modulo-11)
    const digits = normalized.split('').map(Number);
    const check = digits[9];
    const sum = digits.slice(0, 9).reduce((acc, digit, idx) => acc + digit * (10 - idx), 0);
    const rem = sum % 11;
    const expected = rem < 2 ? rem : 11 - rem;

    if (check !== expected) {
      return {
        isValid: false,
        errorCode: 'INVALID_CHECKSUM',
        message: 'کد ملی نامعتبر است.',
        normalized,
        details: { check, expected },
      };
    }

    return {
      isValid: true,
      errorCode: 'VALID',
      message: 'کد ملی صحیح و معتبر است.',
      normalized,
      details: { check },
    };
  }

  /**
   * واکشی داده از وب‌اپ گوگل اپس اسکریپت با زمان انقضا (Timeout)
   * از طریق AbortController
   */
  async function apiFetch(nationalId, timeoutMs = 14000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const url = `${CONFIG.API_URL}?id=${encodeURIComponent(nationalId)}`;
      const res = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        redirect: 'follow',
      });

      if (!res.ok) throw new Error(`http_${res.status}`);
      const json = await res.json();
      return json;
    } finally {
      clearTimeout(timer);
    }
  }

  // ── ۲. دسته‌بندی قطعی و تعیین برچسب وضعیت تکلیف ──────────────────────────

  function classifyStatus(raw) {
    const s = String(raw ?? '').trim();
    const lower = s.toLowerCase();

    // ۱. رد شده (قرمز غلیظ) — شامل «رد شده، استفاده از هوش مصنوعی (تشابه بالای 70 درصد)»
    const isRejected = (
      lower === 'رد' ||
      lower === 'رد شده' ||
      lower === 'مردود' ||
      lower === 'rejected' ||
      lower === 'fail' ||
      lower === 'failed' ||
      lower.startsWith('رد شده') ||
      lower.startsWith('رد:') ||
      lower.startsWith('رد -') ||
      lower.includes('عدم تایید') ||
      lower.includes('عدم تأیید') ||
      lower.includes('مردود')
    );

    if (isRejected) {
      let label = (s === 'رد' || lower === 'rejected') ? 'رد شده' : s;
      if (label.includes('(')) {
        label = label.replace(/\s*\(/g, '\n(');
      }
      return {
        cls: 'status-rejected',
        iconType: 'cross',
        label: toPersianDigits(label),
      };
    }

    // ۲. ارسال نکرده (قرمز رقیق‌تر مایل به صورتی)
    const unsubmittedExact = [
      'ارسال نکرده',
      'ارسال نشده',
      'تحویل نداده',
      'انجام نداده',
      'عدم ارسال',
      'نفرستاده',
      'خیر',
      'no',
      'not submitted',
      'unsubmitted',
    ];

    const isUnsubmitted = (
      unsubmittedExact.includes(s) ||
      unsubmittedExact.includes(lower) ||
      lower.includes('ارسال نکرده') ||
      lower.includes('ارسال نشده') ||
      lower.includes('عدم ارسال') ||
      lower.includes('تحویل نداده') ||
      lower.includes('انجام نداده') ||
      lower.includes('نفرستاده')
    );

    if (isUnsubmitted) {
      return {
        cls: 'status-unsubmitted',
        iconType: 'cross',
        label: 'ارسال نکرده',
      };
    }

    // ۳. بررسی نشده / در حال بررسی (زرد)
    const pendingExact = [
      'بررسی نشده',
      'بررسی نگردیده',
      'در حال بررسی',
      'در انتظار بررسی',
      'در دست بررسی',
      'منتظر بررسی',
      'pending',
      'under review',
    ];

    const isPending = (
      pendingExact.includes(s) ||
      pendingExact.includes(lower) ||
      lower.includes('بررسی نشده') ||
      lower.includes('در حال بررسی') ||
      lower.includes('در انتظار بررسی') ||
      lower.includes('در دست بررسی') ||
      lower.includes('منتظر بررسی') ||
      lower.includes('pending')
    );

    if (isPending) {
      return {
        cls: 'status-pending',
        iconType: 'clock',
        label: (s && s !== 'pending') ? toPersianDigits(s) : 'بررسی نشده',
      };
    }

    // ۴. وضعیت هشدار: ارسال شده، رد پای هوش مصنوعی (نارنجی ED9511 - تشابه بین ۵۰ تا ۷۰ درصد)
    const isAiFlagged = (
      lower.includes('رد پای هوش مصنوعی') ||
      lower.includes('ردپای هوش مصنوعی') ||
      (lower.includes('هوش مصنوعی') && (lower.includes('50') || lower.includes('۵۰') || lower.includes('بین')))
    );

    if (isAiFlagged) {
      // تبدیل «ارسال کرده» به «ارسال شده» در عنوان خروجی وب‌سایت طبق دستور کاربر
      let label = s.replace(/ارسال کرده/g, 'ارسال شده');
      if (label.includes('(')) {
        label = label.replace(/\s*\(/g, '\n(');
      }
      return {
        cls: 'status-ai-flagged',
        iconType: 'warning',
        label: toPersianDigits(label),
      };
    }

    // ۵. مقادیر تایید شده / ارسال شده (سبز)
    const isApproved = (
      lower.includes('مورد تایید') ||
      lower.includes('مورد تأیید') ||
      lower === 'ارسال کرده' ||
      lower === 'ارسال شده' ||
      lower === 'تحویل داده' ||
      lower === 'انجام داده' ||
      lower === 'بله' ||
      lower === 'تایید' ||
      lower === 'تأیید' ||
      lower === 'yes' ||
      lower === 'approved' ||
      lower.startsWith('ارسال شده') ||
      lower.startsWith('ارسال کرده')
    );

    if (isApproved) {
      // تبدیل «ارسال کرده، مورد تایید» به «ارسال شده، مورد تایید» در خروجی وب‌سایت
      let label = 'ارسال شده';
      if (lower.includes('مورد تایید') || lower.includes('مورد تأیید')) {
        label = 'ارسال شده، مورد تایید';
      }
      return {
        cls: 'status-approved',
        iconType: 'check',
        label,
      };
    }

    // ۶. مقادیر سفارشی دیگر به‌صورت وضعیت خنثی همراه با مقدار خام نمایش داده می‌شوند
    if (s && s !== '---' && s !== '-') {
      return {
        cls: 'status-neutral',
        iconType: 'neutral',
        label: toPersianDigits(s),
      };
    }

    // مقدار نامشخص یا خالی
    return {
      cls: 'status-neutral',
      iconType: 'neutral',
      label: 'نامشخص',
    };
  }

  /** تولید کد SVG آیکون‌های وضعیت منطبق با ضخامت خط ۱.۸ آیکون جستجو */
  function getStatusSvg(iconType) {
    if (iconType === 'check') {
      return `<svg class="status-svg" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
        <path d="M4 10.5l4 4 8-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>`;
    }

    if (iconType === 'cross') {
      return `<svg class="status-svg" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
        <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>`;
    }

    if (iconType === 'clock') {
      return `<svg class="status-svg" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.8" />
        <path d="M10 6v4.5l3 1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>`;
    }

    if (iconType === 'warning') {
      return `<svg class="status-svg" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.8" />
        <path d="M10 6.5V11M10 13.5V14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>`;
    }

    return `<svg class="status-svg" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="4" fill="currentColor" />
    </svg>`;
  }

  // ── ۳. عناصر و ارجاعات DOM ────────────────────────────────────────────────

  const form = document.getElementById('inquiry-form');
  const input = document.getElementById('melli-input');
  const btnClear = document.getElementById('btn-clear');
  const fieldHint = document.getElementById('field-hint');
  const fieldSuccess = document.getElementById('field-success');
  const fieldError = document.getElementById('field-error');
  const submitBtn = document.getElementById('submit-btn');
  const skeletonLoader = document.getElementById('skeleton-loader');
  const resultCard = document.getElementById('result-card');
  const resParticipantName = document.getElementById('res-participant-name');
  const resStatusPill = document.getElementById('res-status-pill');
  const resStatusIcon = document.getElementById('res-status-icon');
  const resStatusText = document.getElementById('res-status-text');
  const resDetailsList = document.getElementById('res-details-list');
  const resQueryTime = document.getElementById('res-query-time');
  const alertContainer = document.getElementById('alert-container');

  // ── ۴. مدیریت تعاملات فیلد ورودی و بازخورد هوشمند ──────────────────────────

  const DEFAULT_FIELD_HINT = 'کد ملی را بدون خط تیره یا فاصله وارد نمایید.';

  function showFieldError(msg) {
    fieldError.textContent = msg;
    fieldError.classList.add('visible');
    fieldHint.classList.add('hidden');
    fieldHint.hidden = true;
    if (fieldSuccess) {
      fieldSuccess.classList.remove('visible');
      fieldSuccess.textContent = '';
      fieldSuccess.hidden = true;
    }
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', 'field-error');
    input.setCustomValidity(msg);
  }

  function showFieldSuccess(msg = '✓ کد ملی صحیح و معتبر است.') {
    if (fieldSuccess) {
      fieldSuccess.textContent = msg;
      fieldSuccess.classList.add('visible');
      fieldSuccess.hidden = false;
    }
    fieldError.classList.remove('visible');
    fieldError.textContent = '';
    fieldHint.classList.add('hidden');
    fieldHint.hidden = true;
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    input.setAttribute('aria-invalid', 'false');
    input.setAttribute('aria-describedby', fieldSuccess ? 'field-success' : 'field-hint');
    input.setCustomValidity('');
  }

  function showFieldTyping(len) {
    fieldError.classList.remove('visible');
    fieldError.textContent = '';
    if (fieldSuccess) {
      fieldSuccess.classList.remove('visible');
      fieldSuccess.textContent = '';
      fieldSuccess.hidden = true;
    }
    fieldHint.classList.remove('hidden');
    fieldHint.hidden = false;
    input.classList.remove('is-invalid', 'is-valid');
    input.removeAttribute('aria-invalid');
    input.setAttribute('aria-describedby', 'field-hint');
    input.setCustomValidity('کد ملی ناقص است.');
    fieldHint.textContent = `در حال ورود کد ملی... (${toPersianDigits(len)} از ۱۰ رقم)`;
  }

  function resetFieldFeedback() {
    fieldError.classList.remove('visible');
    fieldError.textContent = '';
    if (fieldSuccess) {
      fieldSuccess.classList.remove('visible');
      fieldSuccess.textContent = '';
      fieldSuccess.hidden = true;
    }
    fieldHint.classList.remove('hidden');
    fieldHint.hidden = false;
    input.classList.remove('is-invalid', 'is-valid');
    input.removeAttribute('aria-invalid');
    input.setAttribute('aria-describedby', 'field-hint');
    input.setCustomValidity('');
    fieldHint.textContent = DEFAULT_FIELD_HINT;
  }

  // پیش‌گرمایش (Pre-warm) وب‌اپ گوگل اپس اسکریپت در اولین تعامل ورودی جهت بیدارباش سریع سرور
  let isApiPrewarmed = false;
  function prewarmBackend() {
    if (isApiPrewarmed || !CONFIG.API_URL) return;
    isApiPrewarmed = true;
    try {
      fetch(CONFIG.API_URL, {
        method: 'GET',
        cache: 'no-store',
      }).catch(() => { });
    } catch (_) { }
  }

  input.addEventListener('focus', prewarmBackend, { once: true });
  input.addEventListener('input', prewarmBackend, { once: true });

  input.addEventListener('input', () => {
    const rawVal = input.value;
    const normalized = normalizeInputDigits(rawVal);
    if (rawVal !== normalized) {
      input.value = normalized;
    }

    // کنترل نمایش دکمه پاک کردن
    btnClear.hidden = input.value.length === 0;

    const len = input.value.length;

    if (len === 0) {
      resetFieldFeedback();
      return;
    }

    // در حین تایپ و پیش از رسیدن به ۱۰ رقم، خطای قرمز نمایش داده نمی‌شود
    if (len < 10) {
      showFieldTyping(len);
      return;
    }

    // با تکمیل دقیق ۱۰ رقم، اعتبارسنجی آنی انجام می‌گیرد
    const validation = validateMelliCode(input.value);
    if (validation.isValid) {
      showFieldSuccess();
    } else {
      showFieldError(validation.message);
    }
  });

  input.addEventListener('blur', () => {
    const val = input.value.trim();
    if (val.length === 0) {
      resetFieldFeedback();
      return;
    }

    const validation = validateMelliCode(val);
    if (validation.isValid) {
      showFieldSuccess();
    } else {
      showFieldError(validation.message);
    }
  });

  btnClear.addEventListener('click', () => {
    input.value = '';
    btnClear.hidden = true;
    resetFieldFeedback();
    input.focus();
  });

  // ── ۵. مدیریت انیمیشن مورف دکمه و اسکلتون لودینگ ──────────────────────────

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle('is-loading', isLoading);
    submitBtn.setAttribute('aria-busy', String(isLoading));

    if (isLoading) {
      resultCard.hidden = true;
      alertContainer.innerHTML = '';
      skeletonLoader.hidden = false;
    } else {
      skeletonLoader.hidden = true;
    }
  }

  // ── ۶. رندر کارت سندی نتیجه (Unified Document Result Card) ────────────────

  // آیکون‌های وکتوری SVG درج‌شده به صورت درون‌خطی (Inline) جهت جلوگیری از تاخیر شبکه و پرش تصویر
  const ROW_ICONS = {
    position: '<svg class="result-item-icon" viewBox="0 0 512 512" width="19" height="19" fill="none" aria-hidden="true" focusable="false"><g><rect x="177.52" y="248" style="fill:#5C7285;" width="187.136" height="16"/><polygon style="fill:#5C7285;" points="364.656,445.472 264.496,445.472 264.496,66.552 364.656,66.552 364.656,82.552 280.496,82.552 280.496,429.472 364.656,429.472 "/></g><path style="fill:#28A76A;" d="M453.728,197.728L453.728,197.728c32.184,0,58.272,26.088,58.272,58.264V256 c0,32.176-26.088,58.264-58.264,58.264h-0.008c-32.176,0-58.264-26.088-58.264-58.264v-0.008 C395.464,223.816,421.552,197.728,453.728,197.728z"/><path style="fill:#123652;" d="M453.728,0L453.728,0C485.912,0,512,26.088,512,58.264v0.008c0,32.176-26.088,58.264-58.264,58.264 h-0.008c-32.176,0-58.264-26.088-58.264-58.264v-0.008C395.464,26.088,421.552,0,453.728,0z"/><g><path style="fill:#32C77F;" d="M453.728,395.464L453.728,395.464c32.184,0,58.272,26.088,58.272,58.264v0.008 C512,485.912,485.912,512,453.736,512h-0.008c-32.176,0-58.264-26.088-58.264-58.264v-0.008 C395.464,421.552,421.552,395.464,453.728,395.464z"/><circle style="fill:#123652;" cx="90.184" cy="73.504" r="35.44"/><path style="fill:#123652;" d="M129.752,123.096H50.616C22.672,123.128,0.024,145.784,0,173.728v99.256 c0,10.16,8.232,18.4,18.4,18.4c10.16,0,18.4-8.232,18.4-18.4v-0.008v-89.008h11.064v83.928v0.112v187.64 c0,10.16,8.24,18.4,18.4,18.4s18.4-8.24,18.4-18.4l0,0V304.696h11.04v150.96c0.008,10.16,8.248,18.392,18.408,18.392 c10.152-0.008,18.384-8.232,18.392-18.392V183.96h11.048v89.008c0,10.16,8.24,18.4,18.4,18.4c10.16,0,18.4-8.24,18.4-18.4v-99.2 C180.336,145.816,157.704,123.152,129.752,123.096z"/></g></svg>',
    workplace: '<svg class="result-item-icon" viewBox="0 0 504.107 504.107" width="19" height="19" fill="none" aria-hidden="true" focusable="false"><g transform="translate(1 1)"><path style="fill:#EBF5F0;" d="M105.987,481.774c0-9.387-7.68-17.067-17.067-17.067c-3.413,0-6.827,0.853-9.387,2.56 c-2.56-11.093-12.8-19.627-24.747-19.627S32.6,456.174,30.04,467.267c-2.56-1.707-5.973-2.56-9.387-2.56 c-9.387,0-17.067,7.68-17.067,17.067V208.707H140.12v273.067v17.067h-51.2C98.307,498.84,105.987,491.16,105.987,481.774z M498.52,208.707v273.067c0-9.387-7.68-17.067-17.067-17.067c-3.413,0-6.827,0.853-9.387,2.56 c-2.56-11.093-12.8-19.627-24.747-19.627s-22.187,8.533-24.747,19.627c-2.56-1.707-5.973-2.56-9.387-2.56 c-9.387,0-17.067,7.68-17.067,17.067s7.68,17.067,17.067,17.067h-51.2v-17.067V208.707H498.52z M208.387,362.307v119.467H140.12 V208.707V72.174l-0.853-0.853L251.053,3.907L362.84,71.32l-0.853,0.853v136.533v273.067H293.72V362.307H208.387z M140.12,481.774 h221.867v17.067H140.12V481.774z"/><g><polygon style="fill:#125643;" points="208.387,481.774 293.72,481.774 293.72,362.307 208.387,362.307 "/><path style="fill:#32C77F;" d="M251.053,72.174c33.28,0,59.733,26.453,59.733,59.733s-26.453,59.733-59.733,59.733 s-59.733-26.453-59.733-59.733S217.773,72.174,251.053,72.174"/></g><path style="fill:#28A76A;" d="M481.453,464.707c9.387,0,17.067,7.68,17.067,17.067s-7.68,17.067-17.067,17.067h-68.267 c-9.387,0-17.067-7.68-17.067-17.067s7.68-17.067,17.067-17.067c3.413,0,6.827,0.853,9.387,2.56 c2.56-11.093,12.8-19.627,24.747-19.627s22.187,8.533,24.747,19.627C474.627,465.56,478.04,464.707,481.453,464.707z M88.92,464.707c9.387,0,17.067,7.68,17.067,17.067s-7.68,17.067-17.067,17.067H20.653c-9.387,0-17.067-7.68-17.067-17.067 s7.68-17.067,17.067-17.067c3.413,0,6.827,0.853,9.387,2.56c2.56-11.093,12.8-19.627,24.747-19.627s22.187,8.533,24.747,19.627 C82.093,465.56,85.507,464.707,88.92,464.707z"/><path style="fill:#32C77F;" d="M191.32,311.107h34.133v-51.2H191.32V311.107z M54.787,311.107H88.92v-51.2H54.787V311.107z M413.187,413.507h34.133v-51.2h-34.133V413.507z M54.787,413.507H88.92v-51.2H54.787V413.507z M276.653,311.107h34.133v-51.2 h-34.133V311.107z M413.187,311.107h34.133v-51.2h-34.133V311.107z"/></g><path style="fill:#123652;" d="M482.453,504.107c-2.56,0-4.267-1.707-4.267-4.267c0-2.56,1.707-4.267,4.267-4.267 c6.827,0,12.8-5.973,12.8-12.8s-5.973-12.8-12.8-12.8c-2.56,0-5.12,0.853-6.827,1.707c-0.853,0.853-2.56,0.853-4.267,0 c-1.707-0.853-2.56-1.707-2.56-3.413c-2.56-9.387-11.093-16.213-20.48-16.213s-18.773,6.827-20.48,16.213 c0,1.707-0.853,2.56-2.56,3.413c-1.707,0.853-2.56,0-4.267,0c-1.707-1.707-4.267-1.707-6.827-1.707c-6.827,0-12.8,5.973-12.8,12.8 s5.973,12.8,12.8,12.8c2.56,0,4.267,1.707,4.267,4.267c0,2.56-1.707,4.267-4.267,4.267c-11.947,0-21.333-9.387-21.333-21.333 c0-11.947,9.387-21.333,21.333-21.333c2.56,0,4.267,0,6.827,0.853c4.267-11.093,15.36-17.92,27.307-17.92s23.04,6.827,27.307,17.92 c6.827-2.56,14.507-0.853,19.627,3.413V213.974H397.12c-2.56,0-4.267-1.707-4.267-4.267c0-2.56,1.707-4.267,4.267-4.267h98.133 v-12.8c0-2.56,1.707-4.267,4.267-4.267s4.267,1.707,4.267,4.267v290.133C503.787,494.72,494.4,504.107,482.453,504.107z M362.987,504.107c-2.56,0-4.267-1.707-4.267-4.267v-12.8H145.387v12.8c0,2.56-1.707,4.267-4.267,4.267 c-2.56,0-4.267-1.707-4.267-4.267v-17.067c0-2.56,1.707-4.267,4.267-4.267h221.867c2.56,0,4.267,1.707,4.267,4.267v17.067 C367.253,502.4,365.547,504.107,362.987,504.107z M89.92,504.107c-2.56,0-4.267-1.707-4.267-4.267c0-2.56,1.707-4.267,4.267-4.267 c6.827,0,12.8-5.973,12.8-12.8s-5.973-12.8-12.8-12.8c-2.56,0-5.12,0.853-6.827,1.707c-0.853,0.853-2.56,0.853-4.267,0 c-1.707-0.853-2.56-1.707-2.56-3.413c-2.56-9.387-11.093-16.213-20.48-16.213s-18.773,6.827-20.48,16.213 c0,1.707-0.853,2.56-2.56,3.413c-1.707,0.853-2.56,0-4.267,0c-1.707-1.707-4.267-1.707-6.827-1.707c-6.827,0-12.8,5.973-12.8,12.8 s5.973,12.8,12.8,12.8c2.56,0,4.267,1.707,4.267,4.267c0,2.56-1.707,4.267-4.267,4.267c-11.947,0-21.333-9.387-21.333-21.333V192.64 c0-2.56,1.707-4.267,4.267-4.267s4.267,1.707,4.267,4.267v12.8h98.133c2.56,0,4.267,1.707,4.267,4.267 c0,2.56-1.707,4.267-4.267,4.267H8.854v251.733c5.12-4.267,12.8-5.12,19.627-3.413c4.267-11.093,15.36-17.92,27.307-17.92 s23.04,7.68,27.307,17.92c2.56-0.853,4.267-0.853,6.827-0.853c11.947,0,21.333,9.387,21.333,21.333 C111.254,494.72,101.867,504.107,89.92,504.107z M362.987,452.907c-2.56,0-4.267-1.707-4.267-4.267V107.307 c0-2.56,1.707-4.267,4.267-4.267s4.267,1.707,4.267,4.267V448.64C367.253,451.2,365.547,452.907,362.987,452.907z M294.72,452.907 c-2.56,0-4.267-1.707-4.267-4.267v-81.067h-76.8v81.067c0,2.56-1.707,4.267-4.267,4.267s-4.267-1.707-4.267-4.267v-81.067h-29.867 c-2.56,0-4.267-1.707-4.267-4.267c0-2.56,1.707-4.267,4.267-4.267h153.6c2.56,0,4.267,1.707,4.267,4.267 c0,2.56-1.707,4.267-4.267,4.267h-29.867v81.067C298.987,451.2,297.28,452.907,294.72,452.907z M141.12,452.907 c-2.56,0-4.267-1.707-4.267-4.267v-332.8c0-2.56,1.707-4.267,4.267-4.267c2.56,0,4.267,1.707,4.267,4.267v332.8 C145.387,451.2,143.68,452.907,141.12,452.907z M448.32,418.774h-34.133c-2.56,0-4.267-1.707-4.267-4.267v-51.2 c0-2.56,1.707-4.267,4.267-4.267h34.133c2.56,0,4.267,1.707,4.267,4.267v51.2C452.587,417.067,450.88,418.774,448.32,418.774z M418.453,410.24h25.6v-42.667h-25.6V410.24z M89.92,418.774H55.787c-2.56,0-4.267-1.707-4.267-4.267v-51.2 c0-2.56,1.707-4.267,4.267-4.267H89.92c2.56,0,4.267,1.707,4.267,4.267v51.2C94.187,417.067,92.48,418.774,89.92,418.774z M60.053,410.24h25.6v-42.667h-25.6V410.24z M448.32,316.374h-34.133c-2.56,0-4.267-1.707-4.267-4.267v-51.2 c0-2.56,1.707-4.267,4.267-4.267h34.133c2.56,0,4.267,1.707,4.267,4.267v51.2C452.587,314.667,450.88,316.374,448.32,316.374z M418.453,307.84h25.6v-42.667h-25.6V307.84z M311.787,316.374h-34.133c-2.56,0-4.267-1.707-4.267-4.267v-51.2 c0-2.56,1.707-4.267,4.267-4.267h34.133c2.56,0,4.267,1.707,4.267,4.267v51.2C316.053,314.667,314.347,316.374,311.787,316.374z M281.92,307.84h25.6v-42.667h-25.6V307.84z M226.453,316.374H192.32c-2.56,0-4.267-1.707-4.267-4.267v-51.2 c0-2.56,1.707-4.267,4.267-4.267h34.133c2.56,0,4.267,1.707,4.267,4.267v51.2C230.72,314.667,229.013,316.374,226.453,316.374z M196.587,307.84h25.6v-42.667h-25.6V307.84z M89.92,316.374H55.787c-2.56,0-4.267-1.707-4.267-4.267v-51.2 c0-2.56,1.707-4.267,4.267-4.267H89.92c2.56,0,4.267,1.707,4.267,4.267v51.2C94.187,314.667,92.48,316.374,89.92,316.374z M60.053,307.84h25.6v-42.667h-25.6V307.84z M252.053,196.907c-34.987,0-64-29.013-64-64s29.013-64,64-64s64,29.013,64,64 S287.04,196.907,252.053,196.907z M252.053,77.44c-30.72,0-55.467,24.747-55.467,55.467s24.747,55.467,55.467,55.467 s55.467-24.747,55.467-55.467S282.773,77.44,252.053,77.44z M260.587,145.707H243.52c-2.56,0-4.267-1.707-4.267-4.267v-34.133 c0-2.56,1.707-4.267,4.267-4.267s4.267,1.707,4.267,4.267v29.867h12.8c2.56,0,4.267,1.707,4.267,4.267 S263.147,145.707,260.587,145.707z M380.053,85.974c-0.853,0-1.707,0-2.56-0.853l-125.44-75.093L126.613,85.12 c-1.707,0.853-4.267,0.853-5.973-1.707s-0.853-4.267,1.707-5.973l128-76.8c1.707-0.853,3.413-0.853,4.267,0l128,76.8 c1.707,0.853,2.56,3.413,1.707,5.973C382.613,85.12,381.76,85.974,380.053,85.974z"/></svg>',
    experience: '<svg class="result-item-icon" viewBox="-4 0 34 34" width="19" height="19" fill="none" aria-hidden="true" focusable="false"><title>سنوات تجربی</title><g id="Vivid.JS" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Vivid-Icons" transform="translate(-750.000000, -644.000000)"><g id="Icons" transform="translate(37.000000, 169.000000)"><g id="doc" transform="translate(702.000000, 468.000000)"><g transform="translate(11.000000, 7.000000)"><rect id="Rectangle-path" fill="#123652" rx="2" fill-rule="nonzero" x="0" y="0" width="26" height="34"/><path d="M5,0 L5,11 L8,8 L11,11 L11,0 L5,0 Z" fill="#28A76A"/><path d="M17,12 L26,12 L26,14 L17,14 L17,12 Z M17,18 L26,18 L26,20 L17,20 L17,18 Z M17,23 L26,23 L26,25 L17,25 L17,23 Z" fill="#FFFFFF"/><path d="M13.995,12.005 L13.995,13.987 L17.005,13.987 L17.005,12.005 L13.995,12.005 Z M13.995,18.015 L13.995,20 L17.005,20 L17.005,18.016 L13.995,18.016 L13.995,18.015 Z M13.995,22.993 L13.995,25.007 L17.005,25.007 L17.005,22.993 L13.995,22.993 Z" fill="#86EFAC"/></g></g></g></g></g></svg>'
  };

  function renderFound(data) {
    const { fullName, position, workplace, experience, status } = data;
    const statusInfo = classifyStatus(status);

    // ۱. نام فراگیر و ۲. نشان کپسولی وضعیت به عنوان کانون اصلی توجه
    resParticipantName.textContent = fullName || 'فراگیر محترم دوره';
    resStatusPill.className = `status-pill ${statusInfo.cls}`;
    resStatusIcon.innerHTML = getStatusSvg(statusInfo.iconType);
    resStatusText.textContent = statusInfo.label;

    // ترتیب فیلدها بر حسب اولویت: سمت سازمانی، محل خدمت، سنوات تجربی
    resDetailsList.innerHTML = '';

    const fields = [
      { label: 'سمت سازمانی', value: position || '---', iconSvg: ROW_ICONS.position },
      { label: 'محل خدمت', value: workplace || '---', iconSvg: ROW_ICONS.workplace },
      { label: 'سنوات تجربی', value: formatExperience(experience), iconSvg: ROW_ICONS.experience },
    ];

    fields.forEach(({ label, value, iconSvg }) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'result-row';

      const dtEl = document.createElement('dt');
      dtEl.className = 'item-label';

      if (iconSvg) {
        dtEl.insertAdjacentHTML('beforeend', iconSvg);
      }

      const labelSpan = document.createElement('span');
      labelSpan.textContent = label;
      dtEl.append(labelSpan);

      const ddEl = document.createElement('dd');
      ddEl.className = 'item-value';
      ddEl.textContent = value;

      rowEl.append(dtEl, ddEl);
      resDetailsList.append(rowEl);
    });

    // ثبت شفاف تاریخ و ساعت استعلام به تقویم جلالی با ارقام فارسی
    const now = new Date();
    const jalaliFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const jalaliDateStr = toPersianDigits(jalaliFormatter.format(now));
    resQueryTime.textContent = `زمان استعلام: ${jalaliDateStr}`;

    // نمایش کارت و اسکرول ملایم به سمت نتیجه
    resultCard.hidden = false;
    alertContainer.innerHTML = '';
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ── ۷. رندر جعبه‌های اعلان خطا یا عدم یافت کد ملی ──────────────────────────

  function createAlertBox(title, message, isError = true) {
    resultCard.hidden = true;
    alertContainer.innerHTML = '';

    const box = document.createElement('div');
    box.className = `alert-box ${isError ? 'alert-error' : 'alert-warning'}`;
    box.setAttribute('role', isError ? 'alert' : 'status');

    // SVG آیکون اعلان
    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSvg.setAttribute('class', 'alert-icon');
    iconSvg.setAttribute('viewBox', '0 0 20 20');
    iconSvg.setAttribute('fill', 'currentColor');
    iconSvg.setAttribute('aria-hidden', 'true');
    iconSvg.setAttribute('focusable', 'false');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute(
      'd',
      'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
    );
    path.setAttribute('clip-rule', 'evenodd');
    iconSvg.append(path);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'alert-content';

    const titleEl = document.createElement('strong');
    titleEl.className = 'alert-title';
    titleEl.textContent = title;

    const descEl = document.createElement('p');
    descEl.className = 'alert-desc';
    descEl.textContent = message;

    contentDiv.append(titleEl, descEl);
    box.append(iconSvg, contentDiv);
    alertContainer.append(box);

    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderNotFound(message) {
    const defaultTitle = 'کد ملی یافت نشد. دو دلیل می‌تواند داشته باشد:';
    const defaultDesc = `۱- حضور نداشتن در جلسه‌ی مربوط به تمرین بارگذاری شده.
۲- عدم ثبت نام در فرم اولیه دوره (فراگیر فاقد اطلاعات).`;

    if (!message || message.includes('ثبت نشده است') || message.includes('دو دلیل')) {
      createAlertBox(defaultTitle, defaultDesc, false);
      return;
    }

    createAlertBox('کد ملی یافت نشد', message, false);
  }

  function renderError(errType) {
    let msg = 'خطا در ارتباط با سرور سامانه. لطفاً اتصال اینترنت خود را بررسی نموده و مجدداً تلاش فرمایید.';

    if (errType === 'AbortError' || errType === 'timeout') {
      msg = 'مهلت اتصال به سرور به پایان رسید. ممکن است سرعت اینترنت پایین باشد؛ لطفاً دوباره تلاش نمایید.';
    } else if (String(errType).startsWith('http_')) {
      msg = `پاسخ ناموفق از سرور مرکزی (${toPersianDigits(errType.replace('http_', ''))}). لطفاً دقایقی دیگر مراجعه فرمایید.`;
    }

    createAlertBox('خطا در دریافت اطلاعات', msg, true);
  }

  // ── ۸. رویداد ارسال فرم استعلام ──────────────────────────────────────────

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const code = input.value.trim();
    const validation = validateMelliCode(code);

    if (!validation.isValid) {
      showFieldError(validation.message);
      input.focus();
      return;
    }

    showFieldSuccess();
    setLoading(true);

    try {
      const json = await apiFetch(validation.normalized);

      if (json && json.success && json.data) {
        renderFound(json.data);
      } else {
        renderNotFound(json ? json.message : null);
      }
    } catch (err) {
      const errName = err.name === 'AbortError' ? 'AbortError' : err.message;
      renderError(errName);
    } finally {
      setLoading(false);
    }
  });

})();
