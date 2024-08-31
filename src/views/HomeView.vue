<script setup lang="ts">
import BookingTable from '@/components/BookingTable.vue'
import BookingSnackBar from '@/components/BookingSnackbar.vue'
import ListLoadingSnackBar from '@/components/ListLoadingSnackbar.vue'
</script>

<template>
  <BookingSnackBar />
  <ListLoadingSnackBar />
  <BookingTable/>
</template>
