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

function UpgradePage({ onBack, onNavigate }) {
  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation activePage="profile" onNavigate={onNavigate} />

      <div className="lg:pl-24">
        <main className="mx-auto min-h-screen w-full max-w-5xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={18} />
            Go back
          </button>

          <header className="mt-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-orange-400/20 bg-orange-400/10 text-orange-300">
              <Crown size={31} />
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-orange-300">
              Leader Plan
            </p>

            <h1 className="mt-3 text-3xl font-bold sm:text-5xl">
              Lead others through Scripture
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Unlock leader guides and practical group resources while keeping the Bible at the center.
            </p>
          </header>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <section className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#0b2742] to-[#071a2d] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                  <BookOpen size={22} />
                </div>

                <div>
                  <h2 className="font-semibold">Standard Plan</h2>
                  <p className="mt-1 text-xs text-slate-500">Your current plan</p>
                </div>
              </div>

              <p className="mt-6 text-3xl font-bold">$7.50</p>
              <p className="mt-1 text-sm text-slate-500">per month</p>

              <div className="mt-6 space-y-3 text-sm text-slate-400">
                <p className="flex items-center gap-2"><Check size={17} className="text-cyan-300" /> Bible reader</p>
                <p className="flex items-center gap-2"><Check size={17} className="text-cyan-300" /> Audio studies</p>
                <p className="flex items-center gap-2"><Check size={17} className="text-cyan-300" /> Study guides</p>
              </div>
            </section>

            <section className="relative overflow-hidden rounded-3xl border border-orange-400/25 bg-gradient-to-br from-orange-400/[0.12] to-[#071a2d] p-6 shadow-xl shadow-black/20">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-300">
                      <Users size={22} />
                    </div>

                    <div>
                      <h2 className="font-semibold">Leader Plan</h2>
                      <p className="mt-1 text-xs text-orange-200/70">Everything in Standard</p>
                    </div>
                  </div>

                  <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-300">
                    Upgrade
                  </span>
                </div>

                <p className="mt-6 text-3xl font-bold">Pricing connected later</p>
                <p className="mt-1 text-sm text-slate-500">Final price comes from Stripe</p>

                <div className="mt-6 space-y-3">
                  {leaderFeatures.map((feature) => (
                    <p key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check size={17} className="mt-0.5 shrink-0 text-orange-300" />
                      {feature}
                    </p>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => window.alert('The secure Stripe checkout will open here after billing is connected.')}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-400 px-4 py-3.5 text-sm font-bold text-[#1a1305] transition hover:bg-orange-300 active:scale-[0.98]"
                >
                  <Crown size={18} />
                  Upgrade to Leader
                </button>
              </div>
            </section>
          </div>

          <section className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
            <ShieldCheck size={21} className="mt-0.5 shrink-0 text-emerald-300" />
            <div>
              <h2 className="font-semibold text-emerald-200">No payment is taken in this prototype</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">The production version will use a secure Stripe checkout and backend entitlement checks.</p>
            </div>
          </section>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600">
            <Sparkles size={14} />
            Built for individuals, groups, and churches
          </div>
        </main>
      </div>
    </div>
  )
}

export default UpgradePage
