<template>
  <!--  auto-width-->
  <v-td slot="body-cell-action">
    <div class="p-4 flex flex-row gap-1">
      <v-btn
        v-if="handleShow"
        color="secondary"
        dense
        label="Show"
        no-caps
        @click="handleShow"
      />
      <v-btn
        v-if="handleEdit"
        color="secondary"
        dense
        label="Edit"
        no-caps
        @click="handleEdit"
      />
      <v-btn
        v-if="handleDelete"
        color="red"
        dense
        label="Delete"
        no-caps
        @click="confirmDeleteClick = true"
      />
      <ConfirmDelete
        v-if="handleDelete"
        :handle-cancel="() => (confirmDeleteClick = false)"
        :handle-delete="handleDelete"
        :show="confirmDeleteClick"
      />
    </div>
  </v-td>
</template>

<script setup lang="ts">
import ConfirmDelete from './ConfirmDelete.vue'

export default {
  name: 'ActionCell',
  components: {
    ConfirmDelete,
  },
  props: {
    handleShow: {
      type: Function,
      required: false,
    },
    handleEdit: {
      type: Function,
      required: false,
    },
    handleDelete: {
      type: Function,
      required: false,
    },
  },
  data() {
    return {
      confirmDeleteClick: false,
    }
  },
}
</script>
