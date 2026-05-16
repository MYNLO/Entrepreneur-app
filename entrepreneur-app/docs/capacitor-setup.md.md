# Mobile App Build Guide

## Prerequisites
- Node.js 18+
- Android Studio (for APK) OR Xcode 15+ (for IPA)
- Java JDK 17 (Android)

## Steps
1. `npm run build`
2. `npx cap init` (use existing config)
3. `npx cap add android` / `npx cap add ios`
4. `npx cap sync`
5. Android: `npx cap open android` → Build → Generate Signed Bundle/APK → Debug/Release
6. iOS: `npx cap open ios` → Product → Archive → Distribute App → Ad Hoc/Enterprise
7. Distribute APK/IPA via direct link, TestFlight, or internal MDM.