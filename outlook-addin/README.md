# Outlook Add-in (Compose)

- Sideload this add-in in Outlook (Windows, Mac, Web).
- When composing a message, use the ribbon button **Dignified Draft** to open a task pane and generate a draft via the backend.

## Dev steps
1) Start backend: see `../backend`.
2) Serve this folder with any static server (or use `npm i && npm start` if you add tooling).
3) In Outlook: insert add-in via **My Add-ins → Upload My Add-in** and choose `manifest.xml`.
