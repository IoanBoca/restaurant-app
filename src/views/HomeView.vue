<template>
  <div class="home-view-container">
    <section class="greeting-section">
      <div class="greeting-contents">
        <h1 class="text-5xl">{{ $t("home.welcome") }}</h1>
        <p class="greeting-description"> {{ $t("home.description") }} </p>
      </div>
    </section>
    <div class="card-container">
      <v-card class="contact-card">
        <v-card-item>
          <v-card-title>Contact</v-card-title>
        </v-card-item>
        <v-card-text>
          <h2>{{ $t("home.contact.address") }}</h2>
          <p>Capu Campului, 713 A</p>
          <br>
          <h2>{{ $t("home.contact.hours") }}</h2>
          <p>{{ $t("home.contact.mtos") }} : 8 - 22</p>
          <br>
          <h2>Contact</h2>
          <p>0745271611</p>
        </v-card-text>
      </v-card>
    </div>
    <GoogleMapLoader />
  </div>
</template>

<script>
import GoogleMapLoader from "@/components/GoogleMapLoader.vue";

export default {
  name: "HomeView",
  components: {
    GoogleMapLoader
  }
};
</script>

<style>
.card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.greeting-section {
  height: 50vh;
  margin-top: 64px;
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("/img/bucovina-home.jpg");
  background-position: center;
  background-size: cover;
}

.greeting-contents {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  color: white;
}

.greeting-description {
  font-size: large;
  width: 800px;
}

.contact-card {
  position: relative;
  width: 800px;
  padding: 20px;
  margin: 20px;
}
</style>