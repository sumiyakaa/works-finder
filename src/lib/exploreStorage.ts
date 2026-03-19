/**
 * 探索本体状態（ExploreSerializableState）の localStorage 永続化層。
 *
 * この層の責務は browser の localStorage API への read / write / clear だけ。
 * 直列化・復元・バリデーションは lib/works.ts の純関数に委譲する。
 *
 * 保存対象は ExploreSerializableState の 6 フィールドのみ:
 *   query, selectedGenres, selectedSiteTypes,
 *   selectedPurposes, selectedTechTags, sortOrder
 *
 * 保存形式は URL パラメータ文字列と同一（serializeExploreState の出力）。
 * これにより URL 同期と localStorage で直列化ロジックを共有し、
 * parseExploreState で双方を同じパスで復元できる。
 */

import type { ExploreSerializableState } from '../types/filter'
import {
  isDefaultExploreState,
  parseExploreState,
  serializeExploreState,
} from './works'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'works-finder-explore-state'

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const isStorageAvailable = (): boolean => {
  try {
    const testKey = '__works_finder_storage_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * localStorage から ExploreSerializableState を復元する。
 * 不正データ・storage 利用不可・デフォルト状態の場合は null を返す。
 *
 * 壊れた値や意味のないデータが残っていた場合は静かに削除し、
 * 次回以降に同じゴミを再 parse しないようにする。
 */
export const readStoredExploreState = (): ExploreSerializableState | null => {
  if (!isStorageAvailable()) {
    return null
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (raw === null || raw.length === 0) {
      return null
    }

    const parsed = parseExploreState(raw)

    if (isDefaultExploreState(parsed)) {
      // データはあったが parse 後にデフォルトと同じ — 壊れた値か意味のない値。
      // 次回の無駄な parse を防ぐため掃除する。
      window.localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return parsed
  } catch {
    // getItem や parse が予期せず失敗 — 安全に null へフォールバック。
    // 壊れた値が残る可能性があるが、例外が出た状態で removeItem を
    // 試みるとさらに例外が出る恐れがあるため、ここでは触らない。
    return null
  }
}

/**
 * ExploreSerializableState を localStorage へ保存する。
 * デフォルト状態（全フィールドが初期値）なら storage をクリアする。
 */
export const writeStoredExploreState = (
  state: ExploreSerializableState,
): void => {
  if (!isStorageAvailable()) {
    return
  }

  try {
    if (isDefaultExploreState(state)) {
      window.localStorage.removeItem(STORAGE_KEY)
      return
    }

    window.localStorage.setItem(STORAGE_KEY, serializeExploreState(state))
  } catch {
    // quota exceeded など — サイレントに失敗
  }
}

/** localStorage から探索状態を明示的に削除する。 */
export const clearStoredExploreState = (): void => {
  if (!isStorageAvailable()) {
    return
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // サイレントに失敗
  }
}
