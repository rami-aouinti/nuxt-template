<template>
  <div v-if="!isLoading && item && isCurrentTeacher">
    <!--      :handle-delete="del"-->
    <Toolbar :handle-reset="resetForm" :handle-submit="onSendForm" />
    <DocumentsForm ref="updateForm" :errors="violations" :values="item">
      <EditLinks v-model="item" links-type="users" />
    </DocumentsForm>
    <Loading :visible="isLoading || deleteLoading" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import DocumentsForm from '../../../components/education/documents/Form.vue'
import Loading from '../../../components/education/Loading.vue'
import Toolbar from '../../../components/education/Toolbar.vue'
import UpdateMixin from '../../../mixins/UpdateMixin'
import EditLinks from '../../../components/education/resource_links/EditLinks.vue'

const servicePrefix = 'Documents'

export default {
  name: 'DocumentsUpdate',
  servicePrefix,
  components: {
    EditLinks,
    Loading,
    Toolbar,
    DocumentsForm,
  },
  mixins: [UpdateMixin],
  computed: {
    ...mapFields('documents', {
      deleteLoading: 'isLoading',
      isLoading: 'isLoading',
      error: 'error',
      updated: 'updated',
      violations: 'violations',
    }),
    ...mapGetters('documents', ['find']),
    ...mapGetters({
      isCurrentTeacher: 'security/isCurrentTeacher',
    }),
  },
  methods: {
    ...mapActions('documents', {
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
