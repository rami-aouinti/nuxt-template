import { computed } from 'vue'
import { EDUCATION_BASE_URL } from '~/composables/useEducationNavigation'

export type EducationEndpoint = {
  slug: string
  icon: string
  title: string
  description: string
  href: string
  type?: 'page' | 'api' | 'form'
}

export type EducationEndpointGroup = {
  key: string
  title: string
  description: string
  items: EducationEndpoint[]
}

export const useEducationMyCoursesEndpoints = () => {
  const groups = computed<EducationEndpointGroup[]>(() => [
    {
      key: 'workspace',
      title: 'Espace de travail',
      description:
        'Pages principales pour parcourir vos cours, suivre vos progrès et récupérer vos certificats.',
      items: [
        {
          slug: 'catalogue-personnel',
          icon: 'mdi-format-list-bulleted',
          title: 'Catalogue personnel',
          description: 'Liste complète de vos cours inscrits.',
          href: `${EDUCATION_BASE_URL}/my-courses`,
          type: 'page',
        },
        {
          slug: 'suivi-de-progression',
          icon: 'mdi-progress-check',
          title: 'Suivi de progression',
          description: 'État d’avancement détaillé par cours.',
          href: `${EDUCATION_BASE_URL}/my-courses/progress`,
          type: 'page',
        },
        {
          slug: 'certificats',
          icon: 'mdi-certificate-outline',
          title: 'Certificats',
          description: 'Télécharger vos attestations et diplômes.',
          href: `${EDUCATION_BASE_URL}/certificates`,
          type: 'page',
        },
        {
          slug: 'notifications',
          icon: 'mdi-bell-outline',
          title: 'Notifications',
          description: 'Alertes liées aux nouvelles activités et délais.',
          href: `${EDUCATION_BASE_URL}/notifications`,
          type: 'page',
        },
      ],
    },
    {
      key: 'activities',
      title: 'Activités et évaluations',
      description:
        'Liens rapides vers les devoirs, quiz, feedbacks et examens disponibles sur chaque cours.',
      items: [
        {
          slug: 'devoirs',
          icon: 'mdi-clipboard-text-outline',
          title: 'Devoirs',
          description: 'Toutes les tâches à remettre dans vos cours.',
          href: `${EDUCATION_BASE_URL}/my-courses/assignments`,
          type: 'page',
        },
        {
          slug: 'feedback-et-enquetes',
          icon: 'mdi-comment-quote-outline',
          title: 'Feedback et enquêtes',
          description:
            'Questionnaires, sondages et évaluations de satisfaction.',
          href: `${EDUCATION_BASE_URL}/feedback`,
          type: 'page',
        },
        {
          slug: 'quiz-et-examens',
          icon: 'mdi-clipboard-check-outline',
          title: 'Quiz et examens',
          description: 'Accès direct aux évaluations notées.',
          href: `${EDUCATION_BASE_URL}/exams`,
          type: 'page',
        },
        {
          slug: 'manuels-et-supports',
          icon: 'mdi-book-open-outline',
          title: 'Manuels et supports',
          description: 'Documents et ressources téléchargeables.',
          href: `${EDUCATION_BASE_URL}/documents`,
          type: 'page',
        },
      ],
    },
    {
      key: 'collaboration',
      title: 'Collaboration',
      description:
        'Outils pour travailler en groupe, échanger avec les formateurs et participer aux forums.',
      items: [
        {
          slug: 'agenda',
          icon: 'mdi-calendar-check-outline',
          title: 'Agenda',
          description: 'Calendrier des sessions et échéances.',
          href: `${EDUCATION_BASE_URL}/calendar`,
          type: 'page',
        },
        {
          slug: 'groupes',
          icon: 'mdi-account-multiple-check-outline',
          title: 'Groupes',
          description: 'Gestion des groupes, coéquipiers et espaces dédiés.',
          href: `${EDUCATION_BASE_URL}/groups`,
          type: 'page',
        },
        {
          slug: 'forums',
          icon: 'mdi-forum-outline',
          title: 'Forums',
          description: 'Discussions et questions-réponses par cours.',
          href: `${EDUCATION_BASE_URL}/forums`,
          type: 'page',
        },
        {
          slug: 'messages-directs',
          icon: 'mdi-email-send-outline',
          title: 'Messages directs',
          description: 'Messagerie entre étudiants et formateurs.',
          href: `${EDUCATION_BASE_URL}/messages`,
          type: 'page',
        },
      ],
    },
    {
      key: 'selfservice',
      title: 'Self-service et administration',
      description:
        'Tout ce qu’il faut pour gérer vos inscriptions, préférences et ressources personnelles.',
      items: [
        {
          slug: 'profil-et-preferences',
          icon: 'mdi-account-cog-outline',
          title: 'Profil et préférences',
          description:
            'Mettre à jour vos informations personnelles et notifications.',
          href: `${EDUCATION_BASE_URL}/profile`,
          type: 'form',
        },
        {
          slug: 'inscription-libre',
          icon: 'mdi-account-plus-outline',
          title: 'Inscription libre',
          description: 'Rejoindre de nouveaux cours disponibles au catalogue.',
          href: `${EDUCATION_BASE_URL}/courses/self-enroll`,
          type: 'form',
        },
        {
          slug: 'exporter-mon-historique',
          icon: 'mdi-cloud-download-outline',
          title: 'Exporter mon historique',
          description: 'Télécharger vos résultats et preuves de suivi.',
          href: `${EDUCATION_BASE_URL}/my-courses/export`,
          type: 'api',
        },
        {
          slug: 'accessibilite-et-securite',
          icon: 'mdi-shield-check-outline',
          title: 'Accessibilité et sécurité',
          description:
            'Configurer 2FA, langue, affichage et options d’accessibilité.',
          href: `${EDUCATION_BASE_URL}/settings`,
          type: 'page',
        },
      ],
    },
  ])

  const primaryShortcuts = computed(
    () => groups.value[0]?.items.slice(0, 3) || [],
  )

  const findEndpointBySlug = (slug: string) =>
    groups.value
      .flatMap((group) => group.items)
      .find((item) => item.slug === slug)

  const findGroupBySlug = (slug: string) =>
    groups.value.find((group) => group.items.some((item) => item.slug === slug))

  return { groups, primaryShortcuts, findEndpointBySlug, findGroupBySlug }
}
