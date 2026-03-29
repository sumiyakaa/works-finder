import type { Work } from '../types/work'
import type { ExploreSerializableState } from '../types/filter'
import { getActiveFilterChips } from './works'
import { CONSULTATION_TARGET } from '../config/siteConfig'

interface WorkSummary {
  id: string
  title: string
  genre: string
  siteType: string
  purpose: string
  budgetRange: string | null | undefined
  durationRange: string | null | undefined
}

export interface ConsultationPayload {
  searchQuery: string
  filterLabels: string[]
  compareIds: string[]
  compareTitles: string[]
  activeWork: WorkSummary | null
  context: 'detail' | 'compare' | 'filtered' | 'default'
}

export interface ConsultationContent {
  eyebrow: string
  title: string
  description: string
  briefTitle: string
  briefCopy: string
  primaryLabel: string
  secondaryLabel: string
  secondaryHref: string
  contextItems: string[]
  draft: string
  primaryHref: string
}

const pickWorkSummary = (work: Work | undefined | null): WorkSummary | null => {
  if (!work) return null
  return {
    id: work.id ?? work.slug,
    title: work.title,
    genre: work.genre,
    siteType: work.siteType,
    purpose: work.purpose,
    budgetRange: work.budgetRange,
    durationRange: work.durationRange,
  }
}

const getContext = (payload: ConsultationPayload): ConsultationPayload['context'] => {
  if (payload.activeWork) return 'detail'
  if (payload.compareIds.length >= 2) return 'compare'
  if (payload.searchQuery || payload.filterLabels.length) return 'filtered'
  return 'default'
}

const formatDisplayValue = (value: string | null | undefined): string =>
  value ?? '-'

export const buildConsultationPayload = (
  exploreState: ExploreSerializableState,
  compareSlugs: string[],
  works: Work[],
  activeWork: Work | null,
): ConsultationPayload => {
  const worksById = new Map(works.map((w) => [w.id ?? w.slug, w]))
  const comparedWorks = compareSlugs
    .map((slug) => worksById.get(slug) ?? works.find((w) => w.slug === slug))
    .filter((w): w is Work => w != null)

  const chips = getActiveFilterChips(exploreState)
  const filterLabels = chips
    .filter((chip) => chip.kind !== 'query')
    .map((chip) => chip.label)

  const payload: ConsultationPayload = {
    searchQuery: exploreState.query.trim(),
    filterLabels,
    compareIds: comparedWorks.map((w) => w.id ?? w.slug),
    compareTitles: comparedWorks.map((w) => w.title),
    activeWork: pickWorkSummary(activeWork),
    context: 'default',
  }

  payload.context = getContext(payload)
  return payload
}

export const buildConsultationSummary = (payload: ConsultationPayload): string => {
  const lines = ['AKASHIKI Works Finder 閲覧メモ', '']

  if (payload.searchQuery) {
    lines.push(`検索語: ${payload.searchQuery}`)
  }

  if (payload.filterLabels.length) {
    lines.push(`適用中フィルタ: ${payload.filterLabels.join(' / ')}`)
  }

  if (payload.compareTitles.length) {
    lines.push(`比較中案件: ${payload.compareTitles.join(' / ')}`)
  }

  if (payload.activeWork) {
    lines.push(
      `アクティブ案件: ${payload.activeWork.title}`,
      `案件情報: ${payload.activeWork.genre} / ${payload.activeWork.siteType} / ${payload.activeWork.purpose}`,
    )
  }

  if (!payload.searchQuery && !payload.filterLabels.length && !payload.compareTitles.length && !payload.activeWork) {
    lines.push('現在は全体一覧を参照した状態です。')
  }

  lines.push('', '見返しポイント:', '- 近い案件の共通点', '- 比較時に見たい条件')
  return lines.join('\n')
}

