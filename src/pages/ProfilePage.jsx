import { useEffect, useMemo, useState } from 'react'
import {
  Building2,
  Camera,
  Check,
  Crown,
  LoaderCircle,
  LogOut,
  Mail,
  Save,
  Sparkles,
  User,
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'
import {
  clearMemberSession,
  getMemberSnapshot,
  readFounderTestPlan,
  setFounderTestPlan,
  updateMemberProfile,
} from '../services/backend'
import { uploadMemberAvatar } from '../services/profile'

const testingPlans = [
  { id: 'free', label: 'Free John' },
  { id: 'standard', label: 'Standard' },
  { id: 'leader', label: 'Leader' },
]

function ProfilePage({
  onNavigate,
  onOpenUpgrade,
}) {
  const [snapshot, setSnapshot] = useState(null)
  const [displayName, setDisplayName] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [selectedTestingPlan, setSelectedTestingPlan] = useState(
    () => readFounderTestPlan() || 'leader',
  )

  async function loadProfile(force = false) {
    try {
      setIsLoading(true)
      setError('')
      const nextSnapshot = await getMemberSnapshot({ force })
      setSnapshot(nextSnapshot)
      setDisplayName(nextSnapshot?.user?.displayName || '')

      if (nextSnapshot?.access?.testingPlan) {
        setSelectedTestingPlan(nextSnapshot.access.testingPlan)
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load your profile.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const initials = useMemo(() => {
    const value = snapshot?.user?.displayName || snapshot?.user?.email || 'P 3'
    return value
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')
  }, [snapshot])

  const planLabel = snapshot?.access?.leaderGuideAccess
    ? 'Leader'
    : snapshot?.access?.fullBibleStudyAccess
      ? 'Standard'
      : 'Free John'

  async function saveProfile() {
    if (!displayName.trim()) {
      setError('Display name cannot be empty.')
      return
    }

    try {
      setIsSaving(true)
      setError('')
      await updateMemberProfile({ displayName: displayName.trim() })
      await loadProfile(true)
      setIsEditing(false)
      setNotice('Profile updated.')
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to update your profile.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    try {
      setIsUploading(true)
      setError('')
      await uploadMemberAvatar(file)
      await loadProfile(true)
      setNotice('Profile picture updated.')
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Unable to upload your profile picture.',
      )
    } finally {
      setIsUploading(false)
    }
  }

  async function changeTestingPlan(plan) {
    setFounderTestPlan(plan)
    setSelectedTestingPlan(plan)
    setNotice(`Viewing the app as ${testingPlans.find((item) => item.id === plan)?.label}.`)
    await loadProfile(true)
  }

  function signOut() {
    clearMemberSession()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation activePage="profile" onNavigate={onNavigate} />

      <div className="lg:pl-24">
        <main className="mx-auto min-h-screen w-full max-w-5xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          <header>
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400 sm:text-sm">
              PROJECT 3|26
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Profile
            </h1>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Your account, plan, identity, and church connection.
            </p>
          </header>

          {isLoading && !snapshot ? (
            <div className="mt-8 flex items-center gap-3 text-slate-400">
              <LoaderCircle size={20} className="animate-spin" />
              Loading your account…
            </div>
          ) : (
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              <div className="space-y-5 lg:col-span-2">
                <section className="rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-5 text-[#153047] shadow-xl shadow-black/10">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="relative shrink-0">
                      {snapshot?.user?.avatarUrl ? (
                        <img
                          src={snapshot.user.avatarUrl}
                          alt="Profile"
                          className="h-20 w-20 rounded-full border border-[#b8ccd7] object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#b8ccd7] bg-[#c7dce7] text-xl font-bold text-cyan-700">
                          {initials}
                        </div>
                      )}

                      <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-[#dfe8ee] bg-cyan-600 text-white shadow">
                        {isUploading ? (
                          <LoaderCircle size={15} className="animate-spin" />
                        ) : (
                          <Camera size={15} />
                        )}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          disabled={isUploading}
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </div>

                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={displayName}
                          onChange={(event) => setDisplayName(event.target.value)}
                          className="w-full border border-[#b8ccd7] bg-white px-3 py-2.5 text-lg font-semibold outline-none focus:border-cyan-500"
                          autoFocus
                        />
                      ) : (
                        <h2 className="text-2xl font-semibold">
                          {snapshot?.user?.displayName || 'Member'}
                        </h2>
                      )}

                      <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                        <Mail size={14} />
                        <span className="truncate">{snapshot?.user?.email}</span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b8ccd7] bg-[#c7dce7] px-3 py-1 text-xs font-semibold text-cyan-700">
                          <User size={12} />
                          {planLabel}
                        </span>

                        {snapshot?.user?.email?.toLowerCase() === 'brian@project326.org' && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-300/40 bg-[#e8ddd0] px-3 py-1 text-xs font-semibold text-orange-600">
                            <Sparkles size={12} />
                            Founder
                          </span>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false)
                            setDisplayName(snapshot?.user?.displayName || '')
                          }}
                          className="border border-[#b8ccd7] bg-[#edf2f4] px-4 py-2.5 text-sm font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={saveProfile}
                          disabled={isSaving}
                          className="inline-flex items-center gap-2 bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                        >
                          {isSaving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="border border-[#b8ccd7] bg-[#edf2f4] px-4 py-2.5 text-sm font-semibold"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </section>

                {snapshot?.access?.canSwitchTestingPlan && (
                  <section className="rounded-[24px] border border-cyan-300/30 bg-[#0c2138] p-5">
                    <div className="flex items-center gap-3">
                      <Sparkles size={20} className="text-cyan-400" />
                      <div>
                        <h2 className="font-semibold">Founder View</h2>
                        <p className="mt-1 text-xs text-slate-400">
                          Preview the exact access level a customer sees.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {testingPlans.map((plan) => (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => changeTestingPlan(plan.id)}
                          className={`px-3 py-3 text-xs font-bold ${
                            selectedTestingPlan === plan.id
                              ? 'bg-cyan-400 text-[#041326]'
                              : 'border border-white/10 bg-[#071a2d] text-slate-300'
                          }`}
                        >
                          {plan.label}
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                <section className="rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-5 text-[#153047]">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-200/70 text-orange-600">
                      <Building2 size={19} />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-semibold">Church Connection</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Church membership and private church chat are being connected next.
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <aside className="space-y-4">
                <section className="rounded-[22px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047]">
                  <div className="flex items-center gap-3">
                    <Crown size={19} className="text-orange-600" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current access</p>
                      <h2 className="mt-1 text-lg font-semibold">{planLabel}</h2>
                    </div>
                  </div>

                  {!snapshot?.access?.leaderGuideAccess && (
                    <button
                      type="button"
                      onClick={onOpenUpgrade}
                      className="mt-4 w-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white"
                    >
                      View upgrades
                    </button>
                  )}
                </section>

                {(notice || error) && (
                  <section className={`rounded-[20px] p-4 text-sm ${error ? 'bg-[#ead9d9] text-red-700' : 'bg-[#d9e7df] text-emerald-800'}`}>
                    {error || notice}
                  </section>
                )}

                <button
                  type="button"
                  onClick={signOut}
                  className="flex w-full items-center justify-center gap-2 border border-red-300/40 bg-[#ead9d9] px-4 py-3 text-sm font-semibold text-red-700"
                >
                  <LogOut size={17} />
                  Sign Out
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Check size={14} className="text-emerald-400" />
                  Account sync connected
                </div>
              </aside>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default ProfilePage
