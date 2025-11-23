import { useCidReqStore } from '../../stores/cidReq'
import { useSecurityStore } from '../../stores/securityStore'

export function useCalendarInvitations() {
  const cidReqStore = useCidReqStore()
  const securirtyStore = useSecurityStore()

  const isPersonalCalendar = null === cidReqStore.course

  const allowCollectiveInvitations = isPersonalCalendar
  const allowSubscriptions = securirtyStore.isAdmin && isPersonalCalendar

  return {
    allowCollectiveInvitations,
    allowSubscriptions,
  }
}
