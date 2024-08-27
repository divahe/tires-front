import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { FlatBooking, BookingRequest } from '@/model/index'

export const useBookingDialogStore = defineStore('dialog', () => {
  const dialogVisible = ref(false)
  const selectedItem = ref<FlatBooking | null>(null)
  const submittedItem = ref<FlatBooking | null>(null)

  const showDialog = (item: FlatBooking) => {
    dialogVisible.value = true
    selectedItem.value = item
  }
  const closeDialog = () => {
    dialogVisible.value = false
  }

  const clearCache = () => {
    submittedItem.value = null
    selectedItem.value = null
  }

  const submitItem = () => {
    submittedItem.value = selectedItem.value
  }

  const bookingRequestFromSelected = (userInput: string) => {
    const details = { contactInformation: userInput }
    const bookingRequest: BookingRequest = {
      name: selectedItem.value?.name ?? null,
      identifier: selectedItem.value?.identifier ?? null,
      id: selectedItem.value?.id?.toString() ?? null,
      inputs: details
    }
    console.log(bookingRequest)
    return bookingRequest
  }

  return {
    showDialog,
    closeDialog,
    dialogVisible,
    selectedItem,
    submittedItem,
    bookingRequestFromSelected,
    clearCache,
    submitItem
  }
})
