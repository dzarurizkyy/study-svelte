<script>
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { contactDetail } from "$lib/api/ContactApi";
  import { addressList, addressDelete } from "$lib/api/AddressApi";
  import { alertSuccess, alertError, alertConfirm } from "$lib/alert";

  const token = localStorage.getItem("token");
  const { id } = page.params;

  let contact = $state({
    id: id,
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  let addresses = $state([]);

  async function fetchAddresses(contactId) {
    const response = await addressList(token, id);
    const responseBody = await response.json();
    console.log(responseBody);

    if (response.status === 200) {
      addresses = responseBody.data;
    } else {
      await alertError(responseBody.errors);
    }
  }

  async function fetchContact() {
    const response = await contactDetail(token, id);
    const responseBody = await response.json();
    console.log(responseBody);

    if (response.status === 200) {
      contact = responseBody.data;
    } else {
      await alertError(responseBody.errors);
    }
  }

  async function handleDeleteAddress(addressId) {
    if (
      !(await alertConfirm("Are your sure you want to delete this address?"))
    ) {
      return;
    }

    const response = await addressDelete(token, id, addressId);
    const responseBody = await response.json();

    if (response.status === 200) {
      await alertSuccess("Address deleted successfully");
      await fetchAddresses();
    } else {
      await alertError(responseBody.errors);
    }
  }

  onMount(async () => {
    await fetchContact();
    await fetchAddresses();
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
      <i class="fas fa-id-card text-blue-400 mr-3" /> Contact Details
    </h1>
  </div>

  <div
    class="bg-gray-800 bg-opacity-80 rounded-xl shadow-custom border border-gray-700 overflow-hidden max-w-2xl mx-auto animate-fade-in"
  >
    <div class="p-8">
      <!-- Contact Header -->
      <div class="mb-8 text-center">
        <div
          class="w-20 h-20 bg-gradient rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg"
        >
          <i class="fas fa-user text-3xl text-white" />
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">
          {contact.first_name}
          {contact.last_name}
        </h2>
        <div class="w-24 h-1 bg-gradient mx-auto rounded-full" />
      </div>

      <!-- Contact Information -->
      <div class="space-y-5 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            class="bg-gray-700 bg-opacity-50 p-5 rounded-lg shadow-md border border-gray-600 transition-all duration-200 hover:bg-opacity-70"
          >
            <div class="flex items-center mb-2">
              <i class="fas fa-user-tag text-blue-400 mr-2" />
              <h3 class="text-gray-300 text-sm font-medium">First Name</h3>
            </div>
            <p class="text-white text-lg ml-6">{contact.first_name}</p>
          </div>
          <div
            class="bg-gray-700 bg-opacity-50 p-5 rounded-lg shadow-md border border-gray-600 transition-all duration-200 hover:bg-opacity-70"
          >
            <div class="flex items-center mb-2">
              <i class="fas fa-user-tag text-blue-400 mr-2" />
              <h3 class="text-gray-300 text-sm font-medium">Last Name</h3>
            </div>
            <p class="text-white text-lg ml-6">{contact.last_name}</p>
          </div>
        </div>

        <div
          class="bg-gray-700 bg-opacity-50 p-5 rounded-lg shadow-md border border-gray-600 transition-all duration-200 hover:bg-opacity-70"
        >
          <div class="flex items-center mb-2">
            <i class="fas fa-envelope text-blue-400 mr-2" />
            <h3 class="text-gray-300 text-sm font-medium">Email</h3>
          </div>
          <p class="text-white text-lg ml-6">{contact.email}</p>
        </div>

        <div
          class="bg-gray-700 bg-opacity-50 p-5 rounded-lg shadow-md border border-gray-600 transition-all duration-200 hover:bg-opacity-70"
        >
          <div class="flex items-center mb-2">
            <i class="fas fa-phone text-blue-400 mr-2" />
            <h3 class="text-gray-300 text-sm font-medium">Phone</h3>
          </div>
          <p class="text-white text-lg ml-6">{contact.phone}</p>
        </div>
      </div>

      <!-- Addresses Section -->
      <div class="mb-8">
        <div class="flex items-center mb-5">
          <i class="fas fa-map-marker-alt text-blue-400 mr-3" />
          <h3 class="text-xl font-semibold text-white">Addresses</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Add Address Card -->
          <div
            class="bg-gray-700 bg-opacity-50 p-5 rounded-lg border-2 border-dashed border-gray-600 shadow-md card-hover"
          >
            <a
              href={`/dashboard/contacts/${contact.id}/addresses/create`}
              class="block h-full"
            >
              <div
                class="flex flex-col items-center justify-center h-full text-center py-4"
              >
                <div
                  class="w-16 h-16 bg-gradient rounded-full flex items-center justify-center mb-4 shadow-lg transform transition-transform duration-300 hover:scale-110"
                >
                  <i class="fas fa-plus text-2xl text-white" />
                </div>
                <h4 class="text-lg font-semibold text-white">Add Address</h4>
              </div>
            </a>
          </div>

          <!-- Address Card 1 -->
          {#each addresses as address (address.id)}
            <div
              class="bg-gray-700 bg-opacity-50 p-5 rounded-lg shadow-md border border-gray-600 card-hover"
            >
              <div class="flex items-center mb-3">
                <div
                  class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3 shadow-md"
                >
                  <i class="fas fa-home text-white" />
                </div>
                <h4 class="text-lg font-semibold text-white">Address</h4>
              </div>
              <div class="space-y-3 text-gray-300 ml-2 mb-4">
                <p class="flex items-center">
                  <i class="fas fa-road text-gray-500 w-6" />
                  <span class="font-medium w-24">Street:</span>
                  <span>{address.street}</span>
                </p>
                <p class="flex items-center">
                  <i class="fas fa-city text-gray-500 w-6" />
                  <span class="font-medium w-24">City:</span>
                  <span>{address.city}</span>
                </p>
                <p class="flex items-center">
                  <i class="fas fa-map text-gray-500 w-6" />
                  <span class="font-medium w-24">Province:</span>
                  <span>{address.province}</span>
                </p>
                <p class="flex items-center">
                  <i class="fas fa-flag text-gray-500 w-6" />
                  <span class="font-medium w-24">Country:</span>
                  <span>{address.country}</span>
                </p>
                <p class="flex items-center">
                  <i class="fas fa-mailbox text-gray-500 w-6" />
                  <span class="font-medium w-24">Postal Code:</span>
                  <span>{address.postal_code}</span>
                </p>
              </div>
              <div class="flex justify-end space-x-3">
                <a
                  href={`/dashboard/contacts/${contact.id}/addresses/${address.id}/edit`}
                  class="px-4 py-2 bg-gradient text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 font-medium shadow-md flex items-center"
                >
                  <i class="fas fa-edit mr-2" /> Edit
                </a>
                <button
                  onclick={() => handleDeleteAddress(address.id)}
                  class="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 font-medium shadow-md flex items-center"
                >
                  <i class="fas fa-trash-alt mr-2" /> Delete
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4">
        <a
          href="/dashboard/contacts"
          class="px-5 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 flex items-center shadow-md"
        >
          <i class="fas fa-arrow-left mr-2" /> Back
        </a>
        <a
          href={`/dashboard/contacts/${id}/edit`}
          class="px-5 py-3 bg-gradient text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 font-medium shadow-lg transform hover:-translate-y-0.5 flex items-center"
        >
          <i class="fas fa-user-edit mr-2" /> Edit Contact
        </a>
      </div>
    </div>
  </div>
</div>
