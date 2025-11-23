import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'VueDraggableStub',
  props: {
    list: { type: Array, default: () => [] },
    modelValue: { type: Array, default: () => [] },
    itemKey: { type: [String, Function], default: 'id' },
  },
  emits: ['update:modelValue', 'change'],
  setup(_props, { slots }) {
    return () => h('div', { class: 'vuedraggable-stub' }, slots.default ? slots.default() : [])
  },
})
