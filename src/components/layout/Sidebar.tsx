import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FilterGroup, FilterGroupKey, FilterState } from '../../types/filter'

interface SidebarProps {
  filterGroups: FilterGroup[]
  selectedFilters: FilterState
  appliedFilterCount: number
  visibleCount: number
  isOpen: boolean
  onFilterToggle: (groupKey: FilterGroupKey, value: string) => void
  onClearFilters: () => void
  onClose: () => void
}

/** 設計書指定の4カテゴリのみ表示 */
const SIDEBAR_GROUP_KEYS: FilterGroupKey[] = [
  'selectedGenres',
  'selectedSiteTypes',
  'selectedPurposes',
  'selectedTechTags',
]

export function Sidebar({
  filterGroups,
  selectedFilters,
  appliedFilterCount,
  visibleCount,
  isOpen,
  onFilterToggle,
  onClearFilters,
  onClose,
}: SidebarProps) {
  const sidebarGroups = filterGroups.filter((g) => SIDEBAR_GROUP_KEYS.includes(g.key))

  // アクティブなフィルタータグ一覧（×で個別解除用）
  const activeTags: { groupKey: FilterGroupKey; value: string }[] = []
  for (const group of sidebarGroups) {
    for (const val of selectedFilters[group.key]) {
      activeTags.push({ groupKey: group.key, value: val })
    }
  }

  const content = (
    <nav className="sidebar" aria-label="絞り込みフィルター">
      <div className="sidebar__header">
        <h2 className="sidebar__title">絞り込み</h2>
        <span className="sidebar__count">{visibleCount}件</span>
        <button
          type="button"
          className="sidebar__close-btn"
          onClick={onClose}
          aria-label="フィルターを閉じる"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* 選択中フィルタータグ */}
      {activeTags.length > 0 && (
        <div className="sidebar__active-tags">
          {activeTags.map((tag) => (
            <button
              key={`${tag.groupKey}-${tag.value}`}
              type="button"
              className="sidebar__active-tag"
              onClick={() => onFilterToggle(tag.groupKey, tag.value)}
            >
              {tag.value}
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          ))}
          <button
            type="button"
            className="sidebar__clear-all"
            onClick={onClearFilters}
          >
            すべてクリア
          </button>
        </div>
      )}

      {/* アコーディオン式フィルターグループ */}
      <div className="sidebar__groups">
        {sidebarGroups.map((group) => (
          <AccordionFilterGroup
            key={group.key}
            group={group}
            selected={selectedFilters[group.key]}
            onToggle={(value) => onFilterToggle(group.key, value)}
          />
        ))}
      </div>

      {appliedFilterCount > 0 && (
        <div className="sidebar__footer">
          <button
            type="button"
            className="sidebar__clear-btn"
            onClick={onClearFilters}
          >
            すべて解除
          </button>
        </div>
      )}
    </nav>
  )

  return (
    <>
      {/* PC: 常時表示 */}
      <div className="sidebar-desktop">
        {content}
      </div>

      {/* SP: ドロワー */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="sidebar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />
            <motion.div
              className="sidebar-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function AccordionFilterGroup({
  group,
  selected,
  onToggle,
}: {
  group: FilterGroup
  selected: string[]
  onToggle: (value: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const selectedCount = selected.length

  return (
    <div className={`sidebar-group${selectedCount > 0 ? ' sidebar-group--active' : ''}`}>
      <button
        type="button"
        className="sidebar-group__header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="sidebar-group__title">{group.title}</span>
        {selectedCount > 0 && (
          <span className="sidebar-group__badge">{selectedCount}</span>
        )}
        <svg
          className={`sidebar-group__arrow${isExpanded ? ' sidebar-group__arrow--open' : ''}`}
          width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            className="sidebar-group__content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="sidebar-group__options">
              {group.options.map((option) => {
                const isSelected = selected.includes(option.label)
                return (
                  <label key={option.label} className={`sidebar-checkbox${isSelected ? ' sidebar-checkbox--checked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggle(option.label)}
                      className="sidebar-checkbox__input"
                    />
                    <span className="sidebar-checkbox__box">
                      {isSelected && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                    <span className="sidebar-checkbox__label">{option.label}</span>
                    <span className="sidebar-checkbox__count">{option.count}</span>
                  </label>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
