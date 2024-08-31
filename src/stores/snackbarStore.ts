import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useBookingStore } from '@/stores/bookingStore'
import type { SnackbarState, Errors, BookingResponse } from '@/model/index'
import dayjs from 'dayjs'

export const useSnackbarStore = defineStore('snackbar', () => {
  const bookingStore = useBookingStore()
  const bookingSnackbar = ref<SnackbarState>({
    show: false,
    time: '',
    name: '',
    address: '',
    id: '',
    info: '',
    type: ''
  })
  const listLoadingError = ref({
    show: false,
    errors: {}
  })

  const setSuccessBookingMessage = (response: BookingResponse) => {
    if (bookingStore.submittedItem != null) {
      ;(bookingSnackbar.value.time = response.time
        ? dayjs(response.time).format('YYYY-MM-DD HH:mm')
        : bookingStore.submittedItem.timeString),
        (bookingSnackbar.value.name = response.mastery.name),
        (bookingSnackbar.value.address = response.mastery.address),
        (bookingSnackbar.value.info = response.info),
        (bookingSnackbar.value.id = response.id ? response.id : ''),
        (bookingSnackbar.value.type = 'success')
      bookingSnackbar.value.show = true
    }
  }

  const setErrorBookingMessage = (error: any) => {
    if (bookingStore.submittedItem != null) {
      ;(bookingSnackbar.value.time = bookingStore.submittedItem.timeString),
        (bookingSnackbar.value.name = bookingStore.submittedItem.name),
        (bookingSnackbar.value.address = bookingStore.submittedItem.address),
        (bookingSnackbar.value.info = error.info),
        (bookingSnackbar.value.id = ''),
        (bookingSnackbar.value.type = 'error')
      bookingSnackbar.value.show = true
    }
  }

  const setListLoadingError = (errors: Errors) => {
    listLoadingError.value = {
      errors,
      show: true
    }
  }

  const removeListLoadingError = () => {
    listLoadingError.value = {
      errors: {},
      show: false
    }
  }

  return {
    bookingSnackbar,
    listLoadingError,
    setErrorBookingMessage,
    setListLoadingError,
    removeListLoadingError,
    setSuccessBookingMessage
  }
})
