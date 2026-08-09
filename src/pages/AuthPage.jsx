import { useEffect, useState } from 'react'
import {
  BookOpen,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
  Server,
} from 'lucide-react'
import {
  checkBackendConnection,
  signInMember,
} from '../services/backend'

function AuthPage({
  onAuthenticated,
  onContinueDemo,
}) {
  const [email, setEmail] =
    useState('')
  const [password, setPassword] =
    useState('')
  const [isSubmitting, setIsSubmitting] =
    useState(false)
  const [error, setError] =
    useState('')
  const [backendStatus, setBackendStatus] =
    useState('checking')

  useEffect(() => {
    let isMounted = true

    checkBackendConnection()
      .then((result) => {
        if (!isMounted) return

        setBackendStatus(
          result?.status === 'ok'
            ? 'connected'
            : 'unavailable',
        )
      })
      .catch(() => {
        if (isMounted) {
          setBackendStatus('unavailable')
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!email.trim() || !password) {
      setError(
        'Enter your email and password.',
      )
      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      await signInMember(
        email.trim(),
        password,
      )

      await onAuthenticated()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
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
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-400">
                PROJECT 3|26
              </p>
              <h1 className="mt-1 text-2xl font-bold">
                Welcome back
              </h1>
            </div>
          </div>

          <section className="mt-7 border border-white/10 bg-[#0c2138] p-5 shadow-2xl shadow-black/20 sm:p-6">
            <div className="flex items-start gap-3 border-b border-white/10 pb-4">
              <div className="mt-0.5 text-cyan-300">
                <Server size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  Live development build
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Sign in to test real account and Bible progress syncing.
                </p>
              </div>
              <span
                className={`shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] ${
                  backendStatus === 'connected'
                    ? 'text-emerald-300'
                    : backendStatus === 'unavailable'
                      ? 'text-orange-300'
                      : 'text-slate-500'
                }`}
              >
                {backendStatus === 'connected'
                  ? 'Connected'
                  : backendStatus === 'unavailable'
                    ? 'Offline'
                    : 'Checking'}
              </span>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-5 space-y-4"
            >
              <label className="block">
                <span className="text-xs font-semibold text-slate-300">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="email"
                  className="mt-2 w-full border border-white/10 bg-[#071a2d] px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-slate-300">
                  Password
                </span>
                <div className="relative mt-2">
                  <LockKeyhole
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="current-password"
                    className="w-full border border-white/10 bg-[#071a2d] py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60"
                    placeholder="Password"
                  />
                </div>
              </label>

              {error && (
                <p className="border border-orange-300/20 bg-orange-400/10 px-3 py-2.5 text-xs leading-5 text-orange-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  backendStatus === 'unavailable'
                }
                className="flex w-full items-center justify-center gap-2 border border-cyan-300/50 bg-cyan-400 px-4 py-3 text-sm font-bold text-[#041326] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                    Signing in…
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={17} />
                    Sign in
                  </>
                )}
              </button>
            </form>
          </section>

          <button
            type="button"
            onClick={onContinueDemo}
            className="mt-4 w-full border border-white/10 bg-transparent px-4 py-3 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:text-white"
          >
            Continue in demo mode
          </button>

          <p className="mt-4 text-center text-[11px] leading-5 text-slate-600">
            Demo mode keeps development data on this device. Signed-in mode syncs progress with the Project 3|26 backend.
          </p>
        </div>
      </div>
    </main>
  )
}

export default AuthPage
