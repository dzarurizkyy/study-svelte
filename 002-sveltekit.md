# ⚡ SvelteKit – Complete Guide
A comprehensive guide for learning SvelteKit, a production-ready framework for building Svelte web applications.

---

## 📋 Table of Contents

- [Introduction to SvelteKit](#-introduction-to-sveltekit)
- [SvelteKit Features](#-sveltekit-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Routing](#-routing)
- [Navigation](#-navigation)
- [Layout](#-layout)
- [Load Data](#-load-data)
- [Route Parameters](#-route-parameters)
- [Invalidating & Cache](#-invalidating--cache)
- [Fetch Request](#-fetch-request)
- [Parent Data](#-parent-data)
- [Server Load Data](#-server-load-data)
- [API Routes](#-api-routes)
- [Error Pages](#-error-pages)
- [Redirect](#-redirect)
- [Form Actions](#-form-actions)
- [Page Options](#-page-options)
- [State Management](#-state-management)
- [Advanced Routing](#-advanced-routing)
- [Advanced Layout](#-advanced-layout)
- [Hooks](#-hooks)
- [Errors](#-errors)
- [Link Options](#-link-options)
- [Lib](#-lib)
- [Environment Variables](#-environment-variables)
- [Server Only Modules](#-server-only-modules)
- [Building the App](#-building-the-app)
- [Adapters](#-adapters)
- [Single Page Application](#-single-page-application)
- [References](#-references)

---

## 🔥 Introduction to SvelteKit

Previously we learned about **Svelte**, a framework for building components. However, when building a real web application, creating components alone is not enough — there are many other concerns to address.

**SvelteKit** is a framework built on top of Svelte that makes your application **production-ready**.

---

## 🧩 SvelteKit Features

SvelteKit solves many common web development problems, including:

| Feature | Description |
|---------|-------------|
| **Routing** | Filesystem-based routing |
| **SSR** | Server-side rendering |
| **Data Fetching** | Built-in load functions |
| **Prerender** | Static HTML generation at build time |
| **SPA** | Single-page application support |
| **Library Packaging** | Package your code as a library |
| **Deployment** | Easy deployment with adapters |

---

## 🗂️ Project Structure

SvelteKit has a standard project structure so every developer follows the same convention.

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

- Reference: [https://svelte.dev/docs/kit/project-structure](https://svelte.dev/docs/kit/project-structure)
- Reference: [https://svelte.dev/docs/kit/project-types](https://svelte.dev/docs/kit/project-types)
- Reference: [https://svelte.dev/docs/kit/web-standards](https://svelte.dev/docs/kit/web-standards)

---

## 📦 Getting Started

- #### Create a New Project

  ```bash
  npx sv create belajar-svelte-kit
  cd belajar-svelte-kit
  npm install
  npm run dev
  ```

---

## 🗺️ Routing

SvelteKit uses a **filesystem-based router**. URL paths are mapped directly to the file system.

| URL Path | File Location |
|----------|---------------|
| `/` | `src/routes/+page.svelte` |
| `/about` | `src/routes/about/+page.svelte` |
| `/counter` | `src/routes/counter/+page.svelte` |

No manual mapping is needed — just place your Svelte file in the correct folder.

- #### Example: Counter Page

  ```svelte
  <!-- src/routes/counter/+page.svelte -->
  <script>
    let counter = $state(0);
    function increment() {
      counter++;
    }
  </script>

  <h1>Counter: {counter}</h1>
  <button onclick={increment}>Increment</button>
  ```

---

## 🔗 Navigation

- When a URL is first accessed via the browser, SvelteKit performs **SSR (Server-Side Rendering)**.
- On subsequent page transitions, it switches to **CSR (Client-Side Rendering)**.
- SvelteKit uses standard `<a>` tags for navigation — no special `<Link>` component like in React or Vue.

```svelte
<!-- src/routes/+page.svelte -->
<h1>Welcome to SvelteKit</h1>

<ul>
  <li><a href="/counter">Counter</a></li>
</ul>
```

For **programmatic navigation**, use the `goto` function:

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

- Reference: [https://svelte.dev/docs/kit/$app-navigation#goto](https://svelte.dev/docs/kit/$app-navigation#goto)

---

## 📐 Layout

When building web pages, many pages share the same layout. Instead of duplicating code, SvelteKit provides a **Layout** system.

- #### Creating a Layout

  Create `+layout.svelte` in the `routes` folder. Use `{@render children()}` to render the page content inside the layout.

  ```svelte
  <!-- src/routes/+layout.svelte -->
  <script>
    const { children } = $props();
  </script>

  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/counter">Counter</a></li>
  </ul>

  {@render children()}
  ```

- #### Nested Layout

  Layouts can be nested. Create a `+layout.svelte` in a subfolder to create a layout scoped to that route group.

  ```svelte
  <!-- src/routes/profile/+layout.svelte -->
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

Before a `+page.svelte` is displayed, you can fetch data using a **load function**.

- #### Page Data (`+page.js`)

  Create a `+page.js` file alongside the page. The `load` function returns data that the page can access via `$props()`.

  ```javascript
  // src/routes/profile/user/+page.js
  export function load() {
    return {
      user: "dzarurizkyy",
      name: "Dzaru Rizky Fathan Fortuna",
      email: "test@gmail.com",
    };
  }
  ```

  ```svelte
  <!-- src/routes/profile/user/+page.svelte -->
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

- #### Layout Data (`+layout.js`)

  You can also add load data to a Layout. All pages under that layout will have access to the layout's data. Note: if a page and layout share the same key, the page data will override the layout data.

  ```javascript
  // src/routes/profile/+layout.js
  export function load() {
    return {
      user: "dzarurizkyy",
    };
  }
  ```

  ```svelte
  <!-- src/routes/profile/+layout.svelte -->
  <script>
    const { children, data } = $props();
  </script>

  <p>Hello {data.user}</p>
  {@render children()}
  ```

- #### Load Parameters

  The load function receives a parameter object with many useful attributes.

  ```javascript
  // src/routes/+layout.js
  export function load({ url }) {
    return {
      pathname: url.pathname,
    };
  }
  ```

  - Reference: [https://svelte.dev/docs/kit/@sveltejs-kit#RequestEvent](https://svelte.dev/docs/kit/@sveltejs-kit#RequestEvent)

- #### Page Information (`$app/state`)

  Instead of using load parameters for page info, you can use the `page` helper from `$app/state`:

  ```svelte
  <script>
    import { page } from "$app/state";
    const { children } = $props();
  </script>

  <p>{page.url.pathname}</p>

  {@render children()}
  ```

  - Reference: [https://svelte.dev/docs/kit/$app-state#page](https://svelte.dev/docs/kit/$app-state#page)

---

## 🔖 Route Parameters

For dynamic URLs like `/products/123`, use **Route Parameters** by wrapping the folder name in square brackets: `[param]`.

- #### Example: Product Detail Page

  ```
  src/routes/products/[id]/+page.svelte
  ```

  ```javascript
  // src/routes/products/[id]/+page.js
  export function load({ params }) {
    return {
      id: params.id,
    };
  }
  ```

  ```svelte
  <!-- src/routes/products/[id]/+page.svelte -->
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

## 🔄 Invalidating & Cache

By default, SvelteKit **caches** load function results. When navigating between pages that share the same layout, the layout's load function won't be re-called unless something changes.

To force a re-run of load functions, use:

| Function | Description |
|----------|-------------|
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

- Reference: [https://svelte.dev/docs/kit/$app-navigation#invalidate](https://svelte.dev/docs/kit/$app-navigation#invalidate)
- Reference: [https://svelte.dev/docs/kit/$app-navigation#invalidateAll](https://svelte.dev/docs/kit/$app-navigation#invalidateAll)

---

## 🌐 Fetch Request

When fetching data inside a load function, SvelteKit provides its **own `fetch` function** that works correctly in both SSR (server) and CSR (browser) environments.

```javascript
// src/routes/products/[id]/+page.js
export async function load({ params, fetch }) {
  const response = await fetch(`/api/products/${params.id}.json`);
  return response.json();
}
```

> ⚠️ Always use the `fetch` from the load function parameter — do not use the global browser `fetch` directly in load functions.

---

## 🧬 Parent Data

You can access data from a parent load function (e.g., a layout's load data) inside a child load function using the `parent` attribute.

```javascript
// src/routes/profile/wallet/+page.js
export async function load({ parent }) {
  const parentData = await parent();
  return {
    user: parentData.user,
  };
}
```

> `parent` returns a **Promise**, so it must be awaited.

---

## 🖥️ Server Load Data

SvelteKit supports running load functions **exclusively on the server**. This is useful for accessing databases, secrets, or server-only resources.

| File | Runs On |
|------|---------|
| `+page.js` | Client & Server (SSR on first load) |
| `+page.server.js` | Server only |
| `+layout.js` | Client & Server |
| `+layout.server.js` | Server only |

If both `+page.server.js` and `+page.js` exist, the server load function runs first. Its result is available as `data` in the client load function.

```javascript
// src/routes/todos/+page.server.js
export async function load() {
  return {
    todos: ["From Server"],
  };
}
```

```javascript
// src/routes/todos/+page.js
export async function load({ data }) {
  return {
    todos: ["From Client", ...data.todos],
  };
}
```

```svelte
<!-- src/routes/todos/+page.svelte -->
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

SvelteKit allows you to create **API endpoints** using `+server.js` files. Define functions named after HTTP methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`, `HEAD`.

> API routes run on the **server only**.

```javascript
// src/routes/api/users/login/+server.js
import { json } from "@sveltejs/kit";

export async function POST({ request, cookies }) {
  const body = await request.json();
  cookies.set("user", body.user, { path: "/" });
  return json({ user: body.user }, { status: 200 });
}
```

```javascript
// src/routes/api/users/current/+server.js
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

- Reference: [https://svelte.dev/docs/kit/@sveltejs-kit#RequestEvent](https://svelte.dev/docs/kit/@sveltejs-kit#RequestEvent)
- Reference: [https://developer.mozilla.org/en-US/docs/Web/API/Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)

---

## ❌ Error Pages

When an error occurs during a load function, SvelteKit displays an error page. You can customize this by creating a `+error.svelte` file.

When you add `+error.svelte` to a route, all sub-paths under that route will use that error page.

```svelte
<!-- src/routes/users/+error.svelte -->
<script>
  import { page } from "$app/state";
</script>

<h1>Error: {page.status}</h1>
<p>Message: {page.error.message}</p>
```

```javascript
// src/routes/users/dashboard/+page.js
export async function load({ fetch }) {
  const response = await fetch("/api/users/current");
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const body = await response.json();
  return { user: body.user };
}
```

---

## ↩️ Redirect

Use the `redirect()` function for server-side redirects, and `goto()` for client-side redirects.

```javascript
// src/routes/profile/+layout.server.js
import { redirect } from "@sveltejs/kit";

export function load({ cookies }) {
  const user = cookies.get("user");

  if (!user) {
    return redirect(303, "/users/login");
  }

  return { user };
}
```

| Function | Environment |
|----------|-------------|
| `redirect()` | Server only |
| `goto()` | Client only |

- Reference: [https://svelte.dev/docs/kit/@sveltejs-kit#redirect](https://svelte.dev/docs/kit/@sveltejs-kit#redirect)

---

## 📝 Form Actions

SvelteKit supports receiving POST form submissions via **Form Actions** in `+page.server.js`.

- #### Default Action

  ```javascript
  // src/routes/todos/+page.server.js
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

- #### Named Actions & Validation Error

  Use `action="?/methodName"` to target specific actions. Use `fail()` to return validation errors accessible via the `form` prop.

  ```svelte
  <!-- src/routes/todos/+page.svelte -->
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

- Reference: [https://svelte.dev/docs/kit/@sveltejs-kit#fail](https://svelte.dev/docs/kit/@sveltejs-kit#fail)

---

## ⚙️ Page Options

SvelteKit allows you to control rendering behavior per page or layout.

| Option | Description |
|--------|-------------|
| `prerender` | Generate static HTML at build time |
| `ssr` | Enable/disable server-side rendering |
| `csr` | Enable/disable client-side rendering |

- #### Prerender

  ```javascript
  // src/routes/counter/+page.js
  export const prerender = true;
  ```

  After running `npm run build`, prerendered HTML files appear in `.svelte-kit/output/prerendered/`.

- Reference: [https://svelte.dev/docs/kit/page-options](https://svelte.dev/docs/kit/page-options)
- Reference: [https://svelte.dev/docs/kit/page-options#prerender](https://svelte.dev/docs/kit/page-options#prerender)

---

## 🗃️ State Management

Svelte's `$state()` runs on the **client (browser)**. Be careful with **shared state on the server** — it is shared across all clients.

For example, storing `todos` in a server-side variable means all browser sessions will see the same data.

> ✅ Always use a per-request mechanism (like cookies, sessions, or a database) for user-specific data on the server.

---

## 🔀 Advanced Routing

- #### Optional Parameters

  Wrap a route parameter in double brackets `[[param]]` to make it optional.

  ```
  src/routes/[[lang=lang]]/home/+page.svelte
  ```

  > ⚠️ Be careful of conflicts with other routes, e.g. `[[lang]]/home` may conflict with `/home`.

- #### Rest Parameters

  Use `[...param]` to capture unlimited path segments.

  ```
  src/routes/files/[...file]/+page.svelte
  ```

  ```javascript
  // src/routes/files/[...file]/+page.js
  export function load({ params }) {
    return { file: params.file };
  }
  ```

- #### Parameter Matchers

  Restrict what values a route parameter can accept by creating a matcher in `src/params/`.

  ```javascript
  // src/params/lang.js
  export function match(lang) {
    const value = lang || "id";
    return ["en", "id", "fn"].includes(value);
  }
  ```

  Then reference it in your folder name: `[lang=lang]`.

---

## 🏗️ Advanced Layout

- #### Route Groups

  Use `(group)` folders to apply layouts to specific route groups without affecting the URL.

  ```
  src/routes/
  ├── (default)/       # Default group with its own layout
  │   ├── +layout.svelte
  │   └── counter/
  ├── (guest)/         # Guest group with a different layout
  │   ├── +layout.svelte
  │   └── about/
  ```

- #### Breaking Layout Hierarchy

  Use `@` syntax on `+page.svelte` or `+layout.svelte` to skip specific parent layouts:

  | File Name | Uses Layout From |
  |-----------|-----------------|
  | `+page@b.svelte` | `b/+layout.svelte` |
  | `+page@a.svelte` | `a/+layout.svelte` |
  | `+page@(guest).svelte` | `(guest)/+layout.svelte` |
  | `+page@.svelte` | `src/routes/+layout.svelte` (root) |

  ```svelte
  <!-- src/routes/(guest)/a/b/c/+page@(guest).svelte -->
  <h1>Hi Content</h1>
  ```

---

## 🪝 Hooks

Hooks are functions that run when specific events occur in SvelteKit.

| File | Scope |
|------|-------|
| `src/hooks.server.js` | Server only |
| `src/hooks.client.js` | Client only |
| `src/hooks.js` | Shared (Server & Client) |

- #### Server Hooks

  `handle({ event, resolve })` runs on every request.

  ```javascript
  // src/hooks.server.js
  export async function handle({ event, resolve }) {
    console.log(`Received request: ${event.url.href}`);
    return await resolve(event);
  }
  ```

- #### Shared Hooks

  `handleError()` and `init()` can be used in both server and client hooks.

  ```javascript
  // src/hooks.client.js
  export function init() {
    console.log("Client initialized");
  }

  export async function handleError(params) {
    console.error("Client error:", params);
  }
  ```

  ```javascript
  // src/hooks.server.js
  export async function init() {
    console.log("Server initialized");
  }
  ```

- #### Universal Hooks

  `reroute()` in `src/hooks.js` runs before `handle()` and can redirect URLs.

  ```javascript
  // src/hooks.js
  export async function reroute({ url }) {
    if (url.pathname === "/home") {
      return "/en/home";
    }
  }
  ```

---

## ⚠️ Errors

SvelteKit divides errors into two categories:

| Type | Description |
|------|-------------|
| **Expected Error** | Intentionally thrown using `error()` |
| **Unexpected Error** | Unintentional — SvelteKit catches it and returns status 500 |

- #### Expected Error

  Use `error()` to throw a handled error and show the nearest `+error.svelte`:

  ```javascript
  // src/routes/(default)/products/[id]/+page.js
  import { error } from "@sveltejs/kit";

  export async function load({ params, fetch }) {
    const response = await fetch(`/api/products/${params.id}.json`);

    if (response.status !== 200) {
      error(404, { message: "Product Not Found" });
    }

    return response.json();
  }
  ```

  ```svelte
  <!-- src/routes/(default)/products/[id]/+error.svelte -->
  <script>
    import { page } from "$app/state";
  </script>

  <h1>Error: {page.status}</h1>
  <p>Message: {page.error.message}</p>
  ```

- Reference: [https://svelte.dev/docs/kit/@sveltejs-kit#error](https://svelte.dev/docs/kit/@sveltejs-kit#error)

---

## 🔗 Link Options

By default, SvelteKit preloads data when hovering over a link to speed up navigation. You can customize this behavior with `data-sveltekit-*` attributes.

```svelte
<ul data-sveltekit-preload-data="tap">
  <li><a href="/">Home</a></li>
  <li><a href="/counter">Counter</a></li>
</ul>
```

- Reference: [https://svelte.dev/docs/kit/link-options](https://svelte.dev/docs/kit/link-options)

---

## 📁 Lib

All files inside `src/lib` are automatically accessible via the `$lib` alias. Use this folder for reusable components and utilities.

```svelte
<!-- src/routes/(default)/counter/+page.svelte -->
<script>
  import Counter from "$lib/components/Counter.svelte";
</script>

<Counter />
```

---

## 🌿 Environment Variables

SvelteKit supports two types of environment variables: **static** (from `.env`) and **dynamic** (set at runtime).

- #### Static Environment

  | Module | Use For |
  |--------|---------|
  | `$env/static/private` | Private variables (server only) |
  | `$env/static/public` | Public variables (prefix: `PUBLIC_`) |

  ```javascript
  import { DB_HOST, DB_PORT } from "$env/static/private";
  import { PUBLIC_NAME } from "$env/static/public";
  ```

- #### Dynamic Environment

  Set at runtime before starting the app:

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

- Reference: [https://svelte.dev/docs/kit/$env-static-private](https://svelte.dev/docs/kit/$env-static-private)
- Reference: [https://svelte.dev/docs/kit/$env-dynamic-private](https://svelte.dev/docs/kit/$env-dynamic-private)

---

## 🔒 Server Only Modules

To ensure certain code only runs on the server, either:

- Name the file with `.server` (e.g. `database.server.js`)
- Place it inside `src/lib/server/`

```javascript
// src/lib/server/database.js
import { DB_HOST, DB_PORT } from "$env/static/private";

export function connect() {
  console.log(`Connecting to database: ${DB_HOST}:${DB_PORT}`);
}
```

```javascript
// src/hooks.server.js
import { connect } from "$lib/server/database";

export async function init() {
  connect();
}
```

---

## 🏗️ Building the App

- #### Build

  ```bash
  npm run build
  ```

  Vite compiles both server and client code. Prerendered pages are generated in `.svelte-kit/output/prerendered/`.

- #### Build Stage Check

  Some code should not run during the build phase (e.g. database connections). Use the `building` flag to guard against this:

  ```javascript
  import { building } from "$app/environment";
  import { connect } from "$lib/server/database";

  if (!building) {
    connect();
  }
  ```

- #### Preview

  After building, preview the production output locally:

  ```bash
  npm run preview
  ```

  > `npm run preview` is for local testing only — it is not a production server.

- Reference: [https://svelte.dev/docs/kit/$app-environment#building](https://svelte.dev/docs/kit/$app-environment#building)

---

## 🚀 Adapters

After building, you need an **Adapter** to deploy the app. SvelteKit ships with `adapter-auto`, which tries to detect your environment. For a Node.js server, use `adapter-node`.

- #### Node.js Adapter

  ```bash
  npm i -D @sveltejs/adapter-node
  ```

  ```javascript
  // svelte.config.js
  import adapter from "@sveltejs/adapter-node";

  const config = {
    kit: {
      adapter: adapter(),
    },
  };

  export default config;
  ```

- #### Running the Production Server

  ```bash
  npm run build
  HOST=127.0.0.1 PORT=4000 ORIGIN=http://localhost:4000 node --env-file=.env build
  ```

- Reference: [https://svelte.dev/docs/kit/adapters](https://svelte.dev/docs/kit/adapters)
- Reference: [https://svelte.dev/docs/kit/adapter-node](https://svelte.dev/docs/kit/adapter-node)

---

## 📄 Single Page Application

SvelteKit can be configured as a pure **SPA (Single Page Application)**. However, this requires that no server-side code is used in the project.

- Reference: [https://svelte.dev/docs/kit/single-page-apps](https://svelte.dev/docs/kit/single-page-apps)

---

## 📚 References

- SvelteKit Official Docs: [https://svelte.dev/docs/kit/introduction](https://svelte.dev/docs/kit/introduction)
- SvelteKit GitHub: [https://github.com/sveltejs/kit](https://github.com/sveltejs/kit)
- Svelte: [https://svelte.dev/](https://svelte.dev/)
- Vite: [https://vite.dev/](https://vite.dev/)
