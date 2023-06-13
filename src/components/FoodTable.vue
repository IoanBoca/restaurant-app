<template>
  <v-table>
    <thead>
    <tr>
      <th class="text-left w-64">
        Name
      </th>
      <th class="text-left">
        Quantity
      </th>
      <th class="text-left">
        Price
      </th>
    </tr>
    </thead>
    <tbody>
    <tr
      v-for="foodItem in getFoodItemsByCategory(item.category)"
      :key="foodItem.name"
    >
      <td>{{ foodItem.name }}</td>
      <td>{{ foodItem.quantity + " " + foodItem.measure }}</td>
      <!--      <td>{{ foodItem.price + " lei" }}</td>-->
      <td>{{ $n(parseInt(foodItem.price), "currency") }}</td>
    </tr>
    </tbody>
  </v-table>
</template>

<script>
import { mapState } from "pinia";
import useFoodStore from "@/stores/food";

export default {
  name: "FoodTable",
  props: {
    item: Object
  },
  computed: {
    ...mapState(useFoodStore, ["getFoodItemsByCategory"])
  },
  data() {
    return {
      dialogEditFoodItem: false,
      dialogDeleteFoodItem: false
    };
  }
};
</script>

<style scoped>
.edit-food-item-button, .delete-food-item-button {
  margin: 20px;
  background: rgb(253, 216, 53);
}

.actions-button-container {
  display: flex;
  flex-direction: row;
}
</style>