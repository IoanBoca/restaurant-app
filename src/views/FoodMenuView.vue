<!--suppress ALL -->
<template>
  <div class="food-menu-container">
    <div v-for="item in categories">
      <v-chip variant="plain" :key="item.category" @click="expandMenu(item)">
        {{ item.category }}
      </v-chip>
      <v-card
        class="food-category-card"
        :key="item.category"
        max-width="344"
      >
        <v-img
          :src="getCategoryCardImagePath(item.category)"
          height="200px"
          cover
        ></v-img>

        <v-card-title>
          {{ item.category }}
        </v-card-title>

        <v-card-text>
          {{ item.description }}
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="orange-lighten-2"
            variant="text"
          >
            Explore
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
            :icon="item.show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            @click="expandMenu(item)"
          ></v-btn>
        </v-card-actions>

        <v-expand-transition>
          <div v-show="item.show">
            <v-divider></v-divider>

            <!--            <v-card-text v-text="item.description"></v-card-text>-->

            <div v-if="userIsAdmin">
              <admin-food-table :item="item"></admin-food-table>
            </div>
            <div v-else>
              <food-table :item="item"></food-table>
            </div>
          </div>
        </v-expand-transition>
      </v-card>
    </div>
  </div>
  <div v-if="userIsAdmin">
    <v-btn class="add-category-button">
      Add Category
      <v-dialog
        v-model="dialogCategory"
        activator="parent"
        width="auto"
      >
        <add-category-form></add-category-form>
        <v-btn class="close-category-button" block @click="dialogCategory = false">Close</v-btn>
      </v-dialog>
    </v-btn>

  </div>
</template>

<script>
import useUserStore from "@/stores/user";
import useFoodStore from "@/stores/food";
import { mapActions, mapState, mapWritableState } from "pinia";
import AddCategoryForm from "@/components/AddCategoryForm.vue";
import { categoriesLinksCollection, foodCollection } from "@/includes/firebase";
import FoodTable from "@/components/FoodTable.vue";
import AdminFoodTable from "@/components/AdminFoodTable.vue";

export default {
  name: "FoodMenuView",
  components: { FoodTable, AddCategoryForm, AdminFoodTable },
  data() {
    return {
      selectedCategory: null,
      show: false,
      dialogCategory: false
    };
  },
  methods: {
    ...mapActions(useFoodStore, ["getFoodData"]),
    expandMenu(item) {
      this.categories.forEach(x => {
        if (x.category === item.category) {
          item.show = !item.show;
        } else {
          x.show = false;
        }
      });
    },
    getCategoryCardImagePath(category) {
      let imageFilePath = "/img/food-cards/food-card-default.png";
      this.imageLinks.forEach((imageLink) => {
        if (imageLink.category == category) {
          imageFilePath = imageLink.link;
          return;
        }
      });
      return imageFilePath;
    }
  },
  computed: {
    ...mapState(useFoodStore, ["categories", "stateUpdated", "imageLinks"]),
    ...mapState(useUserStore, ["userIsAdmin"])
  },
  async created() {
    await this.getFoodData();
    for (let index = 0; index < this.categories.length; index++) {
      this.categories[index].show = false;
    }
  }
};
</script>

<style scoped>
.categories-main-container {
}

.v-chip--variant-plain {
  color: black;
  opacity: 1;
}

.v-chip--variant-plain:hover {
  color: rgb(253, 216, 53);
}

.food-menu-container {
  margin-top: 64px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
}

.food-category-card {
  max-width: 1000px !important;
  width: 500px;
  margin-bottom: 64px;
}

.add-category-button {
  margin: 20px;
  background: rgb(253, 216, 53);
}

.close-category-button {
  background: rgb(253, 216, 53);
}
</style>