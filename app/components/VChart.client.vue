<template>
  <div class="v-chart-stub" role="img" :aria-label="ariaLabel">
    <svg
      v-if="chartType === 'line' && linePath"
      class="v-chart-stub__line"
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
    >
      <polygon
        v-if="lineAreaPath"
        class="v-chart-stub__line-area"
        :points="lineAreaPath"
      />
      <polyline
        class="v-chart-stub__line-path"
        :points="linePath"
        fill="none"
      />
    </svg>

    <div v-else-if="chartType === 'bar' && barValues.length" class="v-chart-stub__bars">
      <div
        v-for="bar in barValues"
        :key="bar.label"
        class="v-chart-stub__bar"
      >
        <div class="v-chart-stub__bar-track">
          <div
            class="v-chart-stub__bar-fill"
            :style="{ height: `${bar.normalized * 100}%` }"
          />
        </div>
        <span class="v-chart-stub__bar-label">{{ bar.label }}</span>
      </div>
    </div>

    <div v-else-if="chartType === 'pie' && pieSegments.length" class="v-chart-stub__pie">
      <div class="v-chart-stub__pie-figure" :style="{ background: pieGradient }" />
      <ul class="v-chart-stub__legend">
        <li v-for="segment in pieSegments" :key="segment.label">
          <span class="v-chart-stub__legend-color" :style="{ background: segment.color }" />
          <span class="v-chart-stub__legend-label">{{ segment.label }}</span>
          <span class="v-chart-stub__legend-value">{{ segment.percent }}%</span>
        </li>
      </ul>
    </div>

    <svg
      v-else-if="chartType === 'radar' && radarPolygons.length"
      class="v-chart-stub__radar"
      viewBox="-60 -60 120 120"
      preserveAspectRatio="xMidYMid meet"
    >
      <polygon
        v-for="(ring, index) in radarGrid"
        :key="`grid-${index}`"
        class="v-chart-stub__radar-grid"
        :points="ring"
      />
      <g v-for="polygon in radarPolygons" :key="polygon.name">
        <polygon
          class="v-chart-stub__radar-polygon"
          :style="{ fill: polygon.fill, stroke: polygon.stroke }"
          :points="polygon.points"
        />
      </g>
    </svg>

    <div v-else class="v-chart-stub__fallback">
      <slot>
        <p class="text-caption mb-0">
          {{ $t('admin.ecommerce.dashboard.charts.unavailable') || 'Chart preview not available.' }}
        </p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  option: Record<string, unknown>
  autoresize?: boolean
}>()

const palette = [
  'var(--v-theme-primary)',
  'var(--v-theme-secondary)',
  'var(--v-theme-success)',
  'var(--v-theme-info)',
  'var(--v-theme-warning)',
  'var(--v-theme-error)',
]

const series = computed(() => {
  const rawSeries = props.option?.series
  if (!Array.isArray(rawSeries)) {
    return []
  }
  return rawSeries as Record<string, unknown>[]
})

const chartType = computed(() => {
  const type = (series.value[0]?.type as string | undefined)?.toLowerCase()
  return type ?? 'line'
})

const lineValues = computed(() => {
  if (chartType.value !== 'line') {
    return [] as number[]
  }

  const dataset = props.option?.dataset as { source?: unknown } | undefined
  const source = Array.isArray(dataset?.source) ? dataset?.source ?? [] : []

  if (source.length) {
    return source
      .map((entry) => {
        if (!Array.isArray(entry) || entry.length < 2) return null
        const value = Number(entry[1])
        return Number.isFinite(value) ? value : null
      })
      .filter((value): value is number => value !== null)
  }

  const firstSeries = series.value[0]
  const data = Array.isArray(firstSeries?.data) ? firstSeries?.data ?? [] : []

  return data
    .map((entry) => {
      if (Array.isArray(entry)) {
        const value = Number(entry[1] ?? entry[0])
        return Number.isFinite(value) ? value : null
      }
      if (entry && typeof entry === 'object' && 'value' in entry) {
        const value = Number((entry as { value: unknown }).value)
        return Number.isFinite(value) ? value : null
      }
      const value = Number(entry)
      return Number.isFinite(value) ? value : null
    })
    .filter((value): value is number => value !== null)
})

