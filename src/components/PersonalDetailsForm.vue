<template>
  <div class="personal-details-container">
    <div class="text-white text-center font-bold p-4 rounded mb-4"
         v-if="booking_show_alert"
         :class="booking_alert_variant"
    >{{ booking_alert_msg }}
    </div>
    <v-card style="padding: 20px">
      <vee-form :validation-schema="schema"
                @submit="register_personal_details">

        <div class="mb-3">
          <label class="inline-block mb-2">How should we address you?</label>
          <vee-field as="select"
                     name="addressing"
                     class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="Mr">Mr</option>
            <option value="Ms">Ms</option>
            <option value="Mrs">Mrs</option>
            <option value="Mdm">Mdm</option>
          </vee-field>
          <ErrorMessage class="text-red-600" name="addressing" />
        </div>

        <div class="mb-3">
          <label class="inline-block mb-2">First name</label>
          <vee-field
            type="text"
            name="first_name"
            placeholder="First Name"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          />
          <ErrorMessage class="text-red-600" name="first_name" />
        </div>

        <div class="mb-3">
          <label class="inline-block mb-2">Last name</label>
          <vee-field
            type="text"
            name="last_name"
            placeholder="Last Name"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          />
          <ErrorMessage class="text-red-600" name="last_name" />
        </div>

        <div class="mb-3">
          <label class="inline-block mb-2">Email</label>
          <vee-field
            type="email"
            name="email"
            placeholder="Email Address"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          />
          <ErrorMessage class="text-red-600" name="email" />
        </div>

        <div class="mb-3">
          <label class="inline-block mb-2">Message</label>
          <vee-field
            type="text"
            name="message"
            placeholder="Message (Maximum 85 characters.)"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          />
          <ErrorMessage class="text-red-600" name="message" />
        </div>

        <button
          type="button"
          @click="back_to_booking_details"
          class="block mt-6 w-full bg-orange-600 text-white py-1.5 px-3 rounded transition hover:bg-orange-700"
        >
          Back
        </button>

        <button
          type="submit"
          :disabled="booking_in_submission"
          class="block mt-6 w-full bg-yellow-600 text-white py-1.5 px-3 rounded transition hover:bg-yellow-700"
        >
          Confirm Booking
        </button>
      </vee-form>
    </v-card>
  </div>

</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import useModalStore from "@/stores/modal";
import useReservationStore from "@/stores/reservation";


export default {
  name: "PersonalDetailsForm",
  data() {
    return {
      schema: {
        addressing: "required",
        first_name: "required|alpha_spaces",
        last_name: "required|alpha_spaces",
        email: "required|email",
        message: "max:85"
      },
      booking_in_submission: false,
      booking_show_alert: false,
      booking_alert_variant: "bg-blue-500",
      booking_alert_msg: "Please wait! Your reservation is being created."
    };
  },
  methods: {
    async register_personal_details(values) {
      let booking_id;

      this.booking_show_alert = true;
      this.booking_in_submission = true;
      this.booking_alert_variant = "bg-blue-500";
      this.booking_alert_msg = "Please wait! Your booking is being created.";

      this.personal_details_info = { ...values };

      try {
        booking_id = await this.completeBooking();
        // booking_id is undefined, but I don't know why
        // console.log(booking_id);
      } catch (error) {
        console.log(error);
        this.booking_in_submission = false;
        this.booking_alert_variant = "bg-red-500";
        this.booking_alert_msg = "An unexpected error occured. Please try again later.";
        return;
      }

      this.booking_alert_variant = "bg-green-500";
      this.booking_alert_msg = `Success! Your booking has been created. It has the id: ${booking_id}`;

      setTimeout(() => {
        window.location.reload();
      }, 8000);
    },
    back_to_booking_details() {
      this.tab = "booking_details";
    },
    ...mapActions(useReservationStore, {
      completeBooking: "book"
    })
  },
  computed: {
    ...mapWritableState(useModalStore, ["tab"]),
    ...mapWritableState(useReservationStore, ["personal_details_info"])
  }
};
</script>

<style>
.personal-details-container {
  width: 500px;
  margin: 50px;
}
</style>