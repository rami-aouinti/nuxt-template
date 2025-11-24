import { computed } from 'vue'

export const EDUCATION_BASE_URL = 'https://education.bro-world.org'

export const useEducationNavigation = () => {
  const { t } = useI18n()
  const localePath = useLocalePath()

  const navLinks = computed(() => [
    {
      icon: 'mdi-home-analytics',
      label: t('pages.education.navigation.home'),
      to: localePath('/education'),
    },
    {
      icon: 'mdi-compass-rose',
      label: t('pages.education.navigation.exploreCourses'),
      to: localePath('/education/course/catalogue-courses'),
    },
    {
      icon: 'mdi-book-account-outline',
      label: t('pages.education.navigation.myCourses'),
      to: localePath('/education/user/courses/list'),
    },
    {
      icon: 'mdi-shield-crown-outline',
      label: t('pages.education.navigation.administration'),
      to: localePath('/education/admin/admin-index'),
    },
    {
      icon: 'mdi-lock-check-outline',
      label: t('pages.education.navigation.accessUrls'),
      to: localePath('/education/accessurl/access-url-auth-sources-assign'),
    },
    {
      icon: 'mdi-rss',
      label: t('pages.education.navigation.blog'),
      to: localePath('/education/blog/blog-posts'),
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
      to: localePath('/education/user/courses/list'),
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
