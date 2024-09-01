<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBookingStore } from '@/stores/bookingStore'
import BookingDialog from '@/components/BookingDialog.vue'
import type { FlatBooking } from '@/model/index'
import dayjs from 'dayjs'

const bookingStore = useBookingStore()
const multiSearch = ref<{ [key: string]: string }>({})
const timeValues = ['timeStart', 'timeEnd']

const headers = ref([
  { title: 'Time', value: 'timeString', key: 'time' },
  { title: 'Name', value: 'name', key: 'name' },
  { title: 'Address', value: 'address', key: 'address' },
  { title: 'CarTypes', value: 'carTypes', key: 'carTypes' }
])

const filteredData = computed(() => {
  const timeStart = multiSearch.value.timeStart ? dayjs(multiSearch.value.timeStart) : null
  const timeEnd = multiSearch.value.timeEnd ? dayjs(multiSearch.value.timeEnd).add(1, 'day') : null

  if (Object.keys(multiSearch.value).length > 0) {
    return bookingStore.flatBookings.filter((item: FlatBooking) => {
      const bookingDate = dayjs(item.time)
      const isWithinDateRange =
        (!timeStart || bookingDate.diff(timeStart) > 0) &&
        (!timeEnd || timeEnd.diff(bookingDate) > 0)

      if (!isWithinDateRange) return false

      return Object.entries(multiSearch.value).every(([key, value]) => {
        const itemValue = item[key as keyof FlatBooking]
        if (!timeValues.includes(key)) {
          return (itemValue || '').toString().toUpperCase().includes(value.toString().toUpperCase())
        }
        return true
      })
    })
  } else {
    return bookingStore.flatBookings
  }
})

onMounted(bookingStore.loadBookings)
</script>

<template>
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
            @click.prevent="bookingStore.showDialog(item)"
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
          @click.stop
        ></v-text-field>
        <v-text-field
          v-model="multiSearch['timeEnd']"
          class="pa small-datepicker"
          type="date"
          label="Search period end"
          placeholder="End"
          @click.stop
        ></v-text-field>
      </div>
      <span id="table-header">Time</span>
      <div @click.stop></div>
    </template>
    <template v-slot:[`header.name`]>
      <v-text-field
        v-model="multiSearch['name']"
        class="pa"
        type="text"
        placeholder="Name"
        @click.stop
      ></v-text-field>
      <span id="table-header">Name</span>
      <div @click.stop></div>
    </template>
    <template v-slot:[`header.address`]>
      <v-text-field
        v-model="multiSearch['address']"
        class="pa"
        type="text"
        placeholder="Address"
        @click.stop
      ></v-text-field>
      <span id="table-header">Address</span>
      <div @click.stop></div>
    </template>
    <template v-slot:[`header.carTypes`]>
      <v-text-field
        v-model="multiSearch['carTypes']"
        class="pa"
        type="text"
        placeholder="Car Types"
        @click.stop
      ></v-text-field>
      <span id="table-header">Car Types</span>
      <div @click.stop></div>
    </template>
  </v-data-table>
  <BookingDialog/>
  
</template>
<style scoped>
.v-input--density-default {
  --v-input-padding-top: 1px;
}
#table-header {
  font-weight: 1000;
}

.small-datepicker {
  padding: 3px;
  flex: 1;
}
.flex-container {
  display: flex;
}

</style>