<template>
  <v-btn class="edit-food-item-button">
    Edit
    <v-dialog
      v-model="dialogEditFoodItem"
      activator="parent"
      width="auto"
    >
      <div class="edit-food-form-container">
        <div class="text-white text-center font-bold p-4 rounded mb-4"
             v-if="editFoodShowAlert"
             :class="editFoodAlertVariant"
        >{{ editFoodAlertMsg }}
        </div>
        <v-card style="padding: 20px">
          <vee-form :validation-schema="addFoodSchema" :initial-values="oldFoodItem"
                    @submit="submitFoodItem">
            <!-- Category -->
            <div class="mb-3">
              <label class="inline-block mb-2">Category</label>
              <vee-field class="ml-10 border border-gray-300" as="select" name="category">
                <template v-for="category in categories" :key="category.category">
                  <option :value="category.category">{{ category.category }}</option>
                </template>
              </vee-field>
              <ErrorMessage class="text-red-600" name="category" />
            </div>
            <!-- Dish Name -->
            <div class="mb-3">
              <label class="inline-block mb-2">Name</label>
              <vee-field
                type="text"
                name="name"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Dish Name"
              />
              <ErrorMessage class="text-red-600" name="name" />
            </div>
            <!-- Unit of measurement -->
            <div class="mb-3">
              <label class="inline-block mb-2">Unit of measurement</label>
              <!-- class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded" -->
              <v-radio-group v-model="measure" mandatory>
                <v-radio label="Grame" value="gr"></v-radio>
                <v-radio label="Mililitri" value="ml"></v-radio>
                <v-radio label="Bucati" value="buc"></v-radio>
              </v-radio-group>
            </div>
            <!-- Quantity -->
            <div class="mb-3">
              <label class="inline-block mb-2">Quantity</label>
              <vee-field
                type="number"
                name="quantity"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Quantity"
              />
              <ErrorMessage class="text-red-600" name="quantity" />
            </div>
            <!-- Price -->
            <div class="mb-3">
              <label class="inline-block mb-2">Price</label>
              <vee-field
                type="number"
                name="price"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Price"
              />
              <ErrorMessage class="text-red-600" name="price" />
            </div>
            <button
              type="submit"
              class="block w-full bg-yellow-600 text-white py-1.5 px-3 rounded transition hover:bg-yellow-700"
              :disabled="editFoodInSubmission"
            >
              Edit Food Item
            </button>
          </vee-form>
        </v-card>
      </div>
      <v-btn class="close-food-item-button" block @click="dialogEditFoodItem = false">Close</v-btn>
    </v-dialog>
  </v-btn>
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import useFoodStore from "@/stores/food";

export default {
  name: "EditFoodItem",
  props: {
    oldFoodItem: Object
  },
  data() {
    return {
      dialogEditFoodItem: false,
      category: Object,
      measure: "gr",
      addFoodSchema: {
        category: "required",
        name: "required|min:3|max:100",
        quantity: "required",
        price: "required"
      },
      editFoodInSubmission: false,
      editFoodShowAlert: false,
      editFoodAlertVariant: "bg-blue-500",
      editFoodAlertMsg: "Please wait! We are updating the food item in the menu."
    };
  },
  computed: {
    ...mapWritableState(useFoodStore, ["getCategories", "categories"])
  },
  methods: {
    async submitFoodItem(values, { resetForm }) {
      this.editFoodShowAlert = true;
      this.editFoodInSubmission = true;
      this.editFoodAlertVariant = "bg-blue-500";
      this.editFoodAlertMsg = "Please wait! We are updating the food item in the menu.";

      try {
        await this.editFoodItem(values, this.measure, this.oldFoodItem.name);
      } catch (error) {
        console.log(error);
        this.editFoodInSubmission = false;
        this.editFoodAlertVariant = "bg-red-500";
        this.editFoodAlertMsg = "An unexpected error occurred. Please try again later.";
        return;
      }
      this.editFoodAlertVariant = "bg-green-500";
      this.editFoodAlertMsg = "Success! The food item has been updated.";

      resetForm();

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },
    ...mapActions(useFoodStore, ["editFoodItem"])
  }
};
</script>

<style scoped>
.close-food-item-button, .edit-food-item-button {
  margin: 20px;
  background: rgb(253, 216, 53);
}

.edit-food-form-container {
  width: 500px;
  margin: 50px;
}
</style>