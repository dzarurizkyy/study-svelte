# ⚡ Svelte Basic – Complete Guide
A comprehensive guide for learning Svelte, a modern Frontend Framework for building web applications.

---

## 📋 Table of Contents

- [What is Svelte](#-what-is-svelte)
- [Why Use a Framework](#-why-use-a-framework)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Hello Svelte](#-hello-svelte)
- [Template Syntax](#-template-syntax)
- [Runes & Reactivity](#-runes--reactivity)
- [Component Communication](#-component-communication)
- [Control Flow](#-control-flow)
- [Binding](#-binding)
- [Styling](#-styling)
- [Actions](#-actions)
- [Transitions](#-transitions)
- [Reactive Classes & Built-ins](#-reactive-classes--built-ins)
- [Store (Legacy)](#-store-legacy)
- [Snippets & Render](#-snippets--render)
- [Context](#-context)
- [Lifecycle Hooks](#-lifecycle-hooks)
- [Special Elements](#-special-elements)
- [References](#-references)

---

## 🔥 What is Svelte

Svelte is a modern Frontend Framework for building web applications. Unlike React or Vue, Svelte shifts work to compile time — it compiles your components to vanilla JavaScript, resulting in highly optimized output with no virtual DOM overhead.

- Official website: [https://svelte.dev/](https://svelte.dev/)
- GitHub: [https://github.com/sveltejs/svelte](https://github.com/sveltejs/svelte)

- #### Ecosystem

  Svelte develops its own ecosystem, unlike React where much of the ecosystem is built by third parties. Svelte's own meta-framework is **SvelteKit**.

  | Aspect | Detail |
  |--------|--------|
  | **Advantage** | Better integration between parts, maintained by the same team |
  | **Disadvantage** | Ecosystem is smaller compared to React |

---

## 🧩 Why Use a Framework

Using a frontend framework provides **standardization** when building projects, especially in a team environment. Without a framework, every developer writes code in their own style, making collaboration and maintenance harder.

---

## 📦 Getting Started

- #### Prerequisites

  | Requirement | Version |
  |-------------|---------|
  | Node.js | v18+ |
  | npm or yarn | — |

- #### Create a New Project

  Svelte projects can be created in two ways:

  | Method | Description |
  |--------|-------------|
  | **Vite** | Lightweight setup, covered in this guide |
  | **SvelteKit** | Full-featured meta-framework (covered separately) |

  > SvelteKit itself uses Vite under the hood, so learning Vite first is a solid foundation.

  To scaffold a new project using Vite:

  ```bash
  npm create vite@latest svelte-basic -- --template svelte
  cd svelte-basic
  npm install
  ```

- #### Running the App

  ```bash
  npm run dev
  ```

- #### Adding Multiple Entry Points

  To add multiple HTML pages (e.g. `hello.html`, `counter.html`), register them in `vite.config.js`:

  ```javascript
  // vite.config.js
  import { defineConfig } from "vite";
  import { svelte } from "@sveltejs/vite-plugin-svelte";

  export default defineConfig({
    plugins: [svelte()],
    build: {
      rollupOptions: {
        input: {
          index: "index.html",
          hello: "hello.html",
        },
      },
    },
  });
  ```

---

## 🗂️ Project Structure

```
svelte-basic/
├── public/                    # Static assets (e.g. article.json, blog.json)
├── src/
│   ├── lib/                   # Reusable components (.svelte)
│   │   ├── HelloSvelte.svelte
│   │   ├── Counter.svelte
│   │   └── ...
│   ├── state/                 # Universal/global state files (.svelte.js)
│   │   └── counter.svelte.js
│   ├── hello.js               # Entry point for hello.html
│   ├── counter.js             # Entry point for counter.html
│   └── ...
├── hello.html
├── counter.html
├── vite.config.js
└── package.json
```

---

## 👋 Hello Svelte

- #### Creating a Component

  In Svelte, each component lives in its own `.svelte` file. A component is divided into three sections: **Script**, **Style**, and **HTML**.

  ```svelte
  <!-- src/lib/HelloSvelte.svelte -->
  <script>
    console.log("Hello Svelte");
  </script>

  <style>
    h1 {
      color: red;
    }
  </style>

  <h1>Hello Svelte</h1>
  ```

- #### Mounting a Component

  Use the `mount()` function from Svelte to attach a component to the DOM:

  ```javascript
  // src/hello.js
  import { mount } from "svelte";
  import HelloSvelte from "./lib/HelloSvelte.svelte";

  const app = mount(HelloSvelte, {
    target: document.getElementById("app"),
  });

  export default app;
  ```

---

## 📝 Template Syntax

- #### Text Expression

  Use curly braces `{}` to embed JavaScript expressions directly into the HTML template:

  ```svelte
  <script>
    const name = "Svelte";
  </script>

  <h1>Hello {name.toUpperCase()}</h1>
  ```

- #### Dynamic Attribute

  Text expressions can also be used as HTML attribute values. If the variable name matches the attribute name, you can use a shorthand:

  ```svelte
  <script>
    const src = "https://picsum.photos/id/1/200/300";
  </script>

  <!-- Shorthand: {src} instead of src={src} -->
  <img {src} alt="Example" />
  ```

- #### Raw HTML

  To render raw HTML strings, use `{@html}`:

  ```svelte
  <script>
    const content = "<p>Hello World!</p>";
  </script>

  {@html content}
  ```

- #### Nested Components

  Import and use other components as if they were HTML tags:

  ```svelte
  <script>
    import Logo from "./Logo.svelte";
  </script>

  <Logo />
  <Logo />
  ```

---

## ⚙️ Runes & Reactivity

Runes are special symbols in Svelte (prefixed with `$`) used to control the Svelte compiler's behavior. They look like functions (e.g. `$state("hello")`).

- #### `$state` — Reactive State

  Creates a reactive variable. When its value changes, the UI automatically updates.

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

- #### `$state` with Objects & Arrays (Deep State)

  When `$state` wraps an object or array, Svelte wraps it in a JavaScript [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to detect nested changes automatically:

  ```svelte
  <script>
    let person = $state({ firstName: "", lastName: "" });
  </script>
  ```

  > ⚠️ `$state` does not support `Set` or `Map` directly — use Svelte's reactive built-ins for those.

- #### `$state.raw` — Non-Deep Reactive State

  Use `$state.raw` when you want only the variable reference to be reactive, not its internal properties:

  ```svelte
  <script>
    let person = $state.raw({ firstName: "", lastName: "" });

    function update() {
      // Must replace the whole object to trigger reactivity
      person = { firstName: "John", lastName: "Doe" };
    }
  </script>
  ```

- #### `$derived` — Derived State

  Creates a state value computed from another reactive state. Automatically recalculates when dependencies change:

  ```svelte
  <script>
    let count = $state([]);
    let total = $derived(count.reduce((a, b) => a + b, 0));
  </script>
  ```

- #### `$derived.by` — Derived with Function

  Use `$derived.by()` when the computation is too complex for a single expression:

  ```svelte
  <script>
    let count = $state([]);
    let total = $derived.by(() => {
      let sum = 0;
      for (let i = 0; i < count.length; i++) {
        sum += count[i];
      }
      return sum;
    });

    function increment() {
      count.push(1);
    }
  </script>

  <h1>{count.join(" + ")} = {total}</h1>
  <button onclick={increment}>Increment</button>
  ```

- #### `$inspect` — Debug State Changes

  Used to log state changes during development. Automatically disabled in production builds:

  ```svelte
  <script>
    let count = $state([]);

    $inspect(count).with((type, values) => {
      console.log(type, values);
    });
  </script>
  ```

  > ✅ Safe to leave in your codebase — `$inspect` only runs in development mode.

- #### `$effect` — Side Effects

  Runs a callback whenever its reactive dependencies change. Useful for integrating non-Svelte APIs (e.g. `setInterval`, manual DOM manipulation):

  ```svelte
  <script>
    let counter = $state(0);
    let interval = $state(1000);

    $effect(() => {
      const timer = setInterval(() => {
        counter += 1;
      }, interval);

      // Return a cleanup function to prevent memory leaks
      return () => clearInterval(timer);
    });
  </script>

  <h1>Counter: {counter}</h1>
  <button onclick={() => (interval += 1000)}>
    Increase Interval: {interval}ms
  </button>
  ```

  > ⚠️ Always return a cleanup function when using `$effect` with timers or subscriptions to avoid memory leaks.

  > 💡 Prefer `$derived` over `$effect` for data transformations. Use `$effect` only as a last resort for DOM manipulation or external integrations.

- #### Universal (Global) State

  Unlike React or Vue, Svelte allows reactive state to be declared **outside** components — making it usable as global state without a separate state management library.

  Runes can only be used in `.svelte` or `.svelte.js` files:

  ```javascript
  // src/state/counter.svelte.js
  export const counter = $state({ count: 0 });
  ```

  ```svelte
  <!-- src/lib/GlobalCounter.svelte -->
  <script>
    import { counter } from "../state/counter.svelte.js";

    function increment() {
      counter.count++;
    }
  </script>

  <button onclick={increment}>Increment</button>
  <p>Count: {counter.count}</p>
  ```

---

## 📡 Component Communication

- #### Props with `$props`

  Pass data into a component using HTML-like attributes. Inside the component, access them with `$props()`:

  ```svelte
  <!-- src/lib/UserRow.svelte -->
  <script>
    const { id, name, address } = $props();
  </script>

  <tr>
    <td>{id}</td>
    <td>{name}</td>
    <td>{address}</td>
  </tr>
  ```

- #### Spread Props

  If you already have an object, use the spread operator to pass all its properties at once:

  ```svelte
  <script>
    const user = { id: "1", name: "Alice", address: "123 Main St" };
  </script>

  <UserRow {...user} />
  ```

- #### Event Props

  Functions (event handlers) can also be passed as props, enabling child-to-parent communication:

  ```svelte
  <!-- src/lib/EditTodo.svelte -->
  <script>
    const { id, name, onEdit } = $props();

    function save() {
      const input = document.getElementById(id);
      onEdit(id, input.value);
    }
  </script>

  {id}
  <input type="text" {id} value={name} />
  <button onclick={save}>Save</button>
  ```

---

## 🔀 Control Flow

- #### `{#if}` Block

  Conditionally render elements based on a boolean expression:

  ```svelte
  {#if done}
    <strike>{id} - {name}</strike>
  {:else}
    <p>{id} - {name}</p>
  {/if}
  ```

- #### `{#each}` Block

  Iterate over arrays and render elements for each item:

  ```svelte
  {#each data as todo}
    <Todo {...todo} />
  {/each}
  ```

- #### Keyed Each Block

  Add a key to help Svelte identify which item was added, removed, or modified. Without a key, Svelte only updates the reactive parts at the end of the list:

  ```svelte
  {#each data as todo (todo.id)}
    <Todo {...todo} />
  {/each}
  ```

  > ✅ Always add a key `(item.id)` when the array can be mutated (add/remove/reorder).

- #### `{#await}` Block

  Handle Promises directly in the template — show a loading state, the resolved data, or an error:

  ```svelte
  <script>
    async function getArticle() {
      const response = await fetch("/article.json");
      return await response.json();
    }
  </script>

  {#await getArticle()}
    <p>Loading ...</p>
  {:then article}
    <h1>{article.title}</h1>
    <p>{article.content}</p>
  {:catch error}
    <p>{error}</p>
  {/await}
  ```

---

## 🔗 Binding

Data normally flows from parent to child. **Binding** allows two-way synchronization between a parent variable and a child element's attribute.

Use `bind:attribute={variable}` to sync an input's value with a reactive state:

```svelte
<script>
  let name = $state("");
</script>

<input type="text" bind:value={name} />
<p>Hello, {name}</p>
```

Binding also works with component props, enabling child-to-parent data flow:

```svelte
<!-- Parent passes a reactive variable; child can mutate it via bind: -->
<script>
  let { id, name, onEdit } = $props();
  const save = () => onEdit(id, name);
</script>

<input type="text" {id} bind:value={name} />
<button onclick={save}>Save</button>
```

---

## 🎨 Styling

- #### Inline Style Attribute

  Apply styles directly on an element using the `style` attribute:

  ```svelte
  <div style="width: {box.width}px; height: {box.height}px; background-color: red;">
    Area: {box.area}
  </div>
  ```

- #### Scoped Style

  Styles inside a `<style>` tag are **scoped to the component** — they won't affect other components even if class names overlap:

  ```svelte
  <style>
    h1 {
      color: red;
    }
  </style>
  ```

- #### Global Style

  Use `:global` to apply styles across all components:

  ```svelte
  <style>
    :global {
      button {
        background-color: #4caf50;
        border: none;
        color: white;
        padding: 5px 10px;
        cursor: pointer;
        border-radius: 5px;
      }

      button:hover {
        background-color: #45a049;
      }
    }
  </style>
  ```

- #### Class Attribute

  Dynamically apply CSS classes using a ternary expression:

  ```svelte
  <h1 class={total % 2 === 0 ? "red" : "blue"}>
    {total}
  </h1>

  <style>
    .red { color: red; }
    .blue { color: blue; }
  </style>
  ```

---

## 🎬 Actions

An **Action** is a function called when an element is mounted. Use `use:action_name` to attach it to an element. Actions typically use `$effect` internally so cleanup runs on unmount:

```svelte
<script>
  function tooltip(node, text) {
    // setup logic
    return {
      destroy() {
        // cleanup logic
      }
    };
  }
</script>

<button use:tooltip={"Click me!"}>Hover</button>
```

- Reference: [https://svelte.dev/docs/svelte/use](https://svelte.dev/docs/svelte/use)
- Reference: [https://svelte.dev/docs/svelte/svelte-action](https://svelte.dev/docs/svelte/svelte-action)

---

## ✨ Transitions

Svelte has built-in transition directives to animate elements when they enter or leave the DOM.

- #### Basic Transition

  Use `transition:type` for the same animation on both enter and exit:

  ```svelte
  <script>
    import { fade } from "svelte/transition";
  </script>

  <div transition:fade>Hello</div>
  ```

- #### Transition with Parameters

  ```svelte
  <li transition:fly={{ y: -200, duration: 2000 }}>...</li>
  ```

- #### Separate In/Out Transitions

  Use `in:` and `out:` to specify different animations for enter and exit:

  ```svelte
  <li
    in:fly={{ y: -200, duration: 2000 }}
    out:fly={{ y: 200, duration: 2000 }}
  >
    ...
  </li>
  ```

- #### Transition Events

  Listen to transition lifecycle events directly on the element:

  ```svelte
  <li
    in:fly={{ y: -200, duration: 2000 }}
    out:fly={{ y: 200, duration: 2000 }}
    onintrostart={() => console.log("introstart")}
    onintroend={() => console.log("introend")}
    onoutrostart={() => console.log("outrostart")}
    onoutroend={() => console.log("outroend")}
  >
    ...
  </li>
  ```

- Reference: [https://svelte.dev/docs/svelte/svelte-transition](https://svelte.dev/docs/svelte/svelte-transition)

---

## 🏗️ Reactive Classes & Built-ins

- #### Reactive Class

  `$state` and `$derived` can be used inside class properties, creating reusable reactive data structures:

  ```svelte
  <script>
    class Box {
      width = $state(100);
      height = $state(100);
      area = $derived(this.width * this.height);
    }

    const box = new Box();
  </script>

  <div>
    Width: <input type="range" min="0" max="500" bind:value={box.width} />
    Height: <input type="range" min="0" max="500" bind:value={box.height} />
  </div>

  <div style="width: {box.width}px; height: {box.height}px; background-color: red;">
    Area: {box.area}
  </div>
  ```

- #### Reactive Built-ins

  For non-primitive data types like `Map`, `Set`, or `Date`, Svelte provides reactive wrappers via `svelte/reactivity`:

  | Class | Replaces |
  |-------|----------|
  | `SvelteMap` | `Map` |
  | `SvelteSet` | `Set` |
  | `SvelteDate` | `Date` |

  ```svelte
  <script>
    import { SvelteMap } from "svelte/reactivity";

    const students = new SvelteMap();
    let student = $state("");
    let value = $state(0);

    function addStudent() {
      students.set(student, value);
      student = "";
      value = 0;
    }
  </script>

  <input type="text" bind:value={student} />
  <input type="number" bind:value />
  <button onclick={addStudent}>Add Student</button>

  <table>
    <tbody>
      {#each students as [name, value] (name)}
        <tr>
          <td>{name}</td>
          <td>{value}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  ```

- Reference: [https://svelte.dev/docs/svelte/svelte-reactivity](https://svelte.dev/docs/svelte/svelte-reactivity)

---

## 🗄️ Store (Legacy)

Before Svelte 5, universal state was handled using **Stores**. You may still encounter stores in third-party libraries, so it's useful to understand them.

- Reference: [https://svelte.dev/docs/svelte/svelte-store](https://svelte.dev/docs/svelte/svelte-store)

- #### Store Types

  | Type | Description |
  |------|-------------|
  | `readable()` | Can only be read |
  | `writable()` | Can be read and updated |

- #### Usage

  Create a store in a separate file:

  ```javascript
  // src/state/counter.js
  import { writable } from "svelte/store";

  export const counter = writable(0);
  counter.subscribe((value) => console.log(value));
  ```

  Use it in a component with the `$` prefix to auto-subscribe:

  ```svelte
  <script>
    import { counter } from "../state/counter.js";

    function increment() {
      $counter++;
    }
  </script>

  <button onclick={increment}>
    Increment: {$counter}
  </button>
  ```

  > In Svelte 5, prefer `$state` in `.svelte.js` files over stores for new projects.

---

## 🧩 Snippets & Render

- #### Snippet

  A **Snippet** is a reusable block of template markup defined within the same component file — useful for avoiding repetition without creating a separate file:

  ```svelte
  {#snippet todoItem(todo)}
    <li>{todo.id} - {todo.name}</li>
  {/snippet}
  ```

- #### Render

  Use `{@render}` to call and display a snippet:

  ```svelte
  {#each data as todo (todo.id)}
    {@render todoItem(todo)}
  {/each}
  ```

- #### Passing Snippets as Props

  Snippets can be passed to child components as props. When placed as inner content of a component tag, they are automatically treated as named props:

  ```svelte
  <!-- src/lib/Layout.svelte -->
  <script>
    const { title, content, footer } = $props();
  </script>

  <h1>{title}</h1>
  <div>{@render content()}</div>
  <footer>{footer}</footer>
  ```

  ```svelte
  <!-- src/lib/Blog.svelte -->
  <script>
    import Layout from "./Layout.svelte";
  </script>

  <Layout title="Blog Example" footer="Copyright 2024">
    {#snippet content()}
      <h1>This is the content</h1>
      <p>This is another content</p>
    {/snippet}
  </Layout>
  ```

- Reference: [https://svelte.dev/docs/svelte/snippet](https://svelte.dev/docs/svelte/snippet)
- Reference: [https://svelte.dev/docs/svelte/@render](https://svelte.dev/docs/svelte/@render)

---

## 🌐 Context

- #### Problem with Global State on the Server

  Global reactive state works well for Client-Side SPAs. However, when running Svelte on a server (e.g. with SvelteKit), global state is shared across all requests — which can leak data between different users.

- #### Context API

  **Context** stores data that is only accessible by the component that sets it and its **child components**. Context itself is not reactive — to make it reactive, store a reactive object inside the context:

  ```svelte
  <!-- ContextCounterApp.svelte (Parent) -->
  <script>
    import { setContext } from "svelte";
    import ContextCounter from "./ContextCounter.svelte";

    const counter = $state({ count: 0 });
    setContext("counter", counter);
  </script>

  <ContextCounter />
  <ContextCounter />
  <ContextCounter />
  ```

  ```svelte
  <!-- ContextCounter.svelte (Child) -->
  <script>
    import { getContext } from "svelte";

    const counter = getContext("counter");

    function increment() {
      counter.count++;
    }
  </script>

  <button onclick={increment}>Increment {counter.count}</button>
  ```

  | Method | Description |
  |--------|-------------|
  | `setContext(key, value)` | Store a value in the current component's context |
  | `getContext(key)` | Retrieve a value from the nearest parent's context |

- Reference: [https://svelte.dev/docs/svelte/context](https://svelte.dev/docs/svelte/context)

---

## 🔄 Lifecycle Hooks

Lifecycle hooks let you run code at specific points in a component's life:

| Hook | When It Runs |
|------|--------------|
| `onMount(callback)` | After the component is first rendered to the DOM |
| `onDestroy(callback)` | Before the component is removed from the DOM |

> The callback in `onMount` can return a cleanup function, which runs when the component is destroyed — equivalent to `onDestroy`.

```svelte
<script>
  import { onMount } from "svelte";
  import Layout from "./Layout.svelte";

  let blog = $state({ title: "", footer: "", content: "" });

  onMount(async () => {
    const response = await fetch("/blog.json");
    blog = await response.json();
  });
</script>

<Layout title={blog.title} footer={blog.footer}>
  {#snippet content()}
    {@html blog.content}
  {/snippet}
</Layout>
```

- Reference: [https://svelte.dev/docs/svelte/lifecycle-hooks](https://svelte.dev/docs/svelte/lifecycle-hooks)

---

## 🪟 Special Elements

Svelte provides special component representations for browser globals like `window`, `document`, `body`, and `head`. This allows you to attach event listeners and bindings to these elements just like regular components.

| Special Element | Represents |
|----------------|------------|
| `<svelte:window>` | `window` object |
| `<svelte:document>` | `document` object |
| `<svelte:body>` | `document.body` |
| `<svelte:head>` | `<head>` tag |

Example — detect mouse position on the body:

```svelte
<script>
  let x = $state(0);
  let y = $state(0);
</script>

<svelte:body onmousemove={(e) => { x = e.clientX; y = e.clientY; }} />

<p>Mouse: {x}, {y}</p>
```

- [svelte:window docs](https://svelte.dev/docs/svelte/svelte-window)
- [svelte:document docs](https://svelte.dev/docs/svelte/svelte-document)
- [svelte:body docs](https://svelte.dev/docs/svelte/svelte-body)
- [svelte:head docs](https://svelte.dev/docs/svelte/svelte-head)

---

## 📚 References

- Svelte Official Docs: [https://svelte.dev/docs/svelte/overview](https://svelte.dev/docs/svelte/overview)
- Svelte GitHub: [https://github.com/sveltejs/svelte](https://github.com/sveltejs/svelte)
- Vite: [https://vite.dev/](https://vite.dev/)
