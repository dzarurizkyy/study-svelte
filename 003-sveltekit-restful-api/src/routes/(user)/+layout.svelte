<script>
  let { children } = $props();
</script>

<div
  class="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex flex-col"
>
  <!-- Header with right-aligned menu -->
  <header class="bg-gradient shadow-lg">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <a
        href="dashboard.html"
        class="flex items-center hover:opacity-90 transition-opacity duration-200"
      >
        <i class="fas fa-address-book text-white text-2xl mr-3" />
        <div class="text-white font-bold text-xl">Contact Management</div>
      </a>
      <nav>
        <ul class="flex space-x-6">
          <li>
            <a
              href="/dashboard/users/profile"
              class="text-gray-100 hover:text-white flex items-center transition-colors duration-200"
            >
              <i class="fas fa-user-circle mr-2" />
              <span>Profile</span>
            </a>
          </li>
          <li>
            <a
              href="/dashboard/users/logout"
              class="text-gray-100 hover:text-white flex items-center transition-colors duration-200"
            >
              <i class="fas fa-sign-out-alt mr-2" />
              <span>Logout</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>

  <!-- Main content -->
  <main class="container mx-auto px-4 py-8 flex-grow">
    {@render children()}
    
    <!-- Footer -->
    <div class="mt-10 mb-6 text-center text-gray-400 text-sm animate-fade-in">
      <p>© 2025 Contact Management. All rights reserved.</p>
    </div>
  </main>

  <!-- JavaScript for toggle search form -->
  <script>
    document.addEventListener("DOMContentLoaded", function () {
      const toggleButton = document.getElementById("toggleSearchForm");
      const searchFormContent = document.getElementById("searchFormContent");
      const toggleIcon = document.getElementById("toggleSearchIcon");

      // Add transition for smooth animation
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
          searchFormContent.style.maxHeight =
            searchFormContent.scrollHeight + "px";
          searchFormContent.style.opacity = "1";
          searchFormContent.style.marginTop = "1rem";
          toggleIcon.classList.remove("fa-chevron-down");
          toggleIcon.classList.add("fa-chevron-up");
        }
      });
    });
  </script>
</div>