export const buildConsultationUrl = (
  payload: ConsultationPayload,
  config = CONSULTATION_TARGET,
): string => {
  const targetUrl = new URL(config.baseUrl || './', window.location.href)
  const params = new URLSearchParams()

  if (payload.searchQuery) {
    params.set('q', payload.searchQuery)
  }

  params.set(config.queryKeys.intent, 'review')
  params.set(config.queryKeys.source, config.source)
  params.set(config.queryKeys.context, payload.context)

  if (payload.filterLabels.length) {
    params.set(config.queryKeys.filters, payload.filterLabels.join(' / '))
  }

  if (payload.compareTitles.length) {
    params.set(config.queryKeys.compareTitles, payload.compareTitles.join(' / '))
  }

  if (payload.activeWork) {
    params.set(config.queryKeys.active, payload.activeWork.id)
    params.set(config.queryKeys.activeTitle, payload.activeWork.title)
  }

  targetUrl.search = params.toString()
  targetUrl.hash = config.hash || ''
  return targetUrl.toString()
}

export const getConsultationContent = (
  exploreState: ExploreSerializableState,
  compareSlugs: string[],
  works: Work[],
  activeWork: Work | null,
  visibleCount: number,
): ConsultationContent => {
  const payload = buildConsultationPayload(exploreState, compareSlugs, works, activeWork)
  const draft = buildConsultationSummary(payload)
  const primaryHref = buildConsultationUrl(payload)
  const totalWorksCount = works.length
  const realWorksCount = works.filter((w) => !w.isConcept).length

  let eyebrow = '閲覧メモ'
  let title = '気になった点を残しておく'
  let description = '閲覧中の条件や候補をメモとして残せます。あとから見返す際にお使いください。'
  let briefTitle = '閲覧メモ'
  let briefCopy = '現在の閲覧状況をもとにメモを生成しています。'
  let primaryLabel = 'メモを残す'
  let secondaryLabel = '一覧へ戻る'
  let secondaryHref = compareSlugs.length ? '#compare-bar' : '#results-heading'
  let contextItems = [`全 ${totalWorksCount} 件`, `実案件 ${realWorksCount} 件`, '比較は最大3件']

  if (payload.activeWork) {
    eyebrow = '事例メモ'
    title = 'この事例のポイントを残す'
    description = `${payload.activeWork.title} の情報をまとめたメモを作成できます。`
    briefTitle = '事例メモ'
    briefCopy = 'この案件の要点を簡潔にまとめています。'
    primaryLabel = 'この事例のメモを残す'
    secondaryLabel = '一覧に戻る'
    secondaryHref = '#results-heading'
    contextItems = [
      payload.activeWork.title,
      formatDisplayValue(payload.activeWork.genre),
      formatDisplayValue(payload.activeWork.purpose),
    ]
  } else if (payload.compareTitles.length >= 2) {
    eyebrow = '比較メモ'
    title = '比較した内容を残す'
    description = '比較中の案件について、違いや共通点をメモとして残せます。'
    briefTitle = '比較メモ'
    briefCopy = '比較中の候補と主な違いをまとめています。'
    primaryLabel = '比較メモを残す'
    secondaryLabel = '比較に戻る'
    secondaryHref = '#compare-bar'
    contextItems = payload.compareTitles
  } else if (visibleCount === 0) {
    eyebrow = '条件メモ'
    title = '検討中の条件を残す'
    description = '該当する案件が見つからない場合でも、検討中の条件をメモに残せます。'
    briefTitle = '条件メモ'
    briefCopy = '現在の検索条件をそのまま記録します。'
    primaryLabel = '条件メモを作る'
    secondaryLabel = '条件を変えて探す'
    secondaryHref = '#filter-heading'
    contextItems = ['条件の見直し', '要件の整理', '別の切り口']
  } else if (payload.searchQuery || payload.filterLabels.length) {
    eyebrow = '絞り込みメモ'
    title = '今の条件を残す'
    description = `${visibleCount} 件に絞り込んだ条件をメモとして保存できます。`
    briefTitle = '絞り込みメモ'
    briefCopy = '現在の検索条件・フィルターを記録します。'
    primaryLabel = 'この条件のメモを作る'
    secondaryLabel = '候補を見返す'
    secondaryHref = '#results-heading'
    contextItems = payload.filterLabels.slice(0, 3)
  }

  return {
    eyebrow,
    title,
    description,
    briefTitle,
    briefCopy,
    primaryLabel,
    secondaryLabel,
    secondaryHref,
    contextItems,
    draft,
    primaryHref,
  }
}
