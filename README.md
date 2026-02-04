# md-viewer

Single-user Markdown docs (Yuque-ish): edit + preview + autosave + outline + images.

## Requirements

- Node.js
- PocketBase (set `NEXT_PUBLIC_PB_URL`)

## Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_PB_URL=https://<your-pocketbase-domain>
```

## Local dev

```bash
npm i
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## PocketBase collections (planned)

- `documents`: `{ title, content_md, version }`
- `assets`: `{ doc (relation->documents), file (file) }`

Auth rules are expected to be handled in PocketBase (existing account system).
