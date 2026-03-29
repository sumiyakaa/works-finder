export const CONSULTATION_TARGET = Object.freeze({
  baseUrl: './index.html',
  hash: '#contact-brief',
  source: 'akashiki-works-finder',
  defaultSortOrder: 'recommended',
  queryKeys: Object.freeze({
    intent: 'intent',
    source: 'source',
    context: 'context',
    filters: 'filters',
    compareTitles: 'compareTitles',
    active: 'active',
    activeTitle: 'activeTitle',
  }),
})

export type ConsultationTarget = typeof CONSULTATION_TARGET
