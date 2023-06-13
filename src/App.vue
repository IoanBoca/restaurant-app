<template>
  <app-header />

  <router-view />

</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import useUserStore from "@/stores/user";
import { auth, usersCollection } from "@/includes/firebase";
import { mapWritableState } from "pinia";

export default {
  name: "App",
  components: {
    AppHeader
  },
  computed: {
    ...mapWritableState(useUserStore, ["userLoggedIn", "userIsAdmin"])
  },
  async created() {
    if (auth.currentUser) {
      this.userLoggedIn = true;
      await usersCollection.doc(auth.currentUser.uid).get().then((doc) => {
        if (doc.data().isAdmin) {
          this.userIsAdmin = true;
          console.log(`The user ${auth.currentUser.displayName} has admin attributes.`);
        } else {
          this.userIsAdmin = false;
          console.log(`The user ${auth.currentUser.displayName} has regular user attributes.`);
        }
      });
    }
  }
};
</script>