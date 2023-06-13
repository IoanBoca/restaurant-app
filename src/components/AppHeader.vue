<template>
  <v-layout>
    <v-app-bar :elevation="2">
      <template v-slot:prepend>
        <router-link class="home-option" :to="{ name: 'home' }" exact-active-class="no-active">
          Acasa in Bucovina
        </router-link>
      </template>
      <v-app-bar-title class="app-bar-options">
        <router-link class="reservation-option" :to="{name: 'reservations'}">
          {{ $t("navbar.reservations") }}
        </router-link>
        <router-link class="menu-option" :to="{name: 'food-menu'}">
          {{ $t("navbar.menu") }}
        </router-link>
        <router-link class="about-option" :to="{name: 'about'}">
          {{ $t("navbar.about") }}
        </router-link>
        <a class="gift-option" href="#">Gift Cards</a>
        <router-link v-if="!userStore.userLoggedIn" class="login-register-option" :to="{name: 'auth'}">
          Login / Register
        </router-link>
        <a v-else class="px-2" href="#" @click.prevent="signOut">Logout</a>
        <a class="language-option" href="#" @click.prevent="changeLocale">{{ currentLocale }}</a>
      </v-app-bar-title>
    </v-app-bar>
  </v-layout>
</template>

<script>
import useUserStore from "@/stores/user";
import { mapStores } from "pinia";

export default {
  name: "AppHeader",
  methods: {
    signOut() {
      this.userStore.signOut();
      this.$router.push({ name: "home" });
    },
    changeLocale() {
      this.$i18n.locale = this.$i18n.locale === "ro" ? "en" : "ro";
    }
  },
  computed: {
    ...mapStores(useUserStore),
    currentLocale() {
      return this.$i18n.locale === "ro" ? "Romanian" : "English";
    }
  }
};
</script>

<style>
.home-option {
  color: black;
  font-weight: bold;
  font-size: larger;
}

.app-bar-options {
  color: rgb(253, 216, 53);
}

.home-option, .reservation-option, .menu-option, .about-option, .gift-option, .login-register-option {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.language-option {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  justify-self: flex-end;
}

</style>