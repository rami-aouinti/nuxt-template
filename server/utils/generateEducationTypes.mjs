import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const rootDir = process.cwd()
const sqlPath = join(rootDir, 'symfony_education.sql')
const outputPath = join(rootDir, 'app/types/education.ts')

const sql = readFileSync(sqlPath, 'utf8')

const tableRegex = /CREATE TABLE `([^`]+)` \(([^]*?)\) ENGINE=/g

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1)

const toTypeName = (tableName) =>
  tableName
    .split('_')
    .filter(Boolean)
    .map((segment) => segment.replace(/[^a-zA-Z0-9]/g, ''))
    .filter(Boolean)
    .map(capitalize)
    .join('')

const sqlTypeToTs = (rawType) => {
  const normalized = rawType.toLowerCase()

  if (normalized.startsWith('tinyint(1)')) return 'boolean'
  if (
    normalized.startsWith('int') ||
    normalized.startsWith('smallint') ||
    normalized.startsWith('mediumint') ||
    normalized.startsWith('bigint') ||
    normalized.startsWith('tinyint') ||
    normalized.startsWith('decimal') ||
    normalized.startsWith('float') ||
    normalized.startsWith('double')
  ) {
    return 'number'
  }

  if (
    normalized.includes('varchar') ||
    normalized.includes('text') ||
    normalized.includes('char') ||
    normalized.includes('blob') ||
    normalized.startsWith('enum')
  ) {
    return 'string'
  }

  if (
    normalized.includes('datetime') ||
    normalized.includes('timestamp') ||
    normalized === 'date' ||
    normalized === 'time' ||
    normalized === 'year'
  ) {
    return 'string'
  }

  if (normalized.includes('json')) return 'Record<string, unknown>'

  return 'unknown'
}

const parseColumns = (block) => {
  return block
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('`'))
    .map((line) => {
      const columnMatch = line.match(/`([^`]+)`\s+([^\s,]+)(.*)/)
      if (!columnMatch) return null

      const [, name, rawType, rest] = columnMatch
      const nullable = !/not null/i.test(rest)
      const tsType = sqlTypeToTs(rawType)

      return {
        name,
        tsType,
        nullable,
      }
    })
    .filter(Boolean)
}

const interfaces = []

for (const match of sql.matchAll(tableRegex)) {
  const tableName = match[1]
  const columnsBlock = match[2]
  const typeName = toTypeName(tableName)
  if (!typeName) continue

  const columns = parseColumns(columnsBlock)
  if (!columns.length) continue

  const properties = columns
    .map((column) => {
      const type = column.nullable ? `${column.tsType} | null` : column.tsType
      return `  ${column.name}: ${type}`
    })
    .join('\n')

  interfaces.push(`export interface ${typeName} {\n${properties}\n}`)
}

const fileContent = `// Auto-generated from symfony_education.sql to describe education entities.\n// Do not edit by hand; update symfony_education.sql and rerun server/utils/generateEducationTypes.mjs.\n\n${interfaces.join('\n\n')}\n`

writeFileSync(outputPath, fileContent)

console.log(`Generated ${interfaces.length} education entity types at ${outputPath}`)
