import { promises as fs } from 'fs'
import path from 'path'

const sourceRoot = path.resolve('education/views')
const targetRoot = path.resolve('app/pages/education')

function toKebab(value) {
  return value
    .replace(/\.vue$/i, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
}

function toTitle(value) {
  return value
    .replace(/\.vue$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase())
}

async function getViewFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await getViewFiles(fullPath)))
    } else if (entry.isFile() && entry.name.endsWith('.vue')) {
      files.push(fullPath)
    }
  }

  return files
}

async function generate() {
  const files = await getViewFiles(sourceRoot)

  for (const filePath of files) {
    const relative = path.relative(sourceRoot, filePath)
    const segments = relative.split(path.sep)
    const fileName = segments.pop() ?? 'index.vue'
    const kebabSegments = segments.map(toKebab)
    const slug = toKebab(fileName)
    const pageDir = path.join(targetRoot, ...kebabSegments)
    const pagePath = path.join(pageDir, `${slug}.vue`)

    await fs.mkdir(pageDir, { recursive: true })

    try {
      await fs.access(pagePath)
      console.warn(`Skipping existing page: ${path.relative(process.cwd(), pagePath)}`)
      continue
    } catch {
      // Create a fresh file
    }

    const importPath = `~/education/views/${relative.replace(/\\/g, '/')}`
    const pageTitle = toTitle(fileName)

    const content = `\
<script setup lang="ts">
import { useHead } from '#imports'
import LegacyView from '${importPath}'

definePageMeta({
  layout: 'default',
})

useHead({
  title: '${pageTitle}',
})
</script>

<template>
  <VContainer fluid class="py-6">
    <VCard variant="text" color="transparent">
      <component :is="LegacyView" />
    </VCard>
  </VContainer>
</template>
`

    await fs.writeFile(pagePath, content, 'utf8')
    console.log(`Created page: ${path.relative(process.cwd(), pagePath)}`)
  }
}

generate().catch((error) => {
  console.error(error)
  process.exit(1)
})
