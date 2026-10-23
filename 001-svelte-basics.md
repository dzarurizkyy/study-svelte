# ⚡ Svelte Basics

A practical reference guide for learning Svelte from scratch — covering template syntax, runes, component communication, control flow, styling, transitions, and context, built hands-on inside a Vite playground.

---

## 📋 Table of Contents

- [Introduction](#-introduction)
  - [What Is Svelte?](#what-is-svelte)
  - [Why a Framework?](#why-a-framework)
  - [The Svelte Ecosystem](#the-svelte-ecosystem)
- [Project Setup](#-project-setup)
  - [Prerequisites](#prerequisites)
  - [Creating the Project](#creating-the-project)
  - [Multi-Page Setup with Vite](#multi-page-setup-with-vite)
  - [Running the App](#running-the-app)
  - [Project Structure](#project-structure)
- [Hello Svelte](#-hello-svelte)
  - [Creating a Component](#creating-a-component)
  - [Mounting a Component](#mounting-a-component)
- [Template Syntax](#-template-syntax)
  - [Text Expressions](#text-expressions)
  - [Dynamic Attributes](#dynamic-attributes)
  - [Raw HTML](#raw-html)
  - [Nested Components](#nested-components)
- [Runes & Reactivity](#-runes--reactivity)
  - [$state — Reactive State](#state--reactive-state)
  - [Deep State with Objects & Arrays](#deep-state-with-objects--arrays)
  - [$state.raw — Non-Deep State](#stateraw--non-deep-state)
  - [$derived — Derived State](#derived--derived-state)
  - [$derived.by — Derived with a Function](#derivedby--derived-with-a-function)
  - [$inspect — Debugging State](#inspect--debugging-state)
  - [$effect — Side Effects](#effect--side-effects)
  - [Universal (Global) State](#universal-global-state)
- [Component Communication](#-component-communication)
  - [Props with $props](#props-with-props)
  - [Spread Props](#spread-props)
  - [Event Props](#event-props)
- [Control Flow](#-control-flow)
  - [The {#if} Block](#the-if-block)
  - [The {#each} Block](#the-each-block)
  - [Keyed Each Blocks](#keyed-each-blocks)
  - [The {#await} Block](#the-await-block)
- [Binding](#-binding)
  - [Binding an Input Value](#binding-an-input-value)
  - [Binding Component Props](#binding-component-props)
- [Styling](#-styling)
  - [Inline Style Attribute](#inline-style-attribute)
  - [Scoped Styles](#scoped-styles)
  - [Global Styles](#global-styles)
  - [Dynamic Class Attribute](#dynamic-class-attribute)
- [Actions](#-actions)
  - [Attaching an Action with use:action](#attaching-an-action-with-useaction)
- [Transitions](#-transitions)
  - [Basic Transition](#basic-transition)
  - [Transition Parameters](#transition-parameters)
  - [Separate In & Out Transitions](#separate-in--out-transitions)
  - [Transition Events](#transition-events)
- [Reactive Classes & Built-ins](#-reactive-classes--built-ins)
  - [Reactive Classes](#reactive-classes)
  - [Reactive Built-ins](#reactive-built-ins)
- [Stores (Legacy)](#-stores-legacy)
  - [Store Types](#store-types)
  - [Using a Store](#using-a-store)
- [Snippets & Render](#-snippets--render)
  - [Defining a Snippet](#defining-a-snippet)
  - [Rendering with {@render}](#rendering-with-render)
  - [Passing Snippets as Props](#passing-snippets-as-props)
- [Context](#-context)
  - [Why Global State Breaks on the Server](#why-global-state-breaks-on-the-server)
  - [setContext & getContext](#setcontext--getcontext)
- [Lifecycle Hooks](#-lifecycle-hooks)
  - [onMount & onDestroy](#onmount--ondestroy)
- [Special Elements](#-special-elements)
  - [svelte:window, document, body & head](#sveltewindow-document-body--head)
- [Quick Reference](#-quick-reference)
- [Best Practices](#-best-practices)

---

## 🎯 Introduction

### What Is Svelte?

- Svelte is a modern frontend framework for building web applications
- Unlike React or Vue, Svelte shifts work to **compile time** — components are compiled to vanilla JavaScript, producing highly optimized output with no virtual DOM overhead

> Reference: [svelte.dev](https://svelte.dev/) · [github.com/sveltejs/svelte](https://github.com/sveltejs/svelte)

### Why a Framework?

- A framework standardizes how a frontend project is built — especially valuable in a team, where everyone would otherwise write code in their own style
- Without a framework, every developer ends up with a different structure, making collaboration and maintenance much harder

### The Svelte Ecosystem

Svelte develops its own ecosystem, unlike React where much of the ecosystem is built by third parties. Svelte's own meta-framework is **SvelteKit**.

| Aspect | Detail |
| --- | --- |
| **Advantage** | Better integration between parts, maintained by the same team |
| **Disadvantage** | The ecosystem is smaller compared to React |

---

## 🏗️ Project Setup

### Prerequisites

| Requirement | Version |
| --- | --- |
| Node.js | v18+ |
| npm or yarn | — |

### Creating the Project

Svelte projects can be created in two ways:

| Method | Description |
| --- | --- |
| **Vite** | Lightweight setup, covered in this guide |
| **SvelteKit** | Full-featured meta-framework (covered separately) |

> **Key Insight:** SvelteKit itself uses Vite under the hood, so learning Vite first is a solid foundation.

To scaffold a new project with Vite:

```bash
npm create vite@latest svelte-basic -- --template svelte
cd svelte-basic
npm install
```

### Multi-Page Setup with Vite

To add multiple HTML pages (e.g. `hello.html`, `counter.html`), each one has to be registered as a build input:

**`vite.config.js`**

```javascript
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

### Running the App

```bash
npm run dev
```

### Project Structure

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

### Creating a Component

Each Svelte component lives in its own `.svelte` file, divided into three sections: **Script**, **Style**, and **HTML**.

**`src/lib/HelloSvelte.svelte`**

```svelte
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

### Mounting a Component

Use the `mount()` function from Svelte to attach a component to the DOM:

**`src/hello.js`**

```javascript
import { mount } from "svelte";
import HelloSvelte from "./lib/HelloSvelte.svelte";

const app = mount(HelloSvelte, {
  target: document.getElementById("app"),
});

export default app;
```

---

## 📝 Template Syntax

### Text Expressions

Curly braces `{}` embed JavaScript expressions directly into the HTML template:

```svelte
<script>
  const name = "Svelte";
</script>

<h1>Hello {name.toUpperCase()}</h1>
```

### Dynamic Attributes

Text expressions can also be used as attribute values. If the variable name matches the attribute name, use the shorthand:

```svelte
<script>
  const src = "https://picsum.photos/id/1/200/300";
</script>

<!-- Shorthand: {src} instead of src={src} -->
<img {src} alt="Example" />
```

### Raw HTML

To render a raw HTML string, use `{@html}`:

```svelte
<script>
  const content = "<p>Hello World!</p>";
</script>

{@html content}
```

### Nested Components

Import other components and use them as if they were HTML tags:

```svelte
<script>
  import Logo from "./Logo.svelte";
</script>

<Logo />
<Logo />
```

---

## ⚙️ Runes & Reactivity

Runes are special symbols prefixed with `$` that control the Svelte compiler's behavior. They look like functions (e.g. `$state("hello")`).

### $state — Reactive State

Creates a reactive variable. When its value changes, the UI updates automatically.

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

### Deep State with Objects & Arrays

When `$state` wraps an object or array, Svelte wraps it in a JavaScript Proxy so nested changes are detected automatically:

> Reference: [MDN: Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

```svelte
<script>
  let person = $state({ firstName: "", lastName: "" });
</script>
```

> **Key Insight:** `$state` doesn't make `Set` or `Map` reactive — use Svelte's [reactive built-ins](#reactive-built-ins) for those.

### $state.raw — Non-Deep State

Use `$state.raw` when only the variable reference should be reactive, not its internal properties:

```svelte
<script>
  let person = $state.raw({ firstName: "", lastName: "" });

  function update() {
    // Must replace the whole object to trigger reactivity
    person = { firstName: "John", lastName: "Doe" };
  }
</script>
```

### $derived — Derived State

Creates a value computed from other reactive state. It recalculates automatically when its dependencies change:

```svelte
<script>
  let count = $state([]);
  let total = $derived(count.reduce((a, b) => a + b, 0));
</script>
```

### $derived.by — Derived with a Function

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

### $inspect — Debugging State

Logs state changes during development. It's automatically disabled in production builds, so it's safe to leave in the codebase:

```svelte
<script>
  let count = $state([]);

  $inspect(count).with((type, values) => {
    console.log(type, values);
  });
</script>
```

### $effect — Side Effects

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

> **Key Insight:** Prefer `$derived` over `$effect` for data transformations. Reach for `$effect` only as a last resort — for DOM manipulation or external integrations — and always return a cleanup function when it starts timers or subscriptions.

### Universal (Global) State

Unlike React or Vue, Svelte lets reactive state be declared **outside** components — making it usable as global state without a separate state management library. Runes can only be used in `.svelte` or `.svelte.js` files.

**`src/state/counter.svelte.js`**

```javascript
export const counter = $state({ count: 0 });
```

**`src/lib/GlobalCounter.svelte`**

```svelte
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

## 📦 Component Communication

### Props with $props

Pass data into a component with HTML-like attributes. Inside the component, read them with `$props()`:

**`src/lib/UserRow.svelte`**

```svelte
<script>
  const { id, name, address } = $props();
</script>

<tr>
  <td>{id}</td>
  <td>{name}</td>
  <td>{address}</td>
</tr>
```

### Spread Props

If you already have an object, spread it to pass all its properties at once:

```svelte
<script>
  const user = { id: "1", name: "Alice", address: "123 Main St" };
</script>

<UserRow {...user} />
```

### Event Props

Functions (event handlers) can also be passed as props, enabling child-to-parent communication:

**`src/lib/EditTodo.svelte`**

```svelte
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

### The {#if} Block

Conditionally render elements based on a boolean expression:

```svelte
{#if done}
  <strike>{id} - {name}</strike>
{:else}
  <p>{id} - {name}</p>
{/if}
```

### The {#each} Block

Iterate over an array and render elements for each item:

```svelte
{#each data as todo}
  <Todo {...todo} />
{/each}
```

### Keyed Each Blocks

A key helps Svelte identify which item was added, removed, or modified. Without a key, Svelte only updates the reactive parts at the end of the list:

```svelte
{#each data as todo (todo.id)}
  <Todo {...todo} />
{/each}
```

> **Key Insight:** Always add a key `(item.id)` whenever the array can be mutated (add/remove/reorder).

### The {#await} Block

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

> **Key Insight:** Data normally flows from parent to child. **Binding** (`bind:attribute={variable}`) enables two-way synchronization between a variable and an element's attribute.

### Binding an Input Value

```svelte
<script>
  let name = $state("");
</script>

<input type="text" bind:value={name} />
<p>Hello, {name}</p>
```

### Binding Component Props

Binding also works with component props, letting a child mutate a value passed in by its parent:

```svelte
<script>
  let { id, name, onEdit } = $props();
  const save = () => onEdit(id, name);
</script>

<input type="text" {id} bind:value={name} />
<button onclick={save}>Save</button>
```

---

## 🎨 Styling

### Inline Style Attribute

Apply styles directly on an element with the `style` attribute:

```svelte
<div style="width: {box.width}px; height: {box.height}px; background-color: red;">
  Area: {box.area}
</div>
```

### Scoped Styles

Styles inside a `<style>` tag are **scoped to the component** — they won't affect other components even if class names overlap:

```svelte
<style>
  h1 {
    color: red;
  }
</style>
```

### Global Styles

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

### Dynamic Class Attribute

Apply CSS classes dynamically with a ternary expression:

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

### Attaching an Action with use:action

An **Action** is a function called when an element is mounted. Attach it with `use:action_name`. Actions typically use `$effect` internally, so cleanup runs on unmount.

> Reference: [svelte.dev/docs/svelte/use](https://svelte.dev/docs/svelte/use) · [svelte.dev/docs/svelte/svelte-action](https://svelte.dev/docs/svelte/svelte-action)

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

---

## ✨ Transitions

Svelte has built-in transition directives to animate elements as they enter or leave the DOM.

> Reference: [svelte.dev/docs/svelte/svelte-transition](https://svelte.dev/docs/svelte/svelte-transition)

### Basic Transition

Use `transition:type` for the same animation on both enter and exit:

```svelte
<script>
  import { fade } from "svelte/transition";
</script>

<div transition:fade>Hello</div>
```

### Transition Parameters

```svelte
<li transition:fly={{ y: -200, duration: 2000 }}>...</li>
```

### Separate In & Out Transitions

Use `in:` and `out:` to specify different animations for enter and exit:

```svelte
<li
  in:fly={{ y: -200, duration: 2000 }}
  out:fly={{ y: 200, duration: 2000 }}
>
  ...
</li>
```

### Transition Events

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

---

## 🏗️ Reactive Classes & Built-ins

### Reactive Classes

`$state` and `$derived` can be used as class fields, creating reusable reactive data structures:

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

### Reactive Built-ins

For non-primitive types like `Map`, `Set`, or `Date`, Svelte provides reactive wrappers via `svelte/reactivity`:

> Reference: [svelte.dev/docs/svelte/svelte-reactivity](https://svelte.dev/docs/svelte/svelte-reactivity)

| Class | Replaces |
| --- | --- |
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

---

## 🗄️ Stores (Legacy)

Before Svelte 5, universal state was handled with **Stores**. You may still encounter them in third-party libraries, so they're worth understanding.

> Reference: [svelte.dev/docs/svelte/svelte-store](https://svelte.dev/docs/svelte/svelte-store)

### Store Types

| Type | Description |
| --- | --- |
| `readable()` | Can only be read |
| `writable()` | Can be read and updated |

### Using a Store

Create the store in a separate file:

**`src/state/counter.js`**

```javascript
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

> **Key Insight:** In Svelte 5, prefer `$state` in `.svelte.js` files over stores for new projects.

---

## 🧩 Snippets & Render

> Reference: [svelte.dev/docs/svelte/snippet](https://svelte.dev/docs/svelte/snippet) · [svelte.dev/docs/svelte/@render](https://svelte.dev/docs/svelte/@render)

### Defining a Snippet

A **Snippet** is a reusable block of template markup defined within the same component file — useful for avoiding repetition without creating a separate file:

```svelte
{#snippet todoItem(todo)}
  <li>{todo.id} - {todo.name}</li>
{/snippet}
```

### Rendering with {@render}

Use `{@render}` to call and display a snippet:

```svelte
{#each data as todo (todo.id)}
  {@render todoItem(todo)}
{/each}
```

### Passing Snippets as Props

Snippets can be passed to child components as props. When placed as inner content of a component tag, they're automatically treated as named props:

**`src/lib/Layout.svelte`**

```svelte
<script>
  const { title, content, footer } = $props();
</script>

<h1>{title}</h1>
<div>{@render content()}</div>
<footer>{footer}</footer>
```

**`src/lib/Blog.svelte`**

```svelte
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

---

## 🌐 Context

> Reference: [svelte.dev/docs/svelte/context](https://svelte.dev/docs/svelte/context)

### Why Global State Breaks on the Server

Global reactive state works well for client-side SPAs. However, when Svelte runs on a server (e.g. with SvelteKit), global state is shared across all requests — which can leak data between different users.

### setContext & getContext

**Context** stores data that's only accessible to the component that sets it and its **child components**.

> **Key Insight:** Context itself is not reactive — to make it reactive, store a reactive object (`$state`) inside the context.

| Method | Description |
| --- | --- |
| `setContext(key, value)` | Store a value in the current component's context |
| `getContext(key)` | Retrieve a value from the nearest parent's context |

**`ContextCounterApp.svelte`** (parent)

```svelte
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

**`ContextCounter.svelte`** (child)

```svelte
<script>
  import { getContext } from "svelte";

  const counter = getContext("counter");

  function increment() {
    counter.count++;
  }
</script>

<button onclick={increment}>Increment {counter.count}</button>
```

---

## 🔄 Lifecycle Hooks

> Reference: [svelte.dev/docs/svelte/lifecycle-hooks](https://svelte.dev/docs/svelte/lifecycle-hooks)

### onMount & onDestroy

Lifecycle hooks let you run code at specific points in a component's life:

| Hook | When It Runs |
| --- | --- |
| `onMount(callback)` | After the component is first rendered to the DOM |
| `onDestroy(callback)` | Before the component is removed from the DOM |

> **Key Insight:** The `onMount` callback can return a cleanup function, which runs when the component is destroyed — equivalent to `onDestroy`.

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

---

## 🪟 Special Elements

### svelte:window, document, body & head

Svelte provides special elements for browser globals like `window`, `document`, `body`, and `head`, so you can attach event listeners and bindings to them just like regular components.

> Reference: [svelte:window](https://svelte.dev/docs/svelte/svelte-window) · [svelte:document](https://svelte.dev/docs/svelte/svelte-document) · [svelte:body](https://svelte.dev/docs/svelte/svelte-body) · [svelte:head](https://svelte.dev/docs/svelte/svelte-head)

| Special Element | Represents |
| --- | --- |
| `<svelte:window>` | `window` object |
| `<svelte:document>` | `document` object |
| `<svelte:body>` | `document.body` |
| `<svelte:head>` | `<head>` tag |

Example — tracking the mouse position on the body:

```svelte
<script>
  let x = $state(0);
  let y = $state(0);
</script>

<svelte:body onmousemove={(e) => { x = e.clientX; y = e.clientY; }} />

<p>Mouse: {x}, {y}</p>
```

---

## 🎯 Quick Reference

| Concept | Purpose | Key Syntax |
| --- | --- | --- |
| **Component** | Script + style + markup in one file | `Name.svelte` |
| **mount** | Attach a component to the DOM | `mount(App, { target })` |
| **$state** | Reactive (deep) state | `let v = $state(init)` |
| **$state.raw** | Reactive reference only | `let v = $state.raw(init)` |
| **$derived** | Computed value from state | `let d = $derived(expr)` |
| **$derived.by** | Computed value from a function | `$derived.by(() => { ... })` |
| **$inspect** | Dev-only state logging | `$inspect(v).with(fn)` |
| **$effect** | Side effects with cleanup | `$effect(() => { ...; return cleanup })` |
| **$props** | Read component props | `const { a, b } = $props()` |
| **Control Flow** | Conditionals, loops, Promises | `{#if}`, `{#each x as y (key)}`, `{#await}` |
| **Binding** | Two-way sync | `bind:value={v}` |
| **Action** | Run code when an element mounts | `use:action={param}` |
| **Transition** | Animate enter/exit | `transition:fade`, `in:` / `out:` |
| **Snippet** | Reusable markup block | `{#snippet name()}` / `{@render name()}` |
| **Context** | Share state with descendants | `setContext(key, v)` / `getContext(key)` |
| **Lifecycle** | Run code on mount/destroy | `onMount(fn)`, `onDestroy(fn)` |

---

## 💡 Best Practices

**✅ Do This**

- **Keep shared state in `.svelte.js` files** — runes work there, so you get global state without a state management library
- **Prefer `$derived` for anything computed** from other state — it stays in sync automatically
- **Add a key to `{#each}` blocks** (`(item.id)`) whenever the list can be added to, removed from, or reordered
- **Return a cleanup function from `$effect`** whenever it starts timers, listeners, or subscriptions
- **Use `SvelteMap` / `SvelteSet` / `SvelteDate`** when you need reactive `Map`, `Set`, or `Date`
- **Use Context instead of global state** when running on the server (SvelteKit), so data doesn't leak between requests

**❌ Avoid This**

- **Using `$effect` for data transformations** — that's `$derived`'s job; keep `$effect` for DOM work and external integrations
- **Mutating a `$state.raw` object's properties** — only reassigning the whole value triggers an update
- **Putting a `Set` or `Map` in `$state`** and expecting it to be reactive
- **Storing a plain (non-`$state`) value in Context** and expecting children to update when it changes
- **Reaching for Stores in new Svelte 5 code** — they're legacy; use runes instead

> Reference: [svelte.dev/docs/svelte/overview](https://svelte.dev/docs/svelte/overview) · [github.com/sveltejs/svelte](https://github.com/sveltejs/svelte) · [vite.dev](https://vite.dev/)
