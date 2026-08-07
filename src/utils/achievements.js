const EARNED_ACHIEVEMENTS_KEY =
  'project326-earned-achievements'

const UNSEEN_ACHIEVEMENTS_KEY =
  'project326-unseen-achievements'

export const achievements = [
  {
    id: 'first-step',
    title: 'First Step',
    description:
      'Complete your first Bible chapter.',
    type: 'chapters',
    target: 1,
    tier: 'bronze',
  },
  {
    id: 'seven-chapters',
    title: 'Getting Started',
    description:
      'Complete 7 Bible chapters.',
    type: 'chapters',
    target: 7,
    tier: 'bronze',
  },
  {
    id: 'three-day-streak',
    title: 'Heating Up',
    description:
      'Complete Scripture on 3 consecutive days.',
    type: 'streak',
    target: 3,
    tier: 'bronze',
  },

  {
    id: 'thirty-chapters',
    title: 'Building Momentum',
    description:
      'Complete 30 Bible chapters.',
    type: 'chapters',
    target: 30,
    tier: 'silver',
  },
  {
    id: 'first-book',
    title: 'Book Finisher',
    description:
      'Complete your first entire book of the Bible.',
    type: 'books',
    target: 1,
    tier: 'silver',
  },
  {
    id: 'five-books',
    title: 'On the Move',
    description:
      'Complete 5 entire books of the Bible.',
    type: 'books',
    target: 5,
    tier: 'silver',
  },
  {
    id: 'seven-day-streak',
    title: 'On Fire',
    description:
      'Complete Scripture on 7 consecutive days.',
    type: 'streak',
    target: 7,
    tier: 'silver',
  },

  {
    id: 'hundred-chapters',
    title: 'Deep Roots',
    description:
      'Complete 100 Bible chapters.',
    type: 'chapters',
    target: 100,
    tier: 'gold',
  },
  {
    id: 'ten-books',
    title: 'Bible Explorer',
    description:
      'Complete 10 entire books of the Bible.',
    type: 'books',
    target: 10,
    tier: 'gold',
  },
  {
    id: 'thirty-day-streak',
    title: 'Unstoppable',
    description:
      'Complete Scripture on 30 consecutive days.',
    type: 'streak',
    target: 30,
    tier: 'gold',
  },
  {
    id: 'halfway',
    title: 'Halfway Home',
    description:
      'Complete half of the Bible.',
    type: 'chapters',
    target: 595,
    tier: 'gold',
  },

  {
    id: 'finish-bible',
    title: 'Journey Complete',
    description:
      'Complete all 1,189 chapters of the Bible.',
    type: 'chapters',
    target: 1189,
    tier: 'legendary',
  },
]

export function readEarnedAchievements() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(
        EARNED_ACHIEVEMENTS_KEY,
      ) || '[]',
    )

    return Array.isArray(stored)
      ? stored
      : []
  } catch {
    return []
  }
}

export function readUnseenAchievements() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(
        UNSEEN_ACHIEVEMENTS_KEY,
      ) || '[]',
    )

    return Array.isArray(stored)
      ? stored
      : []
  } catch {
    return []
  }
}

export function clearUnseenAchievements() {
  localStorage.setItem(
    UNSEEN_ACHIEVEMENTS_KEY,
    JSON.stringify([]),
  )

  window.dispatchEvent(
    new CustomEvent(
      'project326-achievement-viewed',
    ),
  )
}

function addUnseenAchievements(
  achievementIds,
) {
  if (
    achievementIds.length === 0
  ) {
    return
  }

  const existing =
    readUnseenAchievements()

  const updated = [
    ...new Set([
      ...existing,
      ...achievementIds,
    ]),
  ]

  localStorage.setItem(
    UNSEEN_ACHIEVEMENTS_KEY,
    JSON.stringify(updated),
  )
}

function getMetricValue(
  achievement,
  metrics,
) {
  if (
    achievement.type ===
    'chapters'
  ) {
    return (
      metrics.chaptersCompleted ||
      0
    )
  }

  if (
    achievement.type ===
    'books'
  ) {
    return (
      metrics.completedBooks ||
      0
    )
  }

  if (
    achievement.type ===
    'streak'
  ) {
    return (
      metrics.currentStreak ||
      0
    )
  }

  return 0
}

export function syncAchievements(
  metrics,
) {
  const previouslyEarned =
    readEarnedAchievements()

  const earnedSet =
    new Set(previouslyEarned)

  const newlyEarned = []

  achievements.forEach(
    (achievement) => {
      const currentValue =
        getMetricValue(
          achievement,
          metrics,
        )

      if (
        currentValue >=
          achievement.target &&
        !earnedSet.has(
          achievement.id,
        )
      ) {
        earnedSet.add(
          achievement.id,
        )

        newlyEarned.push(
          achievement.id,
        )
      }
    },
  )

  const updated =
    Array.from(earnedSet)

  if (
    newlyEarned.length > 0
  ) {
    localStorage.setItem(
      EARNED_ACHIEVEMENTS_KEY,
      JSON.stringify(updated),
    )

    addUnseenAchievements(
      newlyEarned,
    )

    window.dispatchEvent(
      new CustomEvent(
        'project326-achievement-change',
        {
          detail: {
            newlyEarned,
          },
        },
      ),
    )
  }

  return updated
}

export function getAchievementProgress(
  achievement,
  metrics,
) {
  const currentValue =
    getMetricValue(
      achievement,
      metrics,
    )

  return {
    current: Math.min(
      currentValue,
      achievement.target,
    ),
    target:
      achievement.target,
    percentage: Math.min(
      Math.round(
        (currentValue /
          achievement.target) *
          100,
      ),
      100,
    ),
  }
}