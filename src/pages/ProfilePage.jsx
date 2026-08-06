import { useState } from 'react'
import {
  Bell,
  Building2,
  Check,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Crown,
  ExternalLink,
  LogOut,
  Mail,
  Moon,
  ReceiptText,
  ShieldCheck,
  Smartphone,
  Sparkles,
  User,
  UserRound,
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'

const accountSections = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Name, email, and profile details',
    icon: UserRound,
  },
  {
    id: 'security',
    title: 'Privacy & Security',
    description: 'Password, sign-in, and account protection',
    icon: ShieldCheck,
  },
  {
    id: 'help',
    title: 'Help & Support',
    description: 'Get answers or contact Project 3|26',
    icon: CircleHelp,
  },
]

function ProfilePage({ onNavigate, onOpenUpgrade }) {
  const [notifications, setNotifications] = useState({
    dailyChapter: true,
    streakReminders: true,
    achievements: true,
    churchMessages: true,
    productUpdates: false,
  })

  const [notice, setNotice] = useState('')
  const [confirmation, setConfirmation] = useState(null)

  function toggleNotification(settingId) {
    setNotifications((currentSettings) => ({
      ...currentSettings,
      [settingId]: !currentSettings[settingId],
    }))
  }

  function showPlaceholder(message) {
    setNotice(message)

    window.setTimeout(() => {
      setNotice('')
    }, 3500)
  }

  function handleConfirmation() {
    if (confirmation.type === 'cancel') {
      showPlaceholder(
        'The secure cancellation portal will open here once billing is connected.',
      )
    }

    if (confirmation.type === 'signout') {
      showPlaceholder(
        'Sign out will work once authentication is connected.',
      )
    }

    setConfirmation(null)
  }

  return (
    <div className="min-h-screen bg-[#06111b] text-white">
      <AppNavigation
        activePage="profile"
        onNavigate={onNavigate}
      />

      <div className="lg:pl-24">
        <main className="mx-auto min-h-screen w-full max-w-7xl px-3 pb-32 pt-5 min-[375px]:px-4 sm:px-6 sm:pt-6 lg:px-8 lg:pb-10 lg:pt-8 xl:px-10">
          <header>
            <p className="text-sm font-bold tracking-[0.18em] text-[#45c6d8]">
              PROJECT 3|26
            </p>

            <div className="mt-3 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold sm:text-4xl">
                  Profile
                </h1>

                <p className="mt-2 text-sm text-slate-400 sm:text-base">
                  Manage your account, plan, church, and preferences.
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-300">
                <User size={23} />
              </div>
            </div>
          </header>

          {notice && (
            <section className="mt-5 flex items-start gap-3 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] p-4">
              <Sparkles
                size={19}
                className="mt-0.5 shrink-0 text-cyan-300"
              />

              <p className="text-sm leading-relaxed text-slate-300">
                {notice}
              </p>
            </section>
          )}

          <div className="mt-7 grid gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <section className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821] p-5 shadow-xl shadow-black/20 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="relative">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/20 bg-gradient-to-br from-cyan-400/15 to-orange-400/10 text-2xl font-bold text-cyan-200">
                      BC
                    </div>

                    <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#121f29] bg-emerald-500 text-white">
                      <Check size={14} strokeWidth={3} />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold sm:text-2xl">
                      Brian Cooper
                    </h2>

                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                      <Mail size={15} />

                      <span className="truncate">
                        brian@example.com
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                        <User size={13} />
                        Standard Member
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/15 bg-orange-400/10 px-3 py-1 text-xs font-semibold text-orange-300">
                        <Sparkles size={13} />
                        Journey Day 2
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      showPlaceholder(
                        'Profile editing will open here once account management is connected.',
                      )
                    }
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/20 hover:bg-white/10 hover:text-white"
                  >
                    Edit Profile
                  </button>
                </div>
              </section>

              <section>
                <div>
                  <h2 className="text-xl font-bold">
                    Subscription & Billing
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Manage your plan, payments, and billing history.
                  </p>
                </div>

                <div className="mt-4 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821]">
                  <div className="border-b border-white/5 p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
                          <CreditCard size={23} />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">
                              Standard Plan
                            </h3>

                            <span className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                              Active
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-400">
                            $7.50 per month
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Next billing date: September 3, 2026
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          showPlaceholder(
                            'The secure billing portal will open here once Stripe is connected.',
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/15"
                      >
                        Manage Billing
                        <ExternalLink size={16} />
                      </button>
                    </div>

                    <div className="mt-4 border-t border-white/5 pt-3">
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmation({
                            type: 'cancel',
                            title: 'Cancel subscription?',
                            message:
                              'You will keep access through the end of your current billing period.',
                            buttonText:
                              'Continue to cancellation',
                          })
                        }
                        className="text-xs font-medium text-slate-600 underline-offset-4 transition hover:text-red-300 hover:underline"
                      >
                        Cancel subscription
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenUpgrade}
                    className="group flex w-full items-center gap-4 border-b border-white/5 p-5 text-left transition hover:bg-white/[0.03] sm:p-6"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/15 bg-amber-400/10 text-amber-300">
                      <Crown size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">
                        Upgrade to Leader Plan
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        Unlock leader guides and group resources.
                      </p>
                    </div>

                    <ChevronRight
                      size={19}
                      className="shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-amber-300"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      showPlaceholder(
                        'Invoices and receipts will appear here through the billing portal.',
                      )
                    }
                    className="group flex w-full items-center gap-4 p-5 text-left transition hover:bg-white/[0.03] sm:p-6"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/[0.04] text-slate-300">
                      <ReceiptText size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">
                        Billing History
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        View invoices, receipts, and past payments.
                      </p>
                    </div>

                    <ChevronRight
                      size={19}
                      className="shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-white"
                    />
                  </button>
                </div>
              </section>

              <section>
                <div>
                  <h2 className="text-xl font-bold">
                    Church Connection
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Join your church’s Project 3|26 community.
                  </p>
                </div>

                <div className="mt-4 rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.07] to-[#0d1821] p-5 sm:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
                      <Building2 size={27} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">
                          Villas Church
                        </h3>

                        <span className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                          Connected
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-relaxed text-slate-400">
                        Access church discussions, assigned studies, and group resources.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        showPlaceholder(
                          'Church membership and invitation management will open here.',
                        )
                      }
                      className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/15"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              </section>

              <section>
                <div>
                  <h2 className="text-xl font-bold">
                    Notifications
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Choose what Project 3|26 sends you.
                  </p>
                </div>

                <div className="mt-4 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821]">
                  {[
                    {
                      id: 'dailyChapter',
                      title: 'Daily Chapter',
                      description:
                        'A reminder when today’s chapter is ready.',
                    },
                    {
                      id: 'streakReminders',
                      title: 'Streak Reminders',
                      description:
                        'A gentle reminder when your streak is at risk.',
                    },
                    {
                      id: 'achievements',
                      title: 'Achievements',
                      description:
                        'Celebrate new trophies and milestones.',
                    },
                    {
                      id: 'churchMessages',
                      title: 'Church Messages',
                      description:
                        'New posts and announcements from your church.',
                    },
                    {
                      id: 'productUpdates',
                      title: 'Product Updates',
                      description:
                        'New features and Project 3|26 news.',
                    },
                  ].map((setting, index, settings) => (
                    <div
                      key={setting.id}
                      className={`flex items-center gap-4 p-5 sm:p-6 ${
                        index < settings.length - 1
                          ? 'border-b border-white/5'
                          : ''
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/[0.04] text-slate-300">
                        <Bell size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold sm:text-base">
                          {setting.title}
                        </h3>

                        <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                          {setting.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          toggleNotification(setting.id)
                        }
                        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                          notifications[setting.id]
                            ? 'bg-[#45c6d8]'
                            : 'bg-slate-700'
                        }`}
                        aria-label={`Toggle ${setting.title}`}
                        aria-pressed={notifications[setting.id]}
                      >
                        <span
                          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                            notifications[setting.id]
                              ? 'left-6'
                              : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-4 lg:col-span-4">
              <section className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                    <Smartphone size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      App Preferences
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Display and device settings
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    showPlaceholder(
                      'Appearance settings will be connected later.',
                    )
                  }
                  className="mt-5 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.04]"
                >
                  <Moon
                    size={18}
                    className="text-slate-400"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">
                      Appearance
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Dark mode
                    </p>
                  </div>

                  <ChevronRight
                    size={17}
                    className="text-slate-600"
                  />
                </button>
              </section>

              <section className="overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821]">
                {accountSections.map((section, index) => {
                  const SectionIcon = section.icon

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() =>
                        showPlaceholder(
                          `${section.title} will open here once the account backend is connected.`,
                        )
                      }
                      className={`group flex w-full items-center gap-3 p-5 text-left transition hover:bg-white/[0.03] ${
                        index < accountSections.length - 1
                          ? 'border-b border-white/5'
                          : ''
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-slate-300">
                        <SectionIcon size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="text-sm font-semibold">
                          {section.title}
                        </h2>

                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                          {section.description}
                        </p>
                      </div>

                      <ChevronRight
                        size={17}
                        className="shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-white"
                      />
                    </button>
                  )
                })}
              </section>

              <button
                type="button"
                onClick={() =>
                  setConfirmation({
                    type: 'signout',
                    title: 'Sign out?',
                    message:
                      'You will need to sign in again to continue your journey.',
                    buttonText: 'Sign out',
                  })
                }
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/10 bg-red-400/[0.05] px-4 py-3.5 text-sm font-semibold text-red-300 transition hover:border-red-400/20 hover:bg-red-400/[0.08]"
              >
                <LogOut size={18} />
                Sign Out
              </button>

              <p className="text-center text-xs text-slate-600">
                Project 3|26 IO App
                <br />
                Prototype Version 0.1
              </p>
            </aside>
          </div>
        </main>
      </div>

      {confirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#12202b] p-6 shadow-2xl">
            <h2 className="text-xl font-bold">
              {confirmation.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {confirmation.message}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmation(null)}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300"
              >
                Go back
              </button>

              <button
                type="button"
                onClick={handleConfirmation}
                className="flex-1 rounded-xl bg-red-400 px-4 py-3 text-sm font-bold text-[#210b0b]"
              >
                {confirmation.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage