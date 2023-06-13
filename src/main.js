import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import VeeValidatePlugin from "./includes/validation";
import { auth } from "./includes/firebase";
import "./includes/firebase";

import "./assets/base.css";
import "./assets/main.css";

import "vuetify/styles";
import { mdi } from "vuetify/lib/iconsets/mdi";
import { aliases, fa } from "vuetify/iconsets/fa";
import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css";

import { createVuetify } from "vuetify/lib/framework.mjs";
import * as components from "vuetify/lib/components/index.mjs";
import * as directives from "vuetify/lib/directives/index.mjs";
import { VDataTable } from "vuetify/labs/VDataTable";
import i18n from "./includes/i18n";

const vuetify = createVuetify({
  components: { ...components, VDataTable },
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
      fa
    }
  }
});

let app;

auth.onAuthStateChanged(() => {
  if (!app) {

    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    app.use(VeeValidatePlugin);
    app.use(vuetify);
    app.use(i18n);

    app.mount("#app");
  }
});
