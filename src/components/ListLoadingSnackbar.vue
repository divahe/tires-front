<script setup lang="ts">
import { useSnackbarStore } from '@/stores/snackbarStore'

const snackbarStore = useSnackbarStore()
</script>

<template>
  <v-snackbar
    v-model="snackbarStore.listLoadingError.show"
    class="error"
    multi-line
    vertical
    color="primary"
    close-on-content-click
    timeout="-1"
  >
  <div>
      <li v-for="(value, key) in snackbarStore.listLoadingError.errors" :key="key">
        {{ key }}: {{ value }}
      </li>
  </div>
    <template v-slot:actions>
      <v-btn variant="text"> Click to close </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped></style>