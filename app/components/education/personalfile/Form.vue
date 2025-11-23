<template>
  <v-form>
    <v-input
      id="item_title"
      v-model="item.title"
      :error="v$.item.title.$error"
      :error-message="titleErrors"
      :placeholder="$t('Title')"
      @blur="v$.item.title.$touch()"
      @input="v$.item.title.$touch()"
    />
    <slot />
  </v-form>
</template>

<script setup lang="ts">
import has from 'lodash/has'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  name: 'PersonalFileForm',
  props: {
    values: {
      type: Object,
      required: true,
    },
    errors: {
      type: Object,
      default: () => {},
    },
    initialValues: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      title: null,
      parentResourceNodeId: null,
    }
  },
  computed: {
    item() {
      return this.initialValues || this.values
    },
    titleErrors() {
      const errors = []
      if (!this.v$.item.title.$dirty) return errors
      has(this.violations, 'title') && errors.push(this.violations.title)

      if (this.v$.item.title.required) {
        return this.$t('Required field')
      }

      return errors
    },
    violations() {
      return this.errors || {}
    },
  },
  validations: {
    item: {
      title: {
        required,
      },
      parentResourceNodeId: {},
    },
  },
}
</script>
