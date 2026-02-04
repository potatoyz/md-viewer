# md-viewer

Single-user Markdown docs (Yuque-ish): edit + preview + autosave + outline + images.

## Requirements

- Node.js (this server uses Node via nvm)
- PocketBase running at `https://pb.potatoyz.tech`

## Local dev

```bash
cp .env.example .env.local
npm i
npm run dev
```

## Production on this server

- Served via Caddy: `https://md.potatoyz.tech` -> `localhost:3010`
- systemd service: `md-viewer`

```bash
npm run build
sudo systemctl restart md-viewer
sudo journalctl -u md-viewer -f
```

## PocketBase collections (planned)

- `documents`: `{ title, content_md, version }`
- `assets`: `{ doc (relation->documents), file (file) }`

Auth rules are expected to be handled in PocketBase (existing account system).
