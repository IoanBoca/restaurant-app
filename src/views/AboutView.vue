<template>
  <div class="about-container">
    <h1>This is an about page</h1>
    <GoogleMapLoader />
  </div>
</template>

<script>
import GoogleMapLoader from "@/components/GoogleMapLoader.vue";

export default {
  name: "AboutView",
  components: {
    GoogleMapLoader
  }
};
</script>

<style>
.about-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 64px;
}
</style>