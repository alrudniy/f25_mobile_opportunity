# Opportunity App — React Native (direct Postgres)

This mobile app scaffold connects **directly** to the same PostgreSQL database used by the Django app.
✅ Existing users/passwords work; ✅ New users are stored with Django-style PBKDF2-SHA256 password hashes.

## Project layout
- `App.js` + `src/` screens and styles
- `src/lib/nodeBridge.js` — RN ↔ Node RPC bridge
- `src/lib/auth.js` — login/register helpers
- `nodejs-assets/nodejs-project/` — embedded Node runtime (uses `pg` to talk to Postgres)
  - `main.js` — verifies/creates Django-compatible password hashes
  - `.env` — DB connection (edit here)
  - `package.json` — deps: `pg`, `dotenv`

## Install & run

### 0) Prereqs
- Node 18+, JDK 17, Android Studio (SDKs) and/or Xcode (for iOS)
- Watchman (macOS), Cocoapods for iOS (`sudo gem install cocoapods`)

### 1) Create a bare React Native app
```bash
npx react-native@latest init Opportunity
```

### 2) Run the scaffold into that folder
```bash
python3 scaffold.py --into Opportunity \
  --db-host 34.16.174.60 --db-port 5432 --db-name opportunity_db \
  --db-user oppo_app --db-password CSCI340Fall2025 --db-ssl false
```

### 3) Install React Native dependencies
From the app folder:
```bash
cd Opportunity
npm i nodejs-mobile-react-native @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

iOS pods:
```bash
npx pod-install
# or:
# cd ios && pod install
```

### 4) Install embedded Node project deps
```bash
cd nodejs-assets/nodejs-project
npm i
cd ../../
```

### 5) Run the app
Android:
```bash
npx react-native run-android
```
iOS:
```bash
npx react-native run-ios
```

## Notes
- Default DB settings mirror the Django bootstrap:
  host **34.16.174.60**, db **opportunity_db**, user **oppo_app**, password **CSCI340Fall2025**. Change `nodejs-assets/nodejs-project/.env` if needed.
- If your Postgres requires TLS, set `DB_SSL=true`.
- The auth table is `accounts_user` with fields from Django's `AbstractUser` + `user_type`. The Node layer verifies/creates `pbkdf2_sha256$...` hashes to match Django behavior.
- **Security**: Exposing Postgres to the open internet and baking credentials into a mobile binary are risky. Prefer a tiny API layer for real deployments.
