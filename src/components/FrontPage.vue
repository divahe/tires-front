<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useSnackbarStore } from '@/stores/snackbarStore'
import BookingService from '@/services/BookingService'
import BookingSnackBar from '@/components/BookingSnackbar.vue'
import ListLoadingSnackBar from '@/components/ListLoadingSnackbar.vue'
import type { Booking, FlatBooking, BookingRequest } from '@/model/index'
import dayjs from 'dayjs'
const snackbarStore = useSnackbarStore()
const bookingService = new BookingService()
const bookings = ref<FlatBooking[] | []>([])

const getToday = () => {
  const today = new Date()
  today.setHours(0)
  today.setMinutes(0)
  today.setSeconds(0)
  return today
}

const timeValues = ['timeStart', 'timeEnd']
const userInput = ref('')
const today = getToday()
const minDate = ref(dayjs(today))
const maxDate = ref(dayjs(today.setDate(today.getDate() + 31)))
const multiSearch = ref<{ [key: string]: string }>({})
const selectedItem = ref<FlatBooking | null>(null)
const submittedItem = ref<FlatBooking | null>(null)
const bookingDialog = ref(false)
const headers = ref([
  { title: 'Time', value: 'timeString', key: 'time' },
  { title: 'Name', value: 'name', key: 'name' },
  { title: 'Address', value: 'address', key: 'address' },
  { title: 'CarTypes', value: 'carTypes', key: 'carTypes' }
])
const loadBookings = async () => {
  const response = await bookingService.getBookings()
  if (response.data?.bookings) {
    bookings.value = flattenBookings(response.data.bookings)
  }
  if (response.data?.errors) {
    snackbarStore.setListLoadingError(response.data?.errors)
  }
}

const closeDialog = () => {
  bookingDialog.value = false
}

const flattenBookings = (bookings: Booking[]) => {
  const result = bookings
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
      const withinStartDate = bookingDate.diff(minDate.value)
      const withinEndDate = maxDate.value.diff(bookingDate)
      return withinStartDate > 0 && withinEndDate > 0
    })
  result.sort((a, b) => a.time.diff(b.time))
  return result
}

const filteredData = computed(() => {
  const timeStart = multiSearch.value.timeStart ? dayjs(multiSearch.value.timeStart) : null
  const timeEnd = multiSearch.value.timeEnd ? dayjs(multiSearch.value.timeEnd).add(1, 'day') : null

  if (Object.keys(multiSearch.value).length > 0) {
    return bookings.value.filter((item: FlatBooking) => {
      const bookingDate = dayjs(item.time)
      const isWithinDateRange =
        (!timeStart || bookingDate.diff(timeStart) > 0) &&
        (!timeEnd || timeEnd.diff(bookingDate) > 0)
      if (!isWithinDateRange) {
        console.log('in false return')
        return false
      }
      return Object.entries(multiSearch.value).every(([key, value]) => {
        const itemValue = item[key as keyof FlatBooking]
        if (!timeValues.includes(key)) {
          return (itemValue || '').toString().toUpperCase().includes(value.toString().toUpperCase())
        }
        return true
      })
    })
  } else {
    return bookings.value
  }
})

const openDialog = (item: FlatBooking) => {
  selectedItem.value = item
  bookingDialog.value = true
}

const submitBooking = async () => {
  const details = { contactInformation: userInput.value }
  submittedItem.value = selectedItem.value
  const bookingRequest: BookingRequest = {
    name: selectedItem.value?.name ?? null,
    identifier: selectedItem.value?.identifier ?? null,
    id: selectedItem.value?.id?.toString() ?? null,
    inputs: details
  }
  bookingDialog.value = false
  if (submittedItem.value != null) {
    try {
      const response = await bookingService.makeBooking(bookingRequest)
      console.log(response.data)
      if (response.data) {
        snackbarStore.setBookingMessage({
          time: response.data.time
            ? dayjs(response.data.time).format('YYYY-MM-DD HH:mm')
            : submittedItem.value.timeString,
          name: response.data.mastery.name,
          address: response.data.mastery.address,
          info: response.data.info,
          id: response.data.id ? response.data.id : '',
          type: 'success'
        })
      }
    } catch (error: any) {
      console.log(error)
      snackbarStore.setBookingMessage({
        time: submittedItem.value.timeString,
        name: submittedItem.value.name,
        address: submittedItem.value.address,
        info: error.info,
        id: '',
        type: 'error'
      })
    }
  }
}

onMounted(loadBookings)
</script>
<template>
  <BookingSnackBar />
  <ListLoadingSnackBar />
  <v-data-table
    :headers="headers"
    :items="filteredData"
    item-key="uuid"
    density="compact"
    :item-value="(item) => `${item.uuid}`"
  >
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.timeString }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.address }}</td>
        <td>{{ item.carTypes }}</td>
        <td>
          <v-icon
            size="x-large"
            icon="mdi-calendar-multiselect"
            @click.prevent="openDialog(item)"
            color="primary"
            x-small
          >
          </v-icon>
        </td>
      </tr>
    </template>
    <template v-slot:[`header.time`]>
      <div class="flex-container">
        <v-text-field
          v-model="multiSearch['timeStart']"
          class="pa small-datepicker"
          type="date"
          label="Search period start"
          placeholder="Start"
        ></v-text-field>
        <v-text-field
          v-model="multiSearch['timeEnd']"
          class="pa small-datepicker"
          type="date"
          label="Search period end"
          placeholder="End"
        ></v-text-field>
      </div>
      <span>Time</span>
      <div @click.stop></div>
    </template>
    <template v-slot:[`header.name`]>
      <v-text-field
        v-model="multiSearch['name']"
        class="pa"
        type="text"
        placeholder="Name"
      ></v-text-field>
      <span>Name</span>
      <div @click.stop></div>
    </template>
    <template v-slot:[`header.address`]>
      <v-text-field
        v-model="multiSearch['address']"
        class="pa"
        type="text"
        placeholder="Address"
      ></v-text-field>
      <span>Address</span>
      <div @click.stop></div>
    </template>
    <template v-slot:[`header.carTypes`]>
      <v-text-field
        v-model="multiSearch['carTypes']"
        class="pa"
        type="text"
        placeholder="Car Types"
      ></v-text-field>
      <span>Car Types</span>
      <div @click.stop></div>
    </template>
  </v-data-table>
  <v-dialog v-model="bookingDialog" max-width="500">
    <v-card>
      <v-card-title> Submit booking for {{ selectedItem?.name }} </v-card-title>
      <v-card-text>
        <p><strong>Time:</strong> {{ selectedItem?.timeString }}</p>
        <p><strong>Address:</strong> {{ selectedItem?.address }}</p>
        <p><strong>Car Types:</strong> {{ selectedItem?.carTypes }}</p>
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
        <v-btn color="primary" @click="closeDialog"> Discard </v-btn>
        <v-btn color="primary" @click="submitBooking"> Submit </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style scoped>
.search-field {
  --v-input-padding-top: 0;
  --v-input-padding: 0;
}
.v-field__input {
  padding-bottom: 0 !important;
  min-height: 1.5rem !important;
  padding-top: 0 !important;
}
#table-headers {
  font-weight: 1000;
}

.small-datepicker {
  /* width: 40%; */
  padding: 3px;
  flex: 1;
}
.flex-container {
  display: flex;
  /* width: 50%; */
}
.selected-row {
  background-color: #e0e0e0;
}
</style>
