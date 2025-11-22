import { computed } from 'vue'
import { EDUCATION_BASE_URL } from '~/composables/useEducationNavigation'

export type AdminListItem = {
  label: string
  href: string
  slug?: string
  icon?: string
  type?: 'page' | 'api' | 'form'
  description?: string
  apiPath?: string
  columns?: { key: string; label?: string; i18nKey?: string }[]
  mockData?: Record<string, unknown>[]
}

export type AdminCategory = {
  key: string
  title: string
  description?: string
  icon: string
  color?: string
  items: AdminListItem[]
}

export const useEducationAdministrationData = () => {
  const slugify = (label: string) =>
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  const definitions: AdminCategory[] = [
    {
      key: 'users',
      title: 'User management',
      description: 'Manage and monitor every user profile, session, and access point.',
      icon: 'mdi-account-cog-outline',
      color: 'primary',
      items: [
        {
          label: 'User list',
          href: `${EDUCATION_BASE_URL}/admin/users`,
          icon: 'mdi-format-list-bulleted',
          type: 'page',
          description: 'Browse, search, and filter all existing user profiles.',
          apiPath: 'users',
          columns: [
            { key: 'id', i18nKey: 'pages.education.administration.users.columns.id' },
            { key: 'username', i18nKey: 'pages.education.administration.users.columns.username' },
            { key: 'email', i18nKey: 'pages.education.administration.users.columns.email' },
            { key: 'status', i18nKey: 'pages.education.administration.users.columns.status' },
            { key: 'role', i18nKey: 'pages.education.administration.users.columns.role' },
          ],
          mockData: [
            {
              id: 101,
              username: 'aurore.dupont',
              email: 'aurore.dupont@example.com',
              status: 'Active',
              role: 'Trainer',
            },
            {
              id: 102,
              username: 'ines.kassab',
              email: 'ines.kassab@example.com',
              status: 'Pending',
              role: 'Learner',
            },
            {
              id: 103,
              username: 'ahmed.nabil',
              email: 'ahmed.nabil@example.com',
              status: 'Suspended',
              role: 'Manager',
            },
          ],
        },
        {
          label: 'Add a user',
          href: `${EDUCATION_BASE_URL}/admin/users/create`,
          icon: 'mdi-account-plus-outline',
          type: 'form',
          description: 'Create a single account with identifiers and roles.',
        },
        {
          label: 'Export users list',
          href: `${EDUCATION_BASE_URL}/admin/users/export`,
          icon: 'mdi-cloud-download-outline',
          type: 'api',
          description: 'Download the full roster as a CSV extract.',
        },
        {
          label: 'Create users list',
          href: `${EDUCATION_BASE_URL}/admin/users/batch-create`,
          icon: 'mdi-playlist-plus',
          type: 'form',
          description: 'Bulk-create users with templated fields.',
        },
        {
          label: 'Users tests',
          href: `${EDUCATION_BASE_URL}/admin/users/tests`,
          icon: 'mdi-clipboard-text-outline',
          type: 'page',
          description: 'Review test assignments and completions by user.',
        },
        {
          label: 'Active sessions',
          href: `${EDUCATION_BASE_URL}/admin/users/active-sessions`,
          icon: 'mdi-lan-connect',
          type: 'page',
          description: 'Inspect concurrent logins and terminate stale sessions.',
        },
        {
          label: 'Anonymous users',
          href: `${EDUCATION_BASE_URL}/admin/users/anonymous`,
          icon: 'mdi-incognito',
          type: 'page',
          description: 'Handle guest access and temporary identifiers.',
        },
        {
          label: 'Social ID login',
          href: `${EDUCATION_BASE_URL}/admin/auth/social`,
          icon: 'mdi-fingerprint',
          type: 'page',
          description: 'Configure SSO and external identity providers.',
        },
        {
          label: 'Forms config',
          href: `${EDUCATION_BASE_URL}/admin/forms/configuration`,
          icon: 'mdi-database-cog-outline',
          type: 'form',
          description: 'Manage custom fields for registration and profiles.',
        },
        {
          label: 'Enable content',
          href: `${EDUCATION_BASE_URL}/admin/content/enable`,
          icon: 'mdi-shield-check-outline',
          type: 'page',
          description: 'Toggle platform-wide content activation.',
        },
      ],
    },
    {
      key: 'courses',
      title: 'Course management',
      description: 'Create, organize, and maintain courses with all related assets.',
      icon: 'mdi-book-cog-outline',
      color: 'secondary',
      items: [
        {
          label: 'Search course',
          href: `${EDUCATION_BASE_URL}/admin/courses/search`,
          icon: 'mdi-magnify',
          type: 'page',
          description: 'Find courses by keyword, teacher, or category.',
        },
        {
          label: 'Course list',
          href: `${EDUCATION_BASE_URL}/admin/courses`,
          icon: 'mdi-format-list-bulleted',
          type: 'page',
          description: 'View all courses with quick filters.',
        },
        {
          label: 'Add a course',
          href: `${EDUCATION_BASE_URL}/admin/courses/create`,
          icon: 'mdi-book-plus-outline',
          type: 'form',
          description: 'Create a new course shell with essential data.',
        },
        {
          label: 'Export courses list',
          href: `${EDUCATION_BASE_URL}/admin/courses/export`,
          icon: 'mdi-cloud-download-outline',
          type: 'api',
          description: 'Export the catalog for reporting.',
        },
        {
          label: 'Import courses list',
          href: `${EDUCATION_BASE_URL}/admin/courses/import`,
          icon: 'mdi-cloud-upload-outline',
          type: 'form',
          description: 'Upload course templates in bulk.',
        },
        {
          label: 'Course categories',
          href: `${EDUCATION_BASE_URL}/admin/courses/categories`,
          icon: 'mdi-shape-outline',
          type: 'page',
          description: 'Maintain taxonomy and navigation groupings.',
        },
        {
          label: 'Add a user to course',
          href: `${EDUCATION_BASE_URL}/admin/courses/enroll-user`,
          icon: 'mdi-account-plus-outline',
          type: 'form',
          description: 'Enroll individual learners.',
        },
        {
          label: 'Import users list',
          href: `${EDUCATION_BASE_URL}/admin/courses/import-users`,
          icon: 'mdi-account-arrow-right-outline',
          type: 'form',
          description: 'Enroll cohorts from CSV.',
        },
        {
          label: 'Manage extra fields for courses',
          href: `${EDUCATION_BASE_URL}/admin/courses/extra-fields`,
          icon: 'mdi-form-select',
          type: 'page',
          description: 'Custom attributes for course metadata.',
        },
        {
          label: 'Resources sequencing',
          href: `${EDUCATION_BASE_URL}/admin/courses/sequencing`,
          icon: 'mdi-timeline-text-outline',
          type: 'page',
          description: 'Set progression rules and prerequisites.',
        },
      ],
    },
    {
      key: 'sessions',
      title: 'Sessions management',
      description: 'Package courses into training sessions and track their outcomes.',
      icon: 'mdi-calendar-clock-outline',
      color: 'teal',
      items: [
        {
          label: 'Training session list',
          href: `${EDUCATION_BASE_URL}/admin/sessions`,
          icon: 'mdi-calendar-text-outline',
          type: 'page',
          description: 'All scheduled and archived sessions.',
        },
        {
          label: 'Add a training session',
          href: `${EDUCATION_BASE_URL}/admin/sessions/create`,
          icon: 'mdi-calendar-plus',
          type: 'form',
          description: 'Configure a new training instance.',
        },
        {
          label: 'Select courses',
          href: `${EDUCATION_BASE_URL}/admin/sessions/courses`,
          icon: 'mdi-format-list-checkbox',
          type: 'page',
          description: 'Attach courses to a session shell.',
        },
        {
          label: 'Import sessions list',
          href: `${EDUCATION_BASE_URL}/admin/sessions/import`,
          icon: 'mdi-cloud-upload-outline',
          type: 'form',
          description: 'Bulk import from HRIS or CSV.',
        },
        {
          label: 'Import list of HR directories sessions',
          href: `${EDUCATION_BASE_URL}/admin/sessions/hr-import`,
          icon: 'mdi-office-building-outline',
          type: 'api',
          description: 'Synchronize corporate sessions from HR directories.',
        },
        {
          label: 'Open session',
          href: `${EDUCATION_BASE_URL}/admin/sessions/open`,
          icon: 'mdi-door-open',
          type: 'page',
          description: 'Activate a session for learner access.',
        },
        {
          label: 'Copy from a course session to course',
          href: `${EDUCATION_BASE_URL}/admin/sessions/copy-from-course`,
          icon: 'mdi-content-duplicate',
          type: 'page',
          description: 'Reuse materials between sessions.',
        },
        {
          label: 'Careers and promotions',
          href: `${EDUCATION_BASE_URL}/admin/sessions/careers`,
          icon: 'mdi-briefcase-arrow-up-down-outline',
          type: 'page',
          description: 'Align sessions with career paths and promotions.',
        },
        {
          label: 'Export session results',
          href: `${EDUCATION_BASE_URL}/admin/sessions/export-results`,
          icon: 'mdi-chart-box-outline',
          type: 'api',
          description: 'Download global performance metrics.',
        },
        {
          label: 'Export all results from an exercise',
          href: `${EDUCATION_BASE_URL}/admin/sessions/export-exercise-results`,
          icon: 'mdi-progress-download',
          type: 'api',
          description: 'Export exercise-level details for audits.',
        },
      ],
    },
    {
      key: 'platform',
      title: 'Platform management',
      description: 'Configure core education settings, portals, and integrations.',
      icon: 'mdi-cog-outline',
      color: 'deep-purple',
      items: [
        {
          label: 'Configuration settings',
          href: `${EDUCATION_BASE_URL}/admin/configuration`,
          icon: 'mdi-tune',
          type: 'page',
          description: 'Global toggles, branding, and rules.',
        },
        {
          label: 'Languages',
          href: `${EDUCATION_BASE_URL}/admin/languages`,
          icon: 'mdi-translate',
          type: 'page',
          description: 'Manage enabled locales and defaults.',
        },
        {
          label: 'Portal',
          href: `${EDUCATION_BASE_URL}/admin/portal`,
          icon: 'mdi-web',
          type: 'page',
          description: 'Landing experience and featured content.',
        },
        {
          label: 'Plugins',
          href: `${EDUCATION_BASE_URL}/admin/plugins`,
          icon: 'mdi-puzzle-outline',
          type: 'page',
          description: 'Activate add-ons and extensions.',
        },
        {
          label: 'Region',
          href: `${EDUCATION_BASE_URL}/admin/regions`,
          icon: 'mdi-map-marker-radius-outline',
          type: 'page',
          description: 'Regional rules and mappings.',
        },
        {
          label: 'Email templates',
          href: `${EDUCATION_BASE_URL}/admin/email-templates`,
          icon: 'mdi-email-edit-outline',
          type: 'page',
          description: 'Communication branding and automation.',
        },
        {
          label: 'Global quotas',
          href: `${EDUCATION_BASE_URL}/admin/quotas`,
          icon: 'mdi-scale-balance',
          type: 'page',
          description: 'Storage and usage thresholds.',
        },
        {
          label: 'Simple controls',
          href: `${EDUCATION_BASE_URL}/admin/controls`,
          icon: 'mdi-checkbox-multiple-marked-outline',
          type: 'page',
          description: 'Enable or disable quick platform features.',
        },
        {
          label: 'Statistics',
          href: `${EDUCATION_BASE_URL}/admin/statistics`,
          icon: 'mdi-chart-areaspline',
          type: 'page',
          description: 'Platform-wide analytics.',
        },
        {
          label: 'Reports',
          href: `${EDUCATION_BASE_URL}/admin/reports`,
          icon: 'mdi-file-chart-outline',
          type: 'page',
          description: 'Generate reporting packages.',
        },
        {
          label: 'Tracking sheets',
          href: `${EDUCATION_BASE_URL}/admin/tracking-sheets`,
          icon: 'mdi-clipboard-list-outline',
          type: 'page',
          description: 'Follow learner progress across assets.',
        },
        {
          label: 'Events list',
          href: `${EDUCATION_BASE_URL}/admin/events`,
          icon: 'mdi-calendar-multiselect',
          type: 'page',
          description: 'Platform timeline and scheduled actions.',
        },
        {
          label: 'Configure multiple access URLs',
          href: `${EDUCATION_BASE_URL}/admin/access-urls`,
          icon: 'mdi-link-variant',
          type: 'page',
          description: 'Multi-tenant routing and vanity URLs.',
        },
        {
          label: 'Multiple portal creation',
          href: `${EDUCATION_BASE_URL}/admin/portals/create`,
          icon: 'mdi-domain-plus',
          type: 'form',
          description: 'Spin up additional portals instantly.',
        },
        {
          label: 'External chat (XMPP)',
          href: `${EDUCATION_BASE_URL}/admin/chat/xmpp`,
          icon: 'mdi-message-text-lock-outline',
          type: 'page',
          description: 'Secure external messaging integration.',
        },
        {
          label: 'Import pages',
          href: `${EDUCATION_BASE_URL}/admin/pages/import`,
          icon: 'mdi-file-import-outline',
          type: 'form',
          description: 'Migrate portal pages in bulk.',
        },
      ],
    },
    {
      key: 'skills',
      title: 'Skills',
      description: 'Create and track skill matrices, badges, and assessments.',
      icon: 'mdi-diamond-stone',
      color: 'amber',
      items: [
        {
          label: 'Manage skill lists',
          href: `${EDUCATION_BASE_URL}/admin/skills`,
          icon: 'mdi-format-list-bulleted-type',
          type: 'page',
          description: 'Skill directories and frameworks.',
        },
        {
          label: 'Skills import',
          href: `${EDUCATION_BASE_URL}/admin/skills/import`,
          icon: 'mdi-cloud-upload-outline',
          type: 'form',
          description: 'Upload skills from existing models.',
        },
        {
          label: 'Manage badges',
          href: `${EDUCATION_BASE_URL}/admin/skills/badges`,
          icon: 'mdi-certificate-outline',
          type: 'page',
          description: 'Issue and revoke badges.',
        },
        {
          label: 'Skill rating',
          href: `${EDUCATION_BASE_URL}/admin/skills/rating`,
          icon: 'mdi-star-outline',
          type: 'page',
          description: 'Calibrate rating scales and rubrics.',
        },
        {
          label: 'Skills and assessments',
          href: `${EDUCATION_BASE_URL}/admin/skills/assessments`,
          icon: 'mdi-clipboard-check-outline',
          type: 'page',
          description: 'Connect assessments to skill objectives.',
        },
      ],
    },
    {
      key: 'system',
      title: 'System',
      description: 'View server health and troubleshoot performance tasks.',
      icon: 'mdi-server-network',
      color: 'indigo',
      items: [
        {
          label: 'Server status',
          href: `${EDUCATION_BASE_URL}/admin/system/status`,
          icon: 'mdi-lan-pending',
          type: 'page',
          description: 'Live environment checks.',
        },
        {
          label: 'Clear temporary files',
          href: `${EDUCATION_BASE_URL}/admin/system/clear-temp`,
          icon: 'mdi-broom',
          type: 'page',
          description: 'Clean caches and temporary storage.',
        },
        {
          label: 'Special exports',
          href: `${EDUCATION_BASE_URL}/admin/system/exports`,
          icon: 'mdi-file-export-outline',
          type: 'api',
          description: 'Generate advanced export packages.',
        },
        {
          label: 'Tests',
          href: `${EDUCATION_BASE_URL}/admin/system/tests`,
          icon: 'mdi-flask-outline',
          type: 'page',
          description: 'Diagnostics and smoke tests.',
        },
        {
          label: 'Update exercise results',
          href: `${EDUCATION_BASE_URL}/admin/system/update-results`,
          icon: 'mdi-refresh-circle',
          type: 'page',
          description: 'Recalculate assessments and scoring.',
        },
        {
          label: 'Paths',
          href: `${EDUCATION_BASE_URL}/admin/system/paths`,
          icon: 'mdi-folder-outline',
          type: 'page',
          description: 'System paths and mount points.',
        },
        {
          label: 'Resources by type',
          href: `${EDUCATION_BASE_URL}/admin/system/resources`,
          icon: 'mdi-database-eye-outline',
          type: 'page',
          description: 'Assets grouped by type for auditing.',
        },
      ],
    },
    {
      key: 'security',
      title: 'Security',
      description: 'Audit alerts, exports, and connection attempts in real time.',
      icon: 'mdi-shield-key-outline',
      color: 'error',
      items: [
        {
          label: 'Security alerts and exports',
          href: `${EDUCATION_BASE_URL}/admin/security/alerts`,
          icon: 'mdi-alarm-light-outline',
          type: 'page',
          description: 'Browse alerts and generate exports.',
        },
        {
          label: 'Login attempts',
          href: `${EDUCATION_BASE_URL}/admin/security/login-attempts`,
          icon: 'mdi-shield-lock-outline',
          type: 'page',
          description: 'Monitor authentication events.',
        },
        {
          label: 'Audit logs',
          href: `${EDUCATION_BASE_URL}/admin/security/audit-logs`,
          icon: 'mdi-file-search-outline',
          type: 'api',
          description: 'Download compliance trails.',
        },
      ],
    },
    {
      key: 'chamilo',
      title: 'Chamilo.org',
      description: 'Learn about Chamilo through guides, forums, and official news.',
      icon: 'mdi-school-outline',
      color: 'green',
      items: [
        {
          label: 'Chamilo homepage',
          href: 'https://chamilo.org',
          icon: 'mdi-home-outline',
          type: 'page',
          description: 'Official project website.',
        },
        {
          label: 'User guide',
          href: `${EDUCATION_BASE_URL}/help/user-guide`,
          icon: 'mdi-book-open-page-variant-outline',
          type: 'page',
          description: 'Online documentation for learners and admins.',
        },
        {
          label: 'Chamilo forum',
          href: 'https://forum.chamilo.org',
          icon: 'mdi-forum-outline',
          type: 'page',
          description: 'Community Q&A and tips.',
        },
        {
          label: 'Chamilo download',
          href: 'https://github.com/chamilo/chamilo-lms',
          icon: 'mdi-download-circle-outline',
          type: 'api',
          description: 'Source code and releases.',
        },
        {
          label: 'Guide to next version',
          href: `${EDUCATION_BASE_URL}/help/next-version`,
          icon: 'mdi-rocket-launch-outline',
          type: 'page',
          description: 'Preview upcoming changes.',
        },
        {
          label: 'Contribute code',
          href: 'https://github.com/chamilo/chamilo-lms/blob/master/CONTRIBUTING.md',
          icon: 'mdi-source-branch',
          type: 'page',
          description: 'Contribution guidelines.',
        },
        {
          label: 'Development guide',
          href: `${EDUCATION_BASE_URL}/help/development-guide`,
          icon: 'mdi-wrench-outline',
          type: 'page',
          description: 'Local setup and dev stack notes.',
        },
        {
          label: 'Chamilo extensions',
          href: `${EDUCATION_BASE_URL}/help/extensions`,
          icon: 'mdi-puzzle-star-outline',
          type: 'page',
          description: 'Extensions library and catalog.',
        },
        {
          label: 'Chamilo official news updates',
          href: 'https://news.chamilo.org',
          icon: 'mdi-newspaper-variant-outline',
          type: 'page',
          description: 'Announcements and release notes.',
        },
      ],
    },
    {
      key: 'health',
      title: 'Health check',
      description: 'Monitor environment validation and hosting assignments.',
      icon: 'mdi-heart-pulse',
      color: 'success',
      items: [
        {
          label: 'Email settings are OK',
          href: `${EDUCATION_BASE_URL}/admin/health/email`,
          icon: 'mdi-email-check-outline',
          type: 'page',
          description: 'Validate outbound mail setup.',
        },
        {
          label: 'All DNS have a server and admin assigned',
          href: `${EDUCATION_BASE_URL}/admin/health/dns`,
          icon: 'mdi-lan-check',
          type: 'page',
          description: 'DNS and admin mappings.',
        },
        {
          label: 'Run extended checks',
          href: `${EDUCATION_BASE_URL}/admin/health/full-scan`,
          icon: 'mdi-heart-pulse',
          type: 'api',
          description: 'Full platform scan and export.',
        },
      ],
    },
  ];

  const categories = computed<AdminCategory[]>(() =>
    definitions.map((category) => ({
      ...category,
      items: category.items.map((item) => ({
        ...item,
        slug: item.slug || slugify(item.label),
      })),
    })),
  )

  const findCategory = (key: string) =>
    categories.value.find((category) => category.key === key)

  const findEndpoint = (categoryKey: string, endpointSlug: string) =>
    findCategory(categoryKey)?.items.find((item) => item.slug === endpointSlug)

  return { categories, findCategory, findEndpoint }
}
