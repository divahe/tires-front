<script setup lang="ts">
import { useBookingDialogStore } from '@/stores/bookingDialogStore'
import { useSnackbarStore } from '@/stores/snackbarStore'
import { ref } from 'vue'
import type { BookingRequest } from '@/model/index'
import BookingService from '@/services/BookingService'
const bookingDialogStore = useBookingDialogStore()
const snackbarStore = useSnackbarStore()
const bookingService = new BookingService()
const userInput = ref('')

const submitBooking = async () => {
  bookingDialogStore.submitItem()
  const bookingRequest: BookingRequest = bookingDialogStore.bookingRequestFromSelected(userInput.value)
  bookingDialogStore.closeDialog()
  try {
    const response = await bookingService.makeBooking(bookingRequest)
    console.log(response.data)
    if (response.data) {
      snackbarStore.setSuccessBookingMessage(response.data)
    }
  } catch (error: any) {
    console.log(error)
    snackbarStore.setErrorBookingMessage(error)
  } finally {
    bookingDialogStore.clearCache()
  }
}
</script>
<template>
  <v-dialog v-model="bookingDialogStore.dialogVisible" max-width="500">
    <v-card>
      <v-card-title> Submit booking for {{ bookingDialogStore.selectedItem?.name }} </v-card-title>
      <v-card-text>
        <p><strong>Time:</strong> {{ bookingDialogStore.selectedItem?.timeString }}</p>
        <p><strong>Address:</strong> {{ bookingDialogStore.selectedItem?.address }}</p>
        <p><strong>Car Types:</strong> {{ bookingDialogStore.selectedItem?.carTypes }}</p>
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
        <v-btn color="primary" @click="bookingDialogStore.closeDialog"> Discard </v-btn>
        <v-btn color="primary" @click="submitBooking"> Submit </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
