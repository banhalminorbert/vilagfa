# Világfa Sárkányai — Gyermek Dobcsapat (becs.taltosdob.hu)

A Táltos Dob bécsi csapata és a Bécsi Magyar Iskola közös gyermek dobcsapat-programjának weboldala.

## Fájlszerkezet

```
becs-taltosdob/
├── index.html              # Főoldal (hero logóval, foglalkozásvezetővel, programtervvel, kapcsolattal)
├── jelentkezes.html        # Jelentkezési lap (a CTA gombok ide mutatnak)
├── adatvedelem.html        # GDPR adatvédelmi tájékoztató
├── google-apps-script.gs   # A formhoz tartozó Google Apps Script (másold be a script.google.com-ba)
├── robots.txt              # SEO
├── sitemap.xml             # SEO
├── CNAME                   # GitHub Pages egyéni domain: becs.taltosdob.hu
└── images/
    ├── logo.png            # A csapat logója (hero + favicon + e-mail/social)
    ├── hupczik-andrea.png  # Hupczik Andrea, foglalkozásvezető (a "Foglalkozásvezető" szekcióban)
    ├── social-share.jpg    # 1200×630 kép a közösségi média megosztáshoz (OG/Twitter)
    └── embedded_1..10.jpeg # A dizájn fotói (a korábbi beágyazott képek külön fájlként)
```

## 1) Közzététel GitHub Pages-en

1. Töltsd fel az egész mappa tartalmát egy GitHub repóba.
2. A repó **Settings → Pages** menüjében:
   - Source: `Deploy from a branch`, Branch: `main` / `/ (root)`.
   - Custom domain: `becs.taltosdob.hu` (a CNAME fájl már mellékelve van).
   - Pipáld be az `Enforce HTTPS` opciót, amint elérhető.
3. A domain szolgáltatónál állíts be egy **CNAME rekordot**:
   `becs` → `<felhasznalonev>.github.io`

## 2) A jelentkezési form bekötése (Google Apps Script)

A form CORS-barát módon küld a Google Apps Scriptnek, ami e-mailt küld
a **hupczik@gmail.com** és a **marketing@kozpontiszovetseg.at** címekre.

1. Nyisd meg: https://script.google.com → **Új projekt**.
2. Illeszd be a `google-apps-script.gs` teljes tartalmát.
3. (Opcionális) Ha Google Táblázatba is mentenél, állítsd be a `SHEET_ID`-t.
4. **Telepítés → Új telepítés → Webalkalmazás**:
   - Végrehajtás mint: *Saját magam*
   - Hozzáférés: *Bárki*
   - Engedélyek elfogadása.
5. Másold ki a kapott **Webalkalmazás URL**-t.
6. Nyisd meg a `jelentkezes.html`-t, és cseréld ki a tetején lévő sort:
   ```js
   const SCRIPT_URL = 'IDE_MASOLD_BE_A_GOOGLE_SCRIPT_WEBAPP_URL_T';
   ```
   a saját URL-edre.
7. Commit + push — kész.

> Megjegyzés: a form `mode:'no-cors'`-szal küld, ezért a böngésző a választ nem
> olvassa, de a küldés megtörténik. A felhasználó minden esetben köszönő üzenetet kap.

## 3) Mit kérdez a jelentkezési lap

- **Szülő:** név, e-mail, telefon, otthoni nyelvhasználat
- **Gyermek:** név, életkor (6–14 a célkorosztály), előzetes zenei tapasztalat, egészségügyi tudnivaló
- **Részvétel:** ütemforma (havi / kéthetente), dobkészítő műhely érdeklődés, honnan hallott rólunk
- **Felnőtt dobcsapat:** a szülő szeretne-e maga is részt venni egy felnőtt dobcsapatban, ha elindul
- **Megjegyzés** + kötelező **GDPR hozzájárulás**

## 4) SEO / GEO / Schema / GDPR

- **SEO:** egyedi `<title>`, meta description, kulcsszavak, canonical, robots, sitemap.xml, robots.txt.
- **GEO:** `geo.*` meta tagek és Schema `GeoCoordinates` (Bécs belváros).
- **Schema.org:** `EducationalOrganization` + `FAQPage` strukturált adat (JSON-LD), ami a kereső- és AI-rendszereknek is segít.
- **Közösségi megosztás:** Open Graph + Twitter Card; a `social-share.jpg` (1200×630) jelenik meg megosztáskor — a foglalkozásvezető a gyerekekkel.
- **GDPR:** külön `adatvedelem.html`; az adatkezelők **Hupczik Andrea** (Táltos Dob) és **Bánhalmi Norbert** (Bécsi Magyar Iskola); a tárhely GitHub, a feldolgozás Google Script.

## Megjegyzés a képekről

A megosztáshoz használt `social-share.jpg` a feltöltött anyagból elérhető, a foglalkozásvezetőt
gyerekekkel ábrázoló legjobb fotóból készült. Ha van egy dedikált csoportkép (ahol Hupczik Andrea
a gyerekeket tanítja), cseréld le az `images/social-share.jpg` fájlt egy 1200×630-as változatra —
a beállítások automatikusan azt fogják használni.
