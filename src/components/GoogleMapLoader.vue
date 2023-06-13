<template>
  <div class="google-map-container">
    <div id="reviews-widget">
      <iframe
        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAw5De14oZ2W1WAU03P8njS_jI0JgYqV9Q&q=place_id:ChIJNTvLxEeoNUcR_r2_Hyd7_NY"
        width="800" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
    </div>
    <v-card id="reviews">
      <h2>Reviews</h2>
      <ul>
        <li v-for="review in reviews" :key="review.time">
          <p>{{ review.rating }} stars - {{ review.text }}</p>
          <p>by {{ review.author_name }}</p>
        </li>
      </ul>
    </v-card>
    <div id="map"></div>
  </div>
</template>

<script>
// NEW API key:  AIzaSyAw5De14oZ2W1WAU03P8njS_jI0JgYqV9Q
import { Loader } from "@googlemaps/js-api-loader";

export default {
  name: "GoogleMapLoader",
  data() {
    return {
      reviews: []
    };
  },
  mounted() {
    const loader = new Loader({
      apiKey: "AIzaSyAw5De14oZ2W1WAU03P8njS_jI0JgYqV9Q",
      version: "weekly",
      libraries: ["places"]
    });

    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 47.530091, lng: 25.953517 },
        zoom: 13
      });

      const service = new google.maps.places.PlacesService(map);

      service.getDetails(
        {
          placeId: "ChIJNTvLxEeoNUcR_r2_Hyd7_NY",
          fields: ["reviews"]
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            this.reviews = place.reviews;
          }
        }
      );

    });
  }
};
</script>

<style scoped>
.google-map-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

#map {
  width: 800px;
  min-height: 400px;
}

#reviews {
  width: 800px;
  min-height: 400px;
  border: 1px solid #ddd;
  padding: 20px;
  margin-top: 20px;
}

#reviews h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 20px;
}

#reviews li {
  margin-bottom: 20px;
}

#reviews li p {
  margin: 0;
  font-size: 16px;
}

#reviews li p:first-of-type {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
}

#reviews li p:last-of-type {
  color: #555;
}
</style>

<!--const service = new google.maps.places.PlacesService(map);-->

<!--const request = {-->
<!--placeId: "ChIJNTvLxEeoNUcR_r2_Hyd7_NY",-->
<!--fields: ["reviews"]-->
<!--};-->

<!--service.getDetails(request, (place, status) => {-->
<!--if (status === google.maps.places.PlacesServiceStatus.OK) {-->
<!--this.reviews = place.reviews;-->
<!--}-->
<!--});-->