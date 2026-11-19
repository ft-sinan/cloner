# FT Cloner (Android)

This is a **modified fork of [TwinnDroid](https://github.com/starlightjulie/TwinnDroid)**, rebuilt as **FT Cloner** with a red-on-cream-white identity and a one-clone-per-app limit.

It is **not** the official TwinnDroid release and is not made or endorsed by StarlightJulie. All credit for the cloning engine belongs to **StarlightJulie** — see [ADDITIONAL-TERMS.md](ADDITIONAL-TERMS.md) and the original [LICENSE](LICENSE). This fork is distributed under the same GNU GPL v3 terms.

## What it does

- Clones an installed app (or an APK/XAPK/APKM file) into a **real, separately installed app** with a different package name
- Gives each clone its own login and data — no root and no virtual space
- Renames the clone and changes its icon, including a numbered badge like Vivo's App Clone
- Keeps **one clone per app**, as requested
- Optional Shizuku integration for silent installs
- Red/cream FT Cloner theme by default; other upstream themes remain available

## Build

```bash
cd cloner-android
./gradlew assembleDebug
# output: app/build/outputs/apk/debug/app-debug.apk
```

Needs JDK 17+ and Android SDK platform 36/build-tools 36.0.0. The GitHub Actions workflow in this repo builds it in the cloud and saves the APK to `../apk/FT-Cloner.apk`.

## Notes

Cloned apps are re-signed, so apps with anti-tamper protection (banking apps, some games) may refuse to run. That is a limitation of no-root APK cloning, not of FT Cloner specifically. Use clones in line with each app's terms of service.
