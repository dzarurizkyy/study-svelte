# ⚡ SvelteKit Study Case — Contact Management

Study notes for building the **Contact Management** frontend using SvelteKit 5 (runes) — a client-rendered app that consumes an already-existing Node.js/Express/Prisma REST API.

Like the React version of this study case, there is **no database, no ORM, and no global state library** here. Every piece of data lives on the server; the frontend's job is only to (1) render forms, (2) call the right endpoint, (3) carry the session token on every request, and (4) show the result. What changes is *how* SvelteKit does each of those: routes are folders instead of a `<Routes>` tree, layouts are `+layout.svelte` files with `{@render children()}` instead of `<Outlet />`, and form state is a single `$state` object bound with `bind:value` instead of one `useState` per field.

The notes are split into 3 modules — **User Management** → **Contact Management** → **Address Management** — built stage by stage (page by page), plus a [Bugs Found in the Code](#-bugs-found-in-the-code) section documenting the issues still present in the finished project, with symptom → root cause → fix → lesson.

---

## 📋 Table of Contents

- [Requirement](#-requirement)
- [Architecture Overview](#-architecture-overview)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [Project Structure](#-project-structure)
- [Application Foundation](#-application-foundation)
  - [app.html — Styling Layer](#apphtml--styling-layer)
  - [Runes Mode](#runes-mode)
  - [Disabling SSR](#disabling-ssr)
  - [The $lib Alias](#the-lib-alias)
  - [Environment Variable](#environment-variable)
  - [The API Layer Convention](#the-api-layer-convention)
  - [Token Management](#token-management)
  - [Alert Helper](#alert-helper)
- [Routing](#-routing)
- [Part 1 — User Management](#-part-1--user-management)
  - [Stage 1: Register User](#stage-1-register-user)
  - [Stage 2: Login User](#stage-2-login-user)
  - [Stage 3: Get Current User](#stage-3-get-current-user)
  - [Stage 4: Update Profile & Password](#stage-4-update-profile--password)
  - [Stage 5: Logout User](#stage-5-logout-user)
- [Part 2 — Contact Management](#-part-2--contact-management)
  - [Stage 1: Create Contact](#stage-1-create-contact)
  - [Stage 2: List & Search Contact](#stage-2-list--search-contact)
  - [Stage 3: Pagination](#stage-3-pagination)
  - [Stage 4: Collapsible Search Form](#stage-4-collapsible-search-form)
  - [Stage 5: Contact Detail](#stage-5-contact-detail)
  - [Stage 6: Update Contact](#stage-6-update-contact)
  - [Stage 7: Delete Contact](#stage-7-delete-contact)
- [Part 3 — Address Management](#-part-3--address-management)
  - [Stage 1: Create Address](#stage-1-create-address)
  - [Stage 2: List Address](#stage-2-list-address)
  - [Stage 3: Update Address](#stage-3-update-address)
  - [Stage 4: Delete Address](#stage-4-delete-address)
- [Running the Project](#-running-the-project)
- [Manual Testing](#-manual-testing)
- [Bugs Found in the Code](#-bugs-found-in-the-code)
- [Known Remaining Issues](#-known-remaining-issues)
- [Quick Reference](#-quick-reference)
- [Key Takeaways](#-key-takeaways)

---

## 🎯 Requirement

UI template used as the starting point: [web-template-contact-management](https://github.com/ProgrammerZamanNow/web-template-contact-management) — a set of static HTML pages that get ported into SvelteKit routes.

The app has 3 features, matching 3 backend modules:

1. **User Management** — register, login, view profile, update profile/password, logout
2. **Contact Management** — contact CRUD + search with pagination
3. **Address Management** — address CRUD, an address always belongs to a contact

**User data**: `username`, `password`, `name`

**Contact data**: `first_name`, `last_name`, `email`, `phone`

**Address data**: `street`, `city`, `province`, `country`, `postal_code`

> **Key Insight:** The ownership chain is `User → Contact → Address`. The frontend never sends a `username` — the backend derives it from the token. An address is always reached through its parent contact's URL (`/api/contacts/:id/addresses/...`), and in SvelteKit that chain becomes the folder structure directly: `routes/(user)/dashboard/contacts/[id]/addresses/[addressId]/edit/+page.svelte`.

---

## 🧱 Architecture Overview

```text
┌──────────────────────────────┐         ┌──────────────────────────────┐
│  Frontend (SvelteKit + Vite) │         │  Backend (Express + Prisma)  │
│  http://localhost:5173       │         │  http://localhost:3000       │
│                              │         │                              │
│  routes/     ← pages + state │  fetch  │  route → controller →        │
│  lib/api/    ← HTTP calls    │ ──────► │  service → prisma → MySQL    │
│  lib/alert.js← SweetAlert    │ ◄────── │                              │
│  localStorage← token         │  JSON   │  authMiddleware reads the    │
│  ssr = false (browser only)  │         │  Authorization header        │
└──────────────────────────────┘         └──────────────────────────────┘
```

Two things flow across that boundary:

| Direction | Contract |
| --- | --- |
| Frontend → Backend | `Authorization: <token>` header (the raw token string, **no** `Bearer` prefix) |
| Backend → Frontend | Success: `{ "data": ... }` · Failure: `{ "errors": "..." }` · Search also adds `paging` |

Even though SvelteKit *can* run code on a server, this project turns SSR off (see [Disabling SSR](#disabling-ssr)), so every `fetch` goes straight from the browser to the backend — exactly like the React SPA.

---

## 🏗️ Backend Setup

This project does not build a backend. It reuses the Node.js one: [belajar-nodejs-restful-api](https://github.com/ProgrammerZamanNow/belajar-nodejs-restful-api) — built with **Node.js**, **Prisma ORM**, and **MySQL**.

### Clone & Install

```bash
git clone https://github.com/ProgrammerZamanNow/belajar-nodejs-restful-api.git
cd belajar-nodejs-restful-api
npm install
```

### Configure Database

**`.env`**

```bash
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE_NAME"
```

### Database Migration

```bash
npx prisma migrate deploy
```

### Running the Backend

```bash
npm start
# → http://localhost:3000
```

---

## ⚡ Frontend Setup

### Creating the Project

```bash
npx sv create study-svelte-contact-management
cd study-svelte-contact-management
npm install
```

### Adding SweetAlert2

Nicer alert/confirm dialogs than the browser's built-in `alert()` / `confirm()` — and promise-based, so `await`ing a confirm dialog reads naturally.

```bash
npm install sweetalert2
```

> Reference: [sweetalert2.github.io](https://sweetalert2.github.io/)

### Final Dependency List

**`package.json`**

```json
{
  "devDependencies": {
    "@sveltejs/adapter-auto": "^7.0.1",
    "@sveltejs/kit": "^2.57.0",
    "@sveltejs/vite-plugin-svelte": "^7.0.0",
    "svelte": "^5.55.2",
    "vite": "^8.0.7"
  },
  "dependencies": {
    "sweetalert2": "^11.26.25"
  }
}
```

Note what is **not** there compared to the React version: no router package (routing is built into SvelteKit), no `react-use` (`onMount` and `$state` cover what `useEffectOnce` and `useLocalStorage` did), no axios, no Tailwind package (loaded via CDN), no form library.

---

## 🗂️ Project Structure

```text
003-sveltekit-restful-api/
├── svelte.config.js                   # adapter-auto + forced runes mode
├── vite.config.js                     # sveltekit() plugin
├── jsconfig.json                      # extends .svelte-kit/tsconfig.json
├── .env                               # VITE_URL_API (gitignored)
└── src/
    ├── app.html                       # Tailwind CDN, fonts, custom CSS, %sveltekit.body%
    ├── lib/
    │   ├── alert.js                   # SweetAlert2 wrappers
    │   └── api/
    │       ├── UserApi.js
    │       ├── ContactApi.js
    │       └── AddressApi.js
    └── routes/
        ├── +layout.js                 # export const ssr = false
        ├── +layout.svelte             # root: favicon + {@render children()}
        ├── +page.svelte               # default SvelteKit welcome page
        ├── (default)/                 # public group — centered card layout
        │   ├── +layout.svelte
        │   ├── login/+page.svelte
        │   └── register/+page.svelte
        └── (user)/                    # authenticated group — navbar layout
            ├── +layout.svelte
            └── dashboard/
                ├── users/
                │   ├── profile/+page.svelte   # two forms: name, password
                │   └── logout/+page.svelte    # headless — no UI, just onMount
                └── contacts/
                    ├── +page.svelte           # search + pagination + delete
                    ├── create/+page.svelte
                    └── [id]/
                        ├── +page.svelte       # contact info + its address list
                        ├── edit/+page.svelte
                        └── addresses/
                            ├── create/+page.svelte
                            └── [addressId]/edit/+page.svelte
```

> **Key Insight:** In the React version, `components/` and `main.jsx` were two separate things to keep in sync — a component file, plus a `<Route>` pointing at it. In SvelteKit the folder **is** the route: there is no route table to maintain, and the page component lives exactly at the URL it serves. The `(default)` / `(user)` folders are **route groups** — they pick a layout without adding a segment to the URL.

---

## ⚙️ Application Foundation

Before any feature, these pieces get set up once and are used by every page.

### app.html — Styling Layer

The UI template is Tailwind-based, but Tailwind is pulled from a CDN rather than installed — so there's no PostCSS config and no build step for CSS. `app.html` is SvelteKit's equivalent of Vite's `index.html`.

**`src/app.html`**

```html
<head>
  <meta charset="UTF-8">
  <title>Contact Management - Register</title>

  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Google Fonts: Poppins -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <!-- Font Awesome — every <i class="fas fa-..."> icon comes from here -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: { sans: ['Poppins', 'sans-serif'] },
          boxShadow: {
            'custom': '0 10px 25px -5px rgba(0,0,0,.1), 0 10px 10px -5px rgba(0,0,0,.04)',
          },
        }
      }
    }
  </script>

  <style>
    .bg-gradient     { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); }
    .animate-fade-in { animation: fadeIn .5s ease-in-out; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .card-hover       { transition: all .3s ease; }
    .card-hover:hover { transform: translateY(-5px); box-shadow: 0 15px 30px -5px rgba(0,0,0,.3); }
  </style>

  %sveltekit.head%
</head>

<body data-sveltekit-preload-data="hover">
  <div style="display: contents">%sveltekit.body%</div>
</body>
```

This explains the class names used all over the pages that are **not** Tailwind utilities: `bg-gradient`, `animate-fade-in`, `card-hover`, plus the custom `shadow-custom` registered through `tailwind.config`.

Two SvelteKit-specific placeholders replace React's `<div id="root">` + `<script src="/src/main.jsx">`:

- `%sveltekit.head%` — where SvelteKit injects its own `<link>`/`<script>` tags and anything from `<svelte:head>`
- `%sveltekit.body%` — where the rendered app is mounted

`data-sveltekit-preload-data="hover"` on `<body>` makes every link start loading its target page as soon as the mouse hovers over it.

> Reference: [svelte.dev/docs/kit/project-structure#Project-files-src](https://svelte.dev/docs/kit/project-structure#Project-files-src) · [link-options](https://svelte.dev/docs/kit/link-options)

### Runes Mode

**`svelte.config.js`**

```javascript
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
    runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
  },
  kit: {
    adapter: adapter()
  }
};

export default config;
```

Forcing runes mode means every component in `src/` must use `$state` / `$derived` / `$props` — the legacy `let x = 0` reactivity and `export let` props are switched off. Libraries in `node_modules` are left alone so they can keep using whichever mode they were written in.

### Disabling SSR

**`src/routes/+layout.js`**

```javascript
export const ssr = false;
```

Because this lives in the **root** layout, it applies to every route in the app.

> **Key Insight:** This single line is what lets every page read `localStorage.getItem("token")` at the top of its `<script>`. With SSR on, SvelteKit renders the page on the server first — where `localStorage` doesn't exist — and that top-level line would throw `ReferenceError: localStorage is not defined`. Turning SSR off makes the project behave like a classic SPA: the server sends an empty shell and all rendering happens in the browser. The trade-off is losing server-rendered HTML (slower first paint, worse SEO), which doesn't matter for a dashboard behind a login.

> Reference: [svelte.dev/docs/kit/page-options#ssr](https://svelte.dev/docs/kit/page-options#ssr)

### The $lib Alias

```javascript
import { alertSuccess, alertError } from "$lib/alert";
import { userLogin } from "$lib/api/UserApi";
```

`$lib` points to `src/lib` out of the box — no `vite.config.js` alias and no `jsconfig.json` `paths` needed (the React version needed both to get `@`). `jsconfig.json` just extends the file SvelteKit generates:

**`jsconfig.json`**

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": false,
    "moduleResolution": "bundler"
  }
}
```

> Reference: [svelte.dev/docs/kit/$lib](https://svelte.dev/docs/kit/$lib)

### Environment Variable

**`.env`**

```bash
VITE_URL_API=http://localhost:3000/api
```

Note the base URL already includes `/api`, so every API function appends only the resource path:

```javascript
fetch(`${import.meta.env.VITE_URL_API}/users/login`, { ... })
```

> ⚠️ **Note:** anything in a `VITE_`-prefixed variable ends up in the browser bundle in plain text. Base URLs are fine; secrets never belong here. SvelteKit's own `$env/static/public` (with a `PUBLIC_` prefix) would be the more idiomatic choice, but `import.meta.env.VITE_*` works the same way here.

### The API Layer Convention

Every function in `src/lib/api/*.js` follows the same three rules:

1. Build the URL from `import.meta.env.VITE_URL_API`
2. Attach `Authorization: token` when the endpoint requires auth
3. **Return the raw `Response` object** — never call `.json()` inside the API layer

**`src/lib/api/UserApi.js`** (complete)

```javascript
export const userRegister = async ({ username, password, name }) => {
  return fetch(`${import.meta.env.VITE_URL_API}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ username, password, name }),
  });
};

export const userLogin = async ({ username, password }) => {
  return fetch(`${import.meta.env.VITE_URL_API}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
};

export const userDetail = async (token) => {
  return fetch(`${import.meta.env.VITE_URL_API}/users/current`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};

export const userUpdateName = async (token, { name }) => {
  return fetch(`${import.meta.env.VITE_URL_API}/users/current`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ name }),
  });
};

export const userUpdatePassword = async (token, { password }) => {
  return fetch(`${import.meta.env.VITE_URL_API}/users/current`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ password }),
  });
};

export const userLogout = async (token) => {
  return fetch(`${import.meta.env.VITE_URL_API}/users/logout`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};
```

Which gives every calling page the exact same three-line shape:

```javascript
const response = await someApiCall(...);      // Response
const responseBody = await response.json();   // { data } or { errors }

if (response.status === 200) { /* success */ } else { /* alertError */ }
```

> **Key Insight:** Returning the raw `Response` (instead of parsed JSON) is what makes `response.status` available to the caller. The backend signals success/failure through the **HTTP status**, and the body carries either `data` or `errors` — so the page needs both halves. Unlike the React version, all three API files here follow this convention consistently.

Two more details worth noticing:

- Each function destructures only the fields it sends (`{ username, password, name }`). That's why pages can pass a whole `$state` object — e.g. the register form's `user`, which also contains `confirm_password` — and the extra field is silently dropped before it reaches the request body.
- `userUpdateName` and `userUpdatePassword` hit the *same* endpoint (`PATCH /users/current`). The backend marks both fields optional, so each function sends only its own field — keeping the two forms on the profile page independent.

### Token Management

The backend represents a session as a plain `token` stored on the user row, regenerated on every login. The frontend keeps it in `localStorage` so it survives refreshes:

```javascript
// write it (login)
localStorage.setItem("token", responseBody.data.token);

// read it (top of every authenticated page)
const token = localStorage.getItem("token");

// clear it (logout)
localStorage.removeItem("token");
```

No wrapper hook is needed — the React version used `react-use`'s `useLocalStorage`, but because a Svelte `<script>` runs once per component instance (not on every render), a plain `const token = localStorage.getItem(...)` already behaves like "read once on mount".

> Reference: [developer.mozilla.org — Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### Alert Helper

**`src/lib/alert.js`** (complete)

```javascript
import Swal from "sweetalert2";

export const alertSuccess = async (message) => {
  return await Swal.fire({ icon: "success", title: "Success", text: message });
};

export const alertError = async (message) => {
  return await Swal.fire({ icon: "error", title: "Ups", text: message });
};

export const alertConfirm = async (message) => {
  const response = await Swal.fire({
    icon: "question",
    title: "Confirm",
    text: message,
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#D33",
    cancelButtonColor: "#3085D6",
  });

  return response.isConfirmed;   // ← unwrap to a plain boolean
};
```

> **Key Insight:** `alertConfirm` returns `isConfirmed` rather than SweetAlert's full result object, which lets every delete handler read like plain language: `if (!(await alertConfirm("..."))) return;`. Wrapping the library at its boundary also means the dialog styling can change in exactly one place.

---

## 🧭 Routing

There is no route table — the URL map below is derived entirely from the folders under `src/routes`.

### URL → File Map

| URL | Layout | File |
| --- | --- | --- |
| `/` | root | `routes/+page.svelte` (default welcome page) |
| `/register` | `(default)` | `routes/(default)/register/+page.svelte` |
| `/login` | `(default)` | `routes/(default)/login/+page.svelte` |
| `/dashboard/users/profile` | `(user)` | `routes/(user)/dashboard/users/profile/+page.svelte` |
| `/dashboard/users/logout` | `(user)` | `routes/(user)/dashboard/users/logout/+page.svelte` |
| `/dashboard/contacts` | `(user)` | `routes/(user)/dashboard/contacts/+page.svelte` |
| `/dashboard/contacts/create` | `(user)` | `routes/(user)/dashboard/contacts/create/+page.svelte` |
| `/dashboard/contacts/:id` | `(user)` | `routes/(user)/dashboard/contacts/[id]/+page.svelte` |
| `/dashboard/contacts/:id/edit` | `(user)` | `routes/(user)/dashboard/contacts/[id]/edit/+page.svelte` |
| `/dashboard/contacts/:id/addresses/create` | `(user)` | `routes/(user)/dashboard/contacts/[id]/addresses/create/+page.svelte` |
| `/dashboard/contacts/:id/addresses/:addressId/edit` | `(user)` | `routes/(user)/dashboard/contacts/[id]/addresses/[addressId]/edit/+page.svelte` |

Three routing concepts do all the work here:

**1. Folders compose into URLs.** `dashboard/contacts/[id]/edit/+page.svelte` serves `/dashboard/contacts/:id/edit`. Only folders that contain a `+page.svelte` are reachable pages; `dashboard/` and `[id]/addresses/` are pure grouping folders.

**2. `[param]` folders are dynamic segments.** `[id]` and `[addressId]` match any value, read in the page with `page.params` from `$app/state`.

**3. Layouts wrap with `{@render children()}`.** A `+layout.svelte` applies to every page in its folder and below, and the matched page is rendered wherever `{@render children()}` appears — the Svelte equivalent of React Router's `<Outlet />`. Wrapping folders in parentheses — `(default)` and `(user)` — creates **route groups**: each gets its own layout, but the group name never appears in the URL.

**`src/routes/+layout.svelte`** — the root layout, shared by everything:

```svelte
<script>
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
```

**`src/routes/(default)/+layout.svelte`** — the public shell, a centered card on a gradient background:

```svelte
<script>
  const { children } = $props();
</script>

<div class="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex items-center justify-center p-4">
  {@render children()}
</div>
```

**`src/routes/(user)/+layout.svelte`** — the authenticated shell, with a navbar and footer around the content:

```svelte
<script>
  let { children } = $props();
</script>

<div class="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex flex-col">
  <header class="bg-gradient shadow-lg">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <a href="dashboard.html" class="flex items-center ...">
        <i class="fas fa-address-book text-white text-2xl mr-3" />
        <div class="text-white font-bold text-xl">Contact Management</div>
      </a>
      <nav>
        <ul class="flex space-x-6">
          <li><a href="/dashboard/users/profile">Profile</a></li>
          <li><a href="/dashboard/users/logout">Logout</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8 flex-grow">
    {@render children()}          <!-- ← the matched page renders HERE -->

    <div class="mt-10 mb-6 text-center text-gray-400 text-sm animate-fade-in">
      <p>© 2025 Contact Management. All rights reserved.</p>
    </div>
  </main>

  <!-- leftover <script> from the static template — see Known Remaining Issues -->
</div>
```

> **Key Insight:** Navigation uses plain `<a href="...">` everywhere. In React that would trigger a full page reload and had to become `<Link to>`; SvelteKit instead intercepts clicks on same-origin anchors and performs a client-side navigation automatically. The only links that still break are the ones copied verbatim from the template — `href="dashboard.html"` — which point at a page that doesn't exist (see [Known Remaining Issues](#-known-remaining-issues)).
>
> ⚠️ **Note:** These routes have **no auth guard**. `/dashboard/*` renders for anyone; an unauthenticated visitor simply gets a `401` from the first API call and an error alert. With SSR off, the natural place for a guard is a `+layout.js` in `(user)/` whose `load` function checks `localStorage` and calls `redirect(307, "/login")`.

> Reference: [svelte.dev/docs/kit/routing](https://svelte.dev/docs/kit/routing) · [advanced-routing#Advanced-layouts](https://svelte.dev/docs/kit/advanced-routing#Advanced-layouts)

---

## 👤 Part 1 — User Management

### User API Spec

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/users` | - | Register a new user |
| POST | `/api/users/login` | - | Login, receive a token |
| GET | `/api/users/current` | ✅ | Get the logged-in user's data |
| PATCH | `/api/users/current` | ✅ | Update name and/or password |
| DELETE | `/api/users/logout` | ✅ | Clear the token (logout) |

<details>
<summary>Request/response detail for each endpoint</summary>

**Register** — `POST /api/users`

```json
// Request
{ "username": "dzarurizkyy", "password": "dzaru2024", "name": "Dzaru Rizky" }
```

```json
// Response 200
{ "data": { "username": "dzarurizkyy", "name": "Dzaru Rizky" } }
```

```json
// Response 400
{ "errors": "Username already exists" }
```

**Login** — `POST /api/users/login`

```json
// Request
{ "username": "dzarurizkyy", "password": "dzaru2024" }
```

```json
// Response 200 — the token the frontend must store
{ "data": { "token": "3fa85f64-5717-4562-b3fc-2c963f66afa6" } }
```

```json
// Response 401
{ "errors": "Username or password wrong" }
```

**Get Current** — `GET /api/users/current` — Header: `Authorization: <token>`

```json
{ "data": { "username": "dzarurizkyy", "name": "Dzaru Rizky" } }
```

**Update** — `PATCH /api/users/current` — both fields optional

```json
// Request
{ "name": "New Name" }
```

**Logout** — `DELETE /api/users/logout`

```json
{ "data": "OK" }
```

</details>

---

### Stage 1: Register User

The first page, and the first taste of the pattern every later form follows: one `$state` object + `bind:value` + an async submit handler.

**`src/routes/(default)/register/+page.svelte`**

```svelte
<script>
  import { userRegister } from "$lib/api/UserApi";
  import { alertSuccess, alertError } from "$lib/alert";
  import { goto } from "$app/navigation";

  let user = $state({
    username: "",
    name: "",
    password: "",
    confirm_password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();                                // stop the browser's native form POST

    if (user.password !== user.confirm_password) {     // client-side check the API doesn't do
      await alertError("Password and confirm password not match");
      return;
    }

    const response = await userRegister(user);         // extra confirm_password is dropped by the API fn
    const responseBody = await response.json();

    if (response.status === 200) {
      await alertSuccess("Success register new user");
      await goto("/login");                            // client-side redirect, no page reload
    } else {
      await alertError(responseBody.errors);
    }
  }
</script>

<div class="animate-fade-in bg-gray-800 ... w-full max-w-md">
  <form onsubmit={handleSubmit}>
    <!-- bind:value — state ⇄ input, both directions -->
    <input
      type="text"
      id="username"
      name="username"
      bind:value={user.username}
      required
    />
    <!-- ...name, password, confirm_password inputs, same pattern... -->

    <button type="submit">Register</button>
  </form>

  <div class="text-center text-sm text-gray-400">
    Already have an account? <a href="/login">Sign in</a>
  </div>
</div>
```

Four things are worth naming explicitly, because every other form in the project repeats them:

- **`e.preventDefault()`** — Svelte 5 uses plain `onsubmit={...}` attributes (no `on:submit|preventDefault` modifier anymore), so the default has to be prevented by hand. Without it the browser performs its own form submission and reloads the page.
- **`bind:value`** — one directive replaces React's `value={...}` + `onChange={...}` pair. Because `user` is a `$state` object (a deep proxy), binding to `user.username` keeps the nested field in sync in both directions.
- **One state object per form** — instead of four `useState` calls, the whole form is a single object. That object can then be passed straight into the API function.
- **`goto()`** — SvelteKit's programmatic navigation, the equivalent of React Router's `useNavigate()`, for redirecting *after* an async result.

> **Key Insight:** `await alertSuccess(...)` before `goto(...)` is intentional. `Swal.fire()` returns a promise that resolves when the dialog is **dismissed**, so awaiting it means "show the message, wait for the user to acknowledge, *then* redirect."

> Reference: [svelte.dev/docs/svelte/bind](https://svelte.dev/docs/svelte/bind) · [svelte.dev/docs/kit/$app-navigation#goto](https://svelte.dev/docs/kit/$app-navigation#goto)

---

### Stage 2: Login User

**`src/routes/(default)/login/+page.svelte`**

```svelte
<script>
  import { alertSuccess, alertError } from "$lib/alert";
  import { userLogin } from "$lib/api/UserApi";
  import { goto } from "$app/navigation";

  let user = $state({
    username: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await userLogin(user);
    const responseBody = await response.json();

    if (response.status === 200) {
      const token = responseBody.data.token;     // ← inside the { data } envelope
      localStorage.setItem("token", token);
      await goto("/dashboard/contacts");
    } else {
      await alertError(responseBody.errors);
    }
  }
</script>

<form onsubmit={handleSubmit}>
  <input type="text" id="username" bind:value={user.username} required />
  <input type="password" id="password" bind:value={user.password} required />
  <button type="submit">Sign In</button>

  <div>Don't have an account? <a href="/register">Sign up</a></div>
</form>
```

> **Key Insight:** Because the token lives in `localStorage` and not in component state, it survives a page refresh **and** is readable from any page without props or context. That's the whole reason this app needs no store: the only genuinely global value is one string, and the browser already provides a global place to keep it.

---

### Stage 3: Get Current User

The profile page fetches the current user once, when it mounts.

**`src/routes/(user)/dashboard/users/profile/+page.svelte`** (fetch part)

```svelte
<script>
  import { userDetail, userUpdateName, userUpdatePassword } from "$lib/api/UserApi";
  import { alertSuccess, alertError } from "$lib/alert";
  import { onMount } from "svelte";

  const token = localStorage.getItem("token");
  const user = $state({
    name: "",
  });

  async function fetchUser() {
    const response = await userDetail(token);
    const responseBody = await response.json();

    if (response.status === 200) {
      user.name = responseBody.data.name;      // seeds the bound input
    } else {
      await alertError(responseBody.error);    // ⚠️ see Bug #1
    }
  }

  onMount(async () => {
    await fetchUser();
  });
</script>
```

`onMount` is the Svelte counterpart of `useEffect(fn, [])` / `useEffectOnce` — it runs once, after the component is first rendered to the DOM.

> **Key Insight:** `user` is declared with `const`, yet its field is updated with `user.name = ...`. That works because `$state` returns a deep **proxy**: mutating a property is tracked and re-renders the bound input. What `const` forbids is *reassigning* the variable (`user = {...}`), which pages that replace the whole object (like Contact Detail) avoid by declaring with `let`.

> Reference: [svelte.dev/docs/svelte/lifecycle-hooks#onMount](https://svelte.dev/docs/svelte/lifecycle-hooks#onMount) · [svelte.dev/docs/svelte/$state#Deep-state](https://svelte.dev/docs/svelte/$state#Deep-state)

---

### Stage 4: Update Profile & Password

Two independent forms on one page, each with its own state object and its own API function.

**`src/routes/(user)/dashboard/users/profile/+page.svelte`** (update part)

```svelte
<script>
  const password = $state({
    password: "",
    confirmPassword: "",
  });

  async function handleChangeName(e) {
    e.preventDefault();

    const response = await userUpdateName(token, { name: user.name });
    const responseBody = await response.json();

    if (response.status === 200) {
      await alertSuccess(responseBody.message);    // ⚠️ see Bug #1
    } else {
      await alertError(responseBody.error);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();

    if (password.password !== password.confirmPassword) {
      await alertError("Password and confirm password must be same");
      // ⚠️ no return here — see Bug #2
    }

    const response = await userUpdatePassword(token, { password: password.password });
    const responseBody = await response.json();

    if (response.status === 200) {
      password.password = "";                     // clear the form after success
      password.confirmPassword = "";
      await alertSuccess(responseBody.message);
    } else {
      await alertError(responseBody.error);
    }
  }
</script>

<form onsubmit={handleChangeName}>
  <input type="text" id="name" bind:value={user.name} required />
  <button type="submit">Update Profile</button>
</form>

<form onsubmit={handleChangePassword}>
  <input type="password" id="new_password" bind:value={password.password} required />
  <input type="password" id="confirm_password" bind:value={password.confirmPassword} required />
  <button type="submit">Update Password</button>
</form>
```

> **Key Insight:** Fetching into the same `user` object that the name form is bound to is what makes the form "prefilled". There is no separate "loaded data" vs "form data" — the fetch simply seeds the bound state, and the user's typing takes it from there.

---

### Stage 5: Logout User

**`src/routes/(user)/dashboard/users/logout/+page.svelte`** (complete — no markup at all)

```svelte
<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { userLogout } from "$lib/api/UserApi";
  import { alertSuccess, alertError } from "$lib/alert";

  async function handleLogout() {
    const token = localStorage.getItem("token");

    if (token) {
      const response = await userLogout(token);
      const responseBody = await response.json();

      if (response.status === 200) {
        localStorage.removeItem("token");
        await alertSuccess(responseBody.message);
      } else {
        await alertError(responseBody.error);
      }
    }

    await goto("/login");
  }

  onMount(async () => {
    await handleLogout();
  });
</script>
```

> **Key Insight:** Making logout a *route* rather than an `onclick` handler means the navbar's Logout entry is a plain `<a href="/dashboard/users/logout">`, identical in markup to Profile. The page renders nothing — its entire purpose is the `onMount`: invalidate the token server-side, clear it client-side, redirect. The `if (token)` check also makes it safe to open the URL while already logged out: it just redirects to `/login`.

---

## 📇 Part 2 — Contact Management

### Contact API Spec

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/contacts` | ✅ | Create a contact |
| GET | `/api/contacts` | ✅ | Search contacts (`name`, `email`, `phone`, `page`) |
| GET | `/api/contacts/:id` | ✅ | Get one contact |
| PUT | `/api/contacts/:id` | ✅ | Update a contact |
| DELETE | `/api/contacts/:id` | ✅ | Delete a contact |

The search response carries an extra `paging` object next to `data`:

```json
{
  "data": [ { "id": 1, "first_name": "...", "last_name": "...", "email": "...", "phone": "..." } ],
  "paging": { "page": 1, "total_item": 12, "total_page": 2 }
}
```

---

### Stage 1: Create Contact

**`src/lib/api/ContactApi.js`** (create)

```javascript
export const contactCreate = async (token, { first_name, last_name, email, phone }) => {
  return await fetch(`${import.meta.env.VITE_URL_API}/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ first_name, last_name, email, phone }),
  });
};
```

**`src/routes/(user)/dashboard/contacts/create/+page.svelte`**

```svelte
<script>
  import { goto } from "$app/navigation";
  import { contactCreate } from "$lib/api/ContactApi";
  import { alertSuccess, alertError } from "$lib/alert";

  const token = localStorage.getItem("token");
  const contact = $state({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await contactCreate(token, contact);
    const responseBody = await response.json();

    if (response.status === 200) {
      await alertSuccess("Contact created successfully");
      await goto("/dashboard/contacts");
    } else {
      await alertError("Contact creation failed");
    }
  }
</script>

<form onsubmit={handleSubmit}>
  <input type="text" id="first_name" bind:value={contact.first_name} required />
  <input type="text" id="last_name" bind:value={contact.last_name} required />
  <input type="email" id="email" bind:value={contact.email} required />
  <input type="tel" id="phone" bind:value={contact.phone} required />
  <button type="submit">Save Contact</button>
</form>
```

> **Key Insight:** The state object uses the API's own `snake_case` keys (`first_name`), so it can be passed to `contactCreate` as-is — no mapping step. The React version kept `camelCase` state names and converted them at the call site; here the wire format and the form state are the same shape, which is simpler but leaks the backend's naming into the UI layer.

---

### Stage 2: List & Search Contact

**`src/lib/api/ContactApi.js`** (search)

```javascript
export const contactList = async (token, { name, email, phone, page }) => {
  const url = new URL(`${import.meta.env.VITE_URL_API}/contacts`);

  if (name) url.searchParams.append("name", name);    // only send filters that are set
  if (email) url.searchParams.append("email", email);
  if (phone) url.searchParams.append("phone", phone);
  if (page) url.searchParams.append("page", page);

  return await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};
```

**`src/routes/(user)/dashboard/contacts/+page.svelte`** (fetch + search)

```svelte
<script>
  import { onMount } from "svelte";
  import { contactList, contactDelete } from "$lib/api/ContactApi";
  import { alertSuccess, alertConfirm, alertError } from "$lib/alert";

  const token = localStorage.getItem("token");

  const search = $state({
    name: "",
    email: "",
    phone: "",
    page: 1,
  });

  let contacts = $state([]);
  let totalPage = $state(0);

  async function fetchContacts() {
    const response = await contactList(token, search);
    const responseBody = await response.json();

    if (response.status === 200) {
      contacts = responseBody.data;
      totalPage = responseBody.paging.total_page;
    } else {
      await alertError(responseBody.errors);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    search.page = 1;              // a new search always starts from page 1
    await fetchContacts();
  }

  onMount(async () => {
    toggleSearchForm();
    await fetchContacts();
  });
</script>

<form onsubmit={handleSearch}>
  <input type="text" id="search_name" bind:value={search.name} />
  <input type="text" id="search_email" bind:value={search.email} />
  <input type="text" id="search_phone" bind:value={search.phone} />
  <button type="submit">Search</button>
</form>

{#each contacts as contact (contact.id)}
  <div class="card-hover ...">
    <a href={`/dashboard/contacts/${contact.id}`}>
      <h2>{contact.first_name} {contact.last_name}</h2>
      <p>{contact.email}</p>
      <p>{contact.phone}</p>
    </a>
    <a href={`/dashboard/contacts/${contact.id}/edit`}>Edit</a>
    <button onclick={() => handleDeleteContact(contact.id)}>Delete</button>
  </div>
{/each}
```

The whole `search` object — filters **and** current page — is passed into `contactList`, and the API function picks out what it needs. `(contact.id)` makes the `{#each}` block **keyed**, so Svelte can tell which card was removed after a delete instead of just re-rendering the last one.

> **Key Insight:** `handleSearch` sets `search.page = 1` and then immediately calls `fetchContacts()`, which reads `search.page` — and gets the new value. In React this exact shape was a bug (`setPage` schedules an update; the next line still sees the old value), and the fix needed a `reload` flag plus a `useEffect`. In Svelte, writing to a `$state` proxy updates the value **synchronously**; only the DOM update is batched. So "set, then fetch" just works.

> Reference: [svelte.dev/docs/svelte/each#Keyed-each-blocks](https://svelte.dev/docs/svelte/each#Keyed-each-blocks)

---

### Stage 3: Pagination

**`src/routes/(user)/dashboard/contacts/+page.svelte`** (pagination part)

```svelte
<script>
  let pages = $derived.by(() => {
    const data = [];

    for (let i = 1; i <= totalPage; i++) {
      data.push(i);
    }

    return data;
  });

  async function handlePageChange(value) {
    search.page = value;
    await fetchContacts();
  }
</script>

<nav>
  {#if search.page > 1}
    <a href="#" onclick={() => handlePageChange(search.page - 1)}>Previous</a>
  {/if}

  {#each pages as page (page)}
    {#if page === search.page}
      <a href="#" class="bg-gradient ..." onclick={() => handlePageChange(page)}>{page}</a>
    {:else}
      <a href="#" class="bg-gray-800 ..." onclick={() => handlePageChange(page)}>{page}</a>
    {/if}
  {/each}

  {#if search.page < totalPage}
    <a href="#" onclick={() => handlePageChange(search.page + 1)}>Next</a>
  {/if}
</nav>
```

`pages` is **derived** from `totalPage`: every time a fetch updates `totalPage`, the `[1, 2, ..., n]` array is rebuilt automatically. `$derived.by` is used instead of `$derived(...)` because building the array needs a loop, not a single expression.

> Reference: [svelte.dev/docs/svelte/$derived#$derived.by](https://svelte.dev/docs/svelte/$derived#$derived.by)

---

### Stage 4: Collapsible Search Form

The template's search panel collapses/expands with a chevron button. Its static-HTML JavaScript was moved into a function and called from `onMount`, so the DOM elements are guaranteed to exist.

**`src/routes/(user)/dashboard/contacts/+page.svelte`** (toggle part)

```svelte
<script>
  function toggleSearchForm() {
    const toggleButton = document.getElementById("toggleSearchForm");
    const searchFormContent = document.getElementById("searchFormContent");
    const toggleIcon = document.getElementById("toggleSearchIcon");

    // initial collapsed state
    searchFormContent.style.transition =
      "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, margin 0.3s ease-in-out";
    searchFormContent.style.overflow = "hidden";
    searchFormContent.style.maxHeight = "0px";
    searchFormContent.style.opacity = "0";
    searchFormContent.style.marginTop = "0";

    toggleButton.addEventListener("click", function () {
      if (searchFormContent.style.maxHeight !== "0px") {
        // Hide the form
        searchFormContent.style.maxHeight = "0px";
        searchFormContent.style.opacity = "0";
        searchFormContent.style.marginTop = "0";
        toggleIcon.classList.remove("fa-chevron-up");
        toggleIcon.classList.add("fa-chevron-down");
      } else {
        // Show the form
        searchFormContent.style.maxHeight = searchFormContent.scrollHeight + "px";
        searchFormContent.style.opacity = "1";
        searchFormContent.style.marginTop = "1rem";
        toggleIcon.classList.remove("fa-chevron-down");
        toggleIcon.classList.add("fa-chevron-up");
      }
    });
  }

  onMount(async () => {
    toggleSearchForm();      // DOM exists by now
    await fetchContacts();
  });
</script>
```

> **Key Insight:** `onMount` runs after the component's markup is in the DOM, so it *is* the "DOM is ready" callback — no `DOMContentLoaded` wrapper is needed (and one would never fire, because that event happened long before a client-side navigation reached this page). This works, but it's imperative DOM code inside a declarative framework; the idiomatic Svelte version is a `let open = $state(false)` flag, an `onclick={() => (open = !open)}` on the button, and `class:` / `style:` directives driven by `open`.

---

### Stage 5: Contact Detail

The detail page shows one contact plus the list of its addresses — two independent fetches on mount.

**`src/routes/(user)/dashboard/contacts/[id]/+page.svelte`** (contact part)

```svelte
<script>
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { contactDetail } from "$lib/api/ContactApi";

  const token = localStorage.getItem("token");
  const { id } = page.params;          // ← the [id] folder segment

  let contact = $state({
    id: id,
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  async function fetchContact() {
    const response = await contactDetail(token, id);
    const responseBody = await response.json();

    if (response.status === 200) {
      contact = responseBody.data;     // replace the whole object → needs `let`
    } else {
      await alertError(responseBody.errors);
    }
  }

  onMount(async () => {
    await fetchContact();
    await fetchAddresses();
  });
</script>

<h1>{contact.first_name} {contact.last_name}</h1>
<p>{contact.email}</p>
<p>{contact.phone}</p>

<a href="/dashboard/contacts">Back</a>
<a href={`/dashboard/contacts/${id}/edit`}>Edit Contact</a>
```

`page.params` from `$app/state` is SvelteKit's equivalent of React Router's `useParams()` — it holds every `[param]` segment matched by the current URL.

> Reference: [svelte.dev/docs/kit/$app-state#page](https://svelte.dev/docs/kit/$app-state#page)

---

### Stage 6: Update Contact

**`src/lib/api/ContactApi.js`** (detail + update)

```javascript
export const contactDetail = async (token, id) => {
  return await fetch(`${import.meta.env.VITE_URL_API}/contacts/${id}`, {
    method: "GET",
    headers: { Accept: "application/json", Authorization: token },
  });
};

export const contactUpdate = async (token, id, { first_name, last_name, email, phone }) => {
  return await fetch(`${import.meta.env.VITE_URL_API}/contacts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ first_name, last_name, email, phone }),
  });
};
```

**`src/routes/(user)/dashboard/contacts/[id]/edit/+page.svelte`**

```svelte
<script>
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { contactDetail, contactUpdate } from "$lib/api/ContactApi";
  import { alertSuccess, alertError } from "$lib/alert";

  const token = localStorage.getItem("token");
  const { id } = page.params;
  const contact = $state({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  async function fetchContacts() {
    const response = await contactDetail(token, id);
    const responseBody = await response.json();

    if (response.status === 200) {
      contact.first_name = responseBody.data.first_name;   // ← read inside { data }
      contact.last_name = responseBody.data.last_name;
      contact.email = responseBody.data.email;
      contact.phone = responseBody.data.phone;
    } else {
      await alertError(responseBody.errors);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await contactUpdate(token, id, contact);
    const responseBody = await response.json();

    if (response.status === 200) {
      await alertSuccess("Success update contact");
      await goto("/dashboard/contacts");
    } else {
      await alertError("Failed update contact");
    }
  }

  onMount(async () => {
    await fetchContacts();
  });
</script>

<form onsubmit={handleSubmit}>
  <input type="text" id="first_name" bind:value={contact.first_name} required />
  <!-- ...last_name, email, phone... -->
  <button type="submit">Save Changes</button>
</form>
```

> **Key Insight:** An edit page is just a create page whose state is seeded by a fetch. Because the inputs are bound, writing `contact.first_name = ...` in `onMount` and the user typing into the field write to the same place — so "prefilled" and "user-edited" are indistinguishable by the time submit runs. Here `contact` is `const`, so it's filled field by field; Contact Detail and the address pages declare `let` and replace the whole object instead — both are valid with `$state`.

---

### Stage 7: Delete Contact

**`src/lib/api/ContactApi.js`** (delete)

```javascript
export const contactDelete = async (token, id) => {
  return await fetch(`${import.meta.env.VITE_URL_API}/contacts/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json", Authorization: token },
  });
};
```

**`src/routes/(user)/dashboard/contacts/+page.svelte`** (delete part)

```svelte
<script>
  async function handleDeleteContact(id) {
    if (!(await alertConfirm("Are you sure you want ro delete this contact"))) {
      return;                         // user clicked Cancel
    }

    const response = await contactDelete(token, id);
    const responseBody = await response.json();

    if (response.status === 200) {
      await fetchContacts();          // refresh the list from the server
      await alertSuccess("Success delete contact");
    } else {
      await alertError("Failed delete contact");
    }
  }
</script>

<button onclick={() => handleDeleteContact(contact.id)}>Delete</button>
```

The list is refreshed by refetching rather than by removing the item locally — simpler, and it keeps `paging.total_page` correct.

---

## 📍 Part 3 — Address Management

### Address API Spec

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/contacts/:id/addresses` | ✅ | Create an address for a contact |
| GET | `/api/contacts/:id/addresses` | ✅ | List a contact's addresses |
| GET | `/api/contacts/:id/addresses/:addressId` | ✅ | Get one address |
| PUT | `/api/contacts/:id/addresses/:addressId` | ✅ | Update an address |
| DELETE | `/api/contacts/:id/addresses/:addressId` | ✅ | Delete an address |

Every address function takes `contactId` (and `addressId` where needed) as **positional** arguments, and the body fields as a destructured object:

```javascript
addressCreate(token, contactId, { street, city, province, country, postal_code })
addressList(token, contactId)
addressDetail(token, contactId, addressId)
addressUpdate(token, contactId, addressId, { street, city, province, country, postal_code })
addressDelete(token, contactId, addressId)
```

---

### Stage 1: Create Address

**`src/lib/api/AddressApi.js`** (create)

```javascript
export const addressCreate = async (token, contactId, { street, city, province, country, postal_code }) => {
  return await fetch(`${import.meta.env.VITE_URL_API}/contacts/${contactId}/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ street, city, province, country, postal_code }),
  });
};
```

**`src/routes/(user)/dashboard/contacts/[id]/addresses/create/+page.svelte`**

```svelte
<script>
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { contactDetail } from "$lib/api/ContactApi";
  import { addressCreate } from "$lib/api/AddressApi";
  import { alertSuccess, alertError } from "$lib/alert";

  const token = localStorage.getItem("token");
  const { id } = page.params;

  let contact = $state({ id: id, first_name: "", last_name: "", email: "", phone: "" });

  let address = $state({
    street: "",
    city: "",
    province: "",
    country: "",
    postal_code: "",
  });

  async function fetchContact() {
    const response = await contactDetail(token, id);
    const responseBody = await response.json();

    if (response.status === 200) {
      contact = responseBody.data;
    } else {
      await alertError(responseBody.errors);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await addressCreate(token, id, address);
    const responseBody = await response.json();

    if (response.status === 200) {
      await alertSuccess("Success add address");
      await goto(`/dashboard/contacts/${contact.id}`);   // back to the detail page
    } else {
      await alertError("Failed to add address");
    }
  }

  onMount(async () => {
    await fetchContact();
  });
</script>

<!-- whose address this is -->
<h2>{contact.first_name} {contact.last_name}</h2>
<p>{contact.email} • {contact.phone}</p>

<form onsubmit={handleSubmit}>
  <input type="text" id="street" bind:value={address.street} required />
  <!-- ...city, province, country, postal_code... -->
  <button type="submit">Add Address</button>
</form>
```

> **Key Insight:** The extra `contactDetail` fetch here is purely for context — the create call itself only needs `id` from the URL. It's a small but real UX decision: an address form with no indication of *whose* address it is, is easy to fill in on the wrong contact.

---

### Stage 2: List Address

The address list lives on the Contact Detail page, fetched right after the contact.

**`src/lib/api/AddressApi.js`** (list)

```javascript
export const addressList = async (token, contactId) => {
  return await fetch(`${import.meta.env.VITE_URL_API}/contacts/${contactId}/addresses`, {
    method: "GET",
    headers: { Accept: "application/json", Authorization: token },
  });
};
```

**`src/routes/(user)/dashboard/contacts/[id]/+page.svelte`** (address part)

```svelte
<script>
  import { addressList, addressDelete } from "$lib/api/AddressApi";

  let addresses = $state([]);

  async function fetchAddresses(contactId) {
    const response = await addressList(token, id);     // uses `id` from page.params, not the argument
    const responseBody = await response.json();

    if (response.status === 200) {
      addresses = responseBody.data;
    } else {
      await alertError(responseBody.errors);
    }
  }
</script>

<a href={`/dashboard/contacts/${contact.id}/addresses/create`}>Add Address</a>

{#each addresses as address (address.id)}
  <div class="card-hover ...">
    <p>{address.street}</p>
    <p>{address.city}, {address.province}</p>
    <p>{address.country} {address.postal_code}</p>

    <a href={`/dashboard/contacts/${contact.id}/addresses/${address.id}/edit`}>Edit</a>
    <button onclick={() => handleDeleteAddress(address.id)}>Delete</button>
  </div>
{/each}
```

---

### Stage 3: Update Address

This page needs **two** URL params — `[id]` for the contact and `[addressId]` for the address.

**`src/lib/api/AddressApi.js`** (detail + update)

```javascript
export const addressDetail = async (token, contactId, addressId) => {
  return await fetch(`${import.meta.env.VITE_URL_API}/contacts/${contactId}/addresses/${addressId}`, {
    method: "GET",
    headers: { Accept: "application/json", Authorization: token },
  });
};

export const addressUpdate = async (token, contactId, addressId, { street, city, province, country, postal_code }) => {
  return await fetch(`${import.meta.env.VITE_URL_API}/contacts/${contactId}/addresses/${addressId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ street, city, province, country, postal_code }),
  });
};
```

**`src/routes/(user)/dashboard/contacts/[id]/addresses/[addressId]/edit/+page.svelte`**

```svelte
<script>
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { contactDetail } from "$lib/api/ContactApi";
  import { addressDetail, addressUpdate } from "$lib/api/AddressApi";
  import { alertSuccess, alertError } from "$lib/alert";

  const token = localStorage.getItem("token");
  const { id, addressId } = page.params;     // ← both dynamic segments

  let contact = $state({ id: id, first_name: "", last_name: "", email: "", phone: "" });
  let address = $state({ street: "", city: "", province: "", country: "", postal_code: "" });

  async function fetchContact() {
    const response = await contactDetail(token, id);
    const responseBody = await response.json();

    if (response.status === 200) {
      contact = responseBody.data;
    } else {
      await alertError(responseBody.errors);
    }
  }

  async function fetchAddress() {
    const response = await addressDetail(token, id, addressId);
    const responseBody = await response.json();

    if (response.status === 200) {
      address = responseBody.data;           // seeds every bound input at once
    } else {
      await alertError(responseBody.errors);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await addressUpdate(token, id, addressId, address);
    const responseBody = await response.json();

    if (response.status === 200) {
      await alertSuccess("address updated successfully");   // stays on the page
    } else {
      await alertError(responseBody.errors);
    }
  }

  onMount(async () => {
    await fetchContact();
    await fetchAddress();
  });
</script>

<h2>{contact.first_name} {contact.last_name}</h2>
<p>{contact.email} • {contact.phone_number}</p>    <!-- ⚠️ see Bug #3 -->

<form onsubmit={handleSubmit}>
  <input type="text" id="street" bind:value={address.street} required />
  <!-- ...city, province, country, postal_code... -->
  <button type="submit">Save Changes</button>
</form>
```

`address = responseBody.data` replaces the whole object in one line. The response also contains `id`, which `addressUpdate` simply ignores, because it destructures only the five body fields.

---

### Stage 4: Delete Address

**`src/lib/api/AddressApi.js`** (delete)

```javascript
export const addressDelete = async (token, contactId, addressId) => {
  return await fetch(`${import.meta.env.VITE_URL_API}/contacts/${contactId}/addresses/${addressId}`, {
    method: "DELETE",
    headers: { Accept: "application/json", Authorization: token },
  });
};
```

**`src/routes/(user)/dashboard/contacts/[id]/+page.svelte`** (delete part)

```svelte
<script>
  async function handleDeleteAddress(addressId) {
    if (!(await alertConfirm("Are your sure you want to delete this address?"))) {
      return;
    }

    const response = await addressDelete(token, id, addressId);
    const responseBody = await response.json();

    if (response.status === 200) {
      await alertSuccess("Address deleted successfully");
      await fetchAddresses();          // refresh the address cards
    } else {
      await alertError(responseBody.errors);
    }
  }
</script>
```

Same shape as deleting a contact: confirm → delete → refetch.

---

## 🛠️ Running the Project

**`package.json`** (scripts)

```json
"scripts": {
  "dev": "vite dev",
  "build": "vite build",
  "preview": "vite preview",
  "prepare": "svelte-kit sync || echo ''"
}
```

| Script | Command | When to use it |
| --- | --- | --- |
| `npm run dev` | `vite dev` | The everyday command. Starts the dev server with hot module replacement on `http://localhost:5173`. |
| `npm run build` | `vite build` | Produces the production build. With `adapter-auto`, the output format depends on the detected deployment platform. |
| `npm run preview` | `vite preview` | Serves the production build locally to sanity-check it — not a production server. |
| `npm run prepare` | `svelte-kit sync` | Runs automatically after `npm install`. Generates `.svelte-kit/tsconfig.json` (which `jsconfig.json` extends) and the types for `$app/*` / `$lib`. |

**Startup order matters:**

1. Start **MySQL** and make sure the database exists.
2. Start the backend: `npm start` → `http://localhost:3000`.
3. Start the frontend: `npm run dev` → `http://localhost:5173`.

If the backend isn't running, every page still renders — the fetches simply fail and the error surfaces in the console or an alert.

---

## 🧪 Manual Testing

There are no automated tests in this project, so verification is a walkthrough in the browser with DevTools open. The **Network** tab (to inspect request headers and response bodies) and **Application → Local Storage** (to watch the token) are the two panels that matter.

**Happy path, in order:**

1. Open `/register` → create a user → expect a success alert and a redirect to `/login`.
2. Log in → check **Application → Local Storage** now holds a `token` key.
3. Land on `/dashboard/contacts` → the contact grid renders (only the "Create New Contact" card on a fresh account).
4. Create a contact → it appears in the list.
5. Open the contact → detail page shows its fields and an empty address section.
6. Add an address → redirected back to the detail page, address card now visible.
7. Edit the contact and the address → confirm the forms are **prefilled** before you change anything.
8. Expand the search panel with the chevron → filter by name/email/phone.
9. Create enough contacts to exceed one page → click through the pagination buttons.
10. Delete an address, then a contact → confirm the SweetAlert dialog appears and the list refreshes after confirming.
11. Update your profile name and password from `/dashboard/users/profile`.
12. Log out → `token` disappears from Local Storage and you land on `/login`.

**Failure paths worth testing deliberately:**

| Test | Expected |
| --- | --- |
| Register with an existing username | `400` + error alert with the backend's message |
| Login with a wrong password | `401` + "Username or password wrong" |
| Manually corrupt the `token` in Local Storage, then reload a dashboard page | `401 Unauthorized` on the first fetch |
| Mismatched password + confirmation on register | Blocked client-side, no request sent (check the Network tab) |
| Mismatched password + confirmation on profile | Error alert — **but the request is still sent** (see [Bug #2](#2-password-mismatch-check-without-a-return)) |
| Stop the backend, then submit a form | Network error |

> **Key Insight:** The Network tab's response **Preview** is the fastest way to see the exact shape the backend sends — the `{ data: ... }` / `{ errors: ... }` envelope, and the fact that there is no `message` or `error` field anywhere, which is what [Bug #1](#1-reading-fields-the-backend-never-sends) is about.

---

## 🐛 Bugs Found in the Code

These are issues still present in the finished project, found by reading the code against the backend's response contract. Each one is small, but each teaches something.

### 1. Reading fields the backend never sends

**Symptom:** Updating the profile name or password, and logging out, all show a success dialog with an **empty body**. Any failure on the profile/logout pages shows an empty error dialog too.

**Code:**

```javascript
// ❌ profile/+page.svelte, logout/+page.svelte
if (response.status === 200) {
  await alertSuccess(responseBody.message);
} else {
  await alertError(responseBody.error);
}
```

**Root cause:** The backend's envelope has exactly two shapes: `{ data: ... }` on success and `{ errors: "..." }` on failure. There is no `message` field, and the error key is `errors` (plural) — every other page in the project already reads `responseBody.errors`. Both expressions evaluate to `undefined`, and SweetAlert renders `text: undefined` as an empty body without complaining.

**Fix:**

```javascript
// ✅
if (response.status === 200) {
  await alertSuccess("Profile updated successfully");   // hardcoded, like the other pages
} else {
  await alertError(responseBody.errors);
}
```

**Lesson:** When one page reads `errors` and another reads `error`, one of them is wrong. Reading the backend's error middleware once, and sticking to its exact keys everywhere, avoids a whole class of "blank dialog" bugs.

---

### 2. Password mismatch check without a `return`

**Symptom:** On the profile page, entering two different passwords shows "Password and confirm password must be same" — but after dismissing it, the password is **changed anyway** to the first value.

**Code:**

```javascript
// ❌
if (password.password !== password.confirmPassword) {
  await alertError("Password and confirm password must be same");
}

const response = await userUpdatePassword(token, { password: password.password });
```

**Root cause:** `alertError` only *displays* a message; it doesn't stop execution. Without a `return`, the function falls through to the API call. The register page does this correctly — the same check there ends with `return;`.

**Fix:**

```javascript
// ✅
if (password.password !== password.confirmPassword) {
  await alertError("Password and confirm password must be same");
  return;
}
```

**Lesson:** A validation branch that shows an error must also *exit*. When copying a pattern from another page, copy the whole guard — the `return` is the part that matters.

---

### 3. A field name that doesn't exist on the object

**Symptom:** On the edit address page, the contact header shows the email followed by `•` and then nothing — the phone number is missing.

**Code:**

```svelte
<!-- ❌ addresses/[addressId]/edit/+page.svelte -->
<p>{contact.email} • {contact.phone_number}</p>
```

**Root cause:** The contact object uses `phone`, not `phone_number` (the create address page, with the same header, reads `contact.phone`). Svelte renders `undefined` as an empty string, so there's no error — the value just silently disappears.

**Fix:**

```svelte
<!-- ✅ -->
<p>{contact.email} • {contact.phone}</p>
```

**Lesson:** Template expressions fail silently. When a value is "just not showing", check the key name against the actual response in the Network tab before suspecting the fetch.

---

### 4. Template links copied verbatim

**Symptom:** Clicking the **Contact Management** logo in the navbar, or **Cancel** on the create contact page, leads to a 404.

**Code:**

```svelte
<!-- ❌ (user)/+layout.svelte, contacts/create/+page.svelte -->
<a href="dashboard.html">...</a>
```

**Root cause:** The static template linked its pages as separate `.html` files. In SvelteKit, URLs are folder paths; there is no `dashboard.html` route, so the router renders its 404 page.

**Fix:**

```svelte
<!-- ✅ -->
<a href="/dashboard/contacts">...</a>
```

**Lesson:** When porting a static template, search the whole project for `.html"` once the routes exist — every hit is a link that still points to the old world.

---

## ⚠️ Known Remaining Issues

Smaller things still present in the code, kept as future exercises:

| Issue | Where | Detail |
| --- | --- | --- |
| No route guard on `/dashboard/*` | `(user)/` | Any visitor can open a dashboard URL; they just get 401 alerts. A `(user)/+layout.js` with a `load` that checks `localStorage` and calls `redirect(307, "/login")` would fix it. |
| `/` is the default welcome page | `routes/+page.svelte` | Visiting the root shows "Welcome to SvelteKit" instead of redirecting to `/login` or `/dashboard/contacts`. |
| Leftover `<script>` with `DOMContentLoaded` | `(user)/+layout.svelte` | Copied from the template; the real toggle logic lives in `contacts/+page.svelte`. Should be deleted. |
| Imperative search-form toggle | `contacts/+page.svelte` | `getElementById` + `style.*` + `addEventListener` could become a `$state` flag with `class:`/`style:` directives. |
| Self-closing `<i ... />` tags | all pages | Svelte 5 warns about self-closing non-void HTML elements; should be `<i ...></i>`. |
| Unused parameter / import | `[id]/+page.svelte`, `[addressId]/edit/+page.svelte` | `fetchAddresses(contactId)` ignores its argument; `addressCreate` is imported but not used. |
| Inconsistent post-update behavior | `[addressId]/edit/+page.svelte` | Every other form redirects after success; updating an address stays on the page. |
| `href="#"` pagination links | `contacts/+page.svelte` | Each click appends `#` to the URL; `<button>` elements would be more accurate. |
| Leftover `console.log(responseBody)` | most pages | Debug output still in place. |
| Typos in dialog text | `contacts/+page.svelte`, `[id]/+page.svelte` | "want **ro** delete", "Are **your** sure". |
| No loading or empty states | all list/detail pages | Nothing indicates a fetch in progress, and an empty list looks identical to one that hasn't loaded yet. |

---

## 📚 Quick Reference

### All Endpoints

| Module | Method | Endpoint | Auth |
| --- | --- | --- | --- |
| User | POST | `/api/users` | - |
| User | POST | `/api/users/login` | - |
| User | GET | `/api/users/current` | ✅ |
| User | PATCH | `/api/users/current` | ✅ |
| User | DELETE | `/api/users/logout` | ✅ |
| Contact | POST | `/api/contacts` | ✅ |
| Contact | GET | `/api/contacts` (search) | ✅ |
| Contact | GET | `/api/contacts/:id` | ✅ |
| Contact | PUT | `/api/contacts/:id` | ✅ |
| Contact | DELETE | `/api/contacts/:id` | ✅ |
| Address | POST | `/api/contacts/:id/addresses` | ✅ |
| Address | GET | `/api/contacts/:id/addresses` (list) | ✅ |
| Address | GET | `/api/contacts/:id/addresses/:addressId` | ✅ |
| Address | PUT | `/api/contacts/:id/addresses/:addressId` | ✅ |
| Address | DELETE | `/api/contacts/:id/addresses/:addressId` | ✅ |

### Svelte & SvelteKit APIs Used

| API | Source | Used for |
| --- | --- | --- |
| `$state` | svelte (rune) | Every form object, fetched data, pagination state |
| `$derived.by` | svelte (rune) | Building the page-number array from `totalPage` |
| `$props` | svelte (rune) | Receiving `children` in layouts |
| `bind:value` | svelte | Two-way binding between inputs and state |
| `{#each ... (key)}` / `{#if}` | svelte | Contact cards, address cards, pagination |
| `{@render children()}` | svelte | Layout slot for the matched page |
| `onMount` | svelte | Fetch-on-mount, search-form DOM setup, logout |
| `goto` | `$app/navigation` | Programmatic redirect after an async result |
| `page.params` | `$app/state` | Reading `[id]` and `[addressId]` from the URL |
| `export const ssr = false` | `+layout.js` | Making the whole app browser-only |

### React → SvelteKit Mapping

| React version | SvelteKit version |
| --- | --- |
| `<BrowserRouter>` + `<Routes>` in `main.jsx` | Folders under `src/routes` |
| `<Outlet />` | `{@render children()}` |
| `<Link to="...">` | Plain `<a href="...">` |
| `useNavigate()` | `goto()` |
| `useParams()` | `page.params` |
| `useState` per field + `value`/`onChange` | One `$state` object + `bind:value` |
| `useEffectOnce` / `useEffect(fn, [])` | `onMount` |
| `useLocalStorage` | `localStorage.getItem/setItem/removeItem` |
| `@` alias (vite + jsconfig) | `$lib` (built in) |
| `index.html` | `src/app.html` |

### Page Responsibilities

| Page | Reads | Writes | Notes |
| --- | --- | --- | --- |
| `register` | — | `POST /api/users` | Client-side password confirmation |
| `login` | — | `POST /api/users/login` | Stores the token |
| `users/profile` | `GET /api/users/current` | `PATCH /api/users/current` ×2 | Two independent forms |
| `users/logout` | — | `DELETE /api/users/logout` | Renders nothing |
| `contacts` | `GET /api/contacts` | `DELETE /api/contacts/:id` | Search + pagination + delete |
| `contacts/create` | — | `POST /api/contacts` | |
| `contacts/[id]` | `GET /api/contacts/:id` + address list | `DELETE .../addresses/:addressId` | Two fetches on mount |
| `contacts/[id]/edit` | `GET /api/contacts/:id` | `PUT /api/contacts/:id` | Prefilled form |
| `addresses/create` | `GET /api/contacts/:id` (context) | `POST .../addresses` | |
| `addresses/[addressId]/edit` | contact + address detail | `PUT .../addresses/:addressId` | Two ids from `page.params` |

---

## 💡 Key Takeaways

- **The folder is the route.** There is no route table to keep in sync with the components — `[id]` folders are params, `(group)` folders pick a layout without touching the URL, and `{@render children()}` is the slot where the matched page appears.

- **`ssr = false` is what makes `localStorage` usable everywhere.** SvelteKit renders on the server by default, where browser APIs don't exist. Turning SSR off in the root layout trades server-rendered HTML for a simple SPA model — the right trade for a dashboard behind a login.

- **`$state` writes are synchronous.** Setting `search.page = 1` and calling `fetchContacts()` on the next line just works — the stale-state bug from the React version, and the `reload`-flag workaround it needed, don't exist here.

- **One state object per form, bound with `bind:value`.** It removes most of the boilerplate React needed (`value` + `onChange` per field), and the object can be passed straight into an API function that destructures only the fields it sends.

- **The API layer is a contract, in two directions.** Every `lib/api/` function returns the raw `Response` — consistently, this time — and every page must read the backend's exact keys (`data`, `errors`, `paging`). The remaining bugs in this project are all on the second half of that contract: reading `message`, `error`, or `phone_number`, which don't exist.

- **Template expressions fail silently.** `undefined` renders as nothing, both in `{...}` and in a SweetAlert `text`. When something is "just not showing", compare the key you're reading against the actual response in the Network tab.

- **Port the template, then remove the template's assumptions.** `.html` links, `DOMContentLoaded` scripts, and imperative DOM toggles all came from the static HTML. Each one still "sort of works" or silently does nothing — which is exactly why they're worth hunting down.

> Reference: [svelte.dev/docs/kit/introduction](https://svelte.dev/docs/kit/introduction) · [svelte.dev/docs/svelte/overview](https://svelte.dev/docs/svelte/overview) · [belajar-nodejs-restful-api](https://github.com/ProgrammerZamanNow/belajar-nodejs-restful-api)
