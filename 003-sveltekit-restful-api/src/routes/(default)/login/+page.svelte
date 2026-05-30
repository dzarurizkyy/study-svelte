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
      const token = responseBody.data.token;
      localStorage.setItem("token", token);
      await goto("/dashboard/contacts");
    } else {
      await alertError(responseBody.errors);
    }
  }
</script>

<div
  class="animate-fade-in bg-gray-800 bg-opacity-80 p-8 rounded-xl shadow-custom border border-gray-700 backdrop-blur-sm w-full max-w-md"
>
  <div class="text-center mb-8">
    <div class="inline-block p-3 bg-gradient rounded-full mb-4">
      <i class="fas fa-address-book text-3xl text-white" />
    </div>
    <h1 class="text-3xl font-bold text-white">Contact Management</h1>
    <p class="text-gray-300 mt-2">Sign in to your account</p>
  </div>

  <form onsubmit={handleSubmit}>
    <div class="mb-5">
      <label for="username" class="block text-gray-300 text-sm font-medium mb-2"
        >Username</label
      >
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <i class="fas fa-user text-gray-500" />
        </div>
        <input
          type="text"
          id="username"
          name="username"
          class="w-full pl-10 pr-3 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          placeholder="Enter your username"
          bind:value={user.username}
          required
        />
      </div>
    </div>

    <div class="mb-6">
      <label for="password" class="block text-gray-300 text-sm font-medium mb-2"
        >Password</label
      >
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <i class="fas fa-lock text-gray-500" />
        </div>
        <input
          type="password"
          id="password"
          name="password"
          class="w-full pl-10 pr-3 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          placeholder="Enter your password"
          bind:value={user.password}
          required
        />
      </div>
    </div>

    <div class="mb-6">
      <button
        type="submit"
        class="w-full bg-gradient text-white py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 font-medium shadow-lg transform hover:-translate-y-0.5"
      >
        <i class="fas fa-sign-in-alt mr-2" /> Sign In
      </button>
    </div>

    <div class="text-center text-sm text-gray-400">
      Don't have an account?
      <a
        href="/register"
        class="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
        >Sign up</a
      >
    </div>
  </form>
</div>
