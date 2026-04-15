import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom'

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'URL Scan', path: '/dashboard/url' },
  { name: 'Email Scan', path: '/dashboard/email' }
]

const verdictStyles = {
  LEGIT: 'bg-emerald-500/12 text-emerald-300',
  SUSPICIOUS: 'bg-amber-500/12 text-amber-300',
  PHISHING: 'bg-rose-500/12 text-rose-300'
}

const scoreLegend = [
  {
    label: 'LEGIT',
    description: 'Low risk. Verify sender origin if the source is not known.',
    accent: 'from-emerald-400 to-cyan-400',
    badge: 'text-emerald-300 bg-emerald-500/12'
  },
  {
    label: 'SUSPICIOUS',
    description: 'Medium risk. Review carefully and do not provide credentials.',
    accent: 'from-amber-400 to-orange-500',
    badge: 'text-amber-300 bg-amber-500/12'
  },
  {
    label: 'PHISHING',
    description: 'High risk. Do not click or reply. Treat as malicious until proven otherwise.',
    accent: 'from-rose-500 to-fuchsia-500',
    badge: 'text-rose-300 bg-rose-500/12'
  }
]

function RiskLegend() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {scoreLegend.map((item) => (
        <div key={item.label} className="rounded-[28px] border border-white/10 bg-slate-950/80 p-5 shadow-panel transition hover:-translate-y-1 hover:border-cyan-400/20">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.badge}`}>{item.label}</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
        </div>
      ))}
    </div>
  )
}

function RiskMeter({ score }) {
  const filled = Math.min(100, Math.max(0, score * 1.25))
  const color = score >= 60 ? 'bg-rose-400' : score >= 35 ? 'bg-amber-400' : 'bg-emerald-400'

  return (
    <div className="space-y-3 rounded-3xl border border-white/10 bg-slate-950/75 p-4">
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>Score strength</span>
        <span className="font-semibold text-slate-100">{score} / 80</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-800/80">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${filled}%` }} />
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        Low risk
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
        Medium risk
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-rose-400" />
        High risk
      </div>
    </div>
  )
}

function useHistory() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetch('/history')
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch(() => setHistory([]))
  }, [])

  return [history, setHistory]
}

function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-halo blur-3xl opacity-70" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-6 sm:px-8">
          <header className="mb-8 flex flex-col gap-4 rounded-[32px] border border-white/10 bg-slate-900/70 p-6 shadow-panel backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">PhishShield</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Secure phishing detection with a polished command center.</h1>
            </div>
            <nav className="flex flex-wrap items-center gap-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-cyan-400/18 text-cyan-200 shadow-[0_0_0_1px_rgba(56,189,248,0.2)]'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </header>

          <main className="space-y-8 pb-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/url" element={<UrlScanner />} />
              <Route path="/dashboard/email" element={<EmailScanner />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="py-10 text-center text-sm text-slate-500">
            PhishShield · Secure interface · Local analysis, no third-party telemetry.
          </footer>
        </div>
      </div>
    </BrowserRouter>
  )
}

function Home() {
  const [history] = useHistory()
  const stats = useMemo(() => {
    const total = history.length
    const phishing = history.filter((item) => item.verdict === 'PHISHING').length
    const suspicious = history.filter((item) => item.verdict === 'SUSPICIOUS').length
    const legit = total - phishing - suspicious
    return { total, phishing, suspicious, legit }
  }, [history])

  return (
    <section className="space-y-10">
      <div className="grid gap-8 rounded-[32px] border border-white/10 bg-slate-900/80 p-10 shadow-panel backdrop-blur-xl md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-400/20">Live threat lens</span>
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">A modern phishing control room for fast, confident decisions.</h2>
          <p className="max-w-2xl text-base leading-8 text-slate-300">Scan URLs or email content instantly, review verdicts with transparent reasoning, and inspect recent history with dynamic scoring visualizations.</p>
          <div className="flex flex-wrap gap-4">
            <NavLink to="/dashboard/url" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow transition duration-300 hover:scale-[1.02]">Scan a URL</NavLink>
            <NavLink to="/dashboard/email" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition duration-300 hover:border-cyan-300/40 hover:bg-white/10">Analyze email</NavLink>
          </div>
        </div>
        <div className="space-y-6 rounded-[28px] border border-white/10 bg-slate-950/75 p-8 shadow-glow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-sm uppercase tracking-[0.22em] text-cyan-300/80">Security snapshot</span>
            <span className="rounded-full bg-slate-800/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">secure dashboard</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard label="Total scans" value={stats.total} />
            <MetricCard label="Phishing" value={stats.phishing} accent="text-rose-300" />
            <MetricCard label="Legit" value={stats.legit} accent="text-emerald-300" />
          </div>
          <p className="text-sm leading-7 text-slate-400">Built for crisp interactions, live history, and layered visual feedback that feels premium and responsive.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <FeatureCard title="Interactive workspace" description="One interface for URL scanning, email analysis, and threat history." icon="🧭" />
        <FeatureCard title="Real-time scoring" description="Verdicts are clear, fast, and backed by concise reasoning." icon="⚡" />
        <FeatureCard title="Data-driven alerts" description="History is stored locally and presented in a polished timeline." icon="📊" />
      </div>
    </section>
  )
}

