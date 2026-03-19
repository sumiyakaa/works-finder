import { useCallback, useEffect, useRef, useState } from 'react'
import type { ConsultationContent } from '../../lib/consultation'

interface ConsultationSectionProps {
  content: ConsultationContent
}

export function ConsultationSection({ content }: ConsultationSectionProps) {
  const [copyFeedback, setCopyFeedback] = useState(false)
  const draftRef = useRef<HTMLTextAreaElement>(null)
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => { clearTimeout(feedbackTimerRef.current) }, [])

  const handleCopyDraft = useCallback(() => {
    const text = draftRef.current?.value ?? content.draft
    navigator.clipboard.writeText(text).then(() => {
      clearTimeout(feedbackTimerRef.current)
      setCopyFeedback(true)
      feedbackTimerRef.current = setTimeout(() => { setCopyFeedback(false) }, 2000)
    }).catch(() => {
      // Fallback: select the textarea content for manual copy
      draftRef.current?.select()
    })
  }, [content.draft])

  return (
    <section className="archive-section cta-section" aria-labelledby="consultation-title">
      <div className="section-heading">
        <div>
          <p className="section-label">{content.eyebrow}</p>
          <h2 id="consultation-title">{content.title}</h2>
        </div>
        <p className="section-heading__note">
          {content.description}
        </p>
      </div>

      <div className="cta-section__body">
        <div className="cta-section__copy">
          <div className="cta-section__actions">
            <a
              className="primary-button"
              href={content.primaryHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.primaryLabel}
            </a>
            <a
              className="ghost-button"
              href={content.secondaryHref}
            >
              {content.secondaryLabel}
            </a>
          </div>
        </div>

        <div className="cta-section__brief">
          <p className="cta-section__brief-title">{content.briefTitle}</p>
          <p className="cta-section__brief-copy">{content.briefCopy}</p>

          {content.contextItems.length > 0 ? (
            <ul className="cta-section__context" aria-label="コンテキスト情報">
              {content.contextItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}

          <textarea
            ref={draftRef}
            className="cta-section__draft"
            readOnly
            value={content.draft}
            aria-label="閲覧メモ"
          />

          <button
            className="card-action card-action--secondary cta-section__copy-button"
            type="button"
            onClick={handleCopyDraft}
          >
            {copyFeedback ? 'コピーしました' : 'メモをコピー'}
          </button>
        </div>
      </div>
    </section>
  )
}
