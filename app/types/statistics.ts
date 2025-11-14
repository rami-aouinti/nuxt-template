export interface StatisticsSaleItem {
  period: string
  total: number
}

export interface StatisticsBusinessActivitySummaryItem {
  totalSales: number
  paidOrdersCount: number
  newCustomersCount: number
  averageOrderValue: number
}

export interface Statistics {
  sales: StatisticsSaleItem[]
  businessActivitySummary: StatisticsBusinessActivitySummaryItem[]
}
