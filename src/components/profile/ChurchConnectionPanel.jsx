import { useEffect, useState } from 'react'
import {
  Building2,
  Copy,
  KeyRound,
  LoaderCircle,
  Plus,
} from 'lucide-react'
import {
  createChurchInvite,
  getChurchMemberships,
  joinChurchByCode,
} from '../../services/connect'

function ChurchConnectionPanel() {
  const [memberships, setMemberships] = useState([])
  const [inviteCode, setInviteCode] = useState('')
  const [generatedInvite, setGeneratedInvite] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isWorking, setIsWorking] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  async function loadMemberships() {
    try {
      setError('')
      const rows = await getChurchMemberships()
      setMemberships(rows)
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load church memberships.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMemberships()
  }, [])

  async function joinChurch(event) {
    event.preventDefault()
    const code = inviteCode.trim()
    if (!code || isWorking) return

    try {
      setIsWorking(true)
      setError('')
      setNotice('')
      const membership = await joinChurchByCode(code)
      setInviteCode('')
      setNotice(`Connected to ${membership?.name || 'your church'}. Its private chat is now available in Connect.`)
      await loadMemberships()
    } catch (joinError) {
      setError(
        joinError instanceof Error
          ? joinError.message
          : 'Unable to join this church.',
      )
    } finally {
      setIsWorking(false)
    }
  }

  async function generateInvite(membership) {
    if (isWorking) return

    try {
      setIsWorking(true)
      setError('')
      setNotice('')
      const invite = await createChurchInvite(membership.slug)
      setGeneratedInvite(invite)
      setNotice('Church invite created. Share the code with people you want to admit to this private church space.')
    } catch (inviteError) {
      setError(
        inviteError instanceof Error
          ? inviteError.message
          : 'Unable to create a church invite.',
      )
    } finally {
      setIsWorking(false)
    }
  }

  async function copyInvite() {
    if (!generatedInvite?.code) return
    try {
      await navigator.clipboard.writeText(generatedInvite.code)
      setNotice('Invite code copied.')
    } catch {
      setNotice(`Invite code: ${generatedInvite.code}`)
    }
  }

  return (
    <section className="rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-5 text-[#153047]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-200/70 text-orange-600">
          <Building2 size={19} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">Church Connection</h2>
          <p className="mt-1 text-sm text-slate-500">
            Church rooms are private. Only active members can see or participate in them.
          </p>
        </div>
        {isLoading && <LoaderCircle size={18} className="animate-spin text-slate-400" />}
      </div>

      {memberships.length > 0 && (
        <div className="mt-4 space-y-2">
          {memberships.map((membership) => (
            <div
              key={membership.churchId}
              className="flex flex-col gap-3 border border-orange-300/30 bg-[#f2e6d8] p-3 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{membership.name}</p>
                <p className="mt-1 text-xs capitalize text-slate-500">
                  {membership.role} · Private chat enabled
                </p>
              </div>
              {membership.canInvite && (
                <button
                  type="button"
                  onClick={() => generateInvite(membership)}
                  disabled={isWorking}
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                >
                  <Plus size={14} />
                  Invite member
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {generatedInvite?.code && (
        <div className="mt-3 border border-cyan-300/30 bg-[#c7dce7] p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800">
            {generatedInvite.churchName} invite
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap bg-white/60 px-3 py-2 font-bold tracking-wider">
              {generatedInvite.code}
            </code>
            <button
              type="button"
              onClick={copyInvite}
              className="flex h-9 w-9 items-center justify-center bg-cyan-700 text-white"
              aria-label="Copy invite code"
            >
              <Copy size={15} />
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Expires in 7 days. Up to {generatedInvite.maxUses} people can use it.
          </p>
        </div>
      )}

      <form onSubmit={joinChurch} className="mt-4 border-t border-[#c8d3db] pt-4">
        <label className="text-xs font-semibold text-slate-600">
          Join a church with an invite code
        </label>
        <div className="mt-2 flex gap-2">
          <div className="relative min-w-0 flex-1">
            <KeyRound
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value.toUpperCase())}
              placeholder="Invite code"
              autoCapitalize="characters"
              className="w-full border border-[#b8ccd7] bg-white py-2.5 pl-9 pr-3 text-sm font-semibold uppercase tracking-wide outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            disabled={!inviteCode.trim() || isWorking}
            className="bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            Join
          </button>
        </div>
      </form>

      {(notice || error) && (
        <p className={`mt-3 text-xs leading-5 ${error ? 'text-red-700' : 'text-emerald-700'}`}>
          {error || notice}
        </p>
      )}
    </section>
  )
}

export default ChurchConnectionPanel
