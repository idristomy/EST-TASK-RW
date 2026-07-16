/**
 * AIESEC in Tunisia — recruitment form backend (Google Apps Script).
 *
 * SETUP
 * 1. Open your Google Sheet → Extensions → Apps Script.
 * 2. Delete any boilerplate and paste this whole file.
 * 3. Deploy → New deployment → type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Copy the Web app URL (ends with /exec) and set it as
 *    VITE_APPS_SCRIPT_URL in .env.local and in Vercel.
 *
 * The "Submissions" sheet and its header row are created automatically
 * on the first request, so you don't need to prepare the sheet by hand.
 */

var SHEET_NAME = "Submissions";
var HEADERS = [
  "Timestamp",
  "Full Name",
  "Email",
  "Phone",
  "Local Committee",
  "University",
];

function doPost(e) {
  // Serialize concurrent submissions so two requests can't append to the same
  // row and clobber each other during a recruitment rush.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.phone || "",
      data.lc || "",
      data.university || "",
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Visiting the /exec URL in a browser returns a small health check.
function doGet() {
  return json_({ ok: true, service: "AIESEC Tunisia recruitment" });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  // Force the user-provided columns (Name…University) to plain-text format
  // BEFORE any value is written, so a phone like "+216 20 123 456" is stored
  // literally instead of being parsed as a formula ("Formula parse error").
  // Idempotent and cheap, so it's safe to run on every request.
  sheet.getRange("B:F").setNumberFormat("@");
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
