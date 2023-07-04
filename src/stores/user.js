/* eslint-disable */
import { defineStore } from "pinia";
import { auth, usersCollection } from "@/includes/firebase";

export default defineStore("user", {
  state: () => ({
    userLoggedIn: false,
    userIsAdmin: false
  }),
  actions: {
    async register(values) {
      const userCred = await auth.createUserWithEmailAndPassword(
        values.email, values.password
      );

      await usersCollection.doc(userCred.user.uid).set({
        name: values.name,
        email: values.email,
        age: values.age
      });

      await userCred.user.updateProfile({
        displayName: values.name
      });

      this.userLoggedIn = true;
    },
    async authenticate(values) {
      const userCred = await auth.signInWithEmailAndPassword(values.email, values.password);

      this.currentUserCredentials = userCred.user.uid;
      await usersCollection.doc(userCred.user.uid).get().then((doc) => {
        if (doc.data().isAdmin) {
          this.userIsAdmin = true;
          // The user userCred.user.displayName has admin attributes.
        } else {
          // The user userCred.user.displayName has regular user attributes.
          this.userIsAdmin = false;
        }
      });

      this.userLoggedIn = true;
    },
    async signOut() {
      await auth.signOut();

      this.userIsAdmin = false;
      this.userLoggedIn = false;
    }
  }
});

