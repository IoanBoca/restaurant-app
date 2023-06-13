import { defineStore } from "pinia";

export default defineStore("modal", {
  state: () => ({
    tab: "booking_details",
    auth_tab: "login"
  }),
  getters: {
    hiddenClass(state) {
      return !state.isOpen ? "hidden" : "";
    }
  }
});