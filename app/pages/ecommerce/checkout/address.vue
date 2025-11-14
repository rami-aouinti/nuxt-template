<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'

import AppButton from '~/components/ui/AppButton.vue'
import AppCard from '~/components/ui/AppCard.vue'
import type { AddressAttributes, AddressJsonld } from '~/types/address'
import type { CountryInterfaceJsonld } from '~/types/country'
import type { OrderJsonLd } from '~/types/order'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

definePageMeta({
  title: 'pages.ecommerceCheckout.address.meta.title',
})

const email = ref('')
const useDifferentShipping = ref(false)
const isSubmitting = ref(false)
const submissionState = ref<'idle' | 'success' | 'error'>('idle')

const formRef = ref<VForm | null>(null)

const billingAddress = reactive<AddressAttributes>({
  firstName: '',
  lastName: '',
  company: '',
  street: '',
  city: '',
  postcode: '',
  countryCode: '',
  provinceCode: '',
  provinceName: '',
  phoneNumber: '',
})

const shippingAddress = reactive<AddressAttributes>({
  firstName: '',
  lastName: '',
  company: '',
  street: '',
  city: '',
  postcode: '',
  countryCode: '',
  provinceCode: '',
  provinceName: '',
  phoneNumber: '',
})

const createdBillingAddress = ref<AddressJsonld | null>(null)
const createdShippingAddress = ref<AddressJsonld | null>(null)

const orderToken = computed(() => {
  const queryToken = route.query.order ?? route.query.token ?? route.query.tokenValue
  if (Array.isArray(queryToken)) {
    return queryToken[0] ?? null
  }
  return queryToken ? String(queryToken) : null
})

const {
  data: orderData,
  pending: isOrderLoading,
  error: orderError,
} = await useAsyncData<OrderJsonLd | null>(
  () =>
    orderToken.value
      ? $fetch<OrderJsonLd>(`/api/ecommerce/v2/shop/orders/${encodeURIComponent(orderToken.value)}`)
      : Promise.resolve(null),
  {
    watch: [orderToken],
    server: false,
    default: () => null,
  },
)

const {
  data: countriesData,
  pending: isCountriesLoading,
  error: countriesError,
  refresh: refreshCountries,
} = await useAsyncData<CountryInterfaceJsonld[]>(
  'ecommerce-checkout-countries',
  () => $fetch<CountryInterfaceJsonld[]>(`/api/ecommerce/v2/shop/countries`),
  {
    server: false,
    default: () => [],
  },
)

const countries = computed(() => countriesData.value ?? [])

