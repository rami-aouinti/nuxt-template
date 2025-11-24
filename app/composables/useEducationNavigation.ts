import { computed } from 'vue'

export const EDUCATION_BASE_URL = 'https://education.bro-world.org'

const educationRouteName = (name: string) => ({ name: name as string })

export interface EducationNavItem {
  icon?: string
  label: string
  to?: string
  external?: boolean
  value?: string
  children?: EducationNavItem[]
}

export const useEducationNavigation = () => {
  const { t } = useI18n()
  const localePath = useLocalePath()

  const navLinks = computed<EducationNavItem[]>(() => [
    {
      icon: 'mdi-home-outline',
      label: t('pages.education.navigation.home'),
      to: localePath('/education'),
    },
    {
      icon: 'mdi-book-open-page-variant',
      label: t('pages.education.navigation.myCourses'),
      to: localePath('/education/user/courses/list'),
    },
    {
      icon: 'mdi-compass-outline',
      label: t('pages.education.navigation.exploreCourses'),
      to: localePath('/education/course'),
    },
    {
      icon: 'mdi-calendar-month',
      label: t('pages.education.navigation.events'),
      to: localePath('/education/ccalendarevent/c-calendar-event-list'),
    },
    {
      icon: 'mdi-chart-bar',
      label: t('pages.education.navigation.reporting.title'),
      value: 'reporting',
      children: [
        {
          icon: 'mdi-chart-areaspline',
          label: t('pages.education.navigation.reporting.overview'),
          to: localePath('/education/sessionadmin/admin-dashboard'),
        },
      ],
    },
    {
      icon: 'mdi-account-group-outline',
      label: t('pages.education.navigation.social.title'),
      value: 'social',
      children: [
        {
          icon: 'mdi-home-outline',
          label: t('pages.education.navigation.social.home'),
          to: localePath('/education/social/social-wall'),
        },
        {
          icon: 'mdi-email-outline',
          label: t('pages.education.navigation.social.messages'),
          to: localePath('/education/message/message-list'),
        },
        {
          icon: 'mdi-account-heart-outline',
          label: t('pages.education.navigation.social.friends'),
          to: localePath('/education/social/social-search'),
        },
        {
          icon: 'mdi-account-multiple-outline',
          label: t('pages.education.navigation.social.groups'),
          to: localePath('/education/usergroup/list'),
        },
        {
          icon: 'mdi-file-outline',
          label: t('pages.education.navigation.social.files'),
          to: localePath('/education/personalfile/home'),
        },
        {
          icon: 'mdi-shield-account-outline',
          label: t('pages.education.navigation.social.personalData'),
          to: localePath('/education/user/personal-data'),
        },
      ],
    },
    {
      icon: 'mdi-shield-crown-outline',
      label: t('pages.education.navigation.sessionAdmin.title'),
      value: 'session-admin',
      children: [
        {
          icon: 'mdi-view-dashboard-outline',
          label: t('pages.education.navigation.sessionAdmin.dashboard'),
          to: localePath('/education/sessionadmin/admin-dashboard'),
        },
        {
          icon: 'mdi-star-outline',
          label: t('pages.education.navigation.sessionAdmin.favorites'),
          to: localePath('/education/sessionadmin/favorites-courses'),
        },
        {
          icon: 'mdi-check-circle-outline',
          label: t('pages.education.navigation.sessionAdmin.completed'),
          to: localePath('/education/sessionadmin/completed-courses'),
        },
        {
          icon: 'mdi-progress-clock',
          label: t('pages.education.navigation.sessionAdmin.incomplete'),
          to: localePath('/education/sessionadmin/incomplete-courses'),
        },
        {
          icon: 'mdi-restart',
          label: t('pages.education.navigation.sessionAdmin.restartable'),
          to: localePath('/education/sessionadmin/restart-courses'),
        },
      ],
    },
    {
      icon: 'mdi-cog-outline',
      label: t('pages.education.navigation.administration.title'),
      value: 'administration',
      children: [
        {
          icon: 'mdi-cog-outline',
          label: t('pages.education.navigation.administration.overview'),
          to: localePath('/education/admin/admin-index'),
        },
        {
          icon: 'mdi-account-multiple-outline',
          label: t('pages.education.navigation.administration.users'),
          to: localePath('/education/userreluser/user-rel-user-list'),
        },
        {
          icon: 'mdi-book-outline',
          label: t('pages.education.navigation.administration.courses'),
          to: localePath('/education/course'),
        },
        {
          icon: 'mdi-calendar-clock-outline',
          label: t('pages.education.navigation.administration.sessions'),
          to: localePath('/education/user/sessions/sessions-current'),
        },
        {
          icon: 'mdi-tune',
          label: t('pages.education.navigation.administration.settings'),
          to: localePath('/education/admin/admin-configure-colors'),
        },
      ],
    },
  ])

  const platformRoutes = computed(() => [
    {
      icon: 'mdi-home-variant-outline',
      label: t('pages.education.routes.platformHome'),
      to: localePath('/education'),
    },
    {
      icon: 'mdi-book-open-page-variant',
      label: t('pages.education.routes.library'),
      to: localePath('/education/course/catalogue-courses'),
    },
    {
      icon: 'mdi-playlist-star',
      label: t('pages.education.routes.recommendations'),
      to: localePath('/education/user/courses/sticky-courses'),
    },
    {
      icon: 'mdi-certificate-outline',
      label: t('pages.education.routes.certificates'),
      to: localePath('/education/course/list'),
    },
    {
      icon: 'mdi-account-school-outline',
      label: t('pages.education.routes.instructors'),
      to: localePath('/education/admin/admin-index'),
    },
    {
      icon: 'mdi-chart-areaspline',
      label: t('pages.education.routes.analytics'),
      to: localePath('/education/sessionadmin/admin-dashboard'),
    },
  ])

  return {
    navLinks,
    platformRoutes,
    baseUrl: EDUCATION_BASE_URL,
  }
}
