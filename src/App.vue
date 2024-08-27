<script setup lang="ts">
import TopMenu from '@/components/TopMenu.vue'
import TheSnackBar from '@/components/BookingSnackbar.vue'
</script>

<template>
  <v-app>
    <top-menu />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
