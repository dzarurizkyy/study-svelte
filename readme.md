# Study Svelte ⚡

This repository contains a comprehensive reference guide for Svelte — covering the fundamentals (template syntax, runes, component communication, control flow, transitions, context), the SvelteKit framework (filesystem routing, layouts, load functions, API routes, form actions, hooks, deployment), and a complete Contact Management app built end-to-end against an existing REST API.

## List of Material 📚

- ⚡ **[Svelte Basics](001-svelte-basics.md)**

  Template syntax, runes, props, control flow, binding, styling, transitions, snippets, and context, built hands-on inside a Vite playground — from a first component to `$state`, `$derived`, and `$effect`:

  ```svelte
  <script>
    let count = $state(0);

    function increment() {
      count++;
    }
  </script>

  <h1>Counter {count}</h1>
  <button onclick={increment}>Increment</button>
  ```

- 🧭 **[SvelteKit Basics](002-svelte-kit.md)**

  The production-ready framework on top of Svelte — filesystem routing, layouts, load functions, server load, API routes, form actions, hooks, environment variables, and adapters:

  ```javascript
  // src/routes/products/[id]/+page.js
  export async function load({ params, fetch }) {
    const response = await fetch(`/api/products/${params.id}.json`);
    return response.json();
  }
  ```

- 🚀 **[SvelteKit Study Case — Contact Management](003-sveltekit-study-case.md)**

  A full client-rendered app built stage by stage across three modules — User → Contact → Address — consuming an existing Node.js/Express/Prisma REST API, plus a review of the bugs still present in the finished code:

  ```javascript
  export const contactList = async (token, { name, email, phone, page }) => {
    const url = new URL(`${import.meta.env.VITE_URL_API}/contacts`);

    if (name) url.searchParams.append("name", name);
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

## 📍 References

- [Svelte Docs](https://svelte.dev/docs/svelte/overview)
- [SvelteKit Docs](https://svelte.dev/docs/kit/introduction)

## 👨‍💻 Contributors

- [Dzaru Rizky Fathan Fortuna](https://www.linkedin.com/in/dzarurizky)
