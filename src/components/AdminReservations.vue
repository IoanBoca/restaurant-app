<template>
  <div class="reservations-container">
    <p>Admin reservations</p>
    <v-card style="padding: 20px">
      <vee-form :validation-schema="schema"
                @submit="submitDateTime">
        <div class="mb-3">
          <label class="inline-block mb-2">Choose a date</label>
          <vee-field class="ml-10 border border-gray-300" type="date" name="booking_date"
                     @onchange="console.log($event)" />
          <ErrorMessage class="text-red-600" name="booking_date" />
        </div>

        <button
          type="submit"
          class="block w-full bg-yellow-600 text-white py-1.5 px-3 rounded transition hover:bg-yellow-700"
        >
          Submit
        </button>
      </vee-form>
    </v-card>
    <v-card style="padding: 20px">
      <v-card-title>
        {{ displayReservationsMessage }}
      </v-card-title>
      <div v-for="(item, index) in reservationsForDate" :key="index">
        <div v-if="getNumberOfNeededTablesForReservation(item) > 0">
          <input type="radio" :value="index" v-model="nrOfSelectedReservation">
          {{ item.booking_time + " " + item.last_name + " " + item.first_name + " " + getNumberOfNeededTablesForReservation(item).toString()
          }}
        </div>
      </div>
    </v-card>
    <div class="tables-container">
      <div v-for="tableNumber in 10" :key="tableNumber" class="table">
        <v-card color="yellow" height="200px" width="100px" @click="clickedTable(tableNumber)">
          <v-card-subtitle>
            Table {{ tableNumber }}
          </v-card-subtitle>
          <div v-for="(item, index) in reservationsForDate" :key="index">
            <div v-if="checkTableAssignedToReservation(tableNumber, item)">
              <p>{{ item.booking_time + " " + item.last_name + " " + item.first_name }}</p>
            </div>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import useReservationStore from "@/stores/reservation";
import { mapActions, mapWritableState } from "pinia";

export default {
  name: "AdminReservations",
  data() {
    return {
      schema: {
        booking_date: "required"
      },
      timeIntervals: ["08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00", "18:30", "20:00"],
      reservationsForDate: [],
      nrOfSelectedReservation: null,
      displayReservationsMessage: "Reservations will appear here.",
      dialogAssignTable: false
    };
  },
  methods: {
    submitDateTime(values) {
      this.nrOfSelectedReservation = null;
      this.reservationsForDate = [];
      this.reservationsForDate = this.getReservationsForDate(values.booking_date);
      // this.reservationsForDate.forEach((reservation) => {
      //   console.log(reservation.first_name + " " + reservation.last_name);
      // });
      // resetForm();
    },
    getNumberOfAssignedTablesForReservation(reservation) {
      const assignedTables = reservation.assignedTables.split(" ");
      return assignedTables.length;
    },
    getNumberOfNeededTablesForReservation(reservation) {
      if (reservation.assignedTables == "") {
        return reservation.number_of_tables_needed;
      }
      const assignedTables = reservation.assignedTables.split(" ");
      return reservation.number_of_tables_needed - assignedTables.length;
    },
    getReservationsForDate(booking_date) {
      const result = [];
      this.reservations.forEach((reservation) => {
        if (reservation.booking_date == booking_date) {
          result.push(reservation);
        }
      });
      if (result.length !== 0) {
        this.displayReservationsMessage = "Reservations for " + booking_date.toString();
      } else {
        this.displayReservationsMessage = "There are no reservations for " + booking_date.toString();
      }
      return result;
    },
    checkTableAssignedToReservation(tableNumber, reservation) {
      const assignedTables = reservation.assignedTables.split(" ");
      for (var i = 0; i < assignedTables.length; i++) {
        if (tableNumber == assignedTables[i]) {
          return true;
        }
      }
      return false;
    },
    async clickedTable(tableNumber) {
      if (this.nrOfSelectedReservation == null) {
        alert("You must select a reservation before trying to assign it to a table.");
      } else {
        const selectedReservation = this.reservationsForDate[this.nrOfSelectedReservation];
        if (!this.checkTableIsFree(tableNumber, selectedReservation.booking_time)) {
          alert("This table is already booked. You can not assign a reservation to it.");
        } else {
          alert(`You are trying to assign to table number ${tableNumber} the reservation ${selectedReservation.booking_date} ${selectedReservation.booking_time} ${selectedReservation.first_name} ${selectedReservation.last_name}.`);
          await this.assignTableToReservation(tableNumber, selectedReservation);
        }
      }
    },
    checkTableIsFree(tableNumber, bookingTime) {
      for (var i = 0; i < this.reservationsForDate.length; i++) {
        if (this.checkTableAssignedToReservation(tableNumber, this.reservationsForDate[i])) {
          if (this.reservationsForDate[i].booking_time === bookingTime) {
            return false;
          }
        }
      }
      return true;
    },
    ...mapActions(useReservationStore, ["getReservations", ["assignTableToReservation"]])
  },
  computed: {
    ...mapWritableState(useReservationStore, ["reservations"])
  },
  async created() {
    await this.getReservations();
    this.reservationsForDate = [];
  }
};
</script>

<style scoped>
.reservations-container {
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}

.tables-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

.table {
  padding: 10px;
}
</style>