import { defineComponent, h, watch } from 'vue'

export default defineComponent({
  name: 'DraggableStub',
  props: {
    modelValue: { type: Array as () => unknown[], default: () => [] },
    tag: { type: String, default: 'div' },
    componentData: { type: Object, default: () => ({}) },
  },
  emits: ['update:modelValue', 'change', 'start', 'end'],
  setup(props, { slots, emit }) {
    watch(
      () => props.modelValue,
      () => {
        emit('change', { collection: props.modelValue })
      },
      { deep: true },
    )

    const renderItems = () => {
      const items = props.modelValue ?? []
      return items.map((element, index) =>
        slots.item ? slots.item({ element, index }) : slots.default?.(),
      )
    }

    return () => h(props.tag || 'div', props.componentData, renderItems())
  },
})
