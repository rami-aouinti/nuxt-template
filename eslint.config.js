import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/valid-v-slot': ['error', { allowModifiers: true }], // allow vuetify slot modifier
    'vue/html-self-closing': ['error', { html: { void: 'any' } }], // not conflict with prettier
    '@typescript-eslint/no-explicit-any': 'off',

    // Legacy codebase lint relaxations
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-dynamic-delete': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/unified-signatures': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
    'no-prototype-builtins': 'off',
    'no-constant-binary-expression': 'off',
    'no-empty': 'off',
    'no-unused-vars': 'off',
    'no-useless-escape': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-export-in-script-setup': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/no-required-prop-with-default': 'off',
    'vue/no-side-effects-in-computed-properties': 'off',
    'vue/no-template-shadow': 'off',
    'vue/no-v-html': 'off',
    'vue/no-v-text-v-html-on-component': 'off',
    'vue/no-unused-vars': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-explicit-emits': 'off',
    'vue/use-v-on-exact': 'off',
    'vue/valid-template-root': 'off',
  },
})
