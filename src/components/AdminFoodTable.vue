<template>
  <v-btn class="add-food-item-button">
    Add Food Item
    <v-dialog
      v-model="dialogAddFoodItem"
      activator="parent"
      width="auto"
    >
      <add-food-form :defaultCategory="item.category"></add-food-form>
      <v-btn class="close-food-item-button" block @click="dialogAddFoodItem = false">Close</v-btn>
    </v-dialog>
  </v-btn>
  <v-table>
    <thead>
    <tr>
      <th class="text-left">
        Name
      </th>
      <th class="text-left">
        Quantity
      </th>
      <th class="text-left">
        Price
      </th>
      <th class="text-left">
        Actions
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
      <td>{{ foodItem.price + " lei" }}</td>
      <td>
        <div class="actions-button-container">
          <edit-food-item :oldFoodItem="foodItem"></edit-food-item>
          <delete-food-item :foodItem="foodItem"></delete-food-item>
        </div>
      </td>
    </tr>
    </tbody>
  </v-table>
</template>

<script>
import { mapState } from "pinia";
import useFoodStore from "@/stores/food";
import AddFoodForm from "@/components/AddFoodForm.vue";
import EditFoodItem from "@/components/EditFoodItem.vue";
import DeleteFoodItem from "@/components/DeleteFoodItem.vue";

export default {
  name: "AdminFoodTable",
  props: {
    item: Object
  },
  computed: {
    ...mapState(useFoodStore, ["getFoodItemsByCategory"])
  },
  components: { DeleteFoodItem, EditFoodItem, AddFoodForm },
  data() {
    return {
      dialogAddFoodItem: false
    };
  }
};
</script>

<style scoped>


.actions-button-container {
  display: flex;
  flex-direction: row;
}

.add-food-item-button {
  margin: 20px;
  background: rgb(253, 216, 53);
}

.close-food-item-button {
  background: rgb(253, 216, 53);
}
</style>