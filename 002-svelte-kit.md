# ⚡ SvelteKit Basics

A practical reference guide for learning SvelteKit — covering filesystem routing, layouts, load functions, API routes, form actions, hooks, environment variables, and deployment, built hands-on on top of Svelte.

---

## 📋 Table of Contents

- [Introduction](#-introduction)
  - [What Is SvelteKit?](#what-is-sveltekit)
  - [SvelteKit Features](#sveltekit-features)
- [Project Setup](#-project-setup)
  - [Creating the Project](#creating-the-project)
  - [Project Structure](#project-structure)
- [Routing & Navigation](#-routing--navigation)
  - [Filesystem-Based Routing](#filesystem-based-routing)
  - [SSR First, CSR After](#ssr-first-csr-after)
  - [Navigating with Anchor Tags](#navigating-with-anchor-tags)
  - [Programmatic Navigation with goto](#programmatic-navigation-with-goto)
- [Layouts](#-layouts)
  - [Creating a Layout](#creating-a-layout)
  - [Nested Layouts](#nested-layouts)
- [Load Data](#-load-data)
  - [Page Data](#page-data)
  - [Layout Data](#layout-data)
  - [Load Parameters](#load-parameters)
  - [Page Information with $app/state](#page-information-with-appstate)
- [Route Parameters](#-route-parameters)
  - [Dynamic Segments](#dynamic-segments)
- [Invalidation & Cache](#-invalidation--cache)
  - [How Load Caching Works](#how-load-caching-works)
  - [invalidate & invalidateAll](#invalidate--invalidateall)
- [Fetching & Parent Data](#-fetching--parent-data)
  - [SvelteKit's fetch](#sveltekits-fetch)
  - [Reading Parent Data](#reading-parent-data)
- [Server Load Data](#-server-load-data)
  - [Universal vs. Server Load Files](#universal-vs-server-load-files)
  - [Combining Server & Client Load](#combining-server--client-load)
- [API Routes](#-api-routes)
  - [Creating an Endpoint](#creating-an-endpoint)
- [Error Pages & Redirects](#-error-pages--redirects)
  - [Custom Error Page](#custom-error-page)
  - [Redirecting](#redirecting)
- [Form Actions](#-form-actions)
  - [Defining Actions](#defining-actions)
  - [Named Actions & Validation Errors](#named-actions--validation-errors)
- [Page Options](#-page-options)
  - [prerender, ssr & csr](#prerender-ssr--csr)
- [State Management on the Server](#-state-management-on-the-server)
  - [Shared Server State](#shared-server-state)
- [Advanced Routing](#-advanced-routing)
  - [Optional Parameters](#optional-parameters)
  - [Rest Parameters](#rest-parameters)
  - [Parameter Matchers](#parameter-matchers)
- [Advanced Layouts](#-advanced-layouts)
  - [Route Groups](#route-groups)
  - [Breaking the Layout Hierarchy](#breaking-the-layout-hierarchy)
- [Hooks](#-hooks)
  - [Hook Files](#hook-files)
  - [Server Hooks](#server-hooks)
  - [Shared Hooks](#shared-hooks)
  - [Universal Hooks](#universal-hooks)
- [Errors](#-errors)
  - [Expected vs. Unexpected Errors](#expected-vs-unexpected-errors)
  - [Throwing an Expected Error](#throwing-an-expected-error)
- [Link Options](#-link-options)
  - [Preloading Data](#preloading-data)
- [The lib Folder](#-the-lib-folder)
  - [The $lib Alias](#the-lib-alias)
- [Environment Variables](#-environment-variables)
  - [Static Environment](#static-environment)
  - [Dynamic Environment](#dynamic-environment)
- [Server-Only Modules](#-server-only-modules)
  - [Keeping Code on the Server](#keeping-code-on-the-server)
- [Building & Deploying](#-building--deploying)
  - [Building the App](#building-the-app)
  - [Build Stage Check](#build-stage-check)
  - [Previewing the Build](#previewing-the-build)
  - [Node.js Adapter](#nodejs-adapter)
  - [Running the Production Server](#running-the-production-server)
  - [Single Page Application](#single-page-application)
- [Quick Reference](#-quick-reference)
- [Best Practices](#-best-practices)

---

## 🎯 Introduction

### What Is SvelteKit?

- **Svelte** is a framework for building components — but a real web application needs much more than components alone
- **SvelteKit** is a framework built on top of Svelte that makes your application **production-ready**

> Reference: [svelte.dev/docs/kit/introduction](https://svelte.dev/docs/kit/introduction) · [github.com/sveltejs/kit](https://github.com/sveltejs/kit)

### SvelteKit Features

SvelteKit solves many common web development problems:

| Feature | Description |
| --- | --- |
| **Routing** | Filesystem-based routing |
| **SSR** | Server-side rendering |
| **Data Fetching** | Built-in load functions |
| **Prerender** | Static HTML generation at build time |
| **SPA** | Single-page application support |
| **Library Packaging** | Package your code as a library |
| **Deployment** | Easy deployment with adapters |

---

## 🏗️ Project Setup

### Creating the Project

```bash
npx sv create belajar-svelte-kit
cd belajar-svelte-kit
npm install
npm run dev
```

### Project Structure

SvelteKit has a standard project structure, so every developer follows the same convention.

> Reference: [project-structure](https://svelte.dev/docs/kit/project-structure) · [project-types](https://svelte.dev/docs/kit/project-types) · [web-standards](https://svelte.dev/docs/kit/web-standards)

```
study-svelte-kit/
├── src/
│   ├── lib/               # Reusable components and utilities ($lib alias)
│   │   ├── components/
│   │   └── server/        # Server-only modules
│   ├── params/            # Parameter matchers
│   ├── routes/            # Filesystem-based routing
│   │   ├── +page.svelte
│   │   ├── +layout.svelte
│   │   └── ...
│   ├── hooks.server.js    # Server hooks
│   ├── hooks.client.js    # Client hooks
│   └── hooks.js           # Shared (universal) hooks
├── static/                # Static assets
├── .env                   # Environment variables
└── svelte.config.js
```

---

## 🗺️ Routing & Navigation

### Filesystem-Based Routing

SvelteKit uses a **filesystem-based router** — URL paths map directly to folders under `src/routes`. No manual mapping is needed; just place the Svelte file in the right folder.

| URL Path | File Location |
| --- | --- |
| `/` | `src/routes/+page.svelte` |
| `/about` | `src/routes/about/+page.svelte` |
| `/counter` | `src/routes/counter/+page.svelte` |

**`src/routes/counter/+page.svelte`**

```svelte
<script>
  let counter = $state(0);
  function increment() {
    counter++;
  }
</script>

<h1>Counter: {counter}</h1>
<button onclick={increment}>Increment</button>
```

### SSR First, CSR After

- When a URL is first opened in the browser, SvelteKit performs **SSR (Server-Side Rendering)**
- On subsequent page transitions, it switches to **CSR (Client-Side Rendering)**

### Navigating with Anchor Tags

SvelteKit uses standard `<a>` tags for navigation — there's no special `<Link>` component like in React or Vue.

**`src/routes/+page.svelte`**

```svelte
<h1>Welcome to SvelteKit</h1>

<ul>
  <li><a href="/counter">Counter</a></li>
</ul>
```

### Programmatic Navigation with goto

To navigate from code, use the `goto` function:

> Reference: [svelte.dev/docs/kit/$app-navigation#goto](https://svelte.dev/docs/kit/$app-navigation#goto)

```svelte
<script>
  import { goto } from "$app/navigation";

  let location = $state("");

  function go() {
    goto(location);
  }
</script>

<input type="text" bind:value={location} />
<button onclick={go}>Go</button>
```

---

## 📐 Layouts

Many pages share the same layout. Instead of duplicating code, SvelteKit provides a **Layout** system.

### Creating a Layout

Create `+layout.svelte` in the `routes` folder, and use `{@render children()}` to render the page content inside it.

**`src/routes/+layout.svelte`**

```svelte
<script>
  const { children } = $props();
</script>

<ul>
  <li><a href="/">Home</a></li>
  <li><a href="/counter">Counter</a></li>
</ul>

{@render children()}
```

### Nested Layouts

Layouts can be nested — a `+layout.svelte` in a subfolder creates a layout scoped to that route group.

**`src/routes/profile/+layout.svelte`**

```svelte
<script>
  const { children } = $props();
</script>

<ul>
  <li><a href="/profile/user">User</a></li>
  <li><a href="/profile/address">Address</a></li>
  <li><a href="/profile/wallet">Wallet</a></li>
</ul>

{@render children()}
```

---

## 📡 Load Data

Before a `+page.svelte` is displayed, you can fetch data for it using a **load function**.

### Page Data

Create a `+page.js` file alongside the page. The `load` function returns data the page reads via `$props()`.

**`src/routes/profile/user/+page.js`**

```javascript
export function load() {
  return {
    user: "dzarurizkyy",
    name: "Dzaru Rizky Fathan Fortuna",
    email: "test@gmail.com",
  };
}
```

**`src/routes/profile/user/+page.svelte`**

```svelte
<script>
  const { data } = $props();
</script>

<h1>User Page</h1>
<ul>
  <li>User: {data.user}</li>
  <li>Name: {data.name}</li>
  <li>Email: {data.email}</li>
</ul>
```

### Layout Data

A Layout can have its own load function in `+layout.js`, and every page under that layout can access its data.

> **Key Insight:** If a page and its layout return the same key, the page data overrides the layout data.

**`src/routes/profile/+layout.js`**

```javascript
export function load() {
  return {
    user: "dzarurizkyy",
  };
}
```

**`src/routes/profile/+layout.svelte`**

```svelte
<script>
  const { children, data } = $props();
</script>

<p>Hello {data.user}</p>
{@render children()}
```

### Load Parameters

The load function receives a parameter object with many useful attributes (`url`, `params`, `fetch`, `parent`, …).

> Reference: [svelte.dev/docs/kit/@sveltejs-kit#RequestEvent](https://svelte.dev/docs/kit/@sveltejs-kit#RequestEvent)

**`src/routes/+layout.js`**

```javascript
export function load({ url }) {
  return {
    pathname: url.pathname,
  };
}
```

### Page Information with $app/state

Instead of using load parameters for page info, you can use the `page` helper from `$app/state`:

> Reference: [svelte.dev/docs/kit/$app-state#page](https://svelte.dev/docs/kit/$app-state#page)

```svelte
<script>
  import { page } from "$app/state";
  const { children } = $props();
</script>

<p>{page.url.pathname}</p>

{@render children()}
```

---

## 🔖 Route Parameters

### Dynamic Segments

For dynamic URLs like `/products/123`, wrap the folder name in square brackets — `[param]` — and read it from `params` in the load function.

```
src/routes/products/[id]/+page.svelte
```

**`src/routes/products/[id]/+page.js`**

```javascript
export function load({ params }) {
  return {
    id: params.id,
  };
}
```

**`src/routes/products/[id]/+page.svelte`**

```svelte
<script>
  const { data } = $props();

  async function getProduct() {
    const response = await fetch(`/api/products/${data.id}.json`);
    return response.json();
  }
</script>

{#await getProduct()}
  <p>Loading product...</p>
{:then product}
  <h1>{product.id} - {product.name}</h1>
  <p>{product.description}</p>
  <p>{product.price}</p>
{:catch error}
  <p>Error: {error.message}</p>
{/await}
```

---

## 🔄 Invalidation & Cache

### How Load Caching Works

By default, SvelteKit **caches** load function results. When navigating between pages that share the same layout, the layout's load function isn't re-run unless something it depends on changes.

### invalidate & invalidateAll

To force load functions to re-run:

> Reference: [invalidate](https://svelte.dev/docs/kit/$app-navigation#invalidate) · [invalidateAll](https://svelte.dev/docs/kit/$app-navigation#invalidateAll)

| Function | Description |
| --- | --- |
| `invalidate(url)` | Re-runs all load functions that depend on the given URL |
| `invalidateAll()` | Re-runs all load functions on the current page |

```svelte
<script>
  import { onMount } from "svelte";
  import { invalidateAll } from "$app/navigation";

  onMount(() => {
    invalidateAll();
  });
</script>
```

---

## 🌐 Fetching & Parent Data

### SvelteKit's fetch

When fetching data inside a load function, SvelteKit provides its **own `fetch`** that works correctly in both SSR (server) and CSR (browser).

> **Key Insight:** Always use the `fetch` from the load function's parameter — don't call the global browser `fetch` directly inside load functions.

**`src/routes/products/[id]/+page.js`**

```javascript
export async function load({ params, fetch }) {
  const response = await fetch(`/api/products/${params.id}.json`);
  return response.json();
}
```

### Reading Parent Data

A child load function can read data from its parent load function (e.g. a layout's load data) through the `parent` attribute. `parent` returns a **Promise**, so it must be awaited.

**`src/routes/profile/wallet/+page.js`**

```javascript
export async function load({ parent }) {
  const parentData = await parent();
  return {
    user: parentData.user,
  };
}
```

---

## 🖥️ Server Load Data

### Universal vs. Server Load Files

SvelteKit can run load functions **exclusively on the server** — useful for accessing databases, secrets, or other server-only resources.

| File | Runs On |
| --- | --- |
| `+page.js` | Client & Server (SSR on first load) |
| `+page.server.js` | Server only |
| `+layout.js` | Client & Server |
| `+layout.server.js` | Server only |

### Combining Server & Client Load

If both `+page.server.js` and `+page.js` exist, the server load function runs first, and its result is passed as `data` into the client load function.

**`src/routes/todos/+page.server.js`**

```javascript
export async function load() {
  return {
    todos: ["From Server"],
  };
}
```

**`src/routes/todos/+page.js`**

```javascript
export async function load({ data }) {
  return {
    todos: ["From Client", ...data.todos],
  };
}
```

**`src/routes/todos/+page.svelte`**

```svelte
<script>
  const { data } = $props();
</script>

<ul>
  {#each data.todos as todo}
    <li>{todo}</li>
  {/each}
</ul>
```

---

## 🛣️ API Routes

### Creating an Endpoint

API endpoints live in `+server.js` files, exporting functions named after HTTP methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`, `HEAD`. API routes run on the **server only**.

> Reference: [svelte.dev/docs/kit/@sveltejs-kit#RequestEvent](https://svelte.dev/docs/kit/@sveltejs-kit#RequestEvent) · [MDN: Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)

**`src/routes/api/users/login/+server.js`**

```javascript
import { json } from "@sveltejs/kit";

export async function POST({ request, cookies }) {
  const body = await request.json();
  cookies.set("user", body.user, { path: "/" });
  return json({ user: body.user }, { status: 200 });
}
```

**`src/routes/api/users/current/+server.js`**

```javascript
import { json } from "@sveltejs/kit";

export async function GET({ cookies }) {
  if (cookies.get("user")) {
    return json({ user: cookies.get("user") }, { status: 200 });
  }
  return json({ user: null }, { status: 401 });
}

export async function DELETE({ cookies }) {
  cookies.delete("user", { path: "/" });
  return json({ user: null }, { status: 200 });
}
```

---

## ❌ Error Pages & Redirects

### Custom Error Page

When a load function throws, SvelteKit shows an error page. Customize it with a `+error.svelte` file — every sub-path under that route will use it.

**`src/routes/users/+error.svelte`**

```svelte
<script>
  import { page } from "$app/state";
</script>

<h1>Error: {page.status}</h1>
<p>Message: {page.error.message}</p>
```

**`src/routes/users/dashboard/+page.js`**

```javascript
export async function load({ fetch }) {
  const response = await fetch("/api/users/current");
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const body = await response.json();
  return { user: body.user };
}
```

### Redirecting

Use `redirect()` for server-side redirects and `goto()` for client-side ones.

> Reference: [svelte.dev/docs/kit/@sveltejs-kit#redirect](https://svelte.dev/docs/kit/@sveltejs-kit#redirect)

| Function | Environment |
| --- | --- |
| `redirect()` | Server only |
| `goto()` | Client only |

**`src/routes/profile/+layout.server.js`**

```javascript
import { redirect } from "@sveltejs/kit";

export function load({ cookies }) {
  const user = cookies.get("user");

  if (!user) {
    return redirect(303, "/users/login");
  }

  return { user };
}
```

---

## 📝 Form Actions

SvelteKit receives POST form submissions through **Form Actions** exported from `+page.server.js`.

> Reference: [svelte.dev/docs/kit/@sveltejs-kit#fail](https://svelte.dev/docs/kit/@sveltejs-kit#fail)

### Defining Actions

**`src/routes/todos/+page.server.js`**

```javascript
import { fail } from "@sveltejs/kit";

let lastId = 0;
let todos = [];

export async function load() {
  return { todos };
}

export const actions = {
  add: async ({ request }) => {
    const data = await request.formData();
    const todo = data.get("todo");

    if (todo.trim() === "") {
      return fail(400, { error: true, message: "Todo cannot be empty" });
    }

    todos.push({ id: lastId++, name: todo });
  },
  delete: async ({ request }) => {
    const data = await request.formData();
    const id = data.get("id");
    todos = todos.filter((item) => item.id !== Number(id));
  },
};
```

### Named Actions & Validation Errors

Use `action="?/methodName"` to target a specific action. Validation errors returned with `fail()` are available through the `form` prop.

**`src/routes/todos/+page.svelte`**

```svelte
<script>
  const { data, form } = $props();
</script>

<form method="POST" action="?/add">
  {#if form?.error}
    <label style="color: red">{form?.message}</label>
  {/if}
  <label>
    Todo: <input type="text" name="todo" />
  </label>
  <button type="submit">Add</button>
</form>

<ul>
  {#each data.todos as todo}
    <li>
      {todo.id} - {todo.name}
      <form action="?/delete" method="post" style="display: inline-block;">
        <input type="hidden" name="id" value={todo.id} />
        <button type="submit">Delete</button>
      </form>
    </li>
  {/each}
</ul>
```

---

## ⚙️ Page Options

### prerender, ssr & csr

Rendering behavior can be controlled per page or layout:

> Reference: [svelte.dev/docs/kit/page-options](https://svelte.dev/docs/kit/page-options) · [prerender](https://svelte.dev/docs/kit/page-options#prerender)

| Option | Description |
| --- | --- |
| `prerender` | Generate static HTML at build time |
| `ssr` | Enable/disable server-side rendering |
| `csr` | Enable/disable client-side rendering |

**`src/routes/counter/+page.js`**

```javascript
export const prerender = true;
```

After running `npm run build`, the prerendered HTML files appear in `.svelte-kit/output/prerendered/`.

---

## 🗃️ State Management on the Server

### Shared Server State

Svelte's `$state()` runs on the **client (browser)**. On the server, a module-level variable is **shared across all clients** — e.g. storing `todos` in a server-side variable means every browser session sees the same data.

> **Key Insight:** Use a per-request mechanism (cookies, sessions, or a database) for user-specific data on the server.

---

## 🔀 Advanced Routing

### Optional Parameters

Wrap a route parameter in double brackets — `[[param]]` — to make it optional.

```
src/routes/[[lang=lang]]/home/+page.svelte
```

> **Key Insight:** Watch out for conflicts with other routes — e.g. `[[lang]]/home` can conflict with `/home`.

### Rest Parameters

Use `[...param]` to capture an unlimited number of path segments.

```
src/routes/files/[...file]/+page.svelte
```

**`src/routes/files/[...file]/+page.js`**

```javascript
export function load({ params }) {
  return { file: params.file };
}
```

### Parameter Matchers

Restrict which values a route parameter accepts by creating a matcher in `src/params/`, then reference it in the folder name: `[lang=lang]`.

**`src/params/lang.js`**

```javascript
export function match(lang) {
  const value = lang || "id";
  return ["en", "id", "fn"].includes(value);
}
```

---

## 🧱 Advanced Layouts

### Route Groups

Use `(group)` folders to apply a layout to a specific set of routes without affecting the URL.

```
src/routes/
├── (default)/       # Default group with its own layout
│   ├── +layout.svelte
│   └── counter/
├── (guest)/         # Guest group with a different layout
│   ├── +layout.svelte
│   └── about/
```

### Breaking the Layout Hierarchy

Add `@` to a `+page.svelte` or `+layout.svelte` filename to skip specific parent layouts:

| File Name | Uses Layout From |
| --- | --- |
| `+page@b.svelte` | `b/+layout.svelte` |
| `+page@a.svelte` | `a/+layout.svelte` |
| `+page@(guest).svelte` | `(guest)/+layout.svelte` |
| `+page@.svelte` | `src/routes/+layout.svelte` (root) |

**`src/routes/(guest)/a/b/c/+page@(guest).svelte`**

```svelte
<h1>Hi Content</h1>
```

---

## 🪝 Hooks

### Hook Files

Hooks are functions that run when specific events occur in SvelteKit.

| File | Scope |
| --- | --- |
| `src/hooks.server.js` | Server only |
| `src/hooks.client.js` | Client only |
| `src/hooks.js` | Shared (Server & Client) |

### Server Hooks

`handle({ event, resolve })` runs on every request.

**`src/hooks.server.js`**

```javascript
export async function handle({ event, resolve }) {
  console.log(`Received request: ${event.url.href}`);
  return await resolve(event);
}
```

### Shared Hooks

`handleError()` and `init()` can be used in both server and client hooks.

**`src/hooks.client.js`**

```javascript
export function init() {
  console.log("Client initialized");
}

export async function handleError(params) {
  console.error("Client error:", params);
}
```

**`src/hooks.server.js`**

```javascript
export async function init() {
  console.log("Server initialized");
}
```

### Universal Hooks

`reroute()` in `src/hooks.js` runs before `handle()` and can rewrite URLs.

**`src/hooks.js`**

```javascript
export async function reroute({ url }) {
  if (url.pathname === "/home") {
    return "/en/home";
  }
}
```

---

## ⚠️ Errors

> Reference: [svelte.dev/docs/kit/@sveltejs-kit#error](https://svelte.dev/docs/kit/@sveltejs-kit#error)

### Expected vs. Unexpected Errors

| Type | Description |
| --- | --- |
| **Expected Error** | Intentionally thrown using `error()` |
| **Unexpected Error** | Unintentional — SvelteKit catches it and returns status 500 |

### Throwing an Expected Error

Use `error()` to throw a handled error and show the nearest `+error.svelte`:

**`src/routes/(default)/products/[id]/+page.js`**

```javascript
import { error } from "@sveltejs/kit";

export async function load({ params, fetch }) {
  const response = await fetch(`/api/products/${params.id}.json`);

  if (response.status !== 200) {
    error(404, { message: "Product Not Found" });
  }

  return response.json();
}
```

**`src/routes/(default)/products/[id]/+error.svelte`**

```svelte
<script>
  import { page } from "$app/state";
</script>

<h1>Error: {page.status}</h1>
<p>Message: {page.error.message}</p>
```

---

## 🔗 Link Options

### Preloading Data

By default, SvelteKit preloads data when you hover over a link to speed up navigation. Customize this with `data-sveltekit-*` attributes.

> Reference: [svelte.dev/docs/kit/link-options](https://svelte.dev/docs/kit/link-options)

```svelte
<ul data-sveltekit-preload-data="tap">
  <li><a href="/">Home</a></li>
  <li><a href="/counter">Counter</a></li>
</ul>
```

---

## 📁 The lib Folder

### The $lib Alias

Every file inside `src/lib` is accessible through the `$lib` alias — use it for reusable components and utilities.

**`src/routes/(default)/counter/+page.svelte`**

```svelte
<script>
  import Counter from "$lib/components/Counter.svelte";
</script>

<Counter />
```

---

## 🌿 Environment Variables

SvelteKit supports two kinds of environment variables: **static** (from `.env`, inlined at build time) and **dynamic** (read at runtime).

> Reference: [$env/static/private](https://svelte.dev/docs/kit/$env-static-private) · [$env/dynamic/private](https://svelte.dev/docs/kit/$env-dynamic-private)

### Static Environment

| Module | Use For |
| --- | --- |
| `$env/static/private` | Private variables (server only) |
| `$env/static/public` | Public variables (prefix: `PUBLIC_`) |

```javascript
import { DB_HOST, DB_PORT } from "$env/static/private";
import { PUBLIC_NAME } from "$env/static/public";
```

### Dynamic Environment

Set at runtime, before starting the app:

```bash
export HELLO=World
export PUBLIC_HELLO=World
```

```javascript
import { env } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public";

console.log(env.HELLO);
console.log(publicEnv.PUBLIC_HELLO);
```

---

## 🔒 Server-Only Modules

### Keeping Code on the Server

To guarantee a module only ever runs on the server, either:

- Name the file with `.server` (e.g. `database.server.js`)
- Place it inside `src/lib/server/`

**`src/lib/server/database.js`**

```javascript
import { DB_HOST, DB_PORT } from "$env/static/private";

export function connect() {
  console.log(`Connecting to database: ${DB_HOST}:${DB_PORT}`);
}
```

**`src/hooks.server.js`**

```javascript
import { connect } from "$lib/server/database";

export async function init() {
  connect();
}
```

---

## 🚀 Building & Deploying

### Building the App

```bash
npm run build
```

Vite compiles both server and client code. Prerendered pages are generated in `.svelte-kit/output/prerendered/`.

### Build Stage Check

Some code shouldn't run during the build (e.g. database connections). Guard it with the `building` flag:

> Reference: [svelte.dev/docs/kit/$app-environment#building](https://svelte.dev/docs/kit/$app-environment#building)

```javascript
import { building } from "$app/environment";
import { connect } from "$lib/server/database";

if (!building) {
  connect();
}
```

### Previewing the Build

```bash
npm run preview
```

> **Key Insight:** `npm run preview` is for local testing only — it isn't a production server.

### Node.js Adapter

After building, you need an **Adapter** to deploy. SvelteKit ships with `adapter-auto`, which tries to detect your environment; for a Node.js server, use `adapter-node`.

> Reference: [svelte.dev/docs/kit/adapters](https://svelte.dev/docs/kit/adapters) · [adapter-node](https://svelte.dev/docs/kit/adapter-node)

```bash
npm i -D @sveltejs/adapter-node
```

**`svelte.config.js`**

```javascript
import adapter from "@sveltejs/adapter-node";

const config = {
  kit: {
    adapter: adapter(),
  },
};

export default config;
```

### Running the Production Server

```bash
npm run build
HOST=127.0.0.1 PORT=4000 ORIGIN=http://localhost:4000 node --env-file=.env build
```

### Single Page Application

SvelteKit can also be configured as a pure **SPA (Single Page Application)** — but only if the project uses no server-side code.

> Reference: [svelte.dev/docs/kit/single-page-apps](https://svelte.dev/docs/kit/single-page-apps)

---

## 🎯 Quick Reference

| Concept | Purpose | Key Syntax |
| --- | --- | --- |
| **Page** | A route's UI | `src/routes/<path>/+page.svelte` |
| **Layout** | Shared UI around child pages | `+layout.svelte` + `{@render children()}` |
| **Universal Load** | Load data on server & client | `+page.js` / `+layout.js` → `export function load()` |
| **Server Load** | Load data on the server only | `+page.server.js` / `+layout.server.js` |
| **Route Parameter** | Dynamic URL segment | `[id]`, `[[optional]]`, `[...rest]`, `[x=matcher]` |
| **Route Group** | Group routes without changing URLs | `(group)/` |
| **goto** | Client-side navigation | `goto("/path")` |
| **invalidate** | Re-run load functions | `invalidate(url)`, `invalidateAll()` |
| **API Route** | HTTP endpoint | `+server.js` → `export function GET()` |
| **Form Action** | Handle form POSTs | `export const actions = { add }`, `action="?/add"` |
| **error / redirect / fail** | Control flow from load & actions | `error(404, {...})`, `redirect(303, "/")`, `fail(400, {...})` |
| **Error Page** | Custom error UI | `+error.svelte` + `page.error` |
| **Page Options** | Control rendering | `export const prerender = true` |
| **Hooks** | Run code on requests/errors/init | `handle`, `handleError`, `init`, `reroute` |
| **Env Variables** | Config & secrets | `$env/static/*`, `$env/dynamic/*` |
| **Adapter** | Deploy target | `adapter-node`, `adapter-auto` |

---

## 💡 Best Practices

**✅ Do This**

- **Use the `fetch` passed into load functions** instead of the global `fetch`, so requests work in both SSR and CSR
- **Put secrets and database access in server-only code** — `+page.server.js`, `+layout.server.js`, `.server.js` files, or `src/lib/server/`
- **Store user-specific data per request** (cookies, sessions, database) rather than in module-level server variables
- **Add `+error.svelte`** at the route level where you want a custom error page, and throw expected errors with `error()`
- **Return validation errors with `fail()`** from form actions and read them via the `form` prop
- **Guard build-time side effects** (like database connections) with the `building` flag
- **Use route groups `(group)`** to give sets of pages different layouts without changing their URLs

**❌ Avoid This**

- **Keeping shared mutable state on the server** — every user would see the same data
- **Importing `$env/static/private` or `$env/dynamic/private` into client code** — private variables are for the server only
- **Expecting a layout's load function to re-run on every navigation** — results are cached; call `invalidate()` / `invalidateAll()` when you need fresh data
- **Creating optional-parameter routes (`[[param]]`) that collide** with existing routes like `/home`
- **Using `npm run preview` as a production server** — deploy with an adapter instead
- **Calling `goto()` on the server or `redirect()` on the client** — each only works in its own environment

> Reference: [svelte.dev/docs/kit/introduction](https://svelte.dev/docs/kit/introduction) · [github.com/sveltejs/kit](https://github.com/sveltejs/kit) · [svelte.dev](https://svelte.dev/) · [vite.dev](https://vite.dev/)
