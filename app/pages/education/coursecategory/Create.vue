<template>
  <div>
    <Toolbar :handle-reset="resetForm" :handle-submit="onSendForm" />
    <CourseCategoryForm ref="createForm" :errors="violations" :values="item" />
    <Loading :visible="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { mapActions } from 'vuex'
import { createHelpers } from 'vuex-map-fields'
import CourseCategoryForm from '../../../components/education/coursecategory/Form.vue'
import Loading from '../../../components/education/Loading.vue'
import Toolbar from '../../../components/education/Toolbar.vue'
import CreateMixin from '../../../mixins/CreateMixin'

const servicePrefix = 'CourseCategory'

const { mapFields } = createHelpers({
  getterType: 'coursecategory/getField',
  mutationType: 'coursecategory/updateField',
})

export default {
  name: 'CourseCategoryCreate',
  servicePrefix,
  components: {
    Loading,
    Toolbar,
    CourseCategoryForm,
  },
  mixins: [CreateMixin],
  data() {
    return {
      item: {},
    }
  },
  computed: {
    ...mapFields(['error', 'isLoading', 'created', 'violations']),
  },
  methods: {
    ...mapActions('coursecategory', ['create', 'reset']),
  },
}
</script>