function Dashboard() {
  const [history] = useHistory()
  const counts = useMemo(() => {
    const phishing = history.filter((item) => item.verdict === 'PHISHING').length
    const suspicious = history.filter((item) => item.verdict === 'SUSPICIOUS').length
    const legit = history.filter((item) => item.verdict === 'LEGIT').length
    const safeRate = history.length ? Math.round((legit / history.length) * 100) : 0
    return { phishing, suspicious, legit, safeRate }
  }, [history])

  return (
    <section className="space-y-8">
      <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-panel backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-300/80">Dashboard</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Your threat intelligence command center.</h2>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/80 px-5 py-3 text-sm text-slate-300 shadow-glow">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]" />
            Live scan history
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard label="Scans stored" value={history.length} />
          <DashboardCard label="Phishing hits" value={counts.phishing} accent="text-rose-300" />
          <DashboardCard label="Suspicious" value={counts.suspicious} accent="text-amber-300" />
          <DashboardCard label="Safe rate" value={`${counts.safeRate}%`} accent="text-cyan-300" />
        </div>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-panel backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-300/80">Scoring legend</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Understand every verdict</h3>
          </div>
        </div>
        <div className="mt-6">
          <RiskLegend />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6 rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-panel backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white">Recent threat activity</h3>
              <p className="mt-1 text-sm text-slate-400">Latest scans from your local session.</p>
            </div>
            <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">{history.length} entries</span>
          </div>
          <HistoryPanel history={history.slice(0, 10)} />
        </div>
        <div className="space-y-6 rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-panel backdrop-blur-xl">
          <h3 className="text-xl font-semibold text-white">Fast actions</h3>
          <div className="space-y-4">
            <ActionCard label="Scan a suspicious URL" description="Jump directly into URL analysis." to="/dashboard/url" />
            <ActionCard label="Check an email" description="Inspect sender, subject, and body quickly." to="/dashboard/email" />
          </div>
        </div>
      </div>
    </section>
  )
}

