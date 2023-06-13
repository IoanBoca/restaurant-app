import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import ro from "@/locales/ro.json";

export default createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en,
    ro
  },
  numberFormats: {
    en: {
      currency: {
        style: "currency",
        currency: "RON"
      }
    },
    ro: {
      currency: {
        style: "currency",
        currency: "RON"
      }
    }
  }
});