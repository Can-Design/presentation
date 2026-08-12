# Presentation Dashboard

Private internal index for Can-Design presentation records. It is a static module and is not a public presentation directory. Each record may contain an approved external/public presentation URL.

## Update convention

Edit `presentations.js` to add or update records. Use one object per verified presentation and keep these fields present:

- `title`
- `estimateNumber` — use `"Not linked"` when no verified estimate reference exists
- `client`
- `project`
- `status`
- `updatedDate` — ISO date format: `YYYY-MM-DD`
- `visibility`
- `publicUrl` — the approved external presentation URL

Do not invent client, project, or estimate data. The page automatically includes new statuses and visibility labels in its filters.

## Local preview

Open `index.html` in a browser from this directory. The page loads `presentations.js` locally; no API, authentication, or public directory listing is provided by this module.
