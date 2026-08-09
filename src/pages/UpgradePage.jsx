import {
  ArrowLeft,
  BookOpen,
  Check,
  Crown,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'

const leaderFeatures = [
  'Leader guides for every available chapter',
  'Discussion plans and group questions',
  'Printable resources for churches and groups',
  'Future leader-only collections and tools',
]

const standardFeatures = [
  'Full Bible reader',
  'Audio where available',
  'Study resources where available',
  'Community conversation participation',
]

function UpgradePage({
  onBack,
  onNavigate,
}) {
  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation
        activePage="profile"
        onNavigate={onNavigate}
      />

      <div className="lg:pl-24">
        <main className="mx-auto min-h-screen w-full max-w-5xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-[#0c2138] px-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/35 hover:text-white active:scale-95"
          >
            <ArrowLeft size={17} />
            Go back
          </button>

          <header className="mt-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-300/40 bg-[#e8ddd0] text-orange-600 shadow-lg shadow-black/10">
              <Crown size={27} strokeWidth={2.2} />
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
              Leader Guides
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
              Lead others through Scripture
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Leader Guides are a separate paid product for pastors and small-group leaders.
            </p>
          </header>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <section className="rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-5 text-[#153047] shadow-xl shadow-black/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c7dce7] text-cyan-700">
                  <BookOpen size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="font-semibold">Bible Study</h2>
                  <p className="mt-1 text-xs text-slate-500">Core paid experience</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {standardFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-xl border border-[#c8d3db] bg-[#edf2f4] px-3 py-2.5"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#c7dce7] text-cyan-700">
                      <Check size={15} strokeWidth={2.5} />
                    </div>
                    <p className="text-sm font-medium text-slate-700">{feature}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="relative overflow-hidden rounded-[24px] border border-orange-300/50 bg-[#e8ddd0] p-5 text-[#153047] shadow-xl shadow-black/10">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-orange-300/30 blur-3xl" />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-200/70 text-orange-600">
                    <Users size={20} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h2 className="font-semibold">Leader Guides</h2>
                    <p className="mt-1 text-xs text-slate-500">Separate leader entitlement</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {leaderFeatures.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 rounded-xl border border-orange-300/40 bg-orange-100/50 px-3 py-2.5"
                    >
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-200/80 text-orange-600">
                        <Check size={15} strokeWidth={2.5} />
                      </div>
                      <p className="text-sm leading-5 text-slate-700">{feature}</p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  disabled
                  className="mt-6 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-orange-500/60 px-4 py-3 text-sm font-semibold text-white/90"
                >
                  <Crown size={17} />
                  Checkout coming soon
                </button>
                <p className="mt-2 text-center text-xs text-slate-500">
                  Stripe checkout will be enabled when production billing is connected.
                </p>
              </div>
            </section>
          </div>

          <section className="mt-4 rounded-[20px] border border-emerald-300/40 bg-[#d9e7df] p-4 text-[#153047] shadow-lg shadow-black/10">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-200/70 text-emerald-700">
                <ShieldCheck size={19} strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-emerald-800">No payment is taken in beta</h2>
                <p className="mt-1.5 text-sm leading-5 text-slate-600">
                  Test accounts currently receive product access without a live checkout.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Sparkles size={14} />
            Built for individuals, groups, and churches
          </div>
        </main>
      </div>
    </div>
  )
}

export default UpgradePage