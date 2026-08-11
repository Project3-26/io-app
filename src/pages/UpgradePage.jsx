import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  Check,
  Crown,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'
import { createCheckout, getBillingOffers } from '../services/billing'

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

const churchFeatures = [
  'Bible Study and Leader access for your group',
  'A private Connect room for your church or small group',
  'One invite code members use without paying individually',
  'Sponsored access managed under one subscription',
]

function formatPrice(price) {
  if (!price) return 'Price coming soon'
  const amount = Number(price.amount || 0) / 100
  const currency = String(price.currency || 'USD').toUpperCase()
  const money = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(amount)
  return price.billingInterval && price.billingInterval !== 'one_time'
    ? `${money} / ${price.billingInterval}`
    : money
}

function offerForCode(offers, productCode) {
  return offers.find((offer) => offer.productCode === productCode) || null
}

function preferredPrice(offer) {
  if (!offer?.prices?.length) return null
  return (
    offer.prices.find((price) => price.billingInterval === 'month') ||
    offer.prices.find((price) => price.checkoutConfigured) ||
    offer.prices[0]
  )
}

function UpgradePage({ onBack, onNavigate }) {
  const [offers, setOffers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [checkoutPriceId, setCheckoutPriceId] = useState('')
  const [error, setError] = useState('')
  const [churchName, setChurchName] = useState('')

  useEffect(() => {
    let mounted = true
    getBillingOffers()
      .then((nextOffers) => {
        if (mounted) setOffers(nextOffers)
      })
      .catch((loadError) => {
        if (mounted) setError(loadError instanceof Error ? loadError.message : 'Unable to load billing offers.')
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const standardOffer = useMemo(
    () => offerForCode(offers, 'bible_study'),
    [offers],
  )
  const leaderOffer = useMemo(
    () => offerForCode(offers, 'leader_guides'),
    [offers],
  )
  const churchOffer = useMemo(() => offerForCode(offers, 'church_plan'), [offers])
  const standardPrice = preferredPrice(standardOffer)
  const leaderPrice = preferredPrice(leaderOffer)
  const churchPrice = preferredPrice(churchOffer)

  async function beginCheckout(offer, price) {
    if (!offer || !price?.checkoutConfigured || checkoutPriceId) return

    try {
      const normalizedChurchName = churchName.trim().replace(/\s+/g, ' ')
      if (offer.productCode === 'church_plan' && normalizedChurchName.length < 2) {
        setError('Enter your church or small-group name first.')
        return
      }
      setCheckoutPriceId(price.id)
      setError('')
      const payload = await createCheckout({
        productCode: offer.productCode,
        priceId: price.id,
        billingInterval: price.billingInterval,
        churchName: offer.productCode === 'church_plan' ? normalizedChurchName : undefined,
      })
      if (payload?.churchOnboarding) {
        sessionStorage.setItem('project326-church-onboarding', JSON.stringify(payload.churchOnboarding))
      }
      if (!payload?.url) throw new Error('Checkout did not return a secure redirect.')
      window.location.assign(payload.url)
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Unable to start checkout.')
      setCheckoutPriceId('')
    }
  }

  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation activePage="profile" onNavigate={onNavigate} />

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
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">Project 3|26 Access</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">Choose how you want to journey</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Bible Study unlocks the full Bible experience. Leader Guides are a separate product for pastors and small-group leaders.
            </p>
          </header>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <ProductCard
              title="Bible Study"
              subtitle="Core paid experience"
              icon={<BookOpen size={20} strokeWidth={2.2} />}
              features={standardFeatures}
              offer={standardOffer}
              price={standardPrice}
              isLoading={isLoading}
              isCheckingOut={checkoutPriceId === standardPrice?.id}
              onCheckout={() => beginCheckout(standardOffer, standardPrice)}
              theme="standard"
            />

            <ProductCard
              title="Leader Guides"
              subtitle="Separate leader entitlement"
              icon={<Users size={20} strokeWidth={2.2} />}
              features={leaderFeatures}
              offer={leaderOffer}
              price={leaderPrice}
              isLoading={isLoading}
              isCheckingOut={checkoutPriceId === leaderPrice?.id}
              onCheckout={() => beginCheckout(leaderOffer, leaderPrice)}
              theme="leader"
            />

            <ProductCard
              title="Church Plan"
              subtitle="One plan for your whole group"
              icon={<Users size={20} strokeWidth={2.2} />}
              features={churchFeatures}
              offer={churchOffer}
              price={churchPrice}
              isLoading={isLoading}
              isCheckingOut={checkoutPriceId === churchPrice?.id}
              onCheckout={() => beginCheckout(churchOffer, churchPrice)}
              theme="church"
              churchName={churchName}
              onChurchNameChange={setChurchName}
            />
          </div>

          <section className="mt-4 rounded-[20px] border border-emerald-300/40 bg-[#d9e7df] p-4 text-[#153047] shadow-lg shadow-black/10">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-200/70 text-emerald-700">
                <ShieldCheck size={19} strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-emerald-800">Billing is backend-controlled</h2>
                <p className="mt-1.5 text-sm leading-5 text-slate-600">
                  Checkout only becomes available for active products with a configured Stripe price. No placeholder button can create a charge.
                </p>
              </div>
            </div>
          </section>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-300/25 bg-red-400/10 p-4 text-sm text-red-200">{error}</div>
          )}

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Sparkles size={14} />
            Built for individuals, groups, and churches
          </div>
        </main>
      </div>
    </div>
  )
}

function ProductCard({
  title,
  subtitle,
  icon,
  features,
  offer,
  price,
  isLoading,
  isCheckingOut,
  onCheckout,
  theme,
  churchName,
  onChurchNameChange,
}) {
  const leader = theme === 'leader'
  const church = theme === 'church'
  const configured = Boolean(price?.checkoutConfigured)

  return (
    <section className={`relative overflow-hidden rounded-[24px] p-5 text-[#153047] shadow-xl shadow-black/10 ${leader ? 'border border-orange-300/50 bg-[#e8ddd0]' : 'border border-[#c8d3db] bg-[#dfe8ee]'}`}>
      {leader && <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-orange-300/30 blur-3xl" />}
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${leader ? 'bg-orange-200/70 text-orange-600' : 'bg-[#c7dce7] text-cyan-700'}`}>
            {icon}
          </div>
          <div>
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>

        <div className="mt-5 text-2xl font-bold">
          {isLoading ? 'Checking price…' : formatPrice(price)}
        </div>
        {offer?.name && <p className="mt-1 text-xs text-slate-500">{offer.name}</p>}

        <div className="mt-5 space-y-3">
          {features.map((feature) => (
            <div key={feature} className={`flex items-start gap-3 rounded-xl px-3 py-2.5 ${leader ? 'border border-orange-300/40 bg-orange-100/50' : 'border border-[#c8d3db] bg-[#edf2f4]'}`}>
              <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${leader ? 'bg-orange-200/80 text-orange-600' : 'bg-[#c7dce7] text-cyan-700'}`}>
                <Check size={15} strokeWidth={2.5} />
              </div>
              <p className="text-sm leading-5 text-slate-700">{feature}</p>
            </div>
          ))}
        </div>

        {church && (
          <label className="mt-5 block text-sm font-semibold text-slate-700">
            Church or small-group name
            <input
              value={churchName}
              onChange={(event) => onChurchNameChange(event.target.value)}
              maxLength={100}
              placeholder="Example: Villas Church"
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/15"
            />
          </label>
        )}

        <button
          type="button"
          onClick={onCheckout}
          disabled={!configured || isCheckingOut}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${leader ? 'bg-orange-500' : 'bg-cyan-600'}`}
        >
          {isCheckingOut ? <LoaderCircle size={17} className="animate-spin" /> : <Crown size={17} />}
          {configured ? (isCheckingOut ? 'Opening checkout…' : 'Continue to checkout') : 'Checkout not configured yet'}
        </button>
      </div>
    </section>
  )
}

export default UpgradePage
