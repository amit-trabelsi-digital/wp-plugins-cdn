# Amit Trabelsi - WordPress Plugins Distribution Server

שרת הפצה מרכזי פרטי לפלאגיני WordPress.

**Owner:** Amit Trabelsi
**Contact:** amit@trabel.si
**Website:** https://amit-trabelsi.co.il
**CDN URL:** https://updates.amiteam.io

## מבנה תיקיות

```
public/
├── at-agency-sites-manager/
│   ├── at-agency-sites-manager.zip
│   └── plugin-info.json
└── wordpress-ai-assistant/
    ├── wordpress-ai-assistant.zip
    └── plugin-info.json
```

## API Endpoints

- `GET /plugins` - רשימת כל הפלאגינים
- `GET /:plugin/info.json` - מידע על פלאגין
- `GET /:plugin/download` - הורדת קובץ ZIP
- `GET /health` - בדיקת תקינות

## שימוש

הפלאגינים בוורדפרס צריכים להצביע ל:
```
Update URI: https://updates.amiteam.io/plugin-name/plugin-info.json
```

דוגמה:
- AT Agency Sites Manager: https://updates.amiteam.io/at-agency-sites-manager/plugin-info.json
- WordPress AI Assistant: https://updates.amiteam.io/wordpress-ai-assistant/plugin-info.json
