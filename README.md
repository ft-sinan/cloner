# FT Cloner

A real Android app cloner with FT Cloner's signature **red on cream white** theme. It makes a second, separately installed copy of an app (WhatsApp, Instagram, etc.) with its own login and data — no root required.

## Two parts in this repo

- **`cloner-android/`** — the native Android app. It is a modified fork of [TwinnDroid](https://github.com/starlightjulie/TwinnDroid), rebranded as FT Cloner, restyled red/cream, and limited to **one clone per app**.
- Web assets in the repo root — the original FT Cloner dashboard prototype, still deployed at https://ft-cloner.vercel.app.

## Credit and licence

This is a **modified fork of TwinnDroid**, not the official release and not endorsed by its author. Full credit for the cloning engine goes to **StarlightJulie** — https://github.com/starlightjulie. The fork keeps the GNU GPL v3 licence and the upstream additional terms; see [`cloner-android/LICENSE`](cloner-android/LICENSE) and [`cloner-android/ADDITIONAL-TERMS.md`](cloner-android/ADDITIONAL-TERMS.md). The name, icon and signing key are FT Cloner's own.

## What the Android app does

- Clones installed apps or imported APK/XAPK/APKM files into a real second app with its own package name, login and data
- Lets you rename the clone and choose its icon, including a numbered badge like Vivo's App Clone
- Enforces one clone per app
- Optional Shizuku integration for silent installs
- Red/cream default theme, with the upstream theme picker still available

Clones are re-signed, so apps with anti-tamper protection (banking apps, some games, Google sign-in tied to the original package) may refuse to run. That is inherent to no-root APK cloning.

## APK

A built debug APK is saved at `apk/FT-Cloner.apk`. The GitHub Actions workflow builds it from `cloner-android/` using JDK 17 and Gradle, then commits it back to the branch.

To build locally:

```bash
cd cloner-android
./gradlew assembleDebug
```

## Web prototype

```bash
npm install
npm run dev
npm run build
```
