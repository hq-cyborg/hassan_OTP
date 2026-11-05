# Firebase OTP Demo (web)

Single-file demo: enter phone number -> receive SMS OTP -> verify -> logged in.

## Setup
1. https://console.firebase.google.com -> create a project.
2. Build > Authentication > Get started > Sign-in method > enable **Phone**.
3. (Recommended) Authentication > Sign-in method > Phone > "Phone numbers for testing": add e.g. `+16505550101` with code `123456` (no real SMS, no billing needed).
4. Project settings > General > Your apps > add a **Web app** (`</>`) and copy the `firebaseConfig` into `index.html`.
5. Authentication > Settings > Authorized domains: `localhost` is there by default.

## Run
```
npx serve .
```
Open http://localhost:3000 (must be served over http://localhost, not by double-clicking the file).


## For Laptop : 
1. Unzip the folder.
2. Install Node.js from nodejs.org if it isn't installed. Python also works: python -m http.server 3000.
3. In the folder, run npx serve . -l 3000.
4. Open http://localhost:3000. Use localhost, not 127.0.0.1, and don't double-click the file.
5. Enter +16505550101 and code 123456.