const rules = {
  required: (value: string) =>
    Boolean(value?.toString().trim()) || t('pages.ecommerceCheckout.address.form.validation.required'),
  email: (value: string) =>
    /[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+/.test(value) ||
    t('pages.ecommerceCheckout.address.form.validation.email'),
}

const currencyCode = computed(() => orderData.value?.currencyCode ?? 'USD')

const amountFormatter = computed(
  () =>
    new Intl.NumberFormat(locale.value ?? 'en', {
      style: 'currency',
      currency: currencyCode.value,
    }),
)

const formatAmount = (amount?: number | null) => {
  const formatter = amountFormatter.value
  if (amount == null) {
    return formatter.format(0)
  }

  const normalized = amount / 100
  return formatter.format(Number.isFinite(normalized) ? normalized : 0)
}

const orderTotals = computed(() => {
  const order = orderData.value
  if (!order) {
    return {
      itemsTotal: 0,
      orderPromotionTotal: 0,
      shippingTotal: 0,
      taxTotal: 0,
      total: 0,
      itemsCount: 0,
    }
  }

  return {
    itemsTotal: order.itemsTotal ?? 0,
    orderPromotionTotal: order.orderPromotionTotal ?? 0,
    shippingTotal: order.shippingTotal ?? 0,
    taxTotal: order.taxTotal ?? 0,
    total: order.total ?? 0,
    itemsCount: order.totalQuantity ?? 0,
  }
})

const shippingRoute = computed(() => {
  if (!orderToken.value) {
    return null
  }

  return localePath({
    name: 'ecommerce-checkout-shipping',
    query: { order: orderToken.value },
  })
})

watch(
  () => useDifferentShipping.value,
  (value) => {
    Object.assign(shippingAddress, billingAddress)
    if (!value) {
      createdShippingAddress.value = null
    }
  },
  { immediate: true },
)

const sanitizeAddressPayload = (address: AddressAttributes) => {
  const payload: Record<string, unknown> = {
    firstName: address.firstName.trim(),
    lastName: address.lastName.trim(),
    street: address.street.trim(),
    city: address.city.trim(),
    postcode: address.postcode.trim(),
    countryCode: address.countryCode,
  }

  if (address.company?.trim()) {
    payload.company = address.company.trim()
  }

  if (address.phoneNumber?.trim()) {
    payload.phoneNumber = address.phoneNumber.trim()
  }

  if (address.provinceCode?.trim()) {
    payload.provinceCode = address.provinceCode.trim()
  } else if (address.provinceName?.trim()) {
    payload.provinceName = address.provinceName.trim()
  }

  return payload
}

const clearFormFields = () => {
  email.value = ''
  Object.assign(billingAddress, {
    firstName: '',
    lastName: '',
    company: '',
    street: '',
    city: '',
    postcode: '',
    countryCode: '',
    provinceCode: '',
    provinceName: '',
    phoneNumber: '',
  })
  Object.assign(shippingAddress, {
    firstName: '',
    lastName: '',
    company: '',
    street: '',
    city: '',
    postcode: '',
    countryCode: '',
    provinceCode: '',
    provinceName: '',
    phoneNumber: '',
  })
  formRef.value?.resetValidation()
}

const submit = async () => {
  const result = await formRef.value?.validate()
  if (!result?.valid) {
    return
  }

  submissionState.value = 'idle'
  isSubmitting.value = true

  try {
    const billingPayload = sanitizeAddressPayload(billingAddress)
    const shippingPayload = sanitizeAddressPayload(
      useDifferentShipping.value ? shippingAddress : billingAddress,
    )

    const [billingResponse, shippingResponse] = await Promise.all([
      $fetch<AddressJsonld>('/api/ecommerce/v2/shop/addresses', {
        method: 'POST',
        body: billingPayload,
      }),
      useDifferentShipping.value
        ? $fetch<AddressJsonld>('/api/ecommerce/v2/shop/addresses', {
            method: 'POST',
            body: shippingPayload,
          })
        : Promise.resolve<AddressJsonld | null>(null),
    ])

    createdBillingAddress.value = billingResponse
    createdShippingAddress.value = useDifferentShipping.value ? shippingResponse : null
    submissionState.value = 'success'

    clearFormFields()
  } catch (error) {
    console.error(error)
    submissionState.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="checkout-address-page">
    <div class="checkout-address-page__background" />
    <v-container class="py-10" fluid>
      <v-row class="checkout-address-page__grid" align="stretch" justify="center">
        <v-col cols="12" lg="7">
          <AppCard class="checkout-address-card" elevation="3">
            <div class="checkout-address-card__header">
              <div>
                <p class="text-body-2 text-uppercase text-medium-emphasis font-weight-medium mb-1">
                  {{ t('pages.ecommerceCheckout.address.headline.step', { step: 1 }) }}
                </p>
                <h1 class="text-h5 text-md-h4 font-weight-bold">
                  {{ t('pages.ecommerceCheckout.address.headline.title') }}
                </h1>
                <p class="text-body-2 text-medium-emphasis mt-1">
                  {{ t('pages.ecommerceCheckout.address.headline.subtitle') }}
                </p>
              </div>
              <div class="checkout-address-card__steps">
                <span class="checkout-address-card__step checkout-address-card__step--active">
                  {{ t('pages.ecommerceCheckout.address.steps.address') }}
                </span>
                <span class="checkout-address-card__step">
                  {{ t('pages.ecommerceCheckout.address.steps.shipping') }}
                </span>
                <span class="checkout-address-card__step">
                  {{ t('pages.ecommerceCheckout.address.steps.payment') }}
                </span>
                <span class="checkout-address-card__step">
                  {{ t('pages.ecommerceCheckout.address.steps.complete') }}
                </span>
              </div>
            </div>

            <v-alert
              v-if="submissionState === 'success'"
              type="success"
              variant="tonal"
              class="mb-4"
              density="comfortable"
            >
              {{ t('pages.ecommerceCheckout.address.status.success') }}
            </v-alert>
            <v-alert
              v-else-if="submissionState === 'error'"
              type="error"
              variant="tonal"
              class="mb-4"
              density="comfortable"
            >
              {{ t('pages.ecommerceCheckout.address.status.error') }}
            </v-alert>

            <v-form ref="formRef" @submit.prevent="submit">
              <section class="checkout-address-section mb-6">
                <h2 class="checkout-address-section__title text-h6 font-weight-semibold mb-4">
                  {{ t('pages.ecommerceCheckout.address.form.contact.title') }}
                </h2>
                <v-text-field
                  v-model="email"
                  :label="t('pages.ecommerceCheckout.address.form.contact.email')"
                  :rules="[rules.required, rules.email]"
                  autocomplete="email"
                  type="email"
                  variant="outlined"
                  rounded
                />
              </section>

              <section class="checkout-address-section mb-6">
                <div class="checkout-address-section__header">
                  <h2 class="checkout-address-section__title text-h6 font-weight-semibold">
                    {{ t('pages.ecommerceCheckout.address.form.billing.title') }}
                  </h2>
                  <p class="text-body-2 text-medium-emphasis">
                    {{ t('pages.ecommerceCheckout.address.form.billing.description') }}
                  </p>
                </div>
                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="billingAddress.firstName"
                      :label="t('pages.ecommerceCheckout.address.form.billing.firstName')"
                      :rules="[rules.required]"
                      autocomplete="given-name"
                      variant="outlined"
                      rounded
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="billingAddress.lastName"
                      :label="t('pages.ecommerceCheckout.address.form.billing.lastName')"
                      :rules="[rules.required]"
                      autocomplete="family-name"
                      variant="outlined"
                      rounded
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="billingAddress.company"
                      :label="t('pages.ecommerceCheckout.address.form.billing.company')"
                      autocomplete="organization"
                      variant="outlined"
                      rounded
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="billingAddress.street"
                      :label="t('pages.ecommerceCheckout.address.form.billing.street')"
                      :rules="[rules.required]"
                      autocomplete="address-line1"
                      variant="outlined"
                      rounded
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="billingAddress.city"
                      :label="t('pages.ecommerceCheckout.address.form.billing.city')"
                      :rules="[rules.required]"
                      autocomplete="address-level2"
                      variant="outlined"
                      rounded
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="billingAddress.postcode"
                      :label="t('pages.ecommerceCheckout.address.form.billing.postcode')"
                      :rules="[rules.required]"
                      autocomplete="postal-code"
                      variant="outlined"
                      rounded
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="billingAddress.countryCode"
                      :label="t('pages.ecommerceCheckout.address.form.billing.country')"
                      :items="countries"
                      :item-title="(country) => country.name ?? country.code"
                      item-value="code"
                      :loading="isCountriesLoading"
                      :rules="[rules.required]"
                      variant="outlined"
                      rounded
                      @blur="countriesError ? refreshCountries() : undefined"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="billingAddress.provinceName"
                      :label="t('pages.ecommerceCheckout.address.form.billing.province')"
                      autocomplete="address-level1"
                      variant="outlined"
                      rounded
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="billingAddress.phoneNumber"
                      :label="t('pages.ecommerceCheckout.address.form.billing.phoneNumber')"
                      autocomplete="tel"
                      variant="outlined"
                      rounded
                    />
                  </v-col>
                </v-row>
              </section>

              <v-divider class="my-6" />

              <section class="checkout-address-section">
                <div class="d-flex align-center justify-space-between mb-4">
                  <h2 class="checkout-address-section__title text-h6 font-weight-semibold mb-0">
                    {{ t('pages.ecommerceCheckout.address.form.shipping.title') }}
                  </h2>
                  <v-switch
                    v-model="useDifferentShipping"
                    inset
                    color="primary"
                    density="comfortable"
                    :label="t('pages.ecommerceCheckout.address.form.shipping.useDifferent')"
                  />
                </div>

                <v-expand-transition>
                  <div v-if="useDifferentShipping" class="checkout-address-section__shipping">
                    <p class="text-body-2 text-medium-emphasis mb-4">
                      {{ t('pages.ecommerceCheckout.address.form.shipping.description') }}
                    </p>
                    <v-row dense>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="shippingAddress.firstName"
                          :label="t('pages.ecommerceCheckout.address.form.shipping.firstName')"
                          :rules="[rules.required]"
                          autocomplete="shipping given-name"
                          variant="outlined"
                          rounded
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="shippingAddress.lastName"
                          :label="t('pages.ecommerceCheckout.address.form.shipping.lastName')"
                          :rules="[rules.required]"
                          autocomplete="shipping family-name"
                          variant="outlined"
                          rounded
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="shippingAddress.company"
                          :label="t('pages.ecommerceCheckout.address.form.shipping.company')"
                          autocomplete="shipping organization"
                          variant="outlined"
                          rounded
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="shippingAddress.street"
                          :label="t('pages.ecommerceCheckout.address.form.shipping.street')"
                          :rules="[rules.required]"
                          autocomplete="shipping address-line1"
                          variant="outlined"
                          rounded
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="shippingAddress.city"
                          :label="t('pages.ecommerceCheckout.address.form.shipping.city')"
                          :rules="[rules.required]"
                          autocomplete="shipping address-level2"
                          variant="outlined"
                          rounded
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="shippingAddress.postcode"
                          :label="t('pages.ecommerceCheckout.address.form.shipping.postcode')"
                          :rules="[rules.required]"
                          autocomplete="shipping postal-code"
                          variant="outlined"
                          rounded
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="shippingAddress.countryCode"
                          :label="t('pages.ecommerceCheckout.address.form.shipping.country')"
                          :items="countries"
                          :item-title="(country) => country.name ?? country.code"
                          item-value="code"
                          :loading="isCountriesLoading"
                          :rules="[rules.required]"
                          variant="outlined"
                          rounded
                          @blur="countriesError ? refreshCountries() : undefined"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="shippingAddress.provinceName"
                          :label="t('pages.ecommerceCheckout.address.form.shipping.province')"
                          autocomplete="shipping address-level1"
                          variant="outlined"
                          rounded
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="shippingAddress.phoneNumber"
                          :label="t('pages.ecommerceCheckout.address.form.shipping.phoneNumber')"
                          autocomplete="shipping tel"
                          variant="outlined"
                          rounded
                        />
                      </v-col>
                    </v-row>
                  </div>
                </v-expand-transition>
              </section>

              <div class="checkout-address-actions mt-8">
                <AppButton
                  class="checkout-address-actions__back"
                  color="default"
                  variant="tonal"
                  :to="localePath('ecommerce')"
                >
                  {{ t('pages.ecommerceCheckout.address.actions.back') }}
                </AppButton>
                <AppButton
                  v-if="shippingRoute"
                  color="primary"
                  variant="outlined"
                  :to="shippingRoute"
                >
                  {{ t('pages.ecommerceCheckout.address.actions.goToShipping') }}
                </AppButton>
                <AppButton
                  color="primary"
                  size="large"
                  type="submit"
                  :loading="isSubmitting"
                >
                  {{ t('pages.ecommerceCheckout.address.actions.next') }}
                </AppButton>
              </div>
            </v-form>
          </AppCard>
        </v-col>

        <v-col cols="12" lg="5">
          <div class="checkout-summary">
            <AppCard class="checkout-summary__card" elevation="3">
              <h2 class="text-h6 font-weight-semibold mb-4">
                {{ t('pages.ecommerceCheckout.address.summary.title') }}
              </h2>

              <v-alert
                v-if="orderError"
                type="error"
                variant="tonal"
                density="compact"
                class="mb-4"
              >
                {{ t('pages.ecommerceCheckout.address.summary.orderError') }}
              </v-alert>
              <v-progress-linear
                v-else-if="isOrderLoading"
                indeterminate
                color="primary"
                class="mb-4"
              />

              <ul class="checkout-summary__items">
                <li class="checkout-summary__row">
                  <span>{{ t('pages.ecommerceCheckout.address.summary.itemsTotal') }}</span>
                  <strong>{{ formatAmount(orderTotals.itemsTotal) }}</strong>
                </li>
                <li class="checkout-summary__row">
                  <span>{{ t('pages.ecommerceCheckout.address.summary.discount') }}</span>
                  <strong>-{{ formatAmount(Math.abs(orderTotals.orderPromotionTotal)) }}</strong>
                </li>
                <li class="checkout-summary__row">
                  <span>{{ t('pages.ecommerceCheckout.address.summary.shipping') }}</span>
                  <strong>{{ formatAmount(orderTotals.shippingTotal) }}</strong>
                </li>
                <li class="checkout-summary__row">
                  <span>{{ t('pages.ecommerceCheckout.address.summary.taxes') }}</span>
                  <strong>{{ formatAmount(orderTotals.taxTotal) }}</strong>
                </li>
              </ul>

              <v-divider class="my-4" />

              <div class="checkout-summary__total">
                <span>{{ t('pages.ecommerceCheckout.address.summary.total') }}</span>
                <strong>{{ formatAmount(orderTotals.total) }}</strong>
              </div>

              <p class="text-body-2 text-medium-emphasis mt-4">
                {{ t('pages.ecommerceCheckout.address.summary.itemsLabel', {
                  count: orderTotals.itemsCount,
                }) }}
              </p>
            </AppCard>

            <v-expand-transition>
              <AppCard
                v-if="createdBillingAddress || createdShippingAddress"
                class="checkout-summary__confirmation"
                elevation="1"
              >
                <h3 class="text-subtitle-1 font-weight-semibold mb-3">
                  {{ t('pages.ecommerceCheckout.address.summary.confirmationTitle') }}
                </h3>
                <div v-if="createdBillingAddress" class="mb-3">
                  <h4 class="text-body-2 font-weight-medium mb-1">
                    {{ t('pages.ecommerceCheckout.address.summary.billingSaved') }}
                  </h4>
                  <p class="text-body-2 text-medium-emphasis">
                    {{ createdBillingAddress.firstName }} {{ createdBillingAddress.lastName }}
                  </p>
                </div>
                <div v-if="createdShippingAddress">
                  <h4 class="text-body-2 font-weight-medium mb-1">
                    {{ t('pages.ecommerceCheckout.address.summary.shippingSaved') }}
                  </h4>
                  <p class="text-body-2 text-medium-emphasis">
                    {{ createdShippingAddress.firstName }} {{ createdShippingAddress.lastName }}
                  </p>
                </div>
              </AppCard>
            </v-expand-transition>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.checkout-address-page {
  position: relative;
  min-height: 100%;
  background: linear-gradient(120deg, rgba(111, 66, 193, 0.1), rgba(59, 130, 246, 0.12));
  padding-block: 3rem;
}

.checkout-address-page__background {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.2), transparent 45%),
    radial-gradient(circle at bottom left, rgba(236, 72, 153, 0.18), transparent 45%);
  pointer-events: none;
}

.checkout-address-page__grid {
  position: relative;
  z-index: 1;
}

.checkout-address-card {
  padding: 2.5rem;
  backdrop-filter: blur(16px);
}

.checkout-address-card__header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.checkout-address-card__steps {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.checkout-address-card__step {
  padding: 0.4rem 1rem;
  border-radius: 999px;
  background-color: rgba(59, 130, 246, 0.1);
  color: rgb(var(--v-theme-primary));
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.checkout-address-card__step--active {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-primary-darken-1)));
  color: white;
}

.checkout-address-section__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.checkout-address-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.checkout-address-actions__back {
  color: rgb(var(--v-theme-primary));
}

.checkout-summary {
  position: sticky;
  top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.checkout-summary__card {
  padding: 2rem;
}

.checkout-summary__items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}

.checkout-summary__row {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: rgba(var(--v-theme-on-surface), 0.78);
}

.checkout-summary__row strong {
  color: rgb(var(--v-theme-on-surface));
}

.checkout-summary__total {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 700;
}

.checkout-summary__confirmation {
  padding: 1.5rem;
}

@media (max-width: 960px) {
  .checkout-summary {
    position: static;
  }

  .checkout-address-card {
    padding: 1.75rem;
  }
}
</style>
