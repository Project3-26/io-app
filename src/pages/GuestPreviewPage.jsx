import {
  BookOpen,
  Compass,
  LockKeyhole,
  MessageCircle,
  UserPlus,
} from 'lucide-react'

const previewItems = [
  {
    title: 'Journey',
    body: 'See how Project 3|26 guides you one chapter at a time through the Bible.',
    icon: Compass,
  },
  {
    title: 'Bible Reading',
    body: 'A free account unlocks the Book of John trial and saves your place across devices.',
    icon: BookOpen,
  },
  {
    title: 'Connect',
    body: 'Preview the community experience. Participation requires a real member account.',
    icon: MessageCircle,
  },
]

function GuestPreviewPage({ onCreateAccount, onSignIn }) {
  return (
    <main className="min-h-screen bg-[#041326] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
            <BookOpen size={23} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-400">PROJECT 3|26</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Explore as a guest</h1>
          </div>
        </div>

        <section className="mt-7 rounded-[28px] border border-cyan-300/20 bg-[#0c2138] p-5 shadow-2xl shadow-black/20 sm:p-7">
          <p className="text-sm leading-6 text-slate-300">
            Take a quick look around without creating an account. Guest preview never creates a shared login and never receives member or paid access.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {previewItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-[#071a2d] p-4">
                  <Icon size={22} className="text-cyan-300" />
                  <h2 className="mt-3 text-sm font-bold text-white">{item.title}</h2>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{item.body}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-orange-300/20 bg-orange-400/10 p-4">
            <div className="flex gap-3">
              <LockKeyhole size={19} className="mt-0.5 shrink-0 text-orange-300" />
              <div>
                <p className="text-sm font-semibold text-orange-100">Guest preview is intentionally limited.</p>
                <p className="mt-1 text-xs leading-5 text-orange-100/70">
                  Reading Scripture, saving progress, joining conversations, church areas, and plan access require your own account.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onCreateAccount}
              className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-bold text-[#041326] transition hover:bg-cyan-300"
            >
              <UserPlus size={17} />
              Create free account
            </button>
            <button
              type="button"
              onClick={onSignIn}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              Back to sign in
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}

export default GuestPreviewPage
