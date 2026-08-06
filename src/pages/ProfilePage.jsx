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

const notificationSettings = [
  {
    id: 'dailyChapter',
    title: 'Daily Chapter',
    description: 'A reminder when today’s chapter is ready.',
  },
  {
    id: 'streakReminders',
    title: 'Streak Reminders',
    description: 'A gentle reminder when your streak is at risk.',
  },
  {
    id: 'achievements',
    title: 'Achievements',
    description: 'Celebrate new trophies and milestones.',
  },
  {
    id: 'churchMessages',
    title: 'Church Messages',
    description: 'New posts and announcements from your church.',
  },
  {
    id: 'productUpdates',
    title: 'Product Updates',
    description: 'New features and Project 3|26 news.',
  },
]

function ProfilePage({
  onNavigate,
  onOpenUpgrade,
}) {
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
    if (confirmation?.type === 'cancel') {
      showPlaceholder(
        'The secure cancellation portal will open here once billing is connected.',
      )
    }

    if (confirmation?.type === 'signout') {
      showPlaceholder(
        'Sign out will work once authentication is connected.',
      )
    }

    setConfirmation(null)
  }

  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation
        activePage="profile"
        onNavigate={onNavigate}
      />

      <div className="lg:pl-24">
        <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400 sm:text-sm">
                PROJECT 3|26
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Profile
              </h1>

              <p className="mt-2 text-sm text-slate-400 sm:text-base">
                Manage your account, plan, church, and preferences.
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-400">
              <User size={21} strokeWidth={2.2} />
            </div>
          </header>

          {notice && (
            <section className="mt-5 flex items-start gap-3 rounded-[20px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-lg shadow-black/10">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#c7dce7] text-cyan-700">
                <Sparkles size={17} />
              </div>

              <p className="pt-1 text-sm leading-5 text-slate-600">
                {notice}
              </p>
            </section>
          )}

          <div className="mt-6 grid gap-5 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-8">
              <section className="rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-xl shadow-black/10 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#b8ccd7] bg-[#c7dce7] text-xl font-semibold text-cyan-700">
                      BC
                    </div>

                    <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#dfe8ee] bg-emerald-500 text-white">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-semibold sm:text-2xl">
                      Brian Cooper
                    </h2>

                    <div className="mt-1.5 flex items-center gap-2 text-sm text-slate-500">
                      <Mail size={14} />

                      <span className="truncate">
                        brian@example.com
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b8ccd7] bg-[#c7dce7] px-3 py-1 text-xs font-semibold text-cyan-700">
                        <User size={12} />
                        Standard Member
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-300/40 bg-[#e8ddd0] px-3 py-1 text-xs font-semibold text-orange-600">
                        <Sparkles size={12} />
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
                    className="rounded-xl border border-[#b8ccd7] bg-[#edf2f4] px-4 py-2.5 text-sm font-semibold text-[#153047] transition hover:border-cyan-400/40 hover:bg-white"
                  >
                    Edit Profile
                  </button>
                </div>
              </section>

              <section>
                <div>
                  <h2 className="text-xl font-semibold">
                    Subscription & Billing
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Manage your plan, payments, and billing history.
                  </p>
                </div>

                <div className="mt-3 overflow-hidden rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] text-[#153047] shadow-xl shadow-black/10">
                  <div className="border-b border-[#c8d3db] p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c7dce7] text-cyan-700">
                          <CreditCard size={19} />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">
                              Standard Plan
                            </h3>

                            <span className="rounded-full border border-emerald-300/50 bg-[#d9e7df] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                              Active
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            $7.50 per month
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
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
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#b8ccd7] bg-[#c7dce7] px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-[#d4e5ed]"
                      >
                        Manage Billing
                        <ExternalLink size={15} />
                      </button>
                    </div>

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
                      className="mt-3 text-xs font-medium text-slate-500 underline-offset-4 transition hover:text-red-600 hover:underline"
                    >
                      Cancel subscription
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenUpgrade}
                    className="group flex w-full items-center gap-3 border-b border-[#c8d3db] p-4 text-left transition hover:bg-[#e7eef2] sm:p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-200/70 text-orange-600">
                      <Crown size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">
                        Upgrade to Leader Plan
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Unlock leader guides and group resources.
                      </p>
                    </div>

                    <ChevronRight
                      size={18}
                      className="shrink-0 text-orange-600 transition group-hover:translate-x-1"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      showPlaceholder(
                        'Invoices and receipts will appear here through the billing portal.',
                      )
                    }
                    className="group flex w-full items-center gap-3 p-4 text-left transition hover:bg-[#e7eef2] sm:p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf2f4] text-slate-600">
                      <ReceiptText size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">
                        Billing History
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        View invoices, receipts, and past payments.
                      </p>
                    </div>

                    <ChevronRight
                      size={18}
                      className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-cyan-700"
                    />
                  </button>
                </div>
              </section>

              <section>
                <div>
                  <h2 className="text-xl font-semibold">
                    Church Connection
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Join your church’s Project 3|26 community.
                  </p>
                </div>

                <div className="mt-3 rounded-[24px] border border-orange-300/40 bg-[#e8ddd0] p-4 text-[#153047] shadow-lg shadow-black/10 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-200/70 text-orange-600">
                      <Building2 size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">
                          Villas Church
                        </h3>

                        <span className="rounded-full border border-emerald-300/50 bg-[#d9e7df] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                          Connected
                        </span>
                      </div>

                      <p className="mt-1.5 text-sm leading-5 text-slate-600">
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
                      className="rounded-xl border border-orange-300/50 bg-orange-200/70 px-4 py-2.5 text-sm font-semibold text-orange-600 transition hover:bg-orange-200"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              </section>

              <section>
                <div>
                  <h2 className="text-xl font-semibold">
                    Notifications
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Choose what Project 3|26 sends you.
                  </p>
                </div>

                <div className="mt-3 overflow-hidden rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] text-[#153047] shadow-xl shadow-black/10">
                  {notificationSettings.map(
                    (setting, index) => (
                      <div
                        key={setting.id}
                        className={`flex items-center gap-3 p-4 sm:p-5 ${
                          index <
                          notificationSettings.length - 1
                            ? 'border-b border-[#c8d3db]'
                            : ''
                        }`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#c7dce7] text-cyan-700">
                          <Bell size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold sm:text-base">
                            {setting.title}
                          </h3>

                          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
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
                              ? 'bg-cyan-500'
                              : 'bg-slate-400'
                          }`}
                          aria-label={`Toggle ${setting.title}`}
                          aria-pressed={
                            notifications[setting.id]
                          }
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
                    ),
                  )}
                </div>
              </section>
            </div>

            <aside className="space-y-4 lg:col-span-4">
              <section className="rounded-[22px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-lg shadow-black/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c7dce7] text-cyan-700">
                    <Smartphone size={18} />
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
                  className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-[#edf2f4]"
                >
                  <Moon
                    size={17}
                    className="text-slate-600"
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
                    size={16}
                    className="text-slate-400"
                  />
                </button>
              </section>

              <section className="overflow-hidden rounded-[22px] border border-[#c8d3db] bg-[#dfe8ee] text-[#153047] shadow-lg shadow-black/10">
                {accountSections.map(
                  (section, index) => {
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
                        className={`group flex w-full items-center gap-3 p-4 text-left transition hover:bg-[#e7eef2] ${
                          index <
                          accountSections.length - 1
                            ? 'border-b border-[#c8d3db]'
                            : ''
                        }`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf2f4] text-slate-600">
                          <SectionIcon size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h2 className="text-sm font-semibold">
                            {section.title}
                          </h2>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {section.description}
                          </p>
                        </div>

                        <ChevronRight
                          size={16}
                          className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-cyan-700"
                        />
                      </button>
                    )
                  },
                )}
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
                className="flex w-full items-center justify-center gap-2 rounded-[18px] border border-red-300/40 bg-[#ead9d9] px-4 py-3 text-sm font-semibold text-red-700 transition hover:border-red-400/60 hover:bg-[#efdede]"
              >
                <LogOut size={17} />
                Sign Out
              </button>

              <p className="text-center text-xs text-slate-500">
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
          <div className="w-full max-w-sm rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-5 text-[#153047] shadow-2xl">
            <h2 className="text-xl font-semibold">
              {confirmation.title}
            </h2>

            <p className="mt-2 text-sm leading-5 text-slate-600">
              {confirmation.message}
            </p>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmation(null)}
                className="flex-1 rounded-xl border border-[#b8ccd7] bg-[#edf2f4] px-4 py-3 text-sm font-semibold text-[#153047]"
              >
                Go back
              </button>

              <button
                type="button"
                onClick={handleConfirmation}
                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
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