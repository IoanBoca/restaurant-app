<template>
  <div v-if="userIsAdmin" class="reservations-admin-container">
    <admin-reservations></admin-reservations>
  </div>
  <div v-else class="reservations-container">
    <template v-if="tab === 'booking_details'">
      <p>Booking Details Form:</p>
      <booking-details-form />
    </template>

    <template v-if="tab === 'personal_details'">
      <p>Personal Details Form:</p>
      <personal-details-form />
    </template>
  </div>
</template>

<script>
import BookingDetailsForm from "@/components/BookingDetailsForm.vue";
import PersonalDetailsForm from "@/components/PersonalDetailsForm.vue";
import AdminReservations from "@/components/AdminReservations.vue";
import useModalStore from "@/stores/modal";
import useUserStore from "@/stores/user";
import { mapState } from "pinia";


export default {
  name: "ReservationsView",
  components: {
    BookingDetailsForm,
    PersonalDetailsForm,
    AdminReservations
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(useModalStore, ["tab"]),
    ...mapState(useUserStore, ["userIsAdmin"])
  }

};
</script>

<style>
.reservations-admin-container {
  margin-top: 64px;
  margin-left: 50px;
}

.reservations-container {
  margin-top: 64px;
  margin-left: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

</style>