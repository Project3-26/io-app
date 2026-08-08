import { ArrowLeft, Flame, Lock, Star, Trophy } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  achievementCategories,
  achievements,
  getAchievementProgress,
} from '../utils/achievements'
import BadgeMedallion from './BadgeMedallion'

const tierLabels = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  legendary: 'Legendary',
}

const tierText = {
  bronze: 'text-orange-300',
  silver: 'text-slate-300',
  gold: 'text-amber-300',
  legendary: 'text-cyan-300',
}

function progressSuffix(achievement) {
  if (achievement.type === 'chapters') return 'chapters'
  if (achievement.type === 'streak') return 'days'
  if (achievement.type === 'books' || achievement.type === 'bookSet') return 'books'
  return 'book'
}

function AchievementsGallery({
  earnedAchievementIds,
  achievementMetrics,
  currentStreak,
  onBack,
}) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedAchievementId, setSelectedAchievementId] = useState(null)

  const earnedSet = useMemo(
    () => new Set(earnedAchievementIds),
    [earnedAchievementIds],
  )

  const rankedLocked = useMemo(
    () =>
      achievements
        .filter((achievement) => !earnedSet.has(achievement.id))
        .map((achievement) => ({
          achievement,
          progress: getAchievementProgress(achievement, achievementMetrics),
        }))
        .sort((a, b) => b.progress.percentage - a.progress.percentage),
    [achievementMetrics, earnedSet],
  )

  const nextAchievement = rankedLocked[0]?.achievement || null
  const selectedAchievement = achievements.find(
    (achievement) => achievement.id === selectedAchievementId,
  )
  const featuredAchievement = selectedAchievement || nextAchievement || achievements[0]
  const featuredEarned = earnedSet.has(featuredAchievement.id)
  const featuredProgress = getAchievementProgress(featuredAchievement, achievementMetrics)

  const visibleAchievements = achievements.filter((achievement) => {
    if (activeCategory === 'all') return true
    if (activeCategory === 'legendary') return achievement.tier === 'legendary'
    return achievement.category === activeCategory
  })

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-7">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#0c2138] text-slate-300 transition hover:bg-[#12304c]"
          aria-label="Back to Journey"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-400">PROJECT 3|26</p>
          <h1 className="text-2xl font-bold sm:text-3xl">Badge Collection</h1>
        </div>
        <Trophy size={24} className="text-orange-400" />
      </header>

      <section className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-[20px] border border-white/10 bg-[#0c2138] p-3 sm:p-4">
          <div className="flex items-center gap-2 text-cyan-300">
            <Star size={15} />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em]">Collected</span>
          </div>
          <p className="mt-2 text-xl font-bold sm:text-2xl">{earnedAchievementIds.length}<span className="text-sm font-semibold text-slate-500">/{achievements.length}</span></p>
        </div>
        <div className="rounded-[20px] border border-white/10 bg-[#0c2138] p-3 sm:p-4">
          <div className="flex items-center gap-2 text-orange-300">
            <Flame size={15} />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em]">Streak</span>
          </div>
          <p className="mt-2 text-xl font-bold sm:text-2xl">{currentStreak}<span className="ml-1 text-xs font-semibold text-slate-500">days</span></p>
        </div>
        <div className="rounded-[20px] border border-white/10 bg-[#0c2138] p-3 sm:p-4">
          <div className="flex items-center gap-2 text-amber-300">
            <Trophy size={15} />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em]">Next</span>
          </div>
          <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-slate-200 sm:text-sm">{nextAchievement?.title || 'Collection complete'}</p>
        </div>
      </section>

      <section className="mt-4 rounded-[26px] border border-white/10 bg-[#081b2d] p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <BadgeMedallion achievement={featuredAchievement} earned={featuredEarned} size="lg" showCheck />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-[0.14em] ${tierText[featuredAchievement.tier]}`}>
                {featuredEarned ? 'Collected' : 'Featured Badge'} · {tierLabels[featuredAchievement.tier]}
              </span>
            </div>
            <h2 className="mt-1 text-xl font-semibold">{featuredAchievement.title}</h2>
            <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">{featuredAchievement.description}</p>
            {!featuredEarned && (
              <>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#24394b]">
                  <div className="h-full rounded-full bg-cyan-400" style={{ width: `${featuredProgress.percentage}%` }} />
                </div>
                <p className="mt-2 text-xs font-semibold text-cyan-300">
                  {featuredProgress.current} / {featuredProgress.target} {progressSuffix(featuredAchievement)}
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <nav className="mt-5 flex gap-2 overflow-x-auto pb-2" aria-label="Badge categories">
        {achievementCategories.map((category) => {
          const active = activeCategory === category.id
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`shrink-0 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                active
                  ? 'border-cyan-300/60 bg-cyan-400/15 text-cyan-200'
                  : 'border-white/10 bg-[#0c2138] text-slate-400 hover:text-white'
              }`}
            >
              {category.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400">
            {achievementCategories.find((category) => category.id === activeCategory)?.label}
          </p>
          <h2 className="mt-1 text-xl font-semibold">Collectible medallions</h2>
        </div>
        <p className="text-xs font-semibold text-slate-500">{visibleAchievements.length} badges</p>
      </div>

      <section className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {visibleAchievements.map((achievement) => {
          const earned = earnedSet.has(achievement.id)
          const progress = getAchievementProgress(achievement, achievementMetrics)
          const selected = selectedAchievementId === achievement.id

          return (
            <button
              key={achievement.id}
              type="button"
              onClick={() => setSelectedAchievementId(achievement.id)}
              className={`relative min-h-[150px] rounded-[24px] border p-3 text-left transition sm:p-4 ${
                selected
                  ? 'border-cyan-300/60 bg-[#10304a] shadow-[0_0_24px_rgba(34,211,238,0.12)]'
                  : earned
                    ? 'border-cyan-300/25 bg-[#0c2138] hover:border-cyan-300/45'
                    : 'border-white/10 bg-[#091a2b] hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <BadgeMedallion achievement={achievement} earned={earned} size="md" showCheck />
                {!earned && <Lock size={14} className="mt-1 text-slate-600" />}
              </div>

              <h3 className="mt-3 text-sm font-semibold leading-5 text-white sm:text-base">{achievement.title}</h3>
              <p className={`mt-1 text-[10px] font-bold uppercase tracking-[0.12em] ${tierText[achievement.tier]}`}>
                {tierLabels[achievement.tier]}
              </p>

              {earned ? (
                <p className="mt-2 text-xs font-semibold text-cyan-300">Earned</p>
              ) : (
                <>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#263b4d]">
                    <div className="h-full rounded-full bg-orange-400" style={{ width: `${progress.percentage}%` }} />
                  </div>
                  <p className="mt-1.5 text-[10px] font-semibold text-slate-500">{progress.current} / {progress.target}</p>
                </>
              )}
            </button>
          )
        })}
      </section>
    </main>
  )
}

export default AchievementsGallery
