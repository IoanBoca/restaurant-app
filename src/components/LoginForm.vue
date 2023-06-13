<template>
  <div class="login-container">
    <div class="text-white text-center font-bold p-4 rounded mb-4"
         v-if="login_show_alert"
         :class="login_alert_variant"
    >{{ login_alert_msg }}
    </div>
    <v-card style="padding: 20px">
      <vee-form :validation-schema="login_schema"
                @submit="login">
        <!-- Email -->
        <div class="mb-3">
          <label class="inline-block mb-2">Email</label>
          <vee-field
            type="email"
            name="email"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Email"
          />
          <ErrorMessage class="text-red-600" name="email" />
        </div>
        <!-- Password -->
        <div class="mb-3">
          <label class="inline-block mb-2">Password</label>
          <vee-field
            type="password"
            name="password"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Password"
          />
          <ErrorMessage class="text-red-600" name="password" />
        </div>
        <button
          type="submit"
          class="block w-full bg-yellow-600 text-white py-1.5 px-3 rounded transition hover:bg-yellow-700"
          :disabled="login_in_submission"
        >
          Login
        </button>
        <label class="inline-block mb-2">Don't have an account?</label>
        <button
          type="button"
          @click="changeToRegisterForm"
          class="block w-full bg-orange-600 text-white py-1.5 px-3 rounded transition hover:bg-orange-700"
          :disabled="login_in_submission"
        >
          Register
        </button>
      </vee-form>
    </v-card>
  </div>
</template>

<script>
import useModalStore from "@/stores/modal";
import useUserStore from "@/stores/user";
import { mapWritableState, mapActions, mapState } from "pinia";

export default {
  name: "LoginForm",
  data() {
    return {
      login_schema: {
        email: "required|min:3|max:100|email",
        password: "required|min:9|max:100|excluded:password"
      },
      login_in_submission: false,
      login_show_alert: false,
      login_alert_variant: "bg-blue-500",
      login_alert_msg: "Please wait! We are logging you in."
    };
  },
  computed: {
    ...mapWritableState(useModalStore, ["auth_tab"]),
    ...mapState(useUserStore, ["currentUserCredentials"])
  },
  methods: {
    changeToRegisterForm() {
      this.auth_tab = "register";
    },
    async login(values, { resetForm }) {
      this.login_show_alert = true;
      this.login_in_submission = true;
      this.login_alert_variant = "bg-blue-500";
      this.login_alert_msg = "Please wait! We are logging you in.";

      try {
        await this.authenticate(values);
      } catch (error) {
        console.log(error);
        this.login_in_submission = false;
        this.login_alert_variant = "bg-red-500";
        this.login_alert_msg = "Invalid login details.";
        return;
      }
      this.login_alert_variant = "bg-green-500";
      this.login_alert_msg = "Success! You have been logged in.";

      resetForm();

      setTimeout(() => {
        this.$router.push({ name: "home" });
      }, 3000);
    },
    ...mapActions(useUserStore, ["authenticate"])
  }
};
</script>

<style scoped>
.login-container {
  width: 500px;
}
</style>