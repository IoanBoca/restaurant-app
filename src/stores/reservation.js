import { defineStore } from "pinia";
import { reservationsCollection } from "@/includes/firebase";

export default defineStore("reservation", {
  state: () => ({
    bookingDetailsInfo: {
      adults: "",
      children: "",
      booking_date: "",
      booking_time: ""
    },
    personal_details_info: {
      addressing: "",
      first_name: "",
      last_name: "",
      email: "",
      message: ""
    },
    numberOfTablesNeeded: null,
    tablesOf5InTheRestaurant: 10,
    closestBookingDate: null,
    closestBookingTime: null,
    reservations: []
  }),
  actions: {
    async book() {
      await reservationsCollection.add({
        booking_date: this.bookingDetailsInfo.booking_date,
        booking_time: this.bookingDetailsInfo.booking_time,
        adult_pax: this.bookingDetailsInfo.adults,
        child_pax: this.bookingDetailsInfo.children,
        last_name: this.personal_details_info.last_name,
        first_name: this.personal_details_info.first_name,
        addressing: this.personal_details_info.addressing,
        email: this.personal_details_info.email,
        message: this.personal_details_info.message,
        number_of_tables_needed: this.numberOfTablesNeeded,
        assignedTables: ""
      }).then((docRef) => {
        console.log(`Booking for ${this.personal_details_info.first_name}. Document written with ID: ${docRef.id}`);

        const accountSid = "AC3b4a16c3393d296988f409c3c83103b5";
        const authToken = "8695126590a5dd392fc1106843a17198";

        const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
        const data = new FormData();
        data.append("To", "+40747962375");
        data.append("From", "+16073182672");
        data.append("Body", `Hello! Congratulations for booking a table at Acasa in Bucovina. You have a booking on ${this.bookingDetailsInfo.booking_date} at ${this.bookingDetailsInfo.booking_time}.`);

        const headers = {
          Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`
        };

        fetch(url, {
          method: "POST",
          headers,
          body: data
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Message sent", data);
          })
          .catch((error) => {
            console.error("Error sending message", error);
          });
        
        return docRef.id;
      });
    },
    async isAvailable() {
      return this._isAvailable(this.bookingDetailsInfo.adults, this.bookingDetailsInfo.children, this.bookingDetailsInfo.booking_date, this.bookingDetailsInfo.booking_time);
    },
    async _isAvailable(adultsNumber, childrenNumber, bookingDate, bookingTime) {
      let tablesAvailableAtDatetime = this.tablesOf5InTheRestaurant;
      if ((adultsNumber + childrenNumber) % 5 === 0) {
        this.numberOfTablesNeeded = Math.floor(((adultsNumber + childrenNumber) / 5));
      } else {
        this.numberOfTablesNeeded = Math.floor(((adultsNumber + childrenNumber) / 5)) + 1;
      }

      const snapshot = await reservationsCollection
        .where("booking_date", "==", bookingDate)
        .where("booking_time", "==", bookingTime)
        .get();

      snapshot.docs.forEach((doc) => {
        const docNumberOfTablesNeeded = doc.get("number_of_tables_needed");
        tablesAvailableAtDatetime -= docNumberOfTablesNeeded;
      });

      return this.numberOfTablesNeeded <= tablesAvailableAtDatetime;
    },
    async closestAvailable() {
      // if the closest date and time available is exactly the time requested for the reservation
      this.closestBookingDate = "";
      this.closestBookingTime = "";
      if (await this.isAvailable()) {
        this.closestBookingDate = this.bookingDetailsInfo.booking_date;
        this.closestBookingTime = this.bookingDetailsInfo.booking_time;
        return;
      } else {
        let timeIntervals = ["08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00", "18:30", "20:00"];
        for (let i = 0; i < timeIntervals.length; i++) {
          if (timeIntervals[i] != this.bookingDetailsInfo.booking_time) {
            if (await this._isAvailable(this.bookingDetailsInfo.adults, this.bookingDetailsInfo.children, this.bookingDetailsInfo.booking_date, timeIntervals[i])) {
              this.closestBookingDate = this.bookingDetailsInfo.booking_date;
              this.closestBookingTime = timeIntervals[i];
              break;
            }
          }
        }
      }

    },
    async getReservations() {
      this.reservations = [];
      const snapshot = await reservationsCollection.get();
      snapshot.docs.forEach((doc) => {
        this.reservations.push(doc.data());
      });
    },
    async assignTableToReservation(tableNumber, reservation) {
      const snapshot = await reservationsCollection
        .where("booking_date", "==", reservation.booking_date)
        .where("booking_time", "==", reservation.booking_time)
        .where("assignedTables", "==", reservation.assignedTables)
        .where("adult_pax", "==", reservation.adult_pax)
        .where("child_pax", "==", reservation.child_pax)
        .where("email", "==", reservation.email)
        .where("first_name", "==", reservation.first_name)
        .where("last_name", "==", reservation.last_name)
        .where("number_of_tables_needed", "==", reservation.number_of_tables_needed)
        .get();

      let oldAssignedTables;

      await snapshot.docs.forEach((doc) => {
        oldAssignedTables = doc.get("assignedTables");
        let newAssignedTables;
        if (oldAssignedTables == "") {
          newAssignedTables = tableNumber.toString();
        } else {
          newAssignedTables = oldAssignedTables + " " + tableNumber.toString();
        }
        reservationsCollection.doc(doc.id).update({
          assignedTables: newAssignedTables
        });
        console.log(`Reservation '${reservation.booking_time}' has been assigned a table. New table '${tableNumber}' added to '${oldAssignedTables}'. Now it is: ${newAssignedTables}`);
      });


    }
  }
});