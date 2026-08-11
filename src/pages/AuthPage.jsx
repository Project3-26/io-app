import { useEffect, useState } from 'react'
import {
  BookOpen,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
  Server,
  UserPlus,
} from 'lucide-react'
import {
  checkBackendConnection,
  signInMember,
  signUpMember,
} from '../services/backend'
import { joinChurch } from '../services/connect'

function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState('sign-in')
  const [displayName, setDisplayName] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [churchCode, setChurchCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [backendStatus, setBackendStatus] = useState('checking')

  useEffect(() => {
    let isMounted = true

    checkBackendConnection()
      .then((result) => {
        if (!isMounted) return
        setBackendStatus(result?.status === 'ok' ? 'connected' : 'unavailable')
      })
      .catch(() => {
        if (isMounted) setBackendStatus('unavailable')
      })

    return () => {
      isMounted = false
    }
  }, [])

  function switchMode(nextMode) {
    setMode(nextMode)
    setError('')
    setNotice('')
    setPassword('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setNotice('')

    if (!identifier.trim() || !password) {
      setError('Enter your email and password.')
      return
    }

    if (!identifier.includes('@')) {
      setError('Enter a valid email address.')
      return
    }

    if (mode === 'create-account' && !displayName.trim()) {
      setError('Choose the name you want shown in Project 3|26.')
      return
    }

    if (mode === 'create-account' && password.length < 8) {
      setError('Use a password with at least 8 characters.')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      if (mode === 'create-account') {
        const result = await signUpMember(
          identifier.trim(),
          password,
          displayName.trim(),
        )

        if (result?.session) {
          if (churchCode.trim()) {
            await joinChurch(churchCode.trim())
          }
          await onAuthenticated()
          return
        }

        setNotice('Account created. Check your email to confirm the account, then sign in.')
        setMode('sign-in')
        setPassword('')
        return
      }

      await signInMember(identifier.trim(), password)
      await onAuthenticated()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : mode === 'create-account'
            ? 'Unable to create account.'
            : 'Unable to sign in.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#041326] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-lg items-center">
        <div className="w-full">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center border border-cyan-300/25 bg-[#0c2138] text-cyan-300">
              <BookOpen size={23} />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-400">PROJECT 3|26</p>
              <h1 className="mt-1 text-2xl font-bold">
                {mode === 'create-account' ? 'Create your account' : 'Welcome back'}
              </h1>
            </div>
          </div>

          <section className="mt-7 border border-white/10 bg-[#0c2138] p-5 shadow-2xl shadow-black/20 sm:p-6">
            <div className="flex items-start gap-3 border-b border-white/10 pb-4">
              <div className="mt-0.5 text-cyan-300"><Server size={18} /></div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Project 3|26 member access</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Sign in to sync your profile, Bible progress, community activity, and product access across devices.
                </p>
              </div>
              <span className={`shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] ${backendStatus === 'connected' ? 'text-emerald-300' : backendStatus === 'unavailable' ? 'text-orange-300' : 'text-slate-500'}`}>
                {backendStatus === 'connected' ? 'Connected' : backendStatus === 'unavailable' ? 'Offline' : 'Checking'}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 border border-white/10 bg-[#071a2d] p-1">
              <button type="button" onClick={() => switchMode('sign-in')} className={`px-3 py-2.5 text-xs font-bold ${mode === 'sign-in' ? 'bg-cyan-400 text-[#041326]' : 'text-slate-400'}`}>
                Sign in
              </button>
              <button type="button" onClick={() => switchMode('create-account')} className={`px-3 py-2.5 text-xs font-bold ${mode === 'create-account' ? 'bg-cyan-400 text-[#041326]' : 'text-slate-400'}`}>
                Create account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {mode === 'create-account' && (
                <label className="block">
                  <span className="text-xs font-semibold text-slate-300">Display name</span>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    autoComplete="name"
                    className="mt-2 w-full border border-white/10 bg-[#071a2d] px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60"
                    placeholder="Your name"
                  />
                </label>
              )}

              {mode === 'create-account' && (
                <label className="block">
                  <span className="text-xs font-semibold text-slate-300">Church or group code <span className="font-normal text-slate-500">(optional)</span></span>
                  <input
                    type="text"
                    value={churchCode}
                    onChange={(event) => setChurchCode(event.target.value.toUpperCase())}
                    autoComplete="off"
                    maxLength={32}
                    className="mt-2 w-full border border-white/10 bg-[#071a2d] px-3 py-3 text-sm uppercase tracking-[0.12em] text-white outline-none transition placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-600 focus:border-cyan-300/60"
                    placeholder="Enter the code from your church leader"
                  />
                  <span className="mt-2 block text-[11px] leading-4 text-slate-500">A valid code adds you to your church’s plan and private Connect room. You will not be charged.</span>
                </label>
              )}

              <label className="block">
                <span className="text-xs font-semibold text-slate-300">Email</span>
                <input
                  type="email"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  autoComplete="email"
                  className="mt-2 w-full border border-white/10 bg-[#071a2d] px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-slate-300">Password</span>
                <div className="relative mt-2">
                  <LockKeyhole size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete={mode === 'create-account' ? 'new-password' : 'current-password'}
                    className="w-full border border-white/10 bg-[#071a2d] py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60"
                    placeholder={mode === 'create-account' ? 'At least 8 characters' : 'Password'}
                  />
                </div>
              </label>

              {error && <p className="border border-orange-300/20 bg-orange-400/10 px-3 py-2.5 text-xs leading-5 text-orange-200">{error}</p>}
              {notice && <p className="border border-emerald-300/20 bg-emerald-400/10 px-3 py-2.5 text-xs leading-5 text-emerald-100">{notice}</p>}

              <button
                type="submit"
                disabled={isSubmitting || backendStatus === 'unavailable'}
                className="flex w-full items-center justify-center gap-2 border border-cyan-300/50 bg-cyan-400 px-4 py-3 text-sm font-bold text-[#041326] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    {mode === 'create-account' ? 'Creating account…' : 'Signing in…'}
                  </>
                ) : mode === 'create-account' ? (
                  <><UserPlus size={17} />Create account</>
                ) : (
                  <><CheckCircle2 size={17} />Sign in</>
                )}
              </button>
            </form>
          </section>

          <p className="mt-4 text-center text-[11px] leading-5 text-slate-600">
            Your account controls your plan access and keeps your journey synced across devices.
          </p>
        </div>
      </div>
    </main>
  )
}

export default AuthPage
