<script lang="ts" setup>
import { useBookingStore } from '@/stores/bookingStore'
const bookingStore = useBookingStore()
const reloadAction = () => {
 bookingStore.loadBookings()
}

</script>
<template>
  <v-card class="mx-auto">
    <v-app-bar color="primary" density="compact">
      <template v-slot:prepend>
        <v-container><v-icon alt="tire-icon" size="x-large" icon="mdi-tire"></v-icon></v-container>
      </template>
      <v-app-bar-title>Tire Change Booking App</v-app-bar-title>
      <template v-slot:append>
        <v-btn alt="reload" size="x-large" icon="mdi-reload" @click="reloadAction"></v-btn>
      </template>
    </v-app-bar>
  </v-card>
</template>
<style scoped></style>
