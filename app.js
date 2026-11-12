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

  // ── ۰. مدیریت پرده بارگذاری اولیه با زمان پایه ۳ ثانیه (App Initial Loader) ──
  const LOADER_BASE_DURATION_MS = 3000; // ماندگاری پایه ۳ ثانیه طبق الزام کاربر
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
      const remainingWait = Math.max(0, LOADER_BASE_DURATION_MS - elapsed);

      setTimeout(() => {
        loader.classList.add('fade-out');
        document.body.classList.remove('app-loading');
        loader.setAttribute('aria-hidden', 'true');

        // حذف ایمن عنصر از درخت DOM پس از تکمیل ترنزیشن محو شدن
        setTimeout(() => {
          if (loader.parentNode) {
            loader.hidden = true;
            loader.remove();
          }
        }, 550);
      }, remainingWait);
    }

    // منتظر ماندن برای لود کامل همه منابع (تصاویر، قلم‌های محلی، استایل‌ها)
    if (document.readyState === 'complete') {
      dismissLoader();
    } else {
      window.addEventListener('load', dismissLoader, { once: true });
    }

    // زمان‌سنج اطمینان اضطراری (Fallback Safety)
    setTimeout(dismissLoader, 8000);
  }

  initAppLoader();

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

    // ۱. رد شده (قرمز غلیظ) — شامل دلایل تفصیلی مثل «رد شده (استفاده از هوش مصنوعی)»
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
      return {
        cls: 'status-rejected',
        iconType: 'cross',
        label: (s === 'رد' || lower === 'rejected') ? 'رد شده' : s,
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
        label: (s && s !== 'pending') ? s : 'بررسی نشده',
      };
    }

    // ۴. مقادیر دقیق مثبت (تکلیف شماره یک ارسال شده است - سبز)
    const positiveExact = [
      'ارسال کرده',
      'ارسال شده',
      'تحویل داده',
      'انجام داده',
      'بله',
      'تایید',
      'تأیید',
      'yes',
      'approved',
    ];

    if (positiveExact.includes(s) || positiveExact.includes(lower) || lower.startsWith('ارسال شده') || lower.startsWith('ارسال کرده')) {
      return {
        cls: 'status-approved',
        iconType: 'check',
        label: 'ارسال شده',
      };
    }

    // ۵. مقادیر سفارشی دیگر به‌صورت وضعیت خنثی همراه با مقدار خام نمایش داده می‌شوند
    if (s && s !== '---' && s !== '-') {
      return {
        cls: 'status-neutral',
        iconType: 'neutral',
        label: s,
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

    return `<svg class="status-svg" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="4" fill="currentColor" />
    </svg>`;
  }

  // ── ۳. عناصر و ارجاعات DOM ────────────────────────────────────────────────

  const form               = document.getElementById('inquiry-form');
  const input              = document.getElementById('melli-input');
  const btnClear           = document.getElementById('btn-clear');
  const fieldHint          = document.getElementById('field-hint');
  const fieldSuccess       = document.getElementById('field-success');
  const fieldError         = document.getElementById('field-error');
  const submitBtn          = document.getElementById('submit-btn');
  const skeletonLoader     = document.getElementById('skeleton-loader');
  const resultCard         = document.getElementById('result-card');
  const resParticipantName = document.getElementById('res-participant-name');
  const resStatusPill      = document.getElementById('res-status-pill');
  const resStatusIcon      = document.getElementById('res-status-icon');
  const resStatusText      = document.getElementById('res-status-text');
  const resDetailsList     = document.getElementById('res-details-list');
  const resQueryTime       = document.getElementById('res-query-time');
  const alertContainer     = document.getElementById('alert-container');

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
      { label: 'سمت سازمانی', value: position || '---', icon: 'assets/سمت.svg' },
      { label: 'محل خدمت', value: workplace || '---', icon: 'assets/محل خدمت.svg' },
      { label: 'سنوات تجربی', value: experience ? `${toPersianDigits(experience)} سال` : '---', icon: 'assets/سنوات تجربی.svg' },
    ];

    fields.forEach(({ label, value, icon }) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'result-row';

      const dtEl = document.createElement('dt');
      dtEl.className = 'item-label';

      if (icon) {
        const iconImg = document.createElement('img');
        iconImg.src = icon;
        iconImg.alt = '';
        iconImg.className = 'result-item-icon';
        iconImg.setAttribute('aria-hidden', 'true');
        iconImg.width = 19;
        iconImg.height = 19;
        dtEl.append(iconImg);
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
