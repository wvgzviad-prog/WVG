# Work Visa Georgia — wvg.ge

Professional multilingual recruitment platform built with **Next.js 15 + TypeScript + Tailwind CSS + next-intl**.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| i18n | next-intl |
| Icons | lucide-react |
| Deploy | Vercel (ready) |

---

## Folder Structure

```
wvg-website/
├── app/
│   ├── layout.tsx              ← root redirect
│   ├── page.tsx                ← redirects / → /ka
│   └── [locale]/
│       ├── layout.tsx          ← locale shell (Navbar + Footer)
│       ├── page.tsx            ← Home
│       ├── about/page.tsx      ← About Us
│       ├── vacancies/page.tsx  ← Vacancies (with filters)
│       ├── register/page.tsx   ← Candidate Registration Form
│       ├── documents/page.tsx  ← Required Documents
│       ├── procedure/page.tsx  ← Process Timeline
│       ├── faq/page.tsx        ← FAQ Accordion
│       ├── partners/page.tsx   ← Employers + Request Form
│       └── contact/page.tsx    ← Contact + Form
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          ← sticky nav, mobile menu, lang switcher
│   │   └── Footer.tsx          ← full footer + WhatsApp float button
├── messages/
│   ├── ka.json                 ← Georgian (default)
│   ├── en.json                 ← English
│   └── ru.json                 ← Russian
├── i18n/
│   ├── routing.ts              ← locale config
│   └── request.ts              ← server-side i18n
├── middleware.ts               ← locale routing middleware
└── next.config.ts              ← next-intl plugin
```

---

## Local Development

```bash
# 1. Extract archive
tar -xzf wvg-website.tar.gz
cd wvg-website

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# Open: http://localhost:3000
# → auto-redirects to http://localhost:3000/ka
```

---

## Language Switching

URLs follow the pattern: `/ka/...`, `/en/...`, `/ru/...`

The language switcher in the navbar generates the correct localized URL for the current page. Georgian is the default locale.

---

## Design Tokens

| Token | Value |
|---|---|
| Navy (primary) | `#0f2557` |
| Navy dark | `#091840` |
| Gold (accent) | `#c9a84c` |
| Body font | Inter + Noto Sans Georgian |

---

## Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect GitHub repo at vercel.com
# Framework preset: Next.js (auto-detected)
# No environment variables needed for base deployment
```

---

## Future Integrations

### Airtable (candidate registration)
In `app/[locale]/register/page.tsx`, replace the `setTimeout` mock with:
```ts
await fetch('https://api.airtable.com/v0/YOUR_BASE_ID/Candidates', {
  method: 'POST',
  headers: {
    Authorization: `Bearer YOUR_API_KEY`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ fields: { ...formData } }),
});
```

### WhatsApp notification (Twilio / WATI)
After successful form submit, POST to WhatsApp API with candidate summary.

### Google Sheets fallback
Use `google-spreadsheet` npm package as an alternative to Airtable.

---

## Pages

| Route | Page |
|---|---|
| `/ka` | Home (hero, stats, process, vacancies preview, testimonials) |
| `/ka/about` | About WVG (mission, experience, why us) |
| `/ka/vacancies` | Job listings with country/category/search filters |
| `/ka/register` | Candidate registration form |
| `/ka/documents` | Required documents (12 doc types) |
| `/ka/procedure` | 9-step process timeline |
| `/ka/faq` | 10-question accordion FAQ |
| `/ka/partners` | For employers + workforce request form |
| `/ka/contact` | Contact info + message form + map placeholder |

Replace `/ka` with `/en` or `/ru` for other languages.
