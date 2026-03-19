/**
 * モーダルダイアログの共通操作を管理するカスタム hook。
 *
 * 責務:
 *   1. body スクロールロック（mount 時に overflow: hidden → unmount 時に復元）
 *   2. フォーカストラップ（Tab / Shift+Tab をモーダル内で循環）
 *   3. 初期フォーカス（mount 時に close ボタンへフォーカス）
 *   4. フォーカス復帰（unmount 時に opener 要素へフォーカスを戻す）
 *   5. Escape キーで close
 *
 * compare ロジックには一切関与しない。
 */

import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

interface UseModalDialogOptions {
  onClose: () => void
}

interface UseModalDialogReturn {
  /** overlay (最外周) に付ける ref。フォーカストラップの範囲になる。 */
  overlayRef: RefObject<HTMLDivElement | null>
  /** close ボタンに付ける ref。初期フォーカス先になる。 */
  closeButtonRef: RefObject<HTMLButtonElement | null>
}

export function useModalDialog({
  onClose,
}: UseModalDialogOptions): UseModalDialogReturn {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const openerRef = useRef<Element | null>(null)

  // -----------------------------------------------------------------------
  // 1. opener 要素を記録（mount 時の activeElement）
  // -----------------------------------------------------------------------
  useEffect(() => {
    openerRef.current = document.activeElement
  }, [])

  // -----------------------------------------------------------------------
  // 2. body スクロールロック
  // -----------------------------------------------------------------------
  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [])

  // -----------------------------------------------------------------------
  // 3. 初期フォーカス
  // -----------------------------------------------------------------------
  useEffect(() => {
    // requestAnimationFrame で DOM が確実に描画された後にフォーカス
    const id = requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })
    return () => { cancelAnimationFrame(id) }
  }, [])

  // -----------------------------------------------------------------------
  // 4. フォーカス復帰（cleanup で実行）
  // -----------------------------------------------------------------------
  useEffect(() => {
    return () => {
      const opener = openerRef.current
      if (opener instanceof HTMLElement) {
        // 復帰先がまだ DOM 上に存在する場合のみフォーカスを戻す
        if (document.body.contains(opener)) {
          // 次の tick で戻す（unmount 直後に body の overflow が戻ってから）
          requestAnimationFrame(() => { opener.focus() })
        }
      }
    }
  }, [])

  // -----------------------------------------------------------------------
  // 5. Escape close + フォーカストラップ（Tab / Shift+Tab 循環）
  // -----------------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key !== 'Tab') return

      const overlay = overlayRef.current
      if (!overlay) return

      const focusableElements = overlay.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (focusableElements.length === 0) {
        // フォーカス可能要素が無い場合はモーダル外へ抜けないよう阻止
        e.preventDefault()
        return
      }

      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        // Shift+Tab: 先頭にいたら末尾へ
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        // Tab: 末尾にいたら先頭へ
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => { document.removeEventListener('keydown', handleKeyDown) }
  }, [onClose])

  return { overlayRef, closeButtonRef }
}
