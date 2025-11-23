<template>
  <div>
    <v-card class="mx-auto">
      <CourseForm
        v-if="item"
        ref="updateForm"
        :errors="violations"
        :values="item"
      />
      <Loading :visible="isLoading || deleteLoading" />
      <v-footer>
        <Toolbar
          :handle-delete="del"
          :handle-reset="resetForm"
          :handle-submit="onSendForm"
        />
      </v-footer>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import CourseForm from '../../../components/education/course/Form.vue'
import Loading from '../../../components/education/Loading.vue'
import Toolbar from '../../../components/education/Toolbar.vue'
import UpdateMixin from '../../../mixins/UpdateMixin'

const servicePrefix = 'Course'

export default {
  name: 'CourseUpdate',
  servicePrefix,
  components: {
    Loading,
    Toolbar,
    CourseForm,
  },
  mixins: [UpdateMixin],

  computed: {
    ...mapFields('course', {
      deleteLoading: 'isLoading',
      isLoading: 'isLoading',
      error: 'error',
      updated: 'updated',
      violations: 'violations',
    }),
    ...mapGetters('course', ['find']),
  },

  methods: {
    ...mapActions('course', {
      createReset: 'resetCreate',
      deleteItem: 'del',
      delReset: 'resetDelete',
      retrieve: 'load',
      update: 'update',
      updateReset: 'resetUpdate',
    }),
  },
}
</script>
