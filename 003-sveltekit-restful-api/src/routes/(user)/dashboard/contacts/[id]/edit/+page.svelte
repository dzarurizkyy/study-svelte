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

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await contactUpdate(token, id, contact);
    const responseBody = await response.json();
    console.log(responseBody);

    if (response.status === 200) {
      await alertSuccess("Success update contact");
      await goto("/dashboard/contacts");
    } else {
      await alertError("Failed update contact");
    }
  }

  async function fetchContacts() {
    const response = await contactDetail(token, id);
    const responseBody = await response.json();
    console.log(responseBody);

    if (response.status === 200) {
      contact.first_name = responseBody.data.first_name;
      contact.last_name = responseBody.data.last_name;
      contact.email = responseBody.data.email;
      contact.phone = responseBody.data.phone;
    } else {
      await alertError(responseBody.errors);
    }
  }

  onMount(async () => {
    await fetchContacts();
  });
</script>

<div class="container mx-auto px-4 py-8 flex-grow">
  <div class="flex items-center mb-6">
    <a
      href="/dashboard/contacts"
      class="text-blue-400 hover:text-blue-300 mr-4 flex items-center transition-colors duration-200"
    >
      <i class="fas fa-arrow-left mr-2" /> Back to Contacts
    </a>
    <h1 class="text-2xl font-bold text-white flex items-center">
      <i class="fas fa-user-edit text-blue-400 mr-3" /> Edit Contact
    </h1>
  </div>

  <div
    class="bg-gray-800 bg-opacity-80 rounded-xl shadow-custom border border-gray-700 overflow-hidden max-w-2xl mx-auto animate-fade-in"
  >
    <div class="p-8">
      <form onsubmit={handleSubmit}>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label
              for="first_name"
              class="block text-gray-300 text-sm font-medium mb-2"
              >First Name</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i class="fas fa-user-tag text-gray-500" />
              </div>
              <input
                type="text"
                id="first_name"
                name="first_name"
                class="w-full pl-10 pr-3 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter first name"
                bind:value={contact.first_name}
                required
              />
            </div>
          </div>
          <div>
            <label
              for="last_name"
              class="block text-gray-300 text-sm font-medium mb-2"
              >Last Name</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i class="fas fa-user-tag text-gray-500" />
              </div>
              <input
                type="text"
                id="last_name"
                name="last_name"
                class="w-full pl-10 pr-3 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter last name"
                bind:value={contact.last_name}
                required
              />
            </div>
          </div>
        </div>

        <div class="mb-5">
          <label
            for="email"
            class="block text-gray-300 text-sm font-medium mb-2">Email</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <i class="fas fa-envelope text-gray-500" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              class="w-full pl-10 pr-3 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter email address"
              bind:value={contact.email}
              required
            />
          </div>
        </div>

        <div class="mb-6">
          <label
            for="phone"
            class="block text-gray-300 text-sm font-medium mb-2">Phone</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <i class="fas fa-phone text-gray-500" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              class="w-full pl-10 pr-3 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter phone number"
              bind:value={contact.phone}
              required
            />
          </div>
        </div>

        <div class="flex justify-end space-x-4">
          <a
            href="/dashboard/contacts"
            class="px-5 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 flex items-center shadow-md"
          >
            <i class="fas fa-times mr-2" /> Cancel
          </a>
          <button
            type="submit"
            class="px-5 py-3 bg-gradient text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 font-medium shadow-lg transform hover:-translate-y-0.5 flex items-center"
          >
            <i class="fas fa-save mr-2" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
