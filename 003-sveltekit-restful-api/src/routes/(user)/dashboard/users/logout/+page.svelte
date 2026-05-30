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
      console.log(responseBody);

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
