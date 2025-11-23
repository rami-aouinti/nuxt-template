<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6" sm="6">
        <v-text-field v-model="item.title" :label="$t('Name')" type="text" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
export default {
  name: 'CourseCategoryFilter',
  props: {
    values: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },

  computed: {
    item() {
      return this.initialValues || this.values
    },
  },
  mounted() {},
  methods: {},
}
</script>
