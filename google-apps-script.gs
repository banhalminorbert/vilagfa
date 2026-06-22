/**
 * Világfa Sárkányai — Gyermek Dobcsapat | Jelentkezési form feldolgozó
 * Google Apps Script (Web App)
 *
 * MIT CSINÁL:
 *  - fogadja a jelentkezési lap (jelentkezes.html) elküldött adatait,
 *  - e-mailben elküldi a jelentkezést a hupczik@gmail.com ÉS a
 *    marketing@kozpontiszovetseg.at címekre,
 *  - (opcionálisan) egy Google Táblázatba is beírja sorként.
 *
 * ============== TELEPÍTÉS LÉPÉSRŐL LÉPÉSRE ==============
 * 1. Nyisd meg: https://script.google.com  ->  "Új projekt".
 * 2. Töröld a meglévő kódot, és illeszd be EZT a teljes fájlt.
 * 3. (Opcionális) Ha Google Táblázatba is szeretnéd menteni:
 *      - hozz létre egy Google Táblázatot,
 *      - másold ki az URL-jéből az azonosítót (a /d/ ÉS a /edit közötti rész),
 *      - illeszd be lentebb a SHEET_ID értékéhez.
 *    Ha NEM kell táblázat, hagyd a SHEET_ID-t üresen ('').
 * 4. Mentés (lemez ikon).
 * 5. Jobb felül: "Telepítés" -> "Új telepítés".
 *      - Típus: "Webalkalmazás" (Web app).
 *      - Leírás: pl. "Dobcsapat jelentkezés".
 *      - "Végrehajtás mint" (Execute as): Saját magam (Me).
 *      - "Hozzáférés" (Who has access): "Bárki" (Anyone).
 *      - Telepítés -> engedélyek megadása (Authorize) -> fogadd el.
 * 6. Másold ki a kapott "Webalkalmazás URL"-t.
 * 7. Illeszd be a jelentkezes.html fájl elejére, a SCRIPT_URL változóhoz.
 *
 * MEGJEGYZÉS: ha módosítod a kódot, mindig készíts ÚJ verziójú telepítést
 * ("Telepítés kezelése" -> ceruza -> Új verzió), különben a régi fut tovább.
 */

// ====== BEÁLLÍTÁSOK ======
var EMAIL_RECIPIENTS = 'hupczik@gmail.com, marketing@kozpontiszovetseg.at';
var EMAIL_SUBJECT    = 'Új jelentkezés — Világfa Sárkányai Gyermek Dobcsapat';
var SHEET_ID         = ''; // hagyd üresen, ha nem kell Google Táblázat mentés

// A mezők megjelenítendő (magyar) nevei, sorrendben:
var FIELD_LABELS = {
  szuloNev:     'Szülő / gondviselő neve',
  email:        'E-mail cím',
  telefon:      'Telefonszám',
  nyelv:        'Otthoni nyelvhasználat',
  gyermekNev:   'Gyermek neve',
  gyermekKor:   'Gyermek életkora',
  zeneiTudas:   'Előzetes zenei tapasztalat',
  egeszseg:     'Egészségügyi tudnivaló',
  utem:         'Választott ütemforma',
  dobkeszito:   'Dobkészítő műhely iránti érdeklődés',
  honnan:       'Honnan hallott rólunk',
  felnottDob:   'Felnőtt dobcsapatban részt venne',
  megjegyzes:   'Megjegyzés',
  gdprConsent:  'Adatkezelési hozzájárulás',
  bekuldveTime: 'Beküldés időpontja'
};

function doPost(e) {
  try {
    var data = parsePayload(e);

    sendNotificationEmail(data);

    if (SHEET_ID) {
      appendToSheet(data);
    }

    return jsonResponse({ result: 'success' });
  } catch (err) {
    return jsonResponse({ result: 'error', message: String(err) });
  }
}

// Egyszerű GET-teszt: böngészőből megnyitva visszajelez, hogy él a szkript.
function doGet() {
  return ContentService
    .createTextOutput('Vilagfa Sarkanyai jelentkezes-feldolgozo aktiv.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function parsePayload(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (ignore) {}
  }
  // tartalék: form-encoded paraméterek
  return (e && e.parameter) ? e.parameter : {};
}

function sendNotificationEmail(data) {
  var rows = '';
  var plain = '';
  for (var key in FIELD_LABELS) {
    var label = FIELD_LABELS[key];
    var value = (data[key] !== undefined && data[key] !== null && String(data[key]).trim() !== '')
      ? String(data[key]) : '—';
    var safe = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    rows += '<tr>' +
              '<td style="padding:8px 12px;border:1px solid #e0d8c4;background:#faf6ec;font-weight:600;vertical-align:top;width:230px;">' + label + '</td>' +
              '<td style="padding:8px 12px;border:1px solid #e0d8c4;">' + safe.replace(/\n/g, '<br>') + '</td>' +
            '</tr>';
    plain += label + ': ' + value + '\n';
  }

  var html =
    '<div style="font-family:Arial,Helvetica,sans-serif;color:#20180f;max-width:640px;">' +
      '<h2 style="color:#C1502E;">Új jelentkezés érkezett</h2>' +
      '<p>A Világfa Sárkányai Gyermek Dobcsapat weboldalán keresztül új jelentkezés érkezett:</p>' +
      '<table style="border-collapse:collapse;width:100%;font-size:14px;">' + rows + '</table>' +
      '<p style="margin-top:16px;font-size:12px;color:#8a7f64;">Ez egy automatikus értesítés a becs.taltosdob.hu jelentkezési lapjáról.</p>' +
    '</div>';

  var replyTo = (data.email && String(data.email).indexOf('@') > -1) ? String(data.email) : undefined;

  MailApp.sendEmail({
    to: EMAIL_RECIPIENTS,
    subject: EMAIL_SUBJECT + (data.gyermekNev ? ' — ' + data.gyermekNev : ''),
    htmlBody: html,
    body: plain,
    replyTo: replyTo,
    name: 'Világfa Sárkányai jelentkezés'
  });
}

function appendToSheet(data) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('Jelentkezesek') || ss.insertSheet('Jelentkezesek');

  var keys = Object.keys(FIELD_LABELS);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(keys.map(function (k) { return FIELD_LABELS[k]; }));
  }
  sheet.appendRow(keys.map(function (k) {
    return (data[k] !== undefined && data[k] !== null) ? data[k] : '';
  }));
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
