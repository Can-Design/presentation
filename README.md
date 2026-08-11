# Presentation Hub

Static public-by-link client presentation site. This package deliberately contains no source decks, PDFs, estimate index, or client master dashboard.

## Included

- `presentations/tec-host-2026/` — live TEC Host presentation
- `robots.txt` and per-page `noindex` metadata to discourage search indexing

## Deploy to Cloudflare Pages

1. Upload these files to the private `presentation-hub` GitHub repository.
2. In Cloudflare, create a Pages project from that repository.
3. Framework preset: `None`; build command: leave blank; output directory: `/`.
4. Deploy.

Share the individual presentation URL, for example:
`https://<project>.pages.dev/presentations/tec-host-2026/`

Public-by-link means anyone with the URL can view it. Do not include confidential pricing or private estimate material in a public presentation.
