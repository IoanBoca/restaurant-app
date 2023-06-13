<template>
  <v-btn class="delete-food-item-button-container">
    Delete
    <v-dialog
      v-model="dialogDeleteFoodItem"
      activator="parent"
      width="auto"
    >
      <v-card width="600px">
        <v-card-title>
          Are you sure you want to delete {{ foodItem.name }}?
        </v-card-title>
        <v-btn class="delete-food-item-button" @click="removeFoodItem(foodItem.name)">
          Yes
        </v-btn>
        <v-btn class="close-food-item-button" @click="dialogDeleteFoodItem = false">
          No
        </v-btn>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script>

import { mapActions } from "pinia";
import useFoodStore from "@/stores/food";

export default {
  name: "DeleteFoodItem",
  props: {
    foodItem: Object
  },
  data() {
    return {
      dialogDeleteFoodItem: false
    };
  },
  methods: {
    removeFoodItem(name) {
      console.log("Deleted " + name);
      this.dialogDeleteFoodItem = false;
      this.deleteFoodItem(name);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },
    ...mapActions(useFoodStore, ["deleteFoodItem"])
  }
};
</script>

<style scoped>
.delete-food-item-button-container {
  max-width: 300px;
  margin: 20px;
  background: rgb(253, 216, 53);
}

.close-food-item-button, .delete-food-item-button {
  margin: 20px;
  background: rgb(253, 216, 53);
}
</style>