<script setup lang="ts">
import { mergeProps, ref, watch, computed } from 'vue'
import { useTheme } from 'vuetify'
import type { LocaleObject } from '#i18n'
import { Notify } from '~/stores/notification'

const theme = useTheme()
const drawer = useState('drawer')
const route = useRoute()
const { t, locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const breadcrumbs = computed(() => {
  return route!.matched
    .filter((item) => item.meta && item.meta.title)
    .map((r) => {
      const routeName = typeof r.name === 'string' ? r.name : undefined
      const localizedPath =
        routeName != null
          ? localePath({
              name: routeName,
              params: route.params,
              query: route.query,
            })
          : route.path

      return {
        title: t(String(r.meta.title!)),
        disabled: localizedPath === route.path || false,
        to: localizedPath,
      }
    })
})
const isDark = computed({
  get() {
    return theme.current.value.dark
  },
  set(v) {
    theme.change(v ? 'dark' : 'light')
  },
})
const { loggedIn, clear, user, session } = useUserSession()
const profileCache = useAuthProfileCache()
const credentialsDialog = ref(false)
const controlChevronSize = 18

type LanguageItem = LocaleObject & {
  to: string;
  flag?: string;
  flagIcon?: string;
};

const toFlagEmoji = (code?: string) => {
  if (!code || !/^[A-Z]{2}$/.test(code)) {
    return undefined
  }

  return Array.from(code).reduce((emoji, char) => {
    const base = 0x1f1e6
    const offset = char.charCodeAt(0) - 65
    return `${emoji}${String.fromCodePoint(base + offset)}`
  }, '')
}

const extractFlagCode = (language: LocaleObject) => {
  const iconCountry = language.icon?.split(' ').pop()
  if (iconCountry && /^[a-zA-Z]{2}$/.test(iconCountry)) {
    return iconCountry.toUpperCase()
  }

  const isoCountry = language.iso?.split('-').pop()
  if (isoCountry && /^[a-zA-Z]{2}$/.test(isoCountry)) {
    return isoCountry.toUpperCase()
  }

  const codeCountry = language.code.split('-').pop()
  if (codeCountry && /^[a-zA-Z]{2}$/.test(codeCountry)) {
    return codeCountry.toUpperCase()
  }

  return undefined
}

const toFlagIconName = (code?: string) => {
  if (!code || !/^[A-Z]{2}$/.test(code)) {
    return undefined
  }

  return `circle-flags:${code.toLowerCase()}`
}

const languageItems = computed<LanguageItem[]>(() => {
  const availableLocales = (locales.value ?? []) as LocaleObject[];

  return availableLocales.map((language) => {
    const flagCode = extractFlagCode(language);

    return {
      ...language,
      to: switchLocalePath(language.code) ?? localePath('/'),
      flag: toFlagEmoji(flagCode),
      flagIcon: toFlagIconName(flagCode),
    };
  });
});

const currentLanguage = computed(() =>
  languageItems.value.find((language) => language.code === locale.value),
);

const hasLanguageMenu = computed(() => languageItems.value.length > 0);

const handleLogout = async () => {
  await clear()
  profileCache.value = null
  Notify.success(t('auth.logoutSuccess'))
}

watch(
  () => session.value?.profile,
  (profile) => {
    if (profile) {
      profileCache.value = profile
    }
  },
  { immediate: true },
)

watch(loggedIn, (value) => {
  if (!value) {
    profileCache.value = null
  }
})
</script>

<template>
  <v-app-bar flat>
    <AuthCredentialsDialog v-model="credentialsDialog" />
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <v-breadcrumbs :items="breadcrumbs" />
    <v-spacer />
    <div id="app-bar" />
    <div class="dock-navbar__actions">
      <AppMessenger />
      <AppNotification />
      <v-switch
        v-model="isDark"
        color=""
        hide-details
        inset
        class="dock-navbar__theme-switch"
        false-icon="mdi-white-balance-sunny"
        true-icon="mdi-weather-night"
      />
      <v-menu location="bottom" class="dock-navbar__menu">
        <template #activator="{ props: menu }">
          <v-tooltip location="bottom">
            <template #activator="{ props: tooltip }">
              <v-btn
                icon
                v-bind="mergeProps(menu, tooltip)"
                class="dock-navbar__action-button"
              >
                <v-icon v-if="!loggedIn" icon="mdi-account-circle" size="36" />
                <v-avatar v-else color="primary" size="36">
                  <v-img :src="user?.avatar_url" />
                </v-avatar>
              </v-btn>
            </template>
            <span>{{ loggedIn ? user!.login : t('auth.guest') }}</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item
            v-if="loggedIn"
            :title="t('navigation.profile')"
            prepend-icon="mdi-face"
            :to="localePath('profile')"
          />
          <v-list-item
            :title="t('navigation.settings')"
            prepend-icon="mdi-cog-outline"
            :to="localePath('settings')"
          />
          <v-list-item
            :title="t('navigation.help')"
            prepend-icon="mdi-lifebuoy"
            :to="localePath('help')"
          />
          <v-list-item
            :title="t('navigation.about')"
            prepend-icon="mdi-information-outline"
            :to="localePath('about')"
          />
          <v-list-item
            :title="t('navigation.contact')"
            prepend-icon="mdi-email-outline"
            :to="localePath('contact')"
          />
          <v-divider class="my-2" />
          <template v-if="loggedIn">
            <v-list-item
              :title="t('auth.logout')"
              prepend-icon="mdi-logout"
              @click="handleLogout"
            />
          </template>
          <template v-else>
            <v-list-item
              :title="t('auth.loginWithGithub')"
              prepend-icon="mdi-github"
              href="/api/auth/github"
            />
            <v-list-item
              :title="t('auth.loginWithGoogle')"
              prepend-icon="mdi-google"
              href="/api/auth/google"
            />
            <v-list-item
              :title="t('auth.loginWithFacebook')"
              prepend-icon="mdi-facebook"
              href="/api/auth/facebook"
            />
            <v-list-item
              :title="t('auth.loginWithCredentials')"
              prepend-icon="mdi-lock"
              @click="credentialsDialog = true"
            />
          </template>
        </v-list>
      </v-menu>
      <v-menu
        v-if="hasLanguageMenu"
        transition="fade-transition"
        :offset="[0, 12]"
        class="dock-navbar__menu"
      >
        <template #activator="{ props }">
          <button
            class="dock-navbar__language-button"
            type="button"
            v-bind="props"
          >
            <span
              v-if="currentLanguage?.flag"
              class="dock-navbar__language-flag"
              aria-hidden="true"
            >
              {{ currentLanguage.flag }}
            </span>
            <Icon
              v-else-if="currentLanguage?.flagIcon"
              :name="currentLanguage.flagIcon"
              class="dock-navbar__language-flag-icon"
              aria-hidden="true"
            />
            <span
              v-else
              class="dock-navbar__language-code"
              aria-hidden="true"
            >
              {{ currentLanguage?.code?.toUpperCase() }}
            </span>
          </button>
        </template>

        <v-list
          class="dock-navbar__language-list"
          density="compact"
          tag="ul"
        >
          <v-list-item
            v-for="language in languageItems"
            :key="language.code"
            tag="li"
            class="dock-navbar__language-list-item"
            :class="{
              'dock-navbar__language-list-item--active': language.code === locale,
            }"
          >
            <NuxtLink
              :to="language.to"
              class="dock-navbar__language-link"
            >
              <div class="dock-navbar__language-item">
                <div class="dock-navbar__language-info">
                  <span
                    v-if="language.flag"
                    class="dock-navbar__language-flag dock-navbar__language-flag--item"
                    aria-hidden="true"
                  >
                    {{ language.flag }}
                  </span>
                  <Icon
                    v-else-if="language.flagIcon"
                    :name="language.flagIcon"
                    class="dock-navbar__language-flag-icon dock-navbar__language-flag-icon--item"
                    aria-hidden="true"
                  />
                  <span class="dock-navbar__language-name">{{ language.name }}</span>
                </div>
                <v-icon
                  v-if="language.code === locale"
                  icon="mdi-check"
                  :size="controlChevronSize"
                  class="dock-navbar__language-check"
                />
              </div>
            </NuxtLink>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<style scoped>
