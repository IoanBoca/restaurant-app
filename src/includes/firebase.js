import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";


const firebaseConfig = {
  apiKey: "AIzaSyA1KjWW2IzO4-EKZXgh8ut94IQfsJjJfSU",
  authDomain: "restaurant-ccd2a.firebaseapp.com",
  projectId: "restaurant-ccd2a",
  storageBucket: "restaurant-ccd2a.appspot.com",
  appId: "1:600158284444:web:fbea2a19c0d2f548f91b59"
};

firebase.initializeApp(firebaseConfig);


const db = firebase.firestore();

const auth = firebase.auth();

const storage = firebase.storage();

const reservationsCollection = db.collection("reservations");

const usersCollection = db.collection("users");

const foodCollection = db.collection("food-menu");

const foodCategoriesCollection = db.collection("food-menu-categories");

const categoriesLinksCollection = db.collection("categories-image-link");


export {
  auth,
  storage,
  reservationsCollection,
  usersCollection,
  foodCollection,
  foodCategoriesCollection,
  categoriesLinksCollection
};