import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <main className="landing-page">
      <header className="site-nav">
        <Link to="/" className="brand-mark"><span>iP</span><strong>InterviewPro</strong></Link>
        <nav><Link to="/analytics">Product</Link><Link to="/support">Solutions</Link><Link to="/settings">Pricing</Link><Link to="/login" className="nav-cta">Request a demo</Link></nav>
      </header>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">A calmer way to hire</p>
          <h1>The clarity behind every great hire.</h1>
          <p className="hero-lede">InterviewPro brings thoughtful structure, adaptive AI, and human judgment together in one workspace.</p>
          <div className="hero-actions"><Link to="/interview" className="primary-button">Start an interview</Link><Link to="/login" className="text-link">Sign in <span>→</span></Link></div>
          <div className="proof-row"><div><strong>92%</strong><span>interviewer adoption</span></div><div><strong>4.8/5</strong><span>candidate experience</span></div></div>
        </div>
        <div className="hero-visual"><div className="visual-card"><div className="visual-top"><span className="status-dot" />Live interview <span className="visual-time">24:18</span></div><div className="visual-body"><div className="avatar-card warm"><span>AM</span><small>Alex Morgan</small></div><div className="avatar-card cool"><span>IP</span><small>InterviewPro AI</small></div></div><div className="visual-footer"><span>Question 4 of 8</span><div className="visual-progress"><i /></div><span>56%</span></div></div><div className="floating-note"><span className="note-check">✓</span><div><strong>Strong signal detected</strong><small>Systems thinking · 92%</small></div></div></div>
      </section>
      <section className="feature-strip"><p>Built for teams that care about the signal</p><div><span>Northstar</span><span>Arcwell</span><span>Loopline</span><span>Element</span><span>Vertex</span></div></section>
    </main>
  )
}
