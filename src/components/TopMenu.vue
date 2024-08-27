<script lang="ts" setup>
const reloadAction = () => {
  console.log("to be done")
}

</script>
<template>
  <v-card class="mx-auto">
    <v-app-bar color="primary" density="compact">
      <template v-slot:prepend>
        <v-container><v-icon size="x-large" icon="mdi-tire"></v-icon></v-container>
      </template>
      <v-app-bar-title>Tire Change Booking App</v-app-bar-title>
      <template v-slot:append>
        <v-btn size="x-large" icon="mdi-reload" @click.prevent="reloadAction"></v-btn>
      </template>
    </v-app-bar>
  </v-card>
</template>
<style scoped></style>