function UrlScanner() {
  const [history, setHistory] = useHistory()
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const verdictClass = result ? verdictStyles[result.verdict] : 'bg-slate-800/70 text-slate-200'

  const submit = async (event) => {
    event.preventDefault()
    if (!url) return
    setLoading(true)
    const response = await fetch('/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
    const data = await response.json()
    setResult(data)
    setLoading(false)
    setUrl('')
    const historyResponse = await fetch('/history')
    setHistory(await historyResponse.json())
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
      <div className="space-y-6 rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-panel backdrop-blur-xl">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.22em] text-cyan-300/80">URL scanner</p>
          <h2 className="text-3xl font-semibold text-white">Inspect any link in seconds.</h2>
          <p className="text-slate-400">Paste a suspicious URL and receive a polished verdict, risk meter, and actionable fixes.</p>
        </div>
        <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-5 text-sm text-slate-300 shadow-glow">
          <p className="font-semibold text-slate-100">Quick tip</p>
          <p className="mt-2">Use the sample button to see how the scanner breaks down risky links, then compare with your own suspicious URLs.</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <label className="block text-sm font-semibold text-slate-200">Suspicious URL</label>
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com/login"
            className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-5 py-4 text-slate-100 shadow-glow outline-none transition duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          />
          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow transition duration-300 hover:-translate-y-1"
              disabled={loading}
            >
              {loading ? 'Scanning...' : 'Scan now'}
            </button>
            <button
              type="button"
              onClick={() => setUrl('http://192.168.1.100/login')}
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition duration-300 hover:bg-white/10 hover:-translate-y-1"
            >
              Load sample
            </button>
          </div>
        </form>

        {result ? (
          <div className="space-y-6 rounded-[28px] border border-white/10 bg-slate-900/90 p-6 shadow-glow">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Verdict</p>
                <p className={`mt-2 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${verdictClass}`}>{result.verdict}</p>
              </div>
              <div className="space-y-1 text-right text-slate-300">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Risk score</p>
                <p className="text-3xl font-semibold text-white">{result.score}</p>
              </div>
            </div>

            <RiskMeter score={result.score} />

            <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5 rounded-3xl bg-slate-950/75 p-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Why this URL is flagged</p>
                  {result.reasons.length ? (
                    <ul className="mt-4 space-y-3 text-sm text-slate-300">
                      {result.reasons.map((reason, index) => (
                        <li key={index} className="rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3">{reason}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-slate-400">No major threats detected. Continue verifying the sender or source independently.</p>
                  )}
                </div>

                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Recommended actions</p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-300">
                    {result.recommendations.map((item, index) => (
                      <li key={index} className="rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl bg-slate-950/75 p-5 text-sm text-slate-300">
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Actionable fixes</p>
                  <ul className="mt-4 space-y-3">
                    {result.fixes.map((fix, index) => (
                      <li key={index} className="rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3">{fix}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Badge label="Domain" value={result.details?.domain || 'unknown'} />
                  <Badge label="Shortened" value={result.details?.shortened_url ? 'Yes' : 'No'} />
                  <Badge label="Brand spoofing" value={result.details?.brand_impersonation ? 'Yes' : 'No'} />
                  <Badge label="New domain" value={result.details?.new_domain ? 'Likely' : 'No'} />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <SmallStat label="Encoded path" value={result.details?.many_encoded_chars ? 'Yes' : 'No'} />
                  <SmallStat label="Private IP" value={result.details?.resolved_private_ip ? 'Yes' : 'No'} />
                  <SmallStat label="Nonstandard port" value={result.details?.has_nonstandard_port ? 'Yes' : 'No'} />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <aside className="space-y-6 rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-panel backdrop-blur-xl">
        <div>
          <h3 className="text-lg font-semibold text-white">Scan history</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">Recent URL and email analysis entries stored locally.</p>
        </div>
        <HistoryPanel history={history.filter((entry) => entry.type === 'URL').slice(0, 8)} />
      </aside>
    </section>
  )
}

function EmailScanner() {
  const [history, setHistory] = useHistory()
  const [sender, setSender] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const verdictClass = result ? verdictStyles[result.verdict] : 'bg-slate-800/70 text-slate-200'

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    const response = await fetch('/check_email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender, subject, body })
    })
    const data = await response.json()
    setResult(data)
    setLoading(false)
    setSender('')
    setSubject('')
    setBody('')
    const historyResponse = await fetch('/history')
    setHistory(await historyResponse.json())
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
      <div className="space-y-6 rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-panel backdrop-blur-xl">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.22em] text-cyan-300/80">Email analyzer</p>
          <h2 className="text-3xl font-semibold text-white">Validate suspicious messages faster.</h2>
          <p className="text-slate-400">Inspect sender, subject, and content with deep phishing signals and transparent guidance.</p>
        </div>
        <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-5 text-sm text-slate-300 shadow-glow">
          <p className="font-semibold text-slate-100">What to watch for</p>
          <p className="mt-2">Look for urgent language, mismatched sender domains, shortened links, and unusual attachments.</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <Field label="Sender email" value={sender} onChange={(event) => setSender(event.target.value)} />
          <Field label="Subject line" value={subject} onChange={(event) => setSubject(event.target.value)} />
          <label className="block text-sm font-semibold text-slate-200">Message body</label>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={6}
            className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-5 py-4 text-slate-100 shadow-glow outline-none transition duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            placeholder="Paste the suspicious email content here"
          />
          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow transition duration-300 hover:-translate-y-1"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze email'}
            </button>
            <button
              type="button"
              onClick={() => {
                setSender('no-reply@secure-bank.com')
                setSubject('Urgent: Verify your account now')
                setBody('Dear customer, your account will be suspended unless you verify your credentials immediately.')
              }}
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition duration-300 hover:bg-white/10 hover:-translate-y-1"
            >
              Load sample
            </button>
          </div>
        </form>

        {result ? (
          <div className="space-y-6 rounded-[28px] border border-white/10 bg-slate-900/90 p-6 shadow-glow">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Verdict</p>
                <p className={`mt-2 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${verdictClass}`}>{result.verdict}</p>
              </div>
              <div className="space-y-1 text-right text-slate-300">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Risk score</p>
                <p className="text-3xl font-semibold text-white">{result.score}</p>
              </div>
            </div>

            <RiskMeter score={result.score} />

            <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5 rounded-3xl bg-slate-950/75 p-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Why this email is suspicious</p>
                  {result.reasons.length ? (
                    <ul className="mt-4 space-y-3 text-sm text-slate-300">
                      {result.reasons.map((reason, index) => (
                        <li key={index} className="rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3">{reason}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-slate-400">No strong phishing patterns were detected. Confirm sender authenticity if unsure.</p>
                  )}
                </div>

                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Recommended precautions</p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-300">
                    {result.recommendations.map((item, index) => (
                      <li key={index} className="rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl bg-slate-950/75 p-5 text-sm text-slate-300">
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Actionable fixes</p>
                  <ul className="mt-4 space-y-3">
                    {result.fixes.map((fix, index) => (
                      <li key={index} className="rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3">{fix}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <SmallStat label="Sender domain" value={result.details?.sender_domain || 'N/A'} />
                  <SmallStat label="Contains links" value={result.details?.contains_links ? 'Yes' : 'No'} />
                  <SmallStat label="Urgent language" value={result.details?.urgent_language ? 'Yes' : 'No'} />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Badge label="Shortened links" value={result.details?.shortened_links ? 'Yes' : 'No'} />
                  <Badge label="Free email" value={result.details?.sender_free_domain ? 'Yes' : 'No'} />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <aside className="space-y-6 rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-panel backdrop-blur-xl">
        <div>
          <h3 className="text-lg font-semibold text-white">Email history</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">Track the last email verdicts and keep your workflow organized.</p>
        </div>
        <HistoryPanel history={history.filter((entry) => entry.type === 'EMAIL').slice(0, 8)} />
      </aside>
    </section>
  )
}

function MetricCard({ label, value, accent = 'text-cyan-300' }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-glow transition hover:-translate-y-1 hover:border-cyan-400/20">
      <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <p className={`mt-4 text-3xl font-semibold ${accent}`}>{value ?? '-'}</p>
    </div>
  )
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="group rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-7 shadow-panel transition hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-slate-900/95">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-400/10 text-2xl transition group-hover:bg-cyan-400/15">{icon}</div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-slate-400">{description}</p>
    </div>
  )
}

function DashboardCard({ label, value, accent = 'text-white' }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/90 p-6 shadow-glow transition hover:-translate-y-1 hover:border-cyan-400/20">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-4 text-4xl font-semibold ${accent}`}>{value}</p>
    </div>
  )
}

function ActionCard({ label, description, to }) {
  return (
    <NavLink to={to} className="block rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-5 transition hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-slate-900/95 hover:shadow-glow">
      <p className="text-base font-semibold text-white">{label}</p>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </NavLink>
  )
}

function HistoryPanel({ history }) {
  if (!history.length) {
    return <p className="rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-6 text-sm text-slate-400">No recent scans available yet.</p>
  }

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <div key={`${item.timestamp}-${item.source}`} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 transition hover:-translate-y-1 hover:border-cyan-400/20">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{item.source}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{item.type} scan • Score {item.score}</p>
            </div>
            <p className={`rounded-full px-3 py-1 text-xs font-semibold ${verdictStyles[item.verdict] || 'bg-slate-800/70 text-slate-200'}`}>{item.verdict}</p>
          </div>
          <p className="mt-3 text-sm text-slate-400">{new Date(item.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-200">{label}</label>
      <input
        value={value}
        onChange={onChange}
        className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/90 px-5 py-4 text-slate-100 shadow-glow outline-none transition duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
      />
    </div>
  )
}

function Badge({ label, value }) {
  return (
    <div className="rounded-3xl bg-slate-800/80 px-4 py-3 text-sm text-slate-300 shadow-glow">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 font-medium text-white">{value}</p>
    </div>
  )
}

function SmallStat({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-4 text-sm text-slate-300 transition hover:-translate-y-1 hover:border-cyan-400/20">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 font-semibold text-white">{value}</p>
    </div>
  )
}

export default App
