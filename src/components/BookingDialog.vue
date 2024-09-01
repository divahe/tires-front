<script setup lang="ts">
import { useBookingStore } from '@/stores/bookingStore'
import { useSnackbarStore } from '@/stores/snackbarStore'
import { ref } from 'vue'
import type { BookingRequest } from '@/model/index'
import BookingService from '@/services/BookingService'
const bookingStore = useBookingStore()
const snackbarStore = useSnackbarStore()
const bookingService = new BookingService()
const userInput = ref('')

const submitBooking = async () => {
  bookingStore.submitItem()
  const bookingRequest: BookingRequest = bookingStore.bookingRequestFromSelected(userInput.value)
  bookingStore.closeDialog()

  try {
    const response = await bookingService.makeBooking(bookingRequest)
    if (response.data) {
      snackbarStore.setSuccessBookingMessage(response.data)
    } else if (response.status == 0) {
      console.log("GOTCHA")
    }
  } catch (error: any) {
    snackbarStore.setErrorBookingMessage(error)
  } finally {
    bookingStore.clearCache()
  }
}
</script>
<template>
  <v-dialog v-model="bookingStore.dialogVisible" max-width="500">
    <v-card>
      <v-card-title> Submit booking for {{ bookingStore.selectedItem?.name }} </v-card-title>
      <v-card-text>
        <p><strong>Time:</strong> {{ bookingStore.selectedItem?.timeString }}</p>
        <p><strong>Address:</strong> {{ bookingStore.selectedItem?.address }}</p>
        <p><strong>Car Types:</strong> {{ bookingStore.selectedItem?.carTypes }}</p>
        <p>
          <strong>Your contact details:</strong
          ><v-text-field
            v-model="userInput"
            label="Enter your contact details"
            outlined
          ></v-text-field>
        </p>
        <p>
          <strong
            >Please wait for the booking confirmation notice on this page to verify booking was
            accepted.</strong
          >
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="bookingStore.closeDialog"> Discard </v-btn>
        <v-btn color="primary" @click="submitBooking"> Submit </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
