import type { ActiveExploreChip, ActiveFilterChipAction } from '../../types/filter'

interface ActiveFilterChipsProps {
  chips: ActiveExploreChip[]
  onRemove: (action: ActiveFilterChipAction) => void
}

export function ActiveFilterChips({ chips, onRemove }: ActiveFilterChipsProps) {
  if (chips.length === 0) {
    return null
  }

  return (
    <div className="active-filter-chips" aria-label="適用中の検索条件とフィルタ">
      <p className="active-filter-chips__label">適用中の条件</p>
      <ul className="chip-list active-filter-chips__list">
        {chips.map((chip) => (
          <li
            className={`active-filter-chips__item active-filter-chips__item--${chip.kind}`}
            key={chip.id}
          >
            <span className="active-filter-chips__text">{chip.label}</span>
            <button
              type="button"
              className="active-filter-chips__remove"
              onClick={() => {
                onRemove(chip.action)
              }}
              aria-label={`${chip.label} を解除`}
            >
              解除
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
