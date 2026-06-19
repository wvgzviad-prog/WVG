# WVG Website — Airtable to Google Sheets Migration

## Decision
Use this stack for the current launch:

Tally → Google Sheets → WVG Master Registry 2.0 → Website Admin Panel → wvg.ge

Airtable has been removed from the active code path.

## What changed in code

1. Added `lib/google-sheets.server.ts`.
2. Replaced all API imports from `@/lib/airtable.server` to `@/lib/google-sheets.server`.
3. Deleted the old `lib/airtable.server.ts` file.
4. Merged `lib/session.config.ts` into `lib/session.server.ts` (removed separate config file).
5. Updated `.env.local.example` with Google Sheets service account variables.
6. Added `scripts/generate-password-hash.js` utility.

## Required Google Sheet tabs

Create or rename tabs with these exact default names, or override them in `.env.local`:

- Candidates
- Employers
- Projects
- Payments
- Monitoring
- Documents

The first row of each tab must contain headers. Header names must match the field names used by the Admin API exactly.

### Candidates headers:
Name, Phone, WhatsApp, Profession, Destination Country, Candidate Status, Date of Birth,
Work Experience, Has Passport, Worked in Israel, Tried Israel Entry, Ready to Travel Date,
Document Status, Registration Fee Paid, Security Deposit Paid, Notes, Created Time

### Projects headers:
Position Name, Country, Salary, Workers Needed, Status, Schedule, Accommodation, Notes,
Experience Required, Created Time

### Employers headers:
Name, Request Status, Contact, Phone, Email, Notes, Created Time

### Payments headers:
Candidate, Payment Type, Amount GEL, Date, Notes, Method, Created Time

### Monitoring headers:
Name, Candidate, Arrival Date, Employer, Status In Israel, Contract End Date, Notes,
Last Contact, Created Time

### Documents headers:
Name, Profession, Destination Country, Candidate Status, Document Status, Created Time

## Environment variables

Set these in `.env.local` / Vercel environment:

```env
GOOGLE_SHEETS_SPREADSHEET_ID=your_google_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Optional tab name overrides
GOOGLE_SHEET_CANDIDATES=Candidates
GOOGLE_SHEET_EMPLOYERS=Employers
GOOGLE_SHEET_PROJECTS=Projects
GOOGLE_SHEET_PAYMENTS=Payments
GOOGLE_SHEET_MONITORING=Monitoring
GOOGLE_SHEET_DOCUMENTS=Documents

# Admin auth (unchanged)
ADMIN_PASSWORD_HASH=<bcrypt hash — generate with: node scripts/generate-password-hash.js>
ADMIN_SESSION_SECRET=<64-char random hex>
ADMIN_USERNAME=admin
```

## Google Cloud setup

1. Create a Google Cloud project (or use existing).
2. Enable the **Google Sheets API** for the project.
3. Create a **Service Account** under IAM & Admin.
4. Generate a **JSON key** for the service account.
5. Copy `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
6. Copy `private_key` → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (keep `\n` escaping).
7. **Share the Google Sheet** with the service account email as **Editor**.

## Tally integration

Configure Tally form to send webhook data to the Google Sheet named in `GOOGLE_SHEET_CANDIDATES`
(default: `Candidates`). Field mapping must match the header names above exactly.

Tally → Zapier/Make → Google Sheets append row is the recommended no-code path.
Alternatively, use Tally's native Google Sheets integration (Tally Pro feature).

## Important operational rules

- The website Admin Panel reads and writes directly to Google Sheets.
- **Do not write directly to the Excel Master Registry 2.0 file from the website.**
- The Master Registry is synced from Google Sheets by a controlled manual or scheduled process.
- Never delete rows in Google Sheets — use the "clear row" delete (already implemented) to preserve row numbers as stable IDs.

## Record IDs

Unlike Airtable (UUID-style IDs), Google Sheets records use row numbers as IDs (e.g., `"2"`, `"3"`).
These are stable as long as rows are never physically deleted. The `deleteRecord` function clears
(blanks) the row rather than removing it, preserving row numbering integrity.
