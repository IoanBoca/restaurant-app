<template>
  <div class="booking-details-container">
    <div class="text-white text-center font-bold p-4 rounded mb-4"
         v-if="bookingShowAlert"
         :class="bookingAlertVariant"
    >{{ bookingAlertMsg }}
    </div>
    <v-card style="padding: 20px">
      <vee-form :validation-schema="schema"
                @submit="registerBookingDetails">

        <div class="mb-3">
          <label class="inline-block mb-2">Adults</label>
          <vee-field
            type="number"
            name="adults"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Number of adults"
          />
          <ErrorMessage class="text-red-600" name="adults" />
        </div>

        <div class="mb-3">
          <label class="inline-block mb-2">Children</label>
          <vee-field
            type="number"
            name="children"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Number of children"
          />
          <ErrorMessage class="text-red-600" name="children" />
        </div>

        <div class="mb-3">
          <label class="inline-block mb-2">Choose a date</label>
          <vee-field class="ml-10 border border-gray-300" type="date" name="booking_date"
                     @onchange="console.log($event)" />
          <ErrorMessage class="text-red-600" name="booking_date" />
        </div>

        <div class="mb-3">
          <label class="inline-block mb-2">Choose a time</label>
          <vee-field class="ml-10 border border-gray-300" as="select" name="booking_time">
            <template v-for="interval in timeIntervals" :key="interval">
              <option :value="interval">{{ interval }}</option>
            </template>
          </vee-field>
          <ErrorMessage class="text-red-600" name="booking_time" />
        </div>

        <div class="mb-3 pl-6">
          <vee-field
            type="checkbox"
            name="tos"
            value="1"
            class="w-4 h-4 float-left -ml-6 mt-1 rounded"
          />
          <label class="inline-block">Accept terms of service</label>
          <ErrorMessage class="text-red-600" name="tos" />
        </div>

        <button
          type="submit"
          class="block w-full bg-yellow-600 text-white py-1.5 px-3 rounded transition hover:bg-yellow-700"
        >
          Submit
        </button>

      </vee-form>
    </v-card>
  </div>
</template>

<script>
import useModalStore from "@/stores/modal";
import useReservationStore from "@/stores/reservation";
import { mapActions, mapWritableState } from "pinia";

export default {
  name: "BookingDetailsForm",
  data() {
    return {
      schema: {
        adults: "required",
        children: "required",
        booking_date: "required",
        booking_time: "required",
        tos: "tos"
      },
      tos: false,
      timeIntervals: ["08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00", "18:30", "20:00"],
      bookingInSubmission: false,
      bookingShowAlert: false,
      bookingAlertVariant: "bg-blue-500",
      bookingAlertMsg: "Please wait! Your reservation is being created."
    };
  },
  methods: {
    async registerBookingDetails(values) {
      this.bookingShowAlert = true;
      this.bookingInSubmission = true;
      this.bookingAlertVariant = "bg-blue-500";
      this.bookingAlertMsg = "Please wait! Your reservation is being created.";


      this.bookingDetailsInfo = {
        adults: parseInt(values.adults, 10),
        children: parseInt(values.children, 10),
        booking_date: values.booking_date,
        booking_time: values.booking_time
      };

      if (await this.isAvailable()) {
        this.bookingAlertVariant = "bg-green-500";
        this.bookingAlertMsg = `Success! We have seats available for you.`;

        setTimeout(() => {
          this.tab = "personal_details";
        }, 2000);
      } else {
        await this.closestAvailable();
        this.bookingInSubmission = false;
        this.bookingAlertVariant = "bg-red-500";
        this.bookingAlertMsg = `We are sorry, but that date and time is fully booked. Maybe you want to try to book a table on ${this.closestBookingDate} - ${this.closestBookingTime}`;
        return;
      }
    },
    ...mapActions(useReservationStore, ["isAvailable", "closestAvailable"])
  },
  computed: {
    ...mapWritableState(useModalStore, ["tab"]),
    ...mapWritableState(useReservationStore, ["bookingDetailsInfo", "closestBookingDate", "closestBookingTime"])
  }
};
</script>

<style>
.booking-details-container {
  width: 500px;
}
</style>