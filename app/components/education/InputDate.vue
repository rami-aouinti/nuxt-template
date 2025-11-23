<template>
  <v-menu
    v-model="showMenu"
    :close-on-content-click="false"
    :nudge-right="40"
    min-width="290px"
    offset-y
    transition="scale-transition"
  >
    <template #activator="{ on }">
      <v-text-field
        v-model="date"
        :label="label"
        prepend-icon="mdi-calendar"
        readonly
        v-on="on"
      />
    </template>
    <v-date-picker v-model="date" @input="handleInput" />
  </v-menu>
</template>

<script setup lang="ts">
import { formatDateTime } from '../../utils/dates.js'

export default {
  props: {
    label: {
      type: String,
      required: false,
      default: () => '',
    },
    value: String,
  },
  data() {
    return {
      date: this.value ? this.value : new Date().toISOString().substr(0, 10),
      showMenu: false,
    }
  },
  created() {
    this.date = this.value ? this.value : this.date
  },
  methods: {
    formatDateTime,
    handleInput() {
      this.showMenu = false
      this.$emit('input', this.date)
    },
  },
}
</script>
