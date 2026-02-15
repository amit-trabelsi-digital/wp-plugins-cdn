# WordPress Plugins Distribution System - Summary

**Owner:** Amit Trabelsi (amit@trabel.si)
**Organization:** amit-trabelsi-digital
**CDN Domain:** https://updates.amiteam.io
**Created:** February 15, 2026

---

## 🎯 מטרת המערכת

מערכת אוטומטית להפצת עדכוני פלאגינים לאתרי WordPress באמצעות:
- ✅ GitHub Releases כ-CDN (חינם)
- ✅ Railway CDN Server לmetadata
- ✅ GitHub Actions לאוטומציה מלאה
- ✅ דומיין מותאם אישי

---

## 🏗️ ארכיטקטורה

```
WordPress Site
    ↓ (checks for updates)
Plugin Update URI → https://updates.amiteam.io/plugin-name/plugin-info.json
    ↓ (contains download URL)
GitHub Releases → https://github.com/.../releases/download/v1.0.0/plugin.zip
    ↓ (downloads & installs)
WordPress Plugin Updated! ✅
```

---

## 📦 רכיבי המערכת

### 1. Railway CDN Server
- **URL:** https://updates.amiteam.io
- **GitHub:** https://github.com/amit-trabelsi-digital/wp-plugins-cdn
- **Railway:** https://railway.com/project/f22150f3-b9a2-4926-9b79-2497008fa501
- **תפקיד:** משרת plugin-info.json files
- **טכנולוגיה:** Node.js + Express
- **פריסה:** אוטומטית מ-GitHub push

### 2. GitHub Actions Workflows
**מיקום:** `.github/workflows/release-to-railway.yml`

**טריגר:** Git tags (v*.*.*)

**תהליך:**
1. בניית ZIP מהקוד
2. יצירת GitHub Release
3. יצירת plugin-info.json
4. העלאה ל-GitHub Releases
5. עדכון Railway CDN

### 3. הפלאגינים

#### AT Agency Sites Manager
- **Repo:** https://github.com/amit-trabelsi-digital/at-agency-sites-manager-wp-plugin
- **גרסה נוכחית:** 0.12.0
- **Update URI:** https://updates.amiteam.io/at-agency-sites-manager/plugin-info.json

#### WordPress AI Assistant
- **Repo:** https://github.com/athbss/wp-ai-bro
- **גרסה נוכחית:** 1.3.0
- **Update URI:** https://updates.amiteam.io/wordpress-ai-assistant/plugin-info.json

---

## 🚀 תהליך פרסום גרסה חדשה

### שלב 1: עדכון גרסה
```php
// ערוך את קובץ הפלאגין הראשי
/**
 * Version: 1.0.1  // ← עדכן כאן
 */
```

### שלב 2: Commit & Tag
```bash
git add .
git commit -m "bump: version 1.0.1"
git push origin main

git tag v1.0.1
git push origin v1.0.1
```

### שלב 3: GitHub Actions (אוטומטי)
- ✅ בונה ZIP עם כל הקבצים הנדרשים
- ✅ יוצר GitHub Release עם קובץ הZIP
- ✅ יוצר plugin-info.json עם כל המטא-דאטה
- ✅ מעדכן את Railway CDN Repository
- ✅ Railway פורס אוטומטית את השינויים

### שלב 4: WordPress (אוטומטי)
- WordPress בודק עדכונים כל 12 שעות
- מוצא גרסה חדשה ב-plugin-info.json
- מציג התראה למשתמש
- משתמש לוחץ "עדכן עכשיו"
- WordPress מוריד מ-GitHub Releases
- מתקין ומפעיל! ✅

---

## 🔐 אבטחה

### robots.txt
```
User-agent: *
Disallow: /
```
כל הבוטים חסומים מלסרוק את השרת.

### GitHub Secrets
כל repository של פלאגין צריך:
- `RAILWAY_CDN_REPO` = `amit-trabelsi-digital/wp-plugins-cdn`
- `RAILWAY_CDN_TOKEN` = Personal Access Token עם הרשאות repo

### CORS
מופעל רק לקבצים הנדרשים (plugin-info.json)

---

## 📊 API Endpoints

### `GET /`
מידע על השרת
```json
{
  "status": "ok",
  "name": "Amit Trabelsi - WordPress Plugins Distribution Server",
  "owner": "Amit Trabelsi",
  "contact": "amit@trabel.si"
}
```

### `GET /health`
בדיקת תקינות
```json
{
  "status": "ok",
  "message": "WordPress Plugins CDN is running"
}
```

### `GET /plugins`
רשימת פלאגינים
```json
{
  "plugins": [
    {
      "name": "at-agency-sites-manager",
      "url": "https://updates.amiteam.io/at-agency-sites-manager"
    },
    {
      "name": "wordpress-ai-assistant",
      "url": "https://updates.amiteam.io/wordpress-ai-assistant"
    }
  ]
}
```

### `GET /:plugin/plugin-info.json`
מטא-דאטה של פלאגין (פורמט WordPress Update API)

---

## 💰 עלויות

- **GitHub Releases:** חינם ללא הגבלה
- **Railway Free Tier:** 500 שעות/חודש (מספיק)
- **GitHub Actions:** 2000 דקות/חודש (מספיק)
- **Domain:** עלות של הדומיין בלבד

**עלות כוללת: $0/חודש** (מלבד דומיין)

---

## 🔧 תחזוקה

### בדיקת תקינות
```bash
curl https://updates.amiteam.io/health
curl https://updates.amiteam.io/at-agency-sites-manager/plugin-info.json | jq
```

### עדכון ידני של plugin-info.json
אם צריך לעדכן ידנית:
```bash
cd /path/to/wp-plugins-cdn
# ערוך public/plugin-name/plugin-info.json
git add .
git commit -m "Update plugin info"
git push
# Railway יפרוס אוטומטית
```

### ניקוי Cache ב-WordPress
```php
delete_site_transient('update_plugins');
```

---

## 📈 סטטיסטיקות

- **זמן פריסה:** ~30 שניות מ-git push
- **זמן build:** ~2-3 דקות ב-GitHub Actions
- **זמן זיהוי עדכון ב-WordPress:** עד 12 שעות (או מיידי אם מנקים cache)

---

## 🆘 Troubleshooting

### העדכון לא מופיע ב-WordPress
1. נקה cache: `delete_site_transient('update_plugins');`
2. בדוק Update URI בפלאגין
3. בדוק ש-plugin-info.json מעודכן

### GitHub Actions נכשל
1. בדוק Secrets (RAILWAY_CDN_REPO, RAILWAY_CDN_TOKEN)
2. בדוק הרשאות ה-token
3. בדוק logs ב-Actions tab

### Railway לא מתעדכן
1. בדוק connection ב-Railway Dashboard
2. בדוק deployment logs
3. וודא ש-git push הצליח

---

## 📞 תמיכה

**Amit Trabelsi**
📧 amit@trabel.si
🌐 https://amit-trabelsi.co.il
🔗 GitHub: @athbss

---

**Last Updated:** February 15, 2026
**System Status:** ✅ Operational
