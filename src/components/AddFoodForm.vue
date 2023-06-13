<template>
  <div class="add-food-form-container">
    <div class="text-white text-center font-bold p-4 rounded mb-4"
         v-if="addFoodShowAlert"
         :class="addFoodAlertVariant"
    >{{ addFoodAlertMsg }}
    </div>
    <v-card style="padding: 20px">
      <vee-form :validation-schema="addFoodSchema" :initial-values="initialCategory"
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
          :disabled="addFoodInSubmission"
        >
          Add Food Item
        </button>
      </vee-form>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import useFoodStore from "@/stores/food";

export default {
  name: "AddFoodForm",
  props: {
    defaultCategory: String
  },
  data() {
    return {
      category: Object,
      measure: "gr",
      addFoodSchema: {
        category: "required",
        name: "required|min:3|max:100",
        quantity: "required",
        price: "required"
      },
      initialCategory: {
        category: this.defaultCategory
      },
      addFoodInSubmission: false,
      addFoodShowAlert: false,
      addFoodAlertVariant: "bg-blue-500",
      addFoodAlertMsg: "Please wait! We are adding the food item in the menu."
    };
  },
  computed: {
    ...mapWritableState(useFoodStore, ["getCategories", "categories"])
  },
  methods: {
    async submitFoodItem(values, { resetForm }) {
      this.addFoodShowAlert = true;
      this.addFoodInSubmission = true;
      this.addFoodAlertVariant = "bg-blue-500";
      this.addFoodAlertMsg = "Please wait! We are adding the food item in the menu.";

      try {
        await this.addFoodItem(values, this.measure);
      } catch (error) {
        console.log(error);
        this.addFoodInSubmission = false;
        this.addFoodAlertVariant = "bg-red-500";
        this.addFoodAlertMsg = "An unexpected error occurred. Please try again later.";
        return;
      }
      this.addFoodAlertVariant = "bg-green-500";
      this.addFoodAlertMsg = "Success! The food item has been added.";

      resetForm();

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },
    ...mapActions(useFoodStore, ["addFoodItem"])
  }
};
</script>

<style scoped>
.add-food-form-container {
  width: 500px;
  margin: 50px;
}
</style>