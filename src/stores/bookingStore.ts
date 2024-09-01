import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { FlatBooking, BookingRequest, Booking } from '@/model/index'
import { useSnackbarStore } from '@/stores/snackbarStore'
import BookingService from '@/services/BookingService'
import dayjs from 'dayjs'

export const useBookingStore = defineStore('dialog', () => {
  const snackbarStore = useSnackbarStore()
  const dialogVisible = ref(false)
  const selectedItem = ref<FlatBooking | null>(null)
  const submittedItem = ref<FlatBooking | null>(null)
  const flatBookings = ref<FlatBooking[]>([])

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
    loadBookings()
  }

  const submitItem = () => {
    submittedItem.value = selectedItem.value
  }

  
const today = new Date()
today.setHours(0, 0, 0, 0)
const minDate = ref(dayjs(today))
const maxDate = ref(dayjs(today).add(31, 'day'))

const loadBookings = async () => {
  const bookingService = new BookingService()
  const response = await bookingService.getBookings()

  if (response.data?.bookings) {
    flatBookings.value = flattenBookings(response.data.bookings)
    snackbarStore.removeListLoadingError()
  }

  if (response.data?.errors) {
    snackbarStore.setListLoadingError(response.data?.errors)
  }
  if (response.error) {
    snackbarStore.setListLoadingError({Server: response.error})
  }
}

const flattenBookings = (bookings: Booking[]) => {
  return bookings
    .map((booking: Booking) => {
      const formattedTime = dayjs(booking.time).format('YYYY-MM-DD HH:mm')
      return {
        uuid: booking.uuid,
        identifier: booking.identifier,
        id: booking.id,
        available: booking.available,
        timeString: formattedTime,
        time: dayjs(booking.time),
        name: booking.mastery.name,
        address: booking.mastery.address,
        carTypes: booking.mastery.carTypes.join(', ')
      }
    })
    .filter((booking) => {
      const bookingDate = dayjs(booking.time)
      return bookingDate.isAfter(minDate.value) && bookingDate.isBefore(maxDate.value)
    })
    .sort((a, b) => a.time.diff(b.time))
}

  const bookingRequestFromSelected = (userInput: string) => {
    const details = { contactInformation: userInput }
    const bookingRequest: BookingRequest = {
      name: selectedItem.value?.name ?? null,
      identifier: selectedItem.value?.identifier ?? null,
      id: selectedItem.value?.id?.toString() ?? null,
      inputs: details
    }
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
    submitItem,
    loadBookings,
    flatBookings
  }
})
