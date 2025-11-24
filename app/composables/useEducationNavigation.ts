import { computed } from 'vue'

export const EDUCATION_BASE_URL = 'https://education.bro-world.org'

export const useEducationNavigation = () => {
  const { t } = useI18n()
  const localePath = useLocalePath()

  const navLinks = computed(() => [
    {
      icon: 'mdi-home-analytics',
      label: t('pages.education.navigation.home'),
      to: `${EDUCATION_BASE_URL}/`,
      external: true,
    },
    {
      icon: 'mdi-book-account-outline',
      label: t('pages.education.navigation.myCourses'),
      to: `${EDUCATION_BASE_URL}/my-courses`,
      external: true,
    },
    {
      icon: 'mdi-compass-rose',
      label: t('pages.education.navigation.exploreCourses'),
      to: `${EDUCATION_BASE_URL}/courses`,
      external: true,
    },
    {
      icon: 'mdi-shield-crown-outline',
      label: t('pages.education.navigation.administration'),
      to: `${EDUCATION_BASE_URL}/admin`,
      external: true,
    },
    {
      icon: 'mdi-forum-outline',
      label: t('pages.education.navigation.support'),
      to: localePath('education'),
    },
  ])

  const platformRoutes = computed(() => [
    {
      icon: 'mdi-home-variant-outline',
      label: t('pages.education.routes.platformHome'),
      href: `${EDUCATION_BASE_URL}/`,
    },
    {
      icon: 'mdi-book-open-page-variant',
      label: t('pages.education.routes.library'),
      href: `${EDUCATION_BASE_URL}/library`,
    },
    {
      icon: 'mdi-playlist-star',
      label: t('pages.education.routes.recommendations'),
      href: `${EDUCATION_BASE_URL}/courses/recommended`,
    },
    {
      icon: 'mdi-certificate-outline',
      label: t('pages.education.routes.certificates'),
      href: `${EDUCATION_BASE_URL}/certificates`,
    },
    {
      icon: 'mdi-account-school-outline',
      label: t('pages.education.routes.instructors'),
      href: `${EDUCATION_BASE_URL}/instructors`,
    },
    {
      icon: 'mdi-chart-areaspline',
      label: t('pages.education.routes.analytics'),
      href: `${EDUCATION_BASE_URL}/analytics`,
    },
  ])

  return {
    navLinks,
    platformRoutes,
    baseUrl: EDUCATION_BASE_URL,
  }
}
