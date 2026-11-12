function doGet(e) {
  const nationalId = e.parameter.id;
  if (!nationalId) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      message: "لطفاً کد ملی را وارد نمایید." 
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // Target the specific sheet tab
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("تکلیف اول") || ss.getSheets()[0];
  const data = sheet.getDataRange().getValues();

  // Normalize input: trim and strip non-digits
  const cleanQueryId = String(nationalId).replace(/\D/g, "").trim();

  // Row 0 is header; data starts from Row 1
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // Column B (index 1) is شماره ملی
    // Pad with leading zeros if stored as a 9-digit number
    let rowId = String(row[1]).replace(/\D/g, "").trim();
    if (rowId.length > 0 && rowId.length < 10) {
      rowId = rowId.padStart(10, "0");
    }

    if (rowId === cleanQueryId) {
      const result = {
        fullName: row[0] || "---",       // Column A: نام و نام خانوادگی
        position: row[5] || "---",       // Column F: سمت
        workplace: row[6] || "---",      // Column G: محل خدمت
        experience: row[7] || "---",     // Column H: سنوات تجربی خدمت
        status: String(row[9] || "ارسال نکرده").trim() // Column J: ارسال تکالیف
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