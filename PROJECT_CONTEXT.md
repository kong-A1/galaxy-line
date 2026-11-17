# GALAXY LINE LIFF app: project context

Hand-over for any agent (for example a UI agent) that works on this repo. It collects what was built, the rules the owner set, and the decisions still open. Read it before changing anything.

The owner writes Thai, in short messages with typos. Reply in Thai, concise, result first, and show how you verified.

## 1. What this is

A membership app ("GALAXY") that runs inside LINE (LIFF). Design source: Figma file `UI-Line` (fileKey `TkXk0uIzS4Xx3ly9FcelGC`, page node `0:1`, design width **390px**). The file has 8 screens: login, welcome, OTP request, OTP verify, personal info, member, redeem, privileges.

| Built | Not built |
|---|---|
| LINE login, welcome, sign-in (OTP request + verify on ONE page), consent popup, 404, maintenance | personal info, member, redeem, privileges |

Stack: Vue 3 `<script setup>`, Vite, file-based routing (`vue-router/auto-routes`), Tailwind v4, Pinia, TanStack Vue Query, Axios, vue-i18n (th default, en), `@line/liff`, Vitest, Playwright.

Scripts: `npm run dev`, `npm run type-check`, `npm run lint`, `npm run test:unit`, `npm run build`. Env names live in `.env.development` and `env.d.ts` (do not print values). Optional: `VITE_CONTACT_URL`, `VITE_STATUS_ENDPOINT`, `VITE_MAINTENANCE_END_AT`, `VITE_TERMS_URL`, `VITE_PRIVACY_URL`; each hides or disables its UI when unset.

This is **not a git repo**. Edits cannot be reverted. Re-read a file before editing it, because the owner and Prettier also change files.

## 2. Architecture rules (set by the owner, follow them exactly)

Flow: **Pages / Features / Components (UI) -> Composables -> Services -> Backend**. Stores hold client state and may be used from composables or UI; they are not a layer every request passes through. Lower layers never import upper layers. "Do not create extra layers without a reason."

