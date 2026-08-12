import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Camera,
  Check,
  Crown,
  LoaderCircle,
  Mail,
  Moon,
  Save,
  Sparkles,
  Sun,
  User,
  X,
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'
import ChurchConnectionPanel from '../components/profile/ChurchConnectionPanel'
import {
  getMemberSnapshot,
  readFounderTestPlan,
  setFounderTestPlan,
  updateMemberProfile,
} from '../services/backend'
import { uploadMemberAvatar } from '../services/profile'
import { readThemePreference, saveThemePreference } from '../services/theme'

const testingPlans = [
  { id: 'free', label: 'Free John' },
  { id: 'standard', label: 'Standard' },
  { id: 'leader', label: 'Leader' },
]

const testingAccountEmails = new Set([
  'brian@project326.org',
  'austin@project326.org',
])

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
  const [avatarUploadError, setAvatarUploadError] = useState('')
  const [theme, setTheme] = useState(() => readThemePreference())
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

  const testingAccountEmail =
    snapshot?.user?.email?.trim().toLowerCase() || ''
  const isSilentBetaAccount =
    testingAccountEmail.startsWith('beta+') &&
    testingAccountEmail.endsWith('@project326.org')

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

  const canUseTestingPlan =
    snapshot?.access?.canSwitchTestingPlan ||
    testingAccountEmails.has(testingAccountEmail)

  const avatarErrorTitle = avatarUploadError.toLowerCase().includes('too large')
    ? 'That photo is too large'
    : avatarUploadError.toLowerCase().includes('format')
      ? 'That photo format did not work'
      : avatarUploadError.toLowerCase().includes('session')
        ? 'Your session expired'
        : 'We could not use that photo'

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
      setAvatarUploadError('')
      await uploadMemberAvatar(file)
      await loadProfile(true)
      setNotice('Profile picture updated.')
    } catch (uploadError) {
      const message = uploadError instanceof Error
        ? uploadError.message
        : 'Unable to upload your profile picture. Please try another photo.'
      setError(message)
      setAvatarUploadError(message)
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

  function changeTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(saveThemePreference(nextTheme))
    setNotice(`${nextTheme === 'dark' ? 'Dark' : 'Light'} mode is on.`)
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
              Your identity, Bible access, and church connection.
            </p>
          </header>

          {isLoading && !snapshot ? (
            <div className="mt-8 flex items-center gap-3 text-slate-400">
              <LoaderCircle size={20} className="animate-spin" />
              Loading your profile…
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

                      {isSilentBetaAccount ? (
                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                          <Sparkles size={14} />
                          <span>Project 3|26 beta participant</span>
                        </div>
                      ) : (
                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                          <Mail size={14} />
                          <span className="truncate">{snapshot?.user?.email}</span>
                        </div>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b8ccd7] bg-[#c7dce7] px-3 py-1 text-xs font-semibold text-cyan-700">
                          <User size={12} />
                          {planLabel}
                        </span>

                        {isSilentBetaAccount && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-300/40 bg-[#e8ddd0] px-3 py-1 text-xs font-semibold text-orange-600">
                            <Sparkles size={12} />
                            Beta
                          </span>
                        )}

                        {testingAccountEmail === 'brian@project326.org' && (
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

                {canUseTestingPlan && (
                  <section className="rounded-[24px] border border-cyan-300/30 bg-[#0c2138] p-5">
                    <div className="flex items-center gap-3">
                      <Sparkles size={20} className="text-cyan-400" />
                      <div>
                        <h2 className="font-semibold">Testing View</h2>
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

                <ChurchConnectionPanel />
              </div>

              <aside className="space-y-4">
                <section className="rounded-[22px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047]">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c7dce7] text-cyan-700">
                        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Dark mode</p>
                        <p className="mt-0.5 text-xs text-slate-500">Easy on your eyes in low light.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={theme === 'dark'}
                      aria-label="Toggle dark mode"
                      onClick={changeTheme}
                      className={`theme-toggle relative h-8 w-14 rounded-full p-1 transition-colors ${
                        theme === 'dark' ? 'bg-cyan-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </section>

                <section className="rounded-[22px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047]">
                  <div className="flex items-center gap-3">
                    <Crown size={19} className="text-orange-600" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {isSilentBetaAccount ? 'Beta access' : 'Current access'}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold">{planLabel}</h2>
                    </div>
                  </div>

                  {!isSilentBetaAccount && !snapshot?.access?.leaderGuideAccess && (
                    <button
                      type="button"
                      onClick={onOpenUpgrade}
                      className="mt-4 w-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white"
                    >
                      View upgrades
                    </button>
                  )}

                  {isSilentBetaAccount && (
                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      Full Standard access is enabled during beta. Public plans and sign-in return closer to launch.
                    </p>
                  )}
                </section>

                {(notice || error) && (
                  <section className={`rounded-[20px] p-4 text-sm ${error ? 'bg-[#ead9d9] text-red-700' : 'bg-[#d9e7df] text-emerald-800'}`}>
                    {error || notice}
                  </section>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Check size={14} className="text-emerald-400" />
                  {isSilentBetaAccount ? 'Beta progress sync connected' : 'Account sync connected'}
                </div>
              </aside>
            </div>
          )}
        </main>
      </div>

      {avatarUploadError && (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm"
          role="presentation"
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[26px] border border-orange-300/40 bg-[#f7f2e8] text-[#153047] shadow-2xl shadow-black/50"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="avatar-error-title"
            aria-describedby="avatar-error-message"
          >
            <div className="h-2 bg-orange-500" />
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <AlertTriangle size={24} strokeWidth={2.3} />
                </div>
                <button
                  type="button"
                  onClick={() => setAvatarUploadError('')}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-white hover:text-slate-800"
                  aria-label="Close photo upload message"
                >
                  <X size={18} />
                </button>
              </div>

              <h2 id="avatar-error-title" className="mt-5 text-2xl font-bold tracking-tight">
                {avatarErrorTitle}
              </h2>
              <p id="avatar-error-message" className="mt-3 text-sm leading-6 text-slate-600">
                {avatarUploadError}
              </p>

              <button
                type="button"
                onClick={() => setAvatarUploadError('')}
                className="mt-6 w-full rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-400"
              >
                Choose another photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
