# IWT Summit — Registration Platform

Registration, review and QR-pass system for the IWT Summit 2026. Applicants
apply under one of seven tracks, the secretariat reviews each application, and
approval issues a signed QR pass that gate staff verify by scanning.

## Running it

```bash
npm run install:all          # root + server + client dependencies
cp server/.env.example server/.env
npm run dev                  # client on :5173, API on :5000
```

The Vite dev server proxies `/api` and `/uploads` to Express, so everything is
same-origin and there is no CORS setup in dev.

Default admin password is in `server/.env` (`iwt-admin-2026`). Change it, and
change `QR_SECRET` too — rotating that secret invalidates every pass already
issued.

## The flow

```
/register  →  pick a category  →  multi-step form  →  submit
                                                        ↓
                                              IWT26-DEL-00001 issued
                                                 status: received
                                                        ↓
                          /admin  →  review documents  →  approve
                                                        ↓
                                       QR pass generated and stored
                                                        ↓
              /status  (email + registration number)  →  pass shown
                                                        ↓
                   gate staff scans  →  /verify/<token>  →  green card
```

## Pages

| Route | Purpose |
|---|---|
| `/` | Hero and how-it-works |
| `/register` | The seven category cards |
| `/register/:category` | Multi-step application wizard |
| `/register/success` | Registration number and next steps |
| `/status` | Applicant status lookup, shows the QR pass once approved |
| `/verify/:token` | What a scanned badge opens — valid/invalid card for gate staff |
| `/admin` | Secretariat sign-in |
| `/admin/applications` | Filterable list of applications |
| `/admin/applications/:id` | Full record, document previews, approve/reject |

## How the forms work

All seven categories run on **one** wizard component. A category is a plain
config object listing steps and fields; there is no per-category form code.

- `client/src/components/FormWizard.jsx` — the engine
- `client/src/forms/configs/` — the seven configs plus `commonSteps.js`, which
  holds the fragments (personal details, uploads, travel preferences, review)
  that every category reuses

To add a field, add an entry to a config. To add a category, add a config and a
matching schema entry in `server/src/validation/categorySchemas.js`.

Text answers are sent as one JSON string in a `data` part alongside the file
parts, so multipart never coerces numbers, booleans or arrays into strings.

## QR passes

The QR encodes a URL, not the holder's details:

```
<PUBLIC_BASE_URL>/verify/<base64url(regId)>.<base64url(HMAC-SHA256(regId))>
```

Any phone camera opens it. Because verification is a live lookup against the
record, nothing personal sits in the code and revoking a pass takes effect
immediately — no reissue needed.

`PUBLIC_BASE_URL` must be an address a phone can reach (the client origin, not
the API port), or scanned passes will not open.

## Storage

Registrations live in the **TiesVerse Data API** (`admin.tiesverse.com`, store
`iwt-summit-2026`). `STORAGE=json` switches back to `server/data/db.json`, and
if the Data API is unreachable at boot the server falls back to JSON rather than
refusing to start — a summit that cannot take registrations is worse than one
whose rows are temporarily local. The log line says which backend is live:

```
[storage] TiesVerse Data API — store "iwt-summit-2026"
[storage] local JSON (server/data/db.json)
```

Set `STORAGE_FALLBACK=false` to make an unreachable API a hard startup failure.

Everything above storage talks only to
`server/src/repositories/registrationRepository.js`, which picks between two
modules exporting the same eight names. Routes, services and the client are
identical either way.

A registration is one record. The whole application travels as JSON in a
`payload` column rather than one column per field — the seven categories ask
different questions, so a flat schema would be mostly-null columns needing a
change every time a form does. The four fields the server queries on
(`registrationId`, `email`, `category`, `status`) are also stored as their own
columns so the API filters server-side.

Registration numbers come from the store's atomic counter
(`POST {slug}/sequence/`), not from counting existing records — two submissions
arriving together would otherwise be handed the same number.

The server key can read and rewrite every record, so it lives in `server/.env`
only and is never sent to the browser.

### Known gaps before this goes public

- **Uploads are served by unguessable filename only.** Government IDs and
  passports sit behind obscurity, not authentication. Put them behind an
  admin-authenticated streaming route before real applicant data goes in.
- **Admin auth is a shared password** with no rate limiting, kept in
  `sessionStorage`. Fine for one operator on an unlisted URL; needs real
  accounts and sessions before wider use.
- **No email yet** — approved applicants only see their pass on `/status`.
- Single-process storage **only in the JSON fallback**. On the Data API,
  registration numbers come from an atomic counter, so multiple instances are
  safe there.

## Later phases

Full landing page · agenda · speakers directory · delegate dashboard with
email login · approval emails carrying the pass · uploads moved to R2 via Data
API file columns · event-week check-in scanning · post-event recordings and
certificates.

### The Data API endpoints this uses

Added to support this workflow:

| Endpoint | Purpose |
|---|---|
| `POST {slug}/sequence/` | Draws the next registration number atomically |
| `GET/PATCH {slug}/records/{id}/` | Reads and updates one record (approval) |
| `GET {slug}/records/?where.field=value&q=` | Server-side filtering and search |

All three need an **admin-scope** key (`tvk_ad_…`), which reads, writes and
updates. Issue one in the admin panel under Data API → the store → Keys →
"Server-side". It is origin-locked and belongs in server env only.
