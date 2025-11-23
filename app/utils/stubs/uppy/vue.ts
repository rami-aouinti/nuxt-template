import { defineComponent, h } from 'vue'

export const Dashboard = defineComponent({
  name: 'UppyDashboardStub',
  setup(_, { slots }) {
    return () => h('div', { class: 'uppy-dashboard-stub' }, slots.default?.())
  },
})

export const DashboardModal = defineComponent({
  name: 'UppyDashboardModalStub',
  setup(_, { slots }) {
    return () =>
      h('div', { class: 'uppy-dashboard-modal-stub' }, slots.default?.())
  },
})

export default { Dashboard, DashboardModal }
