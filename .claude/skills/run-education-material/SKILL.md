---
name: run-education-material
description: Build, run, and drive the Education-Material full-stack app (NestJS backend + Angular frontend). Use when asked to start/run/launch the app, run backend or frontend tests, sign in as a user, or take a screenshot of the UI.
---

Education-Material is a NestJS API (`backend/`, MongoDB-backed) plus an
Angular SPA (`frontend/`) that talks to it. Start both dev servers, then
drive the browser with `node .claude/skills/run-education-material/driver.mjs`
(a small Playwright script — there is no `chromium-cli` on this host).

All paths below are relative to the repo root.

## Prerequisites

- Node 20+, npm.
- MongoDB running locally on `mongodb://localhost:27017`. On this Windows
  box it's installed as a service:
  ```powershell
  Get-Service -Name "MongoDB" | Select-Object Name, Status, StartType
  # if Status isn't "Running":
  Start-Service -Name "MongoDB"
  ```
  (No Docker/manual `mongod` needed here — adapt if your machine doesn't
  have the service.)

## Setup

```bash
(cd backend && npm install)
(cd frontend && npm install)
(cd .claude/skills/run-education-material && npm install && npx playwright install chromium)
```

`backend/.env` must already contain (it does, checked into the repo):

```
PORT = 4400
DATABASE_HOST = mongodb://localhost:27017
DATABASE_PORT = 27017
BCRYPT_SALT_ROUNDS = 7
JWT_EXPIRES_IN = 100m
API_URL = http://localhost:4200
```

`API_URL` here is the **frontend's** origin — it's used as the backend's
CORS `origin`, not a URL the backend calls.

## Build

No separate build step to *run* the app — `nest start --watch` compiles
on the fly and `ng serve` bundles on the fly. (`npm run build` in either
directory produces a production build if you need one; not required for
the flows below.)

## Run (agent path)

Start both dev servers in the background and wait for their ports:

```bash
(cd backend && npm run start:dev > /tmp/backend.log 2>&1 &)
(cd frontend && npm run start > /tmp/frontend.log 2>&1 &)

timeout 40 bash -c 'until curl -sf http://localhost:4400/ >/dev/null; do sleep 1; done'
timeout 40 bash -c 'until curl -sf http://localhost:4200/ >/dev/null; do sleep 1; done'
```

Backend log readiness marker: `[NestApplication] Nest application successfully started`.
Frontend log readiness marker: `➜  Local:   http://localhost:4200/`.

Stop with:

```bash
pkill -f "nest start --watch"
pkill -f "ng serve"
```

(On Windows/Git Bash, `pkill -f` may not match — find the PID with
`netstat -ano | grep :4400` / `:4200` and `taskkill //F //PID <pid>` instead.)

### Drive it

```bash
node .claude/skills/run-education-material/driver.mjs <command> [args...]
```

| command | args | what it does |
|---|---|---|
| `screenshot` | `<out.png>` | loads the guest homepage, screenshots it |
| `signin` | `<email> <password> <out.png>` | opens the Signin modal, submits credentials, waits for the logged-in header (`#user-menu-button`), screenshots |
| `signin-fail` | `<email> <password> <out.png>` | same, but waits for the inline `Signin failed` error instead |

Example, using the seeded admin account:

```bash
node .claude/skills/run-education-material/driver.mjs signin admin@edugen.tj 3255443345 /tmp/signed-in.png
```

`FRONTEND_URL` env var overrides the default `http://localhost:4200` if
you serve on a different port.

The seeded admin (created once by `SeedService` on first backend boot,
see `backend/src/modules/seed/seed.service.ts`): `admin@edugen.tj` /
`3255443345`.

## Run (human path)

```bash
cd backend && npm run start:dev    # http://localhost:4400, Ctrl-C to stop
cd frontend && npm run start       # http://localhost:4200, Ctrl-C to stop
```

## Test

```bash
cd backend && npm test
```

Only 1 of 5 suites currently passes — the other 4 fail at import time
with `Cannot find module '@modules/...'`. This is a pre-existing Jest
config gap (`backend/package.json`'s `jest` block has no
`moduleNameMapper` for the `@/`/`@modules/` TS path aliases that
`tsconfig.json` defines), not something introduced by this skill.

```bash
cd frontend && npm test
```

