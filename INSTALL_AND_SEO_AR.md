# دليل التثبيت وتحسين محركات البحث

## التثبيت المحلي

1. استنساخ المستودع:
```bash
git clone https://github.com/mohamedelmaz/devbox-tools.git
cd devbox-tools
```

2. تشغيل خادم محلي:
```bash
python -m http.server 8080
```

3. فتح المتصفح على `http://localhost:8080`

## النشر على GitHub Pages

1. اذهب إلى إعدادات المستودع (Settings)
2. انتقل إلى قسم Pages
3. اختر المصدر: Branch `main`, Folder `/ (root)`
4. احفظ التغييرات

## SEO

- canonical URLs تشير إلى: `https://mohamedelmaz.github.io/devbox-tools/`
- sitemap.xml يحتوي على ~28 عنوان URL
- robots.txt يسمح بجميع العناكب ويشير إلى sitemap
- كل صفحة تحتوي على OG Tags + Twitter Cards + Schema JSON-LD

## هيكل المشروع

```
devbox/
├── index.html              # الصفحة الرئيسية
├── 404.html                # صفحة الخطأ المخصصة
├── .htaccess               # إعدادات Apache
├── .gitignore
├── LICENSE                 # MIT
├── CONTRIBUTING.md
├── README.md
├── INSTALL_AND_SEO_AR.md   # هذا الملف
├── manifest.webmanifest    # PWA manifest
├── robots.txt
├── sitemap.xml
├── sw.js                   # Service Worker
├── about/                  # صفحة من نحن
├── contact/                # صفحة الاتصال
├── privacy-policy/         # سياسة الخصوصية
├── terms/                  # الشروط والأحكام
├── donate/                 # صفحة التبرع
├── developers/             # صفحة المطورين
├── guides/                 # 5 مقالات إرشادية
├── tools/                  # 14 أداة تطوير
└── assets/                 # CSS, JS, صور
```

## التحقق

بعد النشر، تحقق من:
- https://mohamedelmaz.github.io/devbox-tools/
- https://mohamedelmaz.github.io/devbox-tools/sitemap.xml
- https://mohamedelmaz.github.io/devbox-tools/tools/json-formatter/
