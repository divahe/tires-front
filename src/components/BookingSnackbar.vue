<script setup lang="ts">
import { useSnackbarStore } from '@/stores/snackbarStore'
const snackbarStore = useSnackbarStore()

</script>

<template>
  <v-snackbar
    v-model="snackbarStore.bookingSnackbar.show"
    class="message"
    :class="snackbarStore.bookingSnackbar.type"
    multi-line
    vertical
    color="primary"
    close-on-content-click
    timeout="-1"
  >
    Info: {{ snackbarStore.bookingSnackbar.info }}<br />
    Mastery: {{ snackbarStore.bookingSnackbar.name }}<br />
    Address: {{ snackbarStore.bookingSnackbar.address }}<br />
    <div v-if="snackbarStore.bookingSnackbar.time">
      Time: {{ snackbarStore.bookingSnackbar.time }}<br />
    </div>
    <div v-if="snackbarStore.bookingSnackbar.id">
      Id: {{ snackbarStore.bookingSnackbar.id }}<br />
    </div>
    <template v-slot:actions>
      <v-btn variant="text"> Click to close </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped></style>