There is no `test` script in `frontend/package.json` — this exits
immediately with `Missing script: "test"`.

---

## Gotchas

- **Nested `ConfigService` keys need dotted paths.** `backend/src/configs/configs.ts`
  registers config as `{ database: { host }, jwt: { secret, expiresIn }, ... }`
  via `ConfigModule.forRoot({ load: [Configs] })`. Reading a flat key like
  `configService.get('JWT_SECRET')` silently returns `undefined` instead of
  erroring — it looks like a valid env var name but isn't one. Always use
  the dotted path (`'jwt.secret'`, `'database.host'`) to reach these.
  Two call sites had this bug (Mongo URI in `app.module.ts`, JWT secret/expiry
  in `modules/auth/infrastructure/auth.module.ts`) and were fixed as part of
  getting the app to boot at all.
- **Frontend `API_URL` must match the backend's actual `PORT`.**
  `frontend/src/environments/environment.ts` and `environment.development.ts`
  hardcode `API_URL`; they must equal `http://localhost:<backend PORT>`
  (currently `4400`), not the NestJS default of `3000`. If someone changes
  `backend/.env`'s `PORT`, update these two files too — nothing enforces
  they stay in sync.
- **Reassigning a class field to a *new* signal breaks OnPush templates.**
  Several components (`header`, `admin-header`, `profile`) call
  `userStorage.loadUser()` and previously the header additionally
  resubscribed and did `this.currentUser = signal(next)` on every
  `userData$` emission. That swaps in a different signal *instance*, but
  the already-rendered template is still tracking the original instance —
  so the UI never updates after login/logout even though `localStorage` and
  the network call are both correct. Fixed by having
  `UserStorageService` hold one persistent signal and `.set()` it in
  `saveUser`/`clearUser`; `loadUser()` now always returns that same
  instance. If you add a new component reading `currentUser`, use
  `loadUser()` directly and don't copy it into a reassignable field.
- **Signin didn't set the auth cookie.** `AuthService.create()` (signup)
  called `setCookieToken()`; `AuthService.login()` (signin) didn't, so a
  signed-in session had no `jwt_token` cookie for `JwtStrategy` to read on
  subsequent guarded requests. Fixed by passing `@Res({ passthrough: true })`
  into `AuthController.signin()` and calling `setCookieToken()` from `login()`
  too, mirroring signup.
- **The submit button's accessible text is not "Sign anything".** It's the
  i18n string `Log in to your account` (see
  `signin-modal.component.ts`'s `buttonText` computed) — don't select it
  with `:has-text("Sign")`, use `form button[type="submit"]` (scoped to the
  modal's form, since "Sign Up" in the header also matches loosely).
- **Playwright's `text=/regex/flags` locator syntax rejects extra
  comma-separated selectors appended after the regex.** `driver.mjs`'s
  `signin-fail` command waits on the concrete class `form p.text-red-500`
  (from `signin-modal.component.html`) instead.

## Troubleshooting

- **`MongooseError: The uri parameter to openUri() must be a string, got "undefined"`**:
  `MongooseModule.forRootAsync` is reading a config key that doesn't exist
  (see Gotchas — dotted config paths). Confirm `app.module.ts` uses
  `configService.get('database.host')`.
- **`Error: secretOrPrivateKey must have a value`** on `/auth/signin`:
  same class of bug in `AuthModule`'s `JwtModule.registerAsync` — confirm
  it reads `'jwt.secret'` / `'jwt.expiresIn'`, not `'JWT_SECRET'` / `'JWT_EXPIRES_IN'`.
- **Browser console shows `net::ERR_CONNECTION_REFUSED` on `/auth/signin`**:
  the frontend is calling the wrong port. Check
  `frontend/src/environments/environment*.ts` `API_URL` against the
  backend's actual `PORT` (`backend/.env`).
- **Signin succeeds (200, `accessToken` in response) but the header still
  shows "Signin"/"Sign Up" instead of the user menu**: this was the
  signal-reassignment bug above, already fixed in
  `core/storage/user-storage.service.ts` — if it recurs, check that no
  component is doing `this.currentUser = signal(...)` instead of reading
  the service's signal directly.
- **`MongoDB` Windows service is `Stopped`**: `Start-Service -Name "MongoDB"`
  (PowerShell, may need an elevated prompt depending on service ACLs).
