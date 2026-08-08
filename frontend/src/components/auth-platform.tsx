
'use client'

import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  FileDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Play,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'

import {
  AuthUser,
  UserRole,
  canAccess,
  getAuthUser,
  redirectForRole,
  signIn,
  signOut,
} from '@/lib/auth'

import {
  getFinalResult,
  type FinalResult,
} from '@/api/interviewApi'

const nav = {
  candidate: [
    {
      href: '/candidate/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/interview',
      label: 'My interview',
      icon: Play,
    },
    {
      href: '/result/alex-morgan',
      label: 'Results',
      icon: BarChart3,
    },
  ],
  interviewer: [
    {
      href: '/interviewer/dashboard',
      label: 'Command center',
      icon: LayoutDashboard,
    },
    {
      href: '/interviewer/candidates/alex-morgan',
      label: 'Candidates',
      icon: Users,
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ],
}

export function AuthGuard({
  role,
  children,
}: {
  role: UserRole
  children: React.ReactNode
}) {
  const router = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const current = getAuthUser()

    if (!canAccess(current, role)) {
      router('/login')
      return
    }

    setUser(current)
  }, [role, router])

  if (!user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">
        Loading workspace…
      </div>
    )
  }

  return <>{children}</>
}

export function AuthShell({
  role,
  children,
}: {
  role: UserRole
  children: React.ReactNode
}) {
  const { pathname } = useLocation()
  const router = useNavigate()

  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    setUser(getAuthUser())
  }, [])

  const items = nav[role]

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#10263c]">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-[#dbe5ef] bg-white p-5 transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-[#123d5d] text-white">
              <MessageSquare className="size-5" />
            </span>

            Interview
            <span className="text-[#168f99]">Pro</span>
          </Link>

          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-10 rounded-2xl bg-[#eef7f8] p-4">
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#168f99]">
            {role === 'candidate'
              ? 'Candidate portal'
              : 'Interviewer workspace'}
          </p>

          <p className="mt-2 text-sm font-semibold">
            {role === 'candidate'
              ? 'Your next step starts here.'
              : 'Make every decision count.'}
          </p>
        </div>

        <nav className="mt-8 grid gap-2">
          {items.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              onClick={() => setOpen(false)}
              to={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                pathname === href
                  ? 'bg-[#123d5d] text-white shadow-sm'
                  : 'text-[#587086] hover:bg-[#f1f6f9] hover:text-[#123d5d]'
              }`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="absolute inset-x-5 bottom-5 border-t border-[#e5edf3] pt-4">
          <Link
            to="/support"
            className="flex items-center gap-3 px-3 py-2 text-sm text-[#587086]"
          >
            <CircleHelp className="size-4" />
            Help center
          </Link>

          <button
            onClick={() => {
              signOut()
              router('/login')
            }}
            className="mt-2 flex w-full items-center gap-3 px-3 py-2 text-sm text-[#587086]"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#dbe5ef] bg-white/90 px-5 backdrop-blur lg:px-8">
          <button
            className="rounded-lg p-2 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>

          <div className="hidden text-sm text-[#587086] sm:block">
            {role === 'candidate'
              ? 'Candidate portal'
              : 'Interviewer command center'}
          </div>

          <div className="flex items-center gap-4">
            <button
              className="relative text-[#587086]"
              aria-label="Notifications"
            >
              <Bell className="size-5" />

              <span className="absolute -right-1 -top-1 size-2 rounded-full bg-[#168f99]" />
            </button>

            <div className="hidden h-6 w-px bg-[#dbe5ef] sm:block" />

            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-full bg-[#d8e9eb] text-xs font-bold text-[#123d5d]">
                {user?.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')}
              </span>

              <span className="hidden text-sm font-semibold sm:block">
                {user?.name}
              </span>

              <ChevronDown className="hidden size-4 text-[#7a8d9d] sm:block" />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  )
}

export function LoginPage() {
  const router = useNavigate()

  const [role, setRole] = useState<UserRole>('candidate')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (demo = false) => {
    if (!demo && (!email || password.length < 4)) {
      setError(
        'Enter an email and a password with at least 4 characters.'
      )
      return
    }

    signIn(email, role)
    router(redirectForRole(role))
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f9fc] px-5 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#dbe5ef] bg-white shadow-[0_24px_80px_rgba(18,61,93,.12)] md:grid md:grid-cols-[.9fr_1.1fr]">
        <div className="hidden bg-[#123d5d] p-10 text-white md:block">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-[#168f99] text-white">
              <MessageSquare className="size-5" />
            </span>

            InterviewPro
          </Link>

          <div className="mt-28">
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#9ed9d8]">
              The thoughtful interview platform
            </p>

            <h1 className="mt-5 text-4xl font-semibold leading-tight">
              Better conversations. Better decisions.
            </h1>

            <p className="mt-5 leading-7 text-[#c7dae6]">
              A calmer, clearer way to prepare, interview, and grow.
            </p>
          </div>

          <div className="mt-24 flex items-center gap-2 text-sm text-[#c7dae6]">
            <ShieldCheck className="size-4 text-[#9ed9d8]" />
            Secure workspace demo
          </div>
        </div>

        <div className="p-7 sm:p-12">
          <Link
            to="/"
            className="text-sm font-semibold text-[#123d5d] md:hidden"
          >
            ← Back to InterviewPro
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[.16em] text-[#168f99] md:mt-0">
            Welcome back
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Sign in to your workspace
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#587086]">
            Choose a demo role to explore the full experience.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-2 rounded-xl bg-[#eef3f7] p-1">
            {(['candidate', 'interviewer'] as UserRole[]).map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setRole(item)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-semibold capitalize ${
                    role === item
                      ? 'bg-white text-[#123d5d] shadow-sm'
                      : 'text-[#587086]'
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <label className="mt-7 block text-sm font-semibold">
            Work email

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@company.com"
              className="mt-2 h-12 w-full rounded-xl border border-[#cfdde7] px-4 text-sm outline-none focus:border-[#168f99] focus:ring-4 focus:ring-[#168f99]/10"
            />
          </label>

          <label className="mt-4 block text-sm font-semibold">
            Password

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="mt-2 h-12 w-full rounded-xl border border-[#cfdde7] px-4 text-sm outline-none focus:border-[#168f99] focus:ring-4 focus:ring-[#168f99]/10"
            />
          </label>

          {error && (
            <p className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={() => submit()}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#168f99] text-sm font-semibold text-white transition hover:bg-[#117c84]"
          >
            Sign in
            <ArrowRight className="size-4" />
          </button>

          <button
            onClick={() => submit(true)}
            className="mt-3 flex h-12 w-full items-center justify-center rounded-xl border border-[#cfdde7] text-sm font-semibold text-[#123d5d]"
          >
            Continue with demo account
          </button>
        </div>
      </div>
    </main>
  )
}

function PageHeading({
  eyebrow,
  title,
  text,
  action,
}: {
  eyebrow: string
  title: string
  text: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#168f99]">
          {eyebrow}
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#587086]">
          {text}
        </p>
      </div>

      {action}
    </div>
  )
}

function Metric({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string
  value: string
  detail: string
  icon: typeof Target
}) {
  return (
    <div className="rounded-2xl border border-[#dbe5ef] bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="grid size-9 place-items-center rounded-xl bg-[#eef7f8] text-[#168f99]">
          <Icon className="size-4" />
        </span>

        <span className="text-xs font-semibold text-emerald-600">
          {detail}
        </span>
      </div>

      <p className="mt-6 text-2xl font-semibold">
        {value}
      </p>

      <p className="mt-1 text-sm text-[#587086]">
        {label}
      </p>
    </div>
  )
}

export function CandidateDashboard() {
  return (
    <AuthGuard role="candidate">
      <AuthShell role="candidate">
        <PageHeading
          eyebrow="Monday, October 14"
          title="Good morning, Alex."
          text="Keep your momentum going. Your next interview is ready when you are."
          action={
            <Link
              to="/interview"
              className="inline-flex items-center gap-2 rounded-xl bg-[#123d5d] px-4 py-3 text-sm font-semibold text-white"
            >
              Continue interview
              <ArrowRight className="size-4" />
            </Link>
          }
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <section className="rounded-2xl border border-[#dbe5ef] bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[#168f99]">
                  Next up
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Product Designer · Final conversation
                </h2>

                <p className="mt-2 text-sm text-[#587086]">
                  Thursday, October 17 · 10:00 AM · 45 minutes
                </p>
              </div>

              <span className="rounded-full bg-[#fff5dd] px-3 py-1 text-xs font-semibold text-[#9a6b00]">
                In 3 days
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="rounded-xl bg-[#f3f7fa] px-4 py-3 text-sm">
                <span className="block text-xs text-[#7a8d9d]">
                  Interviewer
                </span>

                <strong className="mt-1 block">
                  Maya Chen
                </strong>
              </div>

              <div className="rounded-xl bg-[#f3f7fa] px-4 py-3 text-sm">
                <span className="block text-xs text-[#7a8d9d]">
                  Format
                </span>

                <strong className="mt-1 block">
                  AI-assisted video
                </strong>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#dbe5ef] bg-[#123d5d] p-6 text-white">
            <p className="text-sm font-semibold text-[#9ed9d8]">
              AI cohort progress
            </p>

            <p className="mt-5 text-4xl font-semibold">
              73%
            </p>

            <p className="mt-2 text-sm text-[#c7dae6]">
              You are ahead of 68% of candidates this month.
            </p>

            <div className="mt-5 h-2 rounded-full bg-white/15">
              <div className="h-2 w-[73%] rounded-full bg-[#62c8c9]" />
            </div>

            <Link
              to="/analytics"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white"
            >
              View your insights
              <ArrowRight className="size-4" />
            </Link>
          </section>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_.75fr]">
          <section className="rounded-2xl border border-[#dbe5ef] bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">
                  Previous results
                </h2>

                <p className="mt-1 text-sm text-[#587086]">
                  Your latest interview feedback
                </p>
              </div>

              <Link
                to="/result/alex-morgan"
                className="text-sm font-semibold text-[#168f99]"
              >
                View all
              </Link>
            </div>

            <div className="mt-6 divide-y divide-[#e7eef3]">
              {[
                [
                  'Product Designer · First conversation',
                  'October 10',
                  '8.6 / 10',
                  'Strong',
                ],
                [
                  'UX Researcher · Screening',
                  'September 24',
                  '8.1 / 10',
                  'Good',
                ],
              ].map(([title, date, score, status]) => (
                <Link
                  to="/result/alex-morgan"
                  key={title}
                  className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {title}
                    </p>

                    <p className="mt-1 text-xs text-[#7a8d9d]">
                      {date} · {status}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-[#123d5d]">
                    {score}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#dbe5ef] bg-white p-6">
            <h2 className="font-semibold">
              Prepare with intention
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#587086]">
              Review your strengths and practice the areas that matter most.
            </p>

            <div className="mt-5 grid gap-3">
              <Link
                to="/result/alex-morgan"
                className="flex items-center justify-between rounded-xl bg-[#eef7f8] p-4 text-sm font-semibold text-[#123d5d]"
              >
                Review feedback
                <ChevronRight className="size-4" />
              </Link>

              <Link
                to="/interview"
                className="flex items-center justify-between rounded-xl border border-[#dbe5ef] p-4 text-sm font-semibold text-[#123d5d]"
              >
                Practice a question
                <ChevronRight className="size-4" />
              </Link>
            </div>
          </section>
        </div>
      </AuthShell>
    </AuthGuard>
  )
}

const candidates = [
  ['Alex Morgan', 'Product Designer', '8.6', 'Strong', 'Today, 9:42 AM'],
  ['Priya Shah', 'Senior Product Manager', '9.2', 'Excellent', 'Today, 8:18 AM'],
  ['Jordan Lee', 'UX Researcher', '7.8', 'Good', 'Yesterday'],
  ['Samira Okafor', 'Product Designer', '6.9', 'Review needed', 'Yesterday'],
]

export function InterviewerDashboard() {
  return (
    <AuthGuard role="interviewer">
      <AuthShell role="interviewer">
        <PageHeading
          eyebrow="Monday, October 14"
          title="Good morning, Maya."
          text="Here is the signal across your active hiring pipeline."
          action={
            <button className="inline-flex items-center gap-2 rounded-xl bg-[#123d5d] px-4 py-3 text-sm font-semibold text-white">
              <FileText className="size-4" />
              New interview
            </button>
          }
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric
            icon={Users}
            label="Active candidates"
            value="42"
            detail="+12%"
          />

          <Metric
            icon={ClipboardCheck}
            label="Completed this week"
            value="18"
            detail="+4"
          />

          <Metric
            icon={Target}
            label="Average score"
            value="8.6"
            detail="+0.8"
          />

          <Metric
            icon={Clock3}
            label="Time to decision"
            value="2.4d"
            detail="-18%"
          />
        </div>

        <section className="mt-6 rounded-2xl border border-[#dbe5ef] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7eef3] p-6">
            <div>
              <h2 className="font-semibold">
                Candidate pipeline
              </h2>

              <p className="mt-1 text-sm text-[#587086]">
                Review the latest completed interviews and next actions.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                className="grid size-10 place-items-center rounded-xl border border-[#dbe5ef]"
                aria-label="Search candidates"
              >
                <Search className="size-4 text-[#587086]" />
              </button>

              <button className="rounded-xl border border-[#dbe5ef] px-3 py-2 text-sm font-semibold">
                All roles
                <ChevronDown className="ml-1 inline size-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-[#f8fafb] text-xs uppercase tracking-wide text-[#7a8d9d]">
                <tr>
                  <th className="px-6 py-4 font-semibold">
                    Candidate
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Role
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Score
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Last activity
                  </th>

                  <th />
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e7eef3]">
                {candidates.map(
                  ([name, role, score, status, date]) => (
                    <tr
                      key={name}
                      className="hover:bg-[#fbfcfd]"
                    >
                      <td className="px-6 py-4">
                        <Link
                          to="/interviewer/candidates/alex-morgan"
                          className="flex items-center gap-3 font-semibold"
                        >
                          <span className="grid size-9 place-items-center rounded-full bg-[#d8e9eb] text-xs text-[#123d5d]">
                            {name
                              .split(' ')
                              .map((p) => p[0])
                              .join('')}
                          </span>

                          {name}
                        </Link>
                      </td>

                      <td className="px-6 py-4 text-[#587086]">
                        {role}
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        {score}{' '}
                        <span className="font-normal text-[#7a8d9d]">
                          / 10
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            status === 'Review needed'
                              ? 'bg-[#fff5dd] text-[#9a6b00]'
                              : 'bg-[#e9f7f1] text-[#16805c]'
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-[#587086]">
                        {date}
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          to="/interviewer/candidates/alex-morgan"
                          aria-label={`Open ${name}`}
                        >
                          <ChevronRight className="size-4 text-[#7a8d9d]" />
                        </Link>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      </AuthShell>
    </AuthGuard>
  )
}

export function CandidateDetail() {
  return (
    <AuthGuard role="interviewer">
      <AuthShell role="interviewer">
        <div className="flex items-center gap-2 text-sm text-[#587086]">
          <Link
            to="/interviewer/dashboard"
            className="hover:text-[#168f99]"
          >
            Candidates
          </Link>

          <ChevronRight className="size-4" />

          Alex Morgan
        </div>

        <div className="mt-7 flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <span className="grid size-16 place-items-center rounded-2xl bg-[#d8e9eb] text-lg font-semibold text-[#123d5d]">
              AM
            </span>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[.15em] text-[#168f99]">
                Product Designer
              </p>

              <h1 className="mt-1 text-3xl font-semibold">
                Alex Morgan
              </h1>

              <p className="mt-1 text-sm text-[#587086]">
                alex.morgan@example.com · Applied October 2
              </p>
            </div>
          </div>

          <Link
            to="/result/alex-morgan"
            className="inline-flex items-center gap-2 rounded-xl bg-[#123d5d] px-4 py-3 text-sm font-semibold text-white"
          >
            <FileText className="size-4" />
            View full report
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Metric
            icon={Target}
            label="Overall score"
            value="8.6 / 10"
            detail="Strong"
          />

          <Metric
            icon={TrendingUp}
            label="Recommendation"
            value="Advance"
            detail="92% confidence"
          />

          <Metric
            icon={BookOpen}
            label="Questions answered"
            value="8 / 8"
            detail="Complete"
          />
        </div>

        <section className="mt-6 rounded-2xl border border-[#dbe5ef] bg-white p-6">
          <h2 className="font-semibold">
            Interview timeline
          </h2>

          <div className="mt-6 grid gap-5 border-l-2 border-[#d8e9eb] pl-5">
            <div>
              <p className="text-sm font-semibold">
                Final conversation complete
              </p>

              <p className="mt-1 text-sm text-[#587086]">
                October 10 · AI-generated report ready for review.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold">
                First conversation complete
              </p>

              <p className="mt-1 text-sm text-[#587086]">
                October 4 · Strong collaboration signal.
              </p>
            </div>
          </div>
        </section>
      </AuthShell>
    </AuthGuard>
  )
}

export function ResultPage() {
  const { id } = useParams<{ id: string }>()

  const [expanded, setExpanded] = useState<number | null>(0)
  const [result, setResult] = useState<FinalResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      setError('Interview session ID is missing.')
      setLoading(false)
      return
    }

    getFinalResult(id)
      .then((data) => {
        setResult(data)
      })
      .catch((err) => {
        console.error(err)

        setError(
          err?.response?.data?.detail ||
            'Unable to load the interview result.'
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  const download = () => {
    window.print()
  }

  if (loading) {
    return (
      <AuthGuard role="interviewer">
        <AuthShell role="interviewer">
          <div className="grid min-h-[500px] place-items-center">
            <div className="text-center">
              <div className="mx-auto size-10 animate-spin rounded-full border-4 border-[#dbe5ef] border-t-[#168f99]" />

              <p className="mt-4 text-sm text-[#587086]">
                Loading interview results...
              </p>
            </div>
          </div>
        </AuthShell>
      </AuthGuard>
    )
  }

  if (error || !result) {
    return (
      <AuthGuard role="interviewer">
        <AuthShell role="interviewer">
          <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-white p-8 text-center">
            <h1 className="text-2xl font-semibold text-[#123d5d]">
              Unable to load results
            </h1>

            <p className="mt-3 text-sm text-red-600">
              {error || 'No interview result was found.'}
            </p>

            <Link
              to="/interviewer/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#123d5d] px-4 py-3 text-sm font-semibold text-white"
            >
              Back to dashboard
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </AuthShell>
      </AuthGuard>
    )
  }

  const score =
    result.maximum_score > 0
      ? (result.total_score / result.maximum_score) * 10
      : 0

  const percentage = result.percentage

  const assessment =
    percentage >= 80
      ? 'Excellent candidate'
      : percentage >= 60
        ? 'Good candidate'
        : percentage >= 40
          ? 'Developing candidate'
          : 'Needs improvement'

  const recommendation =
    percentage >= 70
      ? 'Recommended to advance'
      : 'Further evaluation recommended'

  return (
    <AuthGuard role="interviewer">
      <AuthShell role="interviewer">
        <div className="print-actions">
          <div className="flex items-center gap-2 text-sm text-[#587086]">
            <Link
              to="/interviewer/dashboard"
              className="hover:text-[#168f99]"
            >
              Interviewer dashboard
            </Link>

            <ChevronRight className="size-4" />

            <span>Interview report</span>
          </div>

          <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#168f99]">
                AI evaluation report
              </p>

              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
                Interview Results
              </h1>

              <p className="mt-2 text-sm text-[#587086]">
                Completed interview · Final evaluation
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={download}
                className="inline-flex items-center gap-2 rounded-xl border border-[#cfdde7] bg-white px-4 py-3 text-sm font-semibold"
              >
                <FileDown className="size-4" />
                Download PDF
              </button>

              <Link
                to="/interview"
                className="inline-flex items-center gap-2 rounded-xl bg-[#123d5d] px-4 py-3 text-sm font-semibold text-white"
              >
                <MessageSquare className="size-4" />
                New interview
              </Link>
            </div>
          </div>
        </div>

        <section className="report-print mt-8 rounded-2xl border border-[#dbe5ef] bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-8 border-b border-[#e7eef3] pb-8">
            <div
              className="grid size-36 place-items-center rounded-full"
              style={{
                background: `conic-gradient(#168f99 0 ${percentage}%, #e7eef3 ${percentage}% 100%)`,
              }}
            >
              <div className="grid size-28 place-items-center rounded-full bg-white text-center">
                <strong className="text-4xl">
                  {score.toFixed(1)}
                </strong>

                <span className="text-xs text-[#587086]">
                  out of 10
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#168f99]">
                Overall assessment
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                {assessment}
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#587086]">
                {result.summary}
              </p>

              <span
                className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  percentage >= 70
                    ? 'bg-[#e9f7f1] text-[#16805c]'
                    : 'bg-[#fff5dd] text-[#9a6b00]'
                }`}
              >
                <Check className="size-3.5" />
                {recommendation}
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-[#f5f8fa] p-4">
              <p className="text-xs text-[#587086]">
                Overall score
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {score.toFixed(1)}
              </p>

              <p className="mt-1 text-xs font-semibold text-[#168f99]">
                Out of 10
              </p>
            </div>

            <div className="rounded-xl bg-[#f5f8fa] p-4">
              <p className="text-xs text-[#587086]">
                Percentage
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {percentage.toFixed(1)}%
              </p>

              <p className="mt-1 text-xs font-semibold text-[#168f99]">
                Final performance
              </p>
            </div>

            <div className="rounded-xl bg-[#f5f8fa] p-4">
              <p className="text-xs text-[#587086]">
                Questions answered
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {result.answered_questions}
              </p>

              <p className="mt-1 text-xs font-semibold text-[#168f99]">
                Completed
              </p>
            </div>

            <div className="rounded-xl bg-[#f5f8fa] p-4">
              <p className="text-xs text-[#587086]">
                Total score
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {result.total_score}
              </p>

              <p className="mt-1 text-xs font-semibold text-[#168f99]">
                Maximum {result.maximum_score}
              </p>
            </div>
          </div>

          <div className="mt-9 grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <h2 className="font-semibold">
                Performance overview
              </h2>

              <p className="mt-1 text-sm text-[#587086]">
                Overall signal from the completed interview.
              </p>

              <div className="mt-5">
                <div className="flex justify-between text-sm">
                  <span>Interview performance</span>

                  <strong>
                    {percentage.toFixed(1)}%
                  </strong>
                </div>

                <div className="mt-2 h-2 rounded-full bg-[#e7eef3]">
                  <div
                    className="h-2 rounded-full bg-[#168f99]"
                    style={{
                      width: `${Math.min(
                        Math.max(percentage, 0),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-[#eef7f8] p-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-[#168f99]" />

                  <h3 className="text-sm font-semibold">
                    AI summary
                  </h3>
                </div>

                <p className="mt-3 text-sm leading-6 text-[#587086]">
                  {result.summary}
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-semibold">
                Recommendations
              </h2>

              <p className="mt-1 text-sm text-[#587086]">
                Suggested next steps based on the evaluation.
              </p>

              <div className="mt-4 grid gap-3">
                {result.recommendations.length > 0 ? (
                  result.recommendations.map(
                    (recommendation, index) => (
                      <div
                        key={`${recommendation}-${index}`}
                        className="flex gap-3 rounded-xl border border-[#e7eef3] bg-white p-4"
                      >
                        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#eef7f8] text-xs font-semibold text-[#168f99]">
                          {index + 1}
                        </span>

                        <p className="text-sm leading-6 text-[#587086]">
                          {recommendation}
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p className="rounded-xl bg-[#f5f8fa] p-4 text-sm text-[#587086]">
                    Continue practicing advanced technical
                    interview scenarios.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-9 grid gap-5 lg:grid-cols-2">
            <section className="rounded-2xl border border-[#dbe5ef] bg-white p-6">
              <div className="flex items-center gap-2">
                <Check className="size-4 text-[#168f99]" />

                <h2 className="font-semibold">
                  Strengths
                </h2>
              </div>

              <div className="mt-5 grid gap-3">
                {result.strengths.length > 0 ? (
                  result.strengths.map(
                    (strength, index) => (
                      <div
                        key={`${strength}-${index}`}
                        className="rounded-xl bg-[#e9f7f1] p-4 text-sm text-[#16805c]"
                      >
                        {strength}
                      </div>
                    )
                  )
                ) : (
                  <p className="rounded-xl bg-[#f5f8fa] p-4 text-sm text-[#587086]">
                    No specific strengths were recorded.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-[#dbe5ef] bg-white p-6">
              <div className="flex items-center gap-2">
                <Target className="size-4 text-[#168f99]" />

                <h2 className="font-semibold">
                  Areas to improve
                </h2>
              </div>

              <div className="mt-5 grid gap-3">
                {result.gaps.length > 0 ? (
                  result.gaps.map(
                    (gap, index) => (
                      <div
                        key={`${gap}-${index}`}
                        className="rounded-xl bg-[#fff5dd] p-4 text-sm text-[#9a6b00]"
                      >
                        {gap}
                      </div>
                    )
                  )
                ) : (
                  <p className="rounded-xl bg-[#f5f8fa] p-4 text-sm text-[#587086]">
                    No major gaps were identified.
                  </p>
                )}
              </div>
            </section>
          </div>

          <div className="mt-9 border-t border-[#e7eef3] pt-8">
            <h2 className="font-semibold">
              Evaluation details
            </h2>

            <p className="mt-1 text-sm text-[#587086]">
              Expand each section to review the final evaluation.
            </p>

            <div className="mt-5 divide-y divide-[#e7eef3] rounded-xl border border-[#e7eef3]">
              <div>
                <button
                  onClick={() =>
                    setExpanded(
                      expanded === 0 ? null : 0
                    )
                  }
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <span className="grid size-7 place-items-center rounded-lg bg-[#eef7f8] text-xs font-semibold text-[#168f99]">
                    1
                  </span>

                  <span className="flex-1 text-sm font-semibold">
                    Final interview summary
                  </span>

                  {expanded === 0 ? (
                    <ChevronDown className="size-4 text-[#7a8d9d]" />
                  ) : (
                    <ChevronRight className="size-4 text-[#7a8d9d]" />
                  )}
                </button>

                {expanded === 0 && (
                  <div className="px-14 pb-5 text-sm leading-6 text-[#587086]">
                    {result.summary}
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() =>
                    setExpanded(
                      expanded === 1 ? null : 1
                    )
                  }
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <span className="grid size-7 place-items-center rounded-lg bg-[#eef7f8] text-xs font-semibold text-[#168f99]">
                    2
                  </span>

                  <span className="flex-1 text-sm font-semibold">
                    Score calculation
                  </span>

                  {expanded === 1 ? (
                    <ChevronDown className="size-4 text-[#7a8d9d]" />
                  ) : (
                    <ChevronRight className="size-4 text-[#7a8d9d]" />
                  )}
                </button>

                {expanded === 1 && (
                  <div className="px-14 pb-5 text-sm leading-6 text-[#587086]">
                    The candidate scored{' '}
                    <strong>
                      {result.total_score}
                    </strong>{' '}
                    out of{' '}
                    <strong>
                      {result.maximum_score}
                    </strong>{' '}
                    points, resulting in a final percentage of{' '}
                    <strong>
                      {percentage.toFixed(2)}%
                    </strong>
                    .
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() =>
                    setExpanded(
                      expanded === 2 ? null : 2
                    )
                  }
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <span className="grid size-7 place-items-center rounded-lg bg-[#eef7f8] text-xs font-semibold text-[#168f99]">
                    3
                  </span>

                  <span className="flex-1 text-sm font-semibold">
                    Next steps
                  </span>

                  {expanded === 2 ? (
                    <ChevronDown className="size-4 text-[#7a8d9d]" />
                  ) : (
                    <ChevronRight className="size-4 text-[#7a8d9d]" />
                  )}
                </button>

                {expanded === 2 && (
                  <div className="px-14 pb-5">
                    <div className="grid gap-2">
                      {result.recommendations.map(
                        (item, index) => (
                          <p
                            key={`${item}-${index}`}
                            className="text-sm leading-6 text-[#587086]"
                          >
                            • {item}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </AuthShell>
    </AuthGuard>
  )
}
