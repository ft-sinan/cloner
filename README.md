# FT Cloner

A polished, responsive demo app for running multiple accounts of the same app on one device — think WhatsApp, Instagram, Telegram, Facebook and more. The interface uses FT Cloner's signature **red on cream white** theme.

## What's inside

- **Overview dashboard** with a hero, live stats, active clones and recent activity
- **My clones** — pause, resume, launch and delete cloned app instances
- **App library** — 14 supported apps with search and category filters
- **Clone setup flow** — name the clone, isolate its storage, choose notification/boot options and a colour
- **Storage** — usage ring and per-clone breakdown
- **Settings** — clone preferences and profile panel
- Clones persist in `localStorage`, so your changes survive a refresh

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (by default http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

Built with React + Vite. Icons are hand-drawn inline SVG marks; no external asset or font CDN is required.

## Android APK

A ready-to-install **debug APK** is included at `apk/FT-Cloner.apk` (built by the GitHub Actions workflow). Install it on an Android device with "Install unknown apps" enabled for your file manager or browser.

Rebuild it yourself:

```bash
npm ci
npm run apk:build      # needs Android SDK + JDK 21 locally
```

Or trigger the **Build FT Cloner APK** workflow in GitHub Actions — it compiles the APK and saves it back into `apk/FT-Cloner.apk`.

The APK is a Capacitor wrapper around this web app. It is a demo of the FT Cloner experience, not a system-level APK cloner that can run two instances of other apps.
