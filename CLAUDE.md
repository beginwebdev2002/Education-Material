# Education-Material

AI-powered educational material generator ("EduGen"). Monorepo: NestJS + MongoDB backend, Angular 21 (zoneless, signals) frontend.

## Project shape

- `backend/` — NestJS API, MongoDB via Mongoose, port **4400**. `backend/.env` holds `PORT`, `DATABASE_HOST`, JWT secret, CORS origin.
- `frontend/` — Angular 21 SPA, standalone components, zoneless change detection, hash-based routing (`withHashLocation()`), port **4500**.
- `.agents/skills/` — imported third-party skill packs (Angular, Feature-Sliced Design, NestJS, Mongoose, REST API design, TypeScript) that this file distills. When in doubt on something not covered here, check the relevant `.agents/skills/<name>/SKILL.md` before improvising.
- `.claude/skills/run-education-material/` — how to actually build/run/drive the app (setup, seeded admin login, Playwright driver). Use that skill instead of re-deriving run steps here.

Seeded admin account: `admin@edugen.tj` / `3255443345`.

## Dev commands

```
cd backend && npm run start:dev   # nest start --watch --env-file .env, port 4400
cd frontend && npm run start      # ng serve --port=4500
```

MongoDB must be running locally (`mongodb://localhost:27017`) before the backend boots.

## Frontend rules (Angular 21 / Feature-Sliced Design)

**Layering (FSD):** `app > pages > widgets > features > entities > shared`. A layer may only import from layers strictly below it — no same-layer cross-imports (`features/a` must not import `features/b`), no upward imports. Import across a slice boundary only through its `index.ts` barrel, never a deep path into another slice's internals. `shared/` has no slices, one barrel per segment (`shared/ui`, `shared/services`, etc.), no business logic.

**Components:**
- Standalone by default — do not set `standalone: true` explicitly (Angular 21 default).
- `changeDetection: ChangeDetectionStrategy.OnPush` on every component.
- `inject()`, not constructor injection.
- Signal `input()`/`input.required()`/`output()`, not `@Input()`/`@Output()` decorators.
- Native control flow (`@if`/`@for`/`@switch`), never `*ngIf`/`*ngFor`/`*ngSwitch`.
- `[class.x]`/`[style.x]` bindings, never `ngClass`/`ngStyle`.
- `host` object in the decorator instead of `@HostBinding`/`@HostListener`.
- File naming: routed views `*.page.component.ts`, everything else `*.component.ts`, services `*.service.ts`, `providedIn: 'root'` for singletons.

**Forms:** Reactive Forms (`FormGroup`/`FormControl`, typed), never template-driven (`ngModel`/`FormsModule`). For a single instant-apply control with no validation (a settings toggle, a search box), a plain signal + `[value]`/`[checked]` + `(input)`/`(change)` binding is fine — it doesn't need a `FormGroup`, but it also must not use `ngModel`.

**State:** `signal()` for local writable state, `computed()` for derived state, `effect()` only for side effects (inside an injection context). Prefer signals over `BehaviorSubject`/`Subject` for component/service state; RxJS is for interop (`toSignal()`/`toObservable()`) or when you actually need operators.

**Routing:** every feature route is lazy-loaded (`loadComponent`/`loadChildren`). Guards are functional (`CanActivateFn` + `inject()`), not class-based.

**i18n:** this project has a custom runtime i18n system (not `@angular/localize`) — `TranslationService`, `TranslatePipe` (`| translate`), `[translate]` directive, dictionaries at `frontend/src/locale/{en,ru,tj}.json`. Use that for any new user-facing text. Do not reintroduce `i18n` attributes or `$localize`.

## Backend rules (NestJS)

**Module layering** (flat feature-based — already the convention here, keep following it): each business domain gets one directory under `backend/src/modules/<name>/` with, strictly: `<name>.controller.ts`, `<name>.service.ts`, `<name>.module.ts`, `entities/` (Mongoose schemas), `dto/` (validation classes). No `domain/`/`application/`/`infrastructure/` sub-layers, no `adapters/`/`ports/`/`use-cases/` — a small type shared across a module's own files (an enum, a payload interface) is a standalone file at the module root, not a subfolder. No `index.ts` barrels inside `modules/*`, `common/`, or `configs/` — always import the concrete file via its `@modules/*`/`@common/*`/`@configs/*` deep path. Controllers only delegate to services — no business logic in controllers.

**Validation:** every request body is a DTO with `class-validator` decorators. The global `ValidationPipe` runs with `{ whitelist: true, forbidNonWhitelisted: true, transform: true }`.

**Auth:** every route that isn't intentionally public is guarded (`@UseGuards(AuthGuard('jwt'))`), plus a `RolesGuard`/`@Roles()` check for admin-only actions. Never let a DTO field (like `role`) be settable by a non-admin caller.

**Data access:** the module's service injects its Mongoose `Model` directly with `@InjectModel()` — no repository/port abstraction layer. Other modules that need a domain's data (e.g. `AuthService`, `SeedService`, `RolesGuard` needing user lookups) inject that module's service class via normal Nest DI, not a Model or a DI token. Never return a raw user document with `password` still on it — the service excludes it with `.select('-password')`.

**Errors:** throw NestJS HTTP exceptions (`NotFoundException`, `ConflictException`, etc.) from services, not raw `Error`s, and not from controllers.

**TypeScript:** no `any` — use `unknown` + narrowing, or a proper type.

## Known, accepted deviations

- `POST /auth/signup` / `POST /auth/signin` use verb-like path segments — a normal, accepted exception to the "no verbs in resource names" REST guideline for auth endpoints; not something to "fix" by breaking the existing frontend contract.
