# Hassan OTP – Firebase Phone Authentication (web)

Single-file web demo: enter a phone number -> solve reCAPTCHA -> receive an OTP -> verify -> logged in.
Built with plain HTML/CSS/JS and the Firebase Authentication JS SDK (loaded from the CDN, no build step).

## Test number
This project uses a Firebase **test phone number**, so no real SMS is sent and no billing is needed:

| Phone number     | Verification code                                   |
|------------------|-----------------------------------------------------|
| `+923302876999`  | the code set for this number in the Firebase console |

Firebase never sends a message for a test number. It checks the code you type against the fixed code configured for that number.

## Setup
1. Open the Firebase console and use the project `timepass-a394c`.
2. Build > Authentication > Get started > Sign-in method > enable **Phone**.
3. Authentication > Sign-in method > Phone > "Phone numbers for testing": add `+923302876999` with a 6-digit code of your choice.
4. Authentication > Settings > Authorized domains: make sure `localhost` is listed (it is by default).
5. The web app config is already in `index.html` (`firebaseConfig`). Replace it if you use a different Firebase project.

## Run
Serve the folder over http://localhost (opening the file by double-click will not work):

```
python -m http.server 3000
```
or
```
npx serve . -l 3000
```

Open http://localhost:3000 (use `localhost`, not `127.0.0.1`).

## How to use
1. Enter `+923302876999` and click **Send OTP**.
2. Tick the reCAPTCHA checkbox when it appears.
3. Enter the test verification code and click **Verify OTP**.
4. On success the page shows "Login successful!" with the phone number and UID. **Sign out** returns to the start.