| Folder | Responsibility |
|---|---|
| `pages/` | routes, assemble the page, thin (renders a `*Feature.vue`) |
| `layouts/` | layout structure |
| `features/` | UI + capability of one feature, including the screen a page renders (`features/<feature>/<screen>/<Name>Feature.vue`, parts in `components/`). **No `views/` folder (removed 2026-11-06 at the owner's request); do not add another screen layer.** |
| `components/` | reusable UI (`common/`, `ui/`) |
| `composables/` | Logic, Query, Mutation, reusable composition, grouped by feature |
| `stores/` | Pinia, client state only; never duplicates the API cache |
| `services/` | Axios, grouped by module (`services/modules/<module>/`), HTTP only, no UI logic or component state |
| `types/`, `utils/` | types; general functions not tied to Vue or a feature |

Composables file layout (owner's choice): in `composables/<feature>/` the root holds **only data hooks** (useQuery/useMutation, cache invalidation; no screen state, router or messages) and the Logic composables live in `composables/<feature>/logic/`. Logic may call data hooks; data hooks never import Logic. Query and Mutation of one feature stay together; never split into `queries/` and `mutations/`. A mutation invalidates the related query cache. Generic helpers (`useCountdown`, `useGoBack`) stay at the `composables/` root.

Current layout:

- `features/auth/{components, line-log-in, welcome, sign-in}` (screens: `LineLogInFeature`, `WelcomeFeature`, `SignInFeature`), `features/not-found`, `features/maintenance`, `features/status`. `features/app/{campaign,coupon,member,points}` are the owner's empty scaffold.
- `features/consent/PdpaDialog.vue` + `consent.constants.ts`.
- `composables/auth/{useAuth,useOtp}.ts` and `composables/auth/logic/{useSignInForm,useOtpVerification,useSignInStep,useLineLogin}.ts`; `composables/member/useMember.ts`; `composables/system/useSystemStatus.ts` and `composables/system/logic/useMaintenanceRetry.ts`.
- `stores/`: `auth.store`, `loading.store`, `theme`, `pdpa.store`, `sign-in.store`.
- `services/`: `api/axios.ts` (no router or navigation), `api/api-error.ts`, `modules/auth/otp.service.ts`, `modules/system/system.service.ts`, `liff/liff.ts`.
- `utils/`: `phone`, `email`, `redirect`, `date`, `otp` (tests in `utils/__tests__`).
- `app/providers/query.ts` sends any 503 that passes through Vue Query to `/maintenance?redirect=...`.

Boundary check to re-run after adding code: services, stores, composables and utils never import from features/components; features/components never import `@/services`; files importing `@tanstack/vue-query` do not import Logic.

Left alone on purpose: `pages/index.vue` and `pages/auth/index.vue` (the owner's dead pages that still import services directly).

## 3. UI rules the owner gave (each one came from a correction)

1. **Match Figma exactly.** Measure spacing, positions and colors from the design, map them to tokens in `src/styles/theme.css`, then measure the rendered page and compare per line (aim within ~3px). Do not guess by eye. Heading letter-spacing: no `tracking-*` (Figma has none).
2. **No body scroll.** Use `dvh`, never `100vh`/`min-h-screen`. Full-page screens use route meta `fullBleed: true` and an inner `overflow-y-auto` container. `window.scrollY` must stay 0 on wheel. Do not shrink spacing to avoid overflow.
3. **Responsive from 320px to iPad.** Below `lg` (1024px) the page is full width (backgrounds span the screen, content in a centered column `max-w-md`, `md:max-w-xl`). From `lg` up a centered 448px column. iPad portrait (768-1023px) uses the `tablet:` variant to scale type up one step. Fixed items follow the same switch. Test 320, 390, 600, 744, 768, 820, 834, 1023, 1024, 1280 with no horizontal overflow.
4. **Font size leans larger.** Never below 14px for readable text; prefer 16px for descriptions. Re-measure spacing after changing sizes.
5. **Check Thai and English.** English is 1.5-2x longer. Text must wrap in place and not push other elements. Proofread `src/i18n/locales/en.ts`.
6. **Floating glass controls.** Theme/language buttons are fixed, translucent blurred circles (`bg-[#12002a]/40`, `backdrop-blur-2xl`, `ring-1 ring-galaxy-light/40`, 36px, white icon), in `components/ui/FloatingToolbar.vue`, used by `AuthHero` and the status pages. Keep the border purple, not white.
7. **Theme over outside spec.** When a spec or mock comes from outside (hex colors, own header, fonts), keep its behavior and accessibility but restyle with our tokens and components (`bg-galaxy`, `BaseButton size="lg" rounded="xl"`, `rounded-[14px]` cards, `rounded-t-sheet`). Ask before adding brand elements the owner did not request.

Tokens: `--primary`, `--foreground`, `--muted-foreground`, `--background`, `--surface`, `--line`, `--galaxy`, `--galaxy-light`, `--hero-*`. Custom variants: `dark`, `tablet` (768-1023px), `short` (max-height 640px). Motion CSS is in `src/styles/motion.css` and has a reduced-motion block.

## 4. Flow and decisions

- Routes: `/` and `/auth` -> `/auth/line-log-in` -> LINE button -> `/auth/welcome` -> "เข้าใช้งาน" or "ลงทะเบียน" opens the consent popup -> `/auth/sign-in`. Success goes to `/app`.
- Guard in `router/index.ts`: signed in (LIFF) -> login paths go to welcome; not signed in -> only `/auth/line-log-in` and `meta.public` routes (404, maintenance) are reachable.
- **Sign-in is one page** with a step indicator, `?step=verify` switches the sheet (so browser back works). Step 1: phone/email tabs (a sliding pill; changing tab clears validation and slides the input). Step 2: 6-box OTP, ref code, 59 s resend countdown (the owner set it). A reload on step 2 falls back to step 1 (the destination lives only in `sign-in.store`).
- Phone input accepts a leading 0; shown as `81-234-5678` or `081-234-5678`. The validation message sits **inside the card, under the underline**.
- **Consent popup** (`features/consent/PdpaDialog.vue`): native `<dialog>.showModal()`; three checkboxes (terms required, privacy required, marketing optional and never pre-ticked); button "ยินยอม" (not "ยืนยัน"); "ไม่ยอมรับ" only closes it; Esc cannot dismiss it; pressing a document name must NOT tick its checkbox. Stored in `localStorage['pdpa-consent']` = `{version, acceptedAt, marketing}`; bump `PDPA_VERSION` in `stores/pdpa.store.ts` to ask everyone again. `/auth/sign-in` redirects to welcome without consent. Nothing sends consent to a backend yet.
- OTP service is a **dev-only stand-in** (random 4-char ref, accepts any 6 digits except `000000`; a production build throws `unavailable`). Replace the bodies with real `apiClient` calls; callers depend only on the signatures and `OtpError`.
- 404 page is `src/pages/[...path].vue`; maintenance is `src/pages/maintenance.vue` (retry button re-checks status, the planet artwork stays, no logo in the art).

## 5. Open items (do not choose silently; ask the owner)

- Register and sign-in both go to `/auth/sign-in` and nothing tells them apart. Figma has a separate personal-info screen with its own "สมัครสมาชิก" button.
- After a verified code the app goes to `/app`; a new member probably needs the personal-info screen first.
- Nothing exchanges the LIFF token with the backend. `pages/index.vue` holds the real authentication but the `/` redirect means it never runs.
- `ref-branch-code` that arrives inside `liff.state` is not captured (a fallback was offered and not decided).
- After LIFF login the user lands on the login page again and presses the button a second time.
- English copy issues: `{point} pts` reads "1 pts"; `earnStamp.condition` expects an `{item}` nobody passes.
- Real OTP and consent backends do not exist.

## 6. Gotchas that cost time

- vue-i18n parses `@` in messages as link syntax and throws at render. Keep email examples in code, not in locale files.
- A navigation and a watcher that both call `router.replace`: the later one wins. Clear shared state only after the navigation resolves.
- An error that appears on blur and shifts the layout makes the tap on the submit button miss. The button uses `@mousedown.prevent`.
- `BaseButton` hardcodes `rounded-lg`; for a full circle use `rounded-full!`.
- Flex-grow below 1 only distributes that fraction of the free space; use `grow-[1000]` against `grow` for hero versus main.
- `src/typed-router.d.ts` is generated by running `vite`/`vite build`; never edit it. After renaming a page, regenerate it and grep the old slug, i18n `meta.*` keys and `router.push` calls.
- After a scripted edit (Python `re.sub`, sed) load the page; a `\"` in a replacement string once broke a Vue file.
- Focus moves must wait for `nextTick` after the OTP boxes clear or become enabled.

## 7. How to verify UI changes

- The Figma MCP on this account hit its plan limit, so design values may need to come from a saved screenshot (about 1-2px error). Try the Figma tools first (`create_session` before any file tool).
- Playwright's bundled browsers are not installed. Launch the system Chrome: `chromium.launch({ channel: 'chrome' })`, imported from `node_modules/playwright/index.mjs`. Run `npx vite --port 5199 --strictPort` in the background and stop it afterwards. Keep scripts outside the project.
- Simulate "signed in with LIFF" by intercepting `**/src/services/liff/liff.ts*`; pre-accept consent with an init script that sets `localStorage['pdpa-consent']`.
- Always run: `vue-tsc`, eslint, oxlint, prettier, `vitest run`, `vite build`. The only failing suite is the owner's empty `src/__tests__/App.spec.ts`.
- Say what you did not verify (no real device).
