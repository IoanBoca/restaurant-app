import { defineStore } from "pinia";
import { foodCollection, foodCategoriesCollection, categoriesLinksCollection } from "@/includes/firebase";

export default defineStore("food", {
    state: () => ({
      categories: [],
      food: [],
      imageLinks: []
    }),
    actions: {
      async getFoodData() {
        await this.getCategories();
        this.food = [];
        this.imageLinks = [];

        this.categories.forEach(async (category) => {
          const foodItemsByCategory = [];

          // Here we get the Food Data
          const foodByCategory = await foodCollection.where("category", "==", category.category).get();
          foodByCategory.docs.forEach((doc) => {
            foodItemsByCategory.push(doc.data());
          });
          this.food.push({
            category: category.category,
            foodItems: foodItemsByCategory
          });

          // Here we get the categories image links
          const categoryLinks = await categoriesLinksCollection.where("category", "==", category.category).get();
          categoryLinks.docs.forEach((doc) => {
            this.imageLinks.push({
              category: category.category,
              link: doc.data().link
            });
          });
        });
      },
      async getCategories() {
        this.categories = [];
        const snapshot = await foodCategoriesCollection.get();
        snapshot.docs.forEach((doc) => {
          this.categories.push({
            category: doc.get("category"),
            description: doc.get("description")
          });
        });
      },
      // async getCategoryImageLinks() {
      //   await this.getCategories();
      //
      //   this.categories.forEach(async (category) => {
      //     const categoryLinks = await categoriesLinksCollection.where("category", "==", category).get();
      //     categoryLinks.docs.forEach((doc) => {
      //       this.imageLinks.push({
      //         category: category,
      //         link: doc.data().link
      //       });
      //     });
      //   });
      // },
      
      async addFoodItem(values, measure) {
        const foodItem = {
          category: values.category,
          name: values.name,
          price: values.price,
          quantity: values.quantity,
          measure: measure
        };
        await foodCollection.add(foodItem).then((docRef) => {
          console.log(`Food item '${values.name}' has been added. Document written with ID: ${docRef.id}`);
        });
      },
      async deleteFoodItem(name) {
        const foodRef = await foodCollection.where("name", "==", name).get();
        await foodRef.docs.forEach((docRef) => {
          foodCollection.doc(docRef.id).delete();
          console.log(`Food item '${name}' has been deleted. Document had ID: ${docRef.id}`);
        });
      },
      async editFoodItem(values, measure, oldName) {
        const foodRef = await foodCollection.where("name", "==", oldName).get();
        await foodRef.docs.forEach((docRef) => {
          foodCollection.doc(docRef.id).update({
            category: values.category,
            name: values.name,
            price: values.price,
            quantity: values.quantity,
            measure: measure
          });
          console.log(`Food item '${oldName}' has been updated. New name '${values.name}'. Document has ID: ${docRef.id}`);
        });
      },
      async addCategory(values) {
        const category = {
          category: values.category,
          description: values.description
        };
        await foodCategoriesCollection.add(category).then((docRef) => {
          console.log(`Category '${values.category}' has been added. Document written with ID: ${docRef.id}`);
        });
      },
      async addCategoryLink(category, downloadUrl) {
        const categoryLink = {
          category: category,
          link: downloadUrl
        };
        await categoriesLinksCollection.add(categoryLink).then((docRef) => {
          console.log(`The link ('${downloadUrl}') for the '${category}' image category has been added. Document written with ID: ${docRef.id}`);
        });
      },
      getFoodItemsByCategory(category) {
        let result = [];
        this.food.forEach((x) => {
          if (x.category === category) {
            result = x.foodItems;
          }
        });
        return result;
      }
    }
  }
);