const linePath = computed(() => {
  if (!lineValues.value.length) {
    return ''
  }

  const min = Math.min(...lineValues.value)
  const max = Math.max(...lineValues.value)
  const range = max - min || 1

  return lineValues.value
    .map((value, index) => {
      const x =
        lineValues.value.length === 1
          ? 0
          : (index / (lineValues.value.length - 1)) * 100
      const normalized = (value - min) / range
      const y = 50 - normalized * 45
      return `${x},${y}`
    })
    .join(' ')
})

const lineAreaPath = computed(() => {
  if (!lineValues.value.length || !linePath.value) {
    return ''
  }

  const points = linePath.value.split(' ')
  if (!points.length) {
    return ''
  }

  const first = points[0]
  const last = points[points.length - 1]
  return [first, ...points.slice(1, -1), last, `${last.split(',')[0]},55`, `${first.split(',')[0]},55`].join(' ')
})

const barValues = computed(() => {
  if (chartType.value !== 'bar') {
    return [] as { label: string; normalized: number }[]
  }

  const xAxes = props.option?.xAxis
  const categories = Array.isArray(xAxes)
    ? (xAxes[0]?.data as unknown[] | undefined)
    : undefined
  const labels = Array.isArray(categories)
    ? categories.map((entry) => String(entry))
    : []

  const dataSeries = series.value.filter((entry) => entry?.type === 'bar')
  const values = labels.map((_, index) => {
    return dataSeries.reduce((total, serie) => {
      const data = Array.isArray(serie.data) ? serie.data : []
      const value = Number(data[index])
      return total + (Number.isFinite(value) ? value : 0)
    }, 0)
  })

  const max = Math.max(...values, 0) || 1

  return labels.map((label, index) => ({
    label,
    normalized: Math.max(0, values[index] / max),
  }))
})

const pieSegments = computed(() => {
  if (chartType.value !== 'pie') {
    return [] as { label: string; value: number; percent: string; color: string }[]
  }

  const firstSeries = series.value[0]
  const data = Array.isArray(firstSeries?.data) ? firstSeries?.data ?? [] : []
  const values = data
    .map((entry, index) => {
      if (entry && typeof entry === 'object' && 'value' in entry) {
        const value = Number((entry as { value: unknown }).value)
        return {
          label: String((entry as { name?: unknown }).name ?? `Item ${index + 1}`),
          value: Number.isFinite(value) ? value : 0,
        }
      }
      const value = Number(entry)
      return {
        label: `Item ${index + 1}`,
        value: Number.isFinite(value) ? value : 0,
      }
    })
    .filter((entry) => entry.value > 0)

  const total = values.reduce((sum, entry) => sum + entry.value, 0) || 1

  return values.map((entry, index) => ({
    label: entry.label,
    value: entry.value,
    percent: ((entry.value / total) * 100).toFixed(1),
    color: palette[index % palette.length],
  }))
})

const pieGradient = computed(() => {
  if (!pieSegments.value.length) {
    return 'transparent'
  }

  let start = 0
  const segments: string[] = []
  const total = pieSegments.value.reduce((sum, entry) => sum + entry.value, 0) || 1

  pieSegments.value.forEach((segment) => {
    const angle = (segment.value / total) * 360
    const end = start + angle
    segments.push(`${segment.color} ${start}deg ${end}deg`)
    start = end
  })

  return `conic-gradient(${segments.join(', ')})`
})

const radarIndicators = computed(() => {
  if (chartType.value !== 'radar') {
    return [] as string[]
  }

  const radar = props.option?.radar as { indicator?: unknown[] } | undefined
  const indicators = Array.isArray(radar?.indicator) ? radar?.indicator ?? [] : []

  return indicators
    .map((entry, index) => {
      if (entry && typeof entry === 'object' && 'name' in entry) {
        return String((entry as { name: unknown }).name)
      }
      return `Axis ${index + 1}`
    })
})

