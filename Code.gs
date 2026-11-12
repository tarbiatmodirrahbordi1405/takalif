const CACHE_TTL_SEC = 90; // ماندگاری کش (۹۰ ثانیه) جهت بازتاب سریع تغییرات مدیران در شیت
const CHUNK_SIZE = 90000;  // سقف ۹۰ کیلوبایت برای هر کلید (محدودیت گوگل ۱۰۰ کیلوبایت است)

function getCachedDataMap() {
  try {
    const cache = CacheService.getScriptCache();
    const metaStr = cache.get("data_map_meta");
    if (!metaStr) return null;
    
    const meta = JSON.parse(metaStr);
    let fullJson = "";
    for (let i = 0; i < meta.chunks; i++) {
      const chunk = cache.get("data_map_chunk_" + i);
      if (chunk === null) return null; // در صورت انقضای هر چانک، کش را نامعتبر تلقی کن
      fullJson += chunk;
    }
    return JSON.parse(fullJson);
  } catch (err) {
    return null;
  }
}

function setCachedDataMap(map) {
  try {
    const cache = CacheService.getScriptCache();
    const jsonStr = JSON.stringify(map);
    const chunkCount = Math.ceil(jsonStr.length / CHUNK_SIZE);
    
    const entries = {};
    entries["data_map_meta"] = JSON.stringify({ chunks: chunkCount });
    
    for (let i = 0; i < chunkCount; i++) {
      entries["data_map_chunk_" + i] = jsonStr.substring(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    }
    
    cache.putAll(entries, CACHE_TTL_SEC);
  } catch (err) {
    // در صورت بروز خطا در ذخیره‌سازی کش، عملیات اصلی متوقف نمی‌شود
  }
}

function buildDataMapFromSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("تکلیف اول") || ss.getSheets()[0];
  const data = sheet.getDataRange().getValues();
  
  const map = {};
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    let rowId = String(row[1] || "").replace(/\D/g, "").trim();
    if (rowId.length > 0 && rowId.length < 10) {
      rowId = rowId.padStart(10, "0");
    }
    if (rowId) {
      map[rowId] = {
        fullName: row[0] || "---",       // Column A: نام و نام خانوادگی
        position: row[5] || "---",       // Column F: سمت
        workplace: row[6] || "---",      // Column G: محل خدمت
        experience: row[7] || "---",     // Column H: سنوات تجربی خدمت
        status: String(row[9] || "ارسال نکرده").trim() // Column J: ارسال تکالیف
      };
    }
  }
  return map;
}

function doGet(e) {
  const nationalId = e && e.parameter ? e.parameter.id : null;
  if (!nationalId) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      message: "لطفاً کد ملی را وارد نمایید." 
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // نرمال‌سازی کد ملی ورودی: حذف کاراکترهای غیرعددی و تکمیل صفرهای ابتدایی
  let cleanQueryId = String(nationalId).replace(/\D/g, "").trim();
  if (cleanQueryId.length > 0 && cleanQueryId.length < 10) {
    cleanQueryId = cleanQueryId.padStart(10, "0");
  }

  // ۱. تلاش برای خواندن داده از کش سریع
  let dataMap = getCachedDataMap();

  // ۲. در صورت Cache Miss، واکشی از شیت و پر کردن کش
  if (!dataMap) {
    try {
      dataMap = buildDataMapFromSheet();
      setCachedDataMap(dataMap);
    } catch (err) {
      dataMap = null;
    }
  }

  if (dataMap && dataMap[cleanQueryId]) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      data: dataMap[cleanQueryId] 
    })).setMimeType(ContentService.MimeType.JSON);
  } else if (dataMap) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      message: "کد ملی یافت نشد. دو دلیل می‌تواند داشته باشد:\n۱- حضور نداشتن در جلسه‌ی مربوط به تمرین بارگذاری شده.\n۲- عدم ثبت نام در فرم اولیه دوره (فراگیر فاقد اطلاعات)." 
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // ۳. فال‌بک مستقیم و ایمن به اسکن ترتیبی شیت در صورت بروز هرگونه خطای کش
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("تکلیف اول") || ss.getSheets()[0];
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    let rowId = String(row[1] || "").replace(/\D/g, "").trim();
    if (rowId.length > 0 && rowId.length < 10) {
      rowId = rowId.padStart(10, "0");
    }

    if (rowId === cleanQueryId) {
      const result = {
        fullName: row[0] || "---",
        position: row[5] || "---",
        workplace: row[6] || "---",
        experience: row[7] || "---",
        status: String(row[9] || "ارسال نکرده").trim()
      };

      return ContentService.createTextOutput(JSON.stringify({ 
        success: true, 
        data: result 
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ 
    success: false, 
    message: "کد ملی یافت نشد. دو دلیل می‌تواند داشته باشد:\n۱- حضور نداشتن در جلسه‌ی مربوط به تمرین بارگذاری شده.\n۲- عدم ثبت نام در فرم اولیه دوره (فراگیر فاقد اطلاعات)." 
  })).setMimeType(ContentService.MimeType.JSON);
}
