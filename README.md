# Hassan OTP – Firebase Phone Authentication (React Native / Expo)

Expo app: enter a phone number -> solve reCAPTCHA -> receive an OTP -> verify -> logged in.
Works on Android, iOS (Expo Go) and in the browser (Expo web). It was converted from the original plain HTML/JS demo and the login flow is unchanged.

## Test number
This project uses a Firebase **test phone number**, so no real SMS is sent and no billing is needed:

| Phone number     | Verification code                                    |
|------------------|------------------------------------------------------|
| `+923302876999`  | the code set for this number in the Firebase console |

Firebase never sends a message for a test number. It checks the code you type against the fixed code configured for that number.

## Firebase setup
1. Open the Firebase console and use the project `timepass-a394c` (config is in `firebase.js`).
2. Build > Authentication > Get started > Sign-in method > enable **Phone**.
3. Authentication > Sign-in method > Phone > "Phone numbers for testing": add `+923302876999` with a 6-digit code of your choice.
4. Authentication > Settings > Authorized domains: make sure `localhost` is listed (it is by default).

## Run
```
npm install
npx expo start
```
- Press `w` to open it in the browser (http://localhost:8081). Use `localhost`.
- Or scan the QR code with the **Expo Go** app on a phone (same Wi-Fi).
- Press `a` for an Android emulator.

## How to use
1. Enter `+923302876999` and tap **Send OTP**.
2. Complete the reCAPTCHA.
3. Enter the test verification code and tap **Verify OTP**.
4. On success the app shows "Login successful!" with the phone number and UID. **Sign out** returns to the start.

## Project structure
| File | Purpose |
|------|---------|
| `App.js` | Screens and OTP logic (phone -> code -> logged in) |
| `firebase.js` | Firebase config and auth setup (persists the session on phones) |
| `theme.js` | Colours and text; edit this to restyle the app |
| `screenshots/` | Screenshots and recording of the original web version of the flow |

## Notes
Phone auth on mobile uses `expo-firebase-recaptcha` (a WebView reCAPTCHA), which works in Expo Go but is deprecated; for a production build consider `@react-native-firebase/auth`.
