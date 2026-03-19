export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>Aoki Design Studio — 制作実績アーカイブ</p>
        <p className="site-footer__copy">&copy; {year} Aoki Design Studio</p>
      </div>
    </footer>
  )
}