const radarPolygons = computed(() => {
  if (chartType.value !== 'radar') {
    return [] as { name: string; points: string; fill: string; stroke: string }[]
  }

  const dataSeries = series.value.filter((entry) => entry?.type === 'radar')
  const allValues = dataSeries.flatMap((serie) =>
    (Array.isArray(serie.data) ? serie.data : []).flatMap((entry) => {
      if (entry && typeof entry === 'object' && 'value' in entry) {
        return (entry as { value: unknown }).value
      }
      return []
    }),
  )

  const numericValues = allValues
    .map((value) => {
      if (Array.isArray(value)) {
        return value.map((v) => Number(v))
      }
      return [Number(value)]
    })
    .flat()
    .filter((value) => Number.isFinite(value)) as number[]

  const max = Math.max(...numericValues, 0) || 1
  const indicatorCount = radarIndicators.value.length || 1

  const angleStep = (2 * Math.PI) / indicatorCount

  return dataSeries.flatMap((serie, serieIndex) => {
    const data = Array.isArray(serie.data) ? serie.data : []

    return data.map((entry, entryIndex) => {
      const rawValues =
        entry && typeof entry === 'object' && 'value' in entry
          ? ((entry as { value: unknown }).value as unknown[])
          : []

      const values = Array.isArray(rawValues)
        ? rawValues.map((value) => (Number.isFinite(Number(value)) ? Number(value) : 0))
        : []

      const indicatorCount = radarIndicators.value.length || values.length || 1
      const paddedValues = Array.from({ length: indicatorCount }, (_, index) =>
        values[index] ?? 0,
      )

      const points = paddedValues.map((value, index) => {
        const angle = index * angleStep - Math.PI / 2
        const radius = (Math.max(0, value) / max) * 50
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        return `${x.toFixed(2)},${y.toFixed(2)}`
      })

      const color = palette[(serieIndex + entryIndex) % palette.length]
      return {
        name: String((entry as { name?: unknown }).name ?? `Series ${serieIndex + 1}`),
        points: points.join(' '),
        fill: `${color}22`,
        stroke: color,
      }
    })
  })
})

const radarGrid = computed(() => {
  if (chartType.value !== 'radar') {
    return [] as string[]
  }

  const steps = 4
  const indicatorCount = radarIndicators.value.length || 1
  const angleStep = (2 * Math.PI) / indicatorCount

  return Array.from({ length: steps }, (_, step) => {
    const radius = ((step + 1) / steps) * 50
    const points = Array.from({ length: indicatorCount }, (_, index) => {
      const angle = index * angleStep - Math.PI / 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    return points.join(' ')
  })
})

const ariaLabel = computed(() => {
  switch (chartType.value) {
    case 'line':
      return 'Line chart'
    case 'bar':
      return 'Bar chart'
    case 'pie':
      return 'Pie chart'
    case 'radar':
      return 'Radar chart'
    default:
      return 'Chart'
  }
})
</script>

<style scoped>
.v-chart-stub {
  position: relative;
  width: 100%;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.v-chart-stub__line {
  width: 100%;
  height: 100%;
  stroke-width: 2;
}

.v-chart-stub__line-path {
  stroke: var(--v-theme-primary);
}

.v-chart-stub__line-area {
  fill: color-mix(in srgb, var(--v-theme-primary) 20%, transparent);
  stroke: none;
}

.v-chart-stub__bars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(32px, 1fr));
  gap: 12px;
  align-items: end;
  width: 100%;
  padding: 12px 4px 0;
}

.v-chart-stub__bar {
  text-align: center;
}

.v-chart-stub__bar-track {
  position: relative;
  height: 160px;
  background: rgba(var(--v-theme-primary), 0.08);
  border-radius: 6px;
  overflow: hidden;
}

.v-chart-stub__bar-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--v-theme-primary);
  border-radius: inherit;
  transition: height 0.3s ease;
}

.v-chart-stub__bar-label {
  display: block;
  margin-top: 6px;
  font-size: 0.75rem;
}

.v-chart-stub__pie {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  justify-content: space-around;
}

.v-chart-stub__pie-figure {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  position: relative;
}

.v-chart-stub__pie-figure::after {
  content: '';
  position: absolute;
  inset: 24px;
  background: rgba(var(--v-theme-surface), 0.85);
  border-radius: 50%;
}

.v-chart-stub__legend {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 6px;
}

.v-chart-stub__legend li {
  display: grid;
  grid-template-columns: 16px 1fr auto;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
}

.v-chart-stub__legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.v-chart-stub__legend-label {
  font-weight: 500;
}

.v-chart-stub__legend-value {
  font-variant-numeric: tabular-nums;
}

.v-chart-stub__radar {
  width: 100%;
  height: 100%;
}

.v-chart-stub__radar-grid {
  fill: none;
  stroke: rgba(var(--v-theme-primary), 0.2);
  stroke-width: 0.5;
}

.v-chart-stub__radar-polygon {
  stroke-width: 1.5;
  fill-opacity: 0.35;
}

.v-chart-stub__fallback {
  text-align: center;
  padding: 16px;
}
</style>
