<template>
  <div class="auth-container">
    <login-form v-if="auth_tab === 'login'" />
    <register-form v-if="auth_tab === 'register'" />
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";
import useModalStore from "@/stores/modal";
import { mapState } from "pinia";

export default {
  name: "AuthView",
  components: {
    LoginForm,
    RegisterForm
  },
  computed: {
    ...mapState(useModalStore, ["auth_tab"])
  }

};
</script>

<style>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 64px;
}
</style>