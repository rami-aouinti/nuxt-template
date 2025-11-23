export type EducationModule = {
  slug: string
  path?: string
  title: string
  summary: string
  description: string
  category: string
  highlights: string[]
  relatedViews: string[]
}

export type EducationSection = {
  key: string
  title: string
  description: string
  modules: EducationModule[]
}

export const educationSections: EducationSection[] = [
  {
    key: 'learning',
    title: 'Learning experience',
    description:
      'Cours, ressources et évaluations convertis pour l’interface Vuetify 3.',
    modules: [
      {
        slug: 'course-catalog',
        title: 'Catalogue des cours',
        category: 'Cours',
        summary:
          'Navigation dans les catégories, mise en avant des sessions et recherche guidée des cours.',
        description:
          'Reprend les écrans du catalogue (courses, catalogue sessions et catégories) pour proposer une entrée unifiée vers les contenus pédagogiques.',
        highlights: [
          'Filtres par catégorie et langue',
          'Cartes de cours avec sessions planifiées',
          'Accès rapide aux détails et ressources associées',
        ],
        relatedViews: [
          'course/CatalogueCourses.vue',
          'course/CatalogueSessions.vue',
          'coursecategory/List.vue',
        ],
      },
      {
        slug: 'course-workspace',
        title: 'Espace cours',
        category: 'Cours',
        summary:
          'Accueil de cours, documents, liens et ressources collaboratives.',
        description:
          'Rassemble les vues de cours (documents, liens, pages, blog, glossary) dans une présentation cohérente pour les apprenants et les tuteurs.',
        highlights: [
          'Bloc de ressources (documents, liens, page statique)',
          'Actualités et blog internes',
          'Glossaire partagé et navigation contextuelle',
        ],
        relatedViews: [
          'course/CourseHome.vue',
          'documents/List.vue',
          'links/List.vue',
          'blog/List.vue',
          'glossary/List.vue',
        ],
      },
      {
        slug: 'assignments-evaluations',
        title: 'Devoirs et évaluations',
        category: 'Evaluation',
        summary:
          'Suivi des devoirs, questionnaires, scorecards et progression des apprenants.',
        description:
          'Combine les écrans de devoirs, de questionnaires et de compétences pour proposer un suivi structuré et exportable.',
        highlights: [
          'Liste et dépôt des devoirs',
          'Parcours de questionnaires et feedbacks',
          'Suivi de progression et certificats',
        ],
        relatedViews: [
          'assignments/Index.vue',
          'quiz/List.vue',
          'skill/List.vue',
          'userreluser/CertificateList.vue',
        ],
      },
    ],
  },
  {
    key: 'collaboration',
    title: 'Collaboration et communication',
    description:
      'Outils communautaires, interactions sociales et notifications intégrés.',
    modules: [
      {
        slug: 'messaging-notifications',
        title: 'Messagerie & notifications',
        category: 'Communication',
        summary:
          'Messagerie directe, hub de notifications et files d’alertes.',
        description:
          'Centralise les vues message et notification pour garder les utilisateurs informés des activités clés.',
        highlights: [
          'Inbox et conversations par utilisateur',
          'Notifications temps réel',
          'Préférences de suivi et abonnements',
        ],
        relatedViews: ['message/List.vue', 'userreluser/NotificationList.vue'],
      },
      {
        slug: 'social-learning',
        title: 'Apprentissage social',
        category: 'Communauté',
        summary:
          'Forums, groupes d’utilisateurs et interactions sociales depuis les vues existantes.',
        description:
          'Réutilise les écrans sociaux (social, usergroup, userreluser) pour favoriser les échanges et la co-construction de contenu.',
        highlights: [
          'Groupes, communautés et relations utilisateurs',
          'Fil d’actualités et commentaires',
          'Mises à jour en contexte de cours',
        ],
        relatedViews: [
          'social/List.vue',
          'usergroup/List.vue',
          'userreluser/List.vue',
        ],
      },
      {
        slug: 'personal-workspace',
        title: 'Espace personnel',
        category: 'Profil',
        summary:
          'Fichiers personnels, préférences et suivi d’activité.',
        description:
          'Associe les vues personalfile, pageLayout et profile pour offrir un cockpit individuel moderne.',
        highlights: [
          'Gestion de fichiers personnels',
          'Pages personnalisées et widgets',
          'Historique de progression',
        ],
        relatedViews: [
          'personalfile/List.vue',
          'pageLayout/Show.vue',
          'user/Profile.vue',
        ],
      },
      {
        slug: 'social-admin',
        path: '/education/social-admin',
        title: 'Réseau social & supervision',
        category: 'Communauté',
        summary:
          'Vue combinée pour suivre les posts sociaux, les auteurs et les intégrations tierces en temps réel.',
        description:
          'Consomme directement les endpoints social_posts et third_parties pour offrir un cockpit de monitoring et d’alignement avec les vues legacy.',
        highlights: [
          'Feed social issu de /api/social_posts',
          'Badge des statuts et visibilité',
          'Listing des fournisseurs tiers / intégrations',
        ],
        relatedViews: ['social/List.vue', 'socialpost/Show.vue', 'admin/UserList.vue'],
      },
    ],
  },
  {
    key: 'administration',
    title: 'Administration & conformité',
    description:
      'Supervision des utilisateurs, sessions et contrôles qualité.',
    modules: [
      {
        slug: 'user-and-session-admin',
        title: 'Administration des utilisateurs & sessions',
        category: 'Administration',
        summary:
          'Pilotage des utilisateurs, des sessions de formation et des inscriptions.',
        description:
          'S’appuie sur les vues admin/user, sessionadmin et attendance pour suivre la participation et gérer les accès.',
        highlights: [
          'Tableaux de bord utilisateurs',
          'Suivi des présences',
          'Gestion des inscriptions et rôles',
        ],
        relatedViews: [
          'admin/UserList.vue',
          'sessionadmin/List.vue',
          'attendance/List.vue',
        ],
      },
      {
        slug: 'access-urls',
        path: '/education/access-urls',
        title: 'Portails Access URL',
        category: 'Administration',
        summary:
          'Pilotage des portails et sources d’authentification exposés par le endpoint /api/access_urls.',
        description:
          'Les données Access URL sont affichées avec Vuetify 3 et renvoient vers les vues legacy pour les workflows avancés.',
        highlights: [
          'Lecture directe des portails',
          'Indicateurs d’activation et thèmes',
          'Passerelle vers les écrans d’assignation legacy',
        ],
        relatedViews: ['accessurl/AccessUrlAuthSourcesAssign.vue'],
      },
      {
        slug: 'content-governance',
        title: 'Gouvernance contenu',
        category: 'Conformité',
        summary:
          'Gestion des termes, liens, pages institutionnelles et documents partagés.',
        description:
          'Regroupe les vues terms, links, documents et page pour garder une cohérence éditoriale.',
        highlights: [
          'Termes et politiques de conformité',
          'Gestion documentaire',
          'Pages institutionnelles et liens clés',
        ],
        relatedViews: [
          'terms/List.vue',
          'links/List.vue',
          'documents/List.vue',
          'page/List.vue',
        ],
      },
      {
        slug: 'glossary',
        path: '/education/glossary',
        title: 'Glossaire institutionnel',
        category: 'Conformité',
        summary: 'Centralisation des définitions et import/export de termes via /api/glossaries.',
        description:
          'Expose les termes du glossaire à partir de l’API distante et relie les écrans legacy d’export/import.',
        highlights: [
          'Vue Nuxt pour consulter les termes',
          'Compteurs par langue et catégorie',
          'Passerelle vers les écrans d’édition legacy',
        ],
        relatedViews: [
          'glossary/GlossaryList.vue',
          'glossary/GlossaryTermCreate.vue',
          'glossary/GlossaryExport.vue',
        ],
      },
      {
        slug: 'platform-settings',
        title: 'Paramétrage plateforme',
        category: 'Système',
        summary:
          'Réglages transverses : calendrier, catégories, fichiers publics.',
        description:
          'S’appuie sur ccalendarevent, coursecategory et dropbox pour apporter un paramétrage prêt à l’emploi.',
        highlights: [
          'Calendriers et événements',
          'Catégories de cours',
          'Partage et dépôts de fichiers',
        ],
        relatedViews: [
          'ccalendarevent/List.vue',
          'coursecategory/List.vue',
          'dropbox/List.vue',
        ],
      },
    ],
  },
]

export function findEducationModule(slug: string) {
  return educationSections
    .flatMap((section) => section.modules)
    .find((module) => module.slug === slug)
}