.dock-navbar__actions {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: 0.75rem;
}

.dock-navbar__menu :deep(.v-overlay__content) {
  margin-top: 0.25rem;
}

.dock-navbar__action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
}

.dock-navbar__theme-switch {
  --dock-navbar-switch-size: 40px;
  --dock-navbar-switch-track: 28px;
  --dock-navbar-switch-thumb: 18px;
  display: flex;
  align-items: center;
  height: var(--dock-navbar-switch-size);
  padding-inline: 0.25rem;
  border-radius: 9999px;
  background-color: rgba(var(--v-theme-surface-variant), 0.24);
}

.dock-navbar__theme-switch :deep(.v-switch__track) {
  height: var(--dock-navbar-switch-track);
  width: 48px;
  border-radius: 9999px;
  background-color: transparent !important;
}

.dock-navbar__theme-switch :deep(.v-switch__thumb) {
  width: var(--dock-navbar-switch-thumb);
  height: var(--dock-navbar-switch-thumb);
}

.dock-navbar__theme-switch :deep(.v-switch__selection) {
  display: none;
}

.dock-navbar__language-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.dock-navbar__language-flag {
  font-size: 1.25rem;
  line-height: 1;
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji', sans-serif;
}

.dock-navbar__language-flag-icon {
  display: inline-flex;
  width: 1.25rem;
  height: 1.25rem;
}

.dock-navbar__language-flag-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.dock-navbar__language-flag--item {
  margin-right: 0.5rem;
  font-size: 1rem;
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji', sans-serif;
}

.dock-navbar__language-flag-icon--item {
  display: inline-flex;
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
}

.dock-navbar__language-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dock-navbar__language-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.dock-navbar__language-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.dock-navbar__language-button:hover {
  background-color: rgba(var(--v-theme-surface-variant), 0.24);
}
</style>
