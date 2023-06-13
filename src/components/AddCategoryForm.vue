<template>
  <div class="add-category-form-container">
    <div class="text-white text-center font-bold p-4 rounded mb-4"
         v-if="addCategoryShowAlert"
         :class="addCategoryAlertVariant"
    >{{ addCategoryAlertMsg }}
    </div>
    <v-card style="padding: 20px">
      <vee-form :validation-schema="addCategorySchema"
                @submit="submitCategory">
        <!-- Category -->
        <div class="mb-3">
          <label class="inline-block mb-2">Category</label>
          <vee-field
            type="text"
            name="category"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Category Name"
          />
          <ErrorMessage class="text-red-600" name="category" />
        </div>
        <!-- Description -->
        <div class="mb-3">
          <label class="inline-block mb-2">Description</label>
          <vee-field
            type="text"
            name="description"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Description"
          />
          <ErrorMessage class="text-red-600" name="description" />
        </div>
        <!-- Image Upload -->
        <div class="image-upload-container">
          <img :src="previewImage" class="uploading-image" />
          <input type="file" accept="image/*" @change=uploadImage>
        </div>

        <button
          type="submit"
          class="block w-full bg-yellow-600 text-white py-1.5 px-3 rounded transition hover:bg-yellow-700"
          :disabled="addCategoryInSubmission"
        >
          Add Category
        </button>
      </vee-form>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import useFoodStore from "@/stores/food";
import { storage } from "@/includes/firebase";

export default {
  name: "AddCategoryForm",
  data() {
    return {
      addCategorySchema: {
        category: "required|min:3|max:20",
        description: "required|min:3|max:200"
      },
      addCategoryInSubmission: false,
      addCategoryShowAlert: false,
      addCategoryAlertVariant: "bg-blue-500",
      addCategoryAlertMsg: "Please wait! We are adding the category item in the menu.",
      previewImage: null,
      imageToUpload: null,
      noFileUploaded: true
    };
  },
  methods: {
    async submitCategory(values, { resetForm }) {
      this.addCategoryShowAlert = true;
      this.addCategoryInSubmission = true;
      this.addCategoryAlertVariant = "bg-blue-500";
      this.addCategoryAlertMsg = "Please wait! We are adding the category item in the menu.";

      if (this.noFileUploaded) {
        this.addCategoryInSubmission = false;
        this.addCategoryAlertVariant = "bg-red-500";
        this.addCategoryAlertMsg = "You must add an image before you want to submit the new category.";
        return;
      }

      try {
        await this.addCategory(values, this.measure);
        const storageRef = storage.ref();
        const currentImageExtension = this.imageToUpload.name.split(".").pop();
        const foodCardsRef = storageRef.child(`food-cards/food-card-${values.category}.${currentImageExtension}`);
        const uploadTask = foodCardsRef.put(this.imageToUpload);
        uploadTask.on("state_changed",
          (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            console.log(error);
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              console.log("File available at", downloadURL);
              this.addCategoryLink(values.category, downloadURL);
            });
          });
      } catch (error) {
        console.log(error);
        this.addCategoryInSubmission = false;
        this.addCategoryAlertVariant = "bg-red-500";
        this.addCategoryAlertMsg = "An unexpected error occurred. Please try again later.";
        return;
      }
      this.addCategoryAlertVariant = "bg-green-500";
      this.addCategoryAlertMsg = "Success! The category item has been added.";

      resetForm();

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },
    uploadImage(event) {
      this.previewImage = null;
      this.noFileUploaded = !event.target.files.length;
      this.imageToUpload = event.target.files[0];
      // const image = event.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(this.imageToUpload);
      reader.onload = event => {
        this.previewImage = event.target.result;
      };
    },
    ...mapActions(useFoodStore, ["addCategory", "addCategoryLink"])
  }
};
</script>

<style scoped>
.add-category-form-container {
  width: 500px;
  margin: 50px;
}

.uploading-image {
  display: flex;
}

.image-upload-container {
  margin: 15px;
}
</style>