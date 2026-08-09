import { bookAchievements } from '../data/bookBadges'

const EARNED_ACHIEVEMENTS_KEY = 'project326-earned-achievements'
const UNSEEN_ACHIEVEMENTS_KEY = 'project326-unseen-achievements'

const LAW_BOOKS = ['genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy']
const HISTORY_BOOKS = ['joshua', 'judges', 'ruth', 'first-samuel', 'second-samuel', 'first-kings', 'second-kings', 'first-chronicles', 'second-chronicles', 'ezra', 'nehemiah', 'esther']
const WISDOM_BOOKS = ['job', 'psalms', 'proverbs', 'ecclesiastes', 'song-of-solomon']
const MAJOR_PROPHETS = ['isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel']
const THE_TWELVE = ['hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi']
const GOSPELS = ['matthew', 'mark', 'luke', 'john']
const PAULS_LETTERS = ['romans', 'first-corinthians', 'second-corinthians', 'galatians', 'ephesians', 'philippians', 'colossians', 'first-thessalonians', 'second-thessalonians', 'first-timothy', 'second-timothy', 'titus', 'philemon']
const GENERAL_LETTERS = ['hebrews', 'james', 'first-peter', 'second-peter', 'first-john', 'second-john', 'third-john', 'jude']
const OLD_TESTAMENT = [...LAW_BOOKS, ...HISTORY_BOOKS, ...WISDOM_BOOKS, ...MAJOR_PROPHETS, ...THE_TWELVE]
const NEW_TESTAMENT = [...GOSPELS, 'acts', ...PAULS_LETTERS, ...GENERAL_LETTERS, 'revelation']
const ALL_BIBLE_BOOKS = [...OLD_TESTAMENT, ...NEW_TESTAMENT]

export const achievementCategories = [
  { id: 'all', label: 'All' },
  { id: 'journey', label: 'Journey' },
  { id: 'streaks', label: 'Streaks' },
  { id: 'books', label: 'Book Count' },
  { id: 'sections', label: 'Collections' },
  { id: 'featured', label: 'Book Badges' },
  { id: 'legendary', label: 'Legendary' },
]

const progressAchievements = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete your first Bible chapter.',
    type: 'chapters',
    target: 1,
    tier: 'bronze',
    category: 'journey',
    artwork: 'footprints',
    sound: 'bronze',
  },
  {
    id: 'seven-chapters',
    title: 'Getting Started',
    description: 'Complete 7 Bible chapters.',
    type: 'chapters',
    target: 7,
    tier: 'bronze',
    category: 'journey',
    artwork: 'open-bible',
    sound: 'bronze',
  },
  {
    id: 'thirty-chapters',
    title: 'Building Momentum',
    description: 'Complete 30 Bible chapters.',
    type: 'chapters',
    target: 30,
    tier: 'silver',
    category: 'journey',
    artwork: 'trail-marker',
    sound: 'silver',
  },
  {
    id: 'hundred-chapters',
    title: 'Deep Roots',
    description: 'Complete 100 Bible chapters.',
    type: 'chapters',
    target: 100,
    tier: 'gold',
    category: 'journey',
    artwork: 'roots',
    sound: 'gold',
  },
  {
    id: 'quarter-way',
    title: 'Quarter Way',
    description: 'Complete one quarter of the Bible.',
    type: 'chapters',
    target: 297,
    tier: 'gold',
    category: 'journey',
    artwork: 'mountain',
    sound: 'gold',
  },
  {
    id: 'halfway',
    title: 'Halfway Home',
    description: 'Complete half of the Bible.',
    type: 'chapters',
    target: 595,
    tier: 'gold',
    category: 'journey',
    artwork: 'summit-flag',
    sound: 'gold',
  },
  {
    id: 'final-stretch',
    title: 'Final Stretch',
    description: 'Complete three quarters of the Bible.',
    type: 'chapters',
    target: 892,
    tier: 'gold',
    category: 'journey',
    artwork: 'sunrise-trail',
    sound: 'gold',
  },
  {
    id: 'finish-bible',
    title: 'Journey Complete',
    description: 'Complete all 1,189 chapters of the Bible.',
    type: 'chapters',
    target: 1189,
    tier: 'legendary',
    category: 'journey',
    artwork: 'crowned-bible',
    sound: 'legendary',
  },
  {
    id: 'three-day-streak',
    title: 'Heating Up',
    description: 'Complete Scripture on 3 consecutive days.',
    type: 'streak',
    target: 3,
    tier: 'bronze',
    category: 'streaks',
    artwork: 'flame',
    sound: 'bronze',
  },
  {
    id: 'seven-day-streak',
    title: 'On Fire',
    description: 'Complete Scripture on 7 consecutive days.',
    type: 'streak',
    target: 7,
    tier: 'silver',
    category: 'streaks',
    artwork: 'flame',
    sound: 'silver',
  },
  {
    id: 'thirty-day-streak',
    title: 'Faithful Month',
    description: 'Complete Scripture on 30 consecutive days.',
    type: 'streak',
    target: 30,
    tier: 'gold',
    category: 'streaks',
    artwork: 'laurel-flame',
    sound: 'gold',
  },
  {
    id: 'ninety-day-streak',
    title: 'Season of Faithfulness',
    description: 'Complete Scripture on 90 consecutive days.',
    type: 'streak',
    target: 90,
    tier: 'gold',
    category: 'streaks',
    artwork: 'torch',
    sound: 'gold',
  },
  {
    id: 'half-year-streak',
    title: 'Half-Year Strong',
    description: 'Complete Scripture on 180 consecutive days.',
    type: 'streak',
    target: 180,
    tier: 'gold',
    category: 'streaks',
    artwork: 'lamp',
    sound: 'gold',
  },
  {
    id: 'year-streak',
    title: 'A Year in the Word',
    description: 'Complete Scripture on 365 consecutive days.',
    type: 'streak',
    target: 365,
    tier: 'legendary',
    category: 'streaks',
    artwork: 'radiant-torch',
    sound: 'legendary',
  },
  {
    id: 'first-book',
    title: 'Book Finisher',
    description: 'Complete your first entire book of the Bible.',
    type: 'books',
    target: 1,
    tier: 'bronze',
    category: 'books',
    artwork: 'book-check',
    sound: 'bronze',
  },
  {
    id: 'five-books',
    title: 'On the Move',
    description: 'Complete 5 entire books of the Bible.',
    type: 'books',
    target: 5,
    tier: 'bronze',
    category: 'books',
    artwork: 'book-stack',
    sound: 'bronze',
  },
  {
    id: 'ten-books',
    title: 'Bible Explorer',
    description: 'Complete 10 entire books of the Bible.',
    type: 'books',
    target: 10,
    tier: 'silver',
    category: 'books',
    artwork: 'compass',
    sound: 'silver',
  },
  {
    id: 'twenty-five-books',
    title: 'Growing Library',
    description: 'Complete 25 entire books of the Bible.',
    type: 'books',
    target: 25,
    tier: 'silver',
    category: 'books',
    artwork: 'bookshelf',
    sound: 'silver',
  },
  {
    id: 'half-library',
    title: 'Half the Library',
    description: 'Complete 33 entire books of the Bible.',
    type: 'books',
    target: 33,
    tier: 'gold',
    category: 'books',
    artwork: 'half-library',
    sound: 'gold',
  },
  {
    id: 'sixty-books',
    title: 'Almost There',
    description: 'Complete 60 entire books of the Bible.',
    type: 'books',
    target: 60,
    tier: 'gold',
    category: 'books',
    artwork: 'full-library',
    sound: 'gold',
  },
  {
    id: 'every-book',
    title: 'Every Book',
    description: 'Complete all 66 books of the Bible.',
    type: 'books',
    target: 66,
    tier: 'legendary',
    category: 'books',
    artwork: 'full-library',
    sound: 'legendary',
  },
]

const collectionAchievements = [
  {
    id: 'the-law',
    title: 'The Law',
    description: 'Complete Genesis through Deuteronomy.',
    type: 'bookSet',
    bookIds: LAW_BOOKS,
    target: LAW_BOOKS.length,
    tier: 'bronze',
    category: 'sections',
    artwork: 'scales',
    sound: 'bronze',
  },
  {
    id: 'the-history',
    title: 'The History',
    description: 'Complete Joshua through Esther.',
    type: 'bookSet',
    bookIds: HISTORY_BOOKS,
    target: HISTORY_BOOKS.length,
    tier: 'bronze',
    category: 'sections',
    artwork: 'gate',
    sound: 'bronze',
  },
  {
    id: 'wisdom-poetry',
    title: 'Wisdom & Poetry',
    description: 'Complete Job through Song of Solomon.',
    type: 'bookSet',
    bookIds: WISDOM_BOOKS,
    target: WISDOM_BOOKS.length,
    tier: 'bronze',
    category: 'sections',
    artwork: 'harp-scroll',
    sound: 'bronze',
  },
  {
    id: 'major-prophets',
    title: 'Major Prophets',
    description: 'Complete Isaiah through Daniel.',
    type: 'bookSet',
    bookIds: MAJOR_PROPHETS,
    target: MAJOR_PROPHETS.length,
    tier: 'silver',
    category: 'sections',
    artwork: 'watchtower',
    sound: 'silver',
  },
  {
    id: 'the-twelve',
    title: 'The Twelve',
    description: 'Complete Hosea through Malachi.',
    type: 'bookSet',
    bookIds: THE_TWELVE,
    target: THE_TWELVE.length,
    tier: 'silver',
    category: 'sections',
    artwork: 'twelve-stars',
    sound: 'silver',
  },
  {
    id: 'old-testament-complete',
    title: 'Old Testament Complete',
    description: 'Complete all 39 books of the Old Testament.',
    type: 'bookSet',
    bookIds: OLD_TESTAMENT,
    target: OLD_TESTAMENT.length,
    tier: 'gold',
    category: 'sections',
    artwork: 'temple',
    sound: 'gold',
  },
  {
    id: 'the-gospels',
    title: 'The Gospels',
    description: 'Complete Matthew, Mark, Luke, and John.',
    type: 'bookSet',
    bookIds: GOSPELS,
    target: GOSPELS.length,
    tier: 'gold',
    category: 'sections',
    artwork: 'cross-rays',
    sound: 'gold',
  },
  {
    id: 'church-on-fire',
    title: 'Church on Fire',
    description: 'Complete the book of Acts.',
    type: 'book',
    bookId: 'acts',
    target: 1,
    tier: 'bronze',
    category: 'sections',
    artwork: 'flame-footsteps',
    sound: 'bronze',
  },
  {
    id: 'pauls-letters',
    title: "Paul's Letters",
    description: "Complete Paul's letters from Romans through Philemon.",
    type: 'bookSet',
    bookIds: PAULS_LETTERS,
    target: PAULS_LETTERS.length,
    tier: 'silver',
    category: 'sections',
    artwork: 'letter',
    sound: 'silver',
  },
  {
    id: 'general-letters',
    title: 'General Letters',
    description: 'Complete Hebrews through Jude.',
    type: 'bookSet',
    bookIds: GENERAL_LETTERS,
    target: GENERAL_LETTERS.length,
    tier: 'silver',
    category: 'sections',
    artwork: 'quill-letter',
    sound: 'silver',
  },
  {
    id: 'the-revelation',
    title: 'The Revelation',
    description: 'Complete the book of Revelation.',
    type: 'book',
    bookId: 'revelation',
    target: 1,
    tier: 'gold',
    category: 'sections',
    artwork: 'crown-stars',
    sound: 'gold',
  },
  {
    id: 'new-testament-complete',
    title: 'New Testament Complete',
    description: 'Complete all 27 books of the New Testament.',
    type: 'bookSet',
    bookIds: NEW_TESTAMENT,
    target: NEW_TESTAMENT.length,
    tier: 'gold',
    category: 'sections',
    artwork: 'tomb',
    sound: 'gold',
  },
  {
    id: 'whole-counsel',
    title: 'Whole Counsel of God',
    description: 'Complete every book in both Testaments.',
    type: 'bookSet',
    bookIds: ALL_BIBLE_BOOKS,
    target: ALL_BIBLE_BOOKS.length,
    tier: 'legendary',
    category: 'sections',
    artwork: 'illuminated-bible',
    sound: 'legendary',
  },
]

export const achievements = [
  ...progressAchievements,
  ...collectionAchievements,
  ...bookAchievements,
]

export function readEarnedAchievements() {
  try {
    const stored = JSON.parse(localStorage.getItem(EARNED_ACHIEVEMENTS_KEY) || '[]')
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

export function readUnseenAchievements() {
  try {
    const stored = JSON.parse(localStorage.getItem(UNSEEN_ACHIEVEMENTS_KEY) || '[]')
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

export function clearUnseenAchievements() {
  localStorage.setItem(UNSEEN_ACHIEVEMENTS_KEY, JSON.stringify([]))
  window.dispatchEvent(new CustomEvent('project326-achievement-viewed'))
}

function addUnseenAchievements(achievementIds) {
  if (achievementIds.length === 0) return

  const existing = readUnseenAchievements()
  const updated = [...new Set([...existing, ...achievementIds])]
  localStorage.setItem(UNSEEN_ACHIEVEMENTS_KEY, JSON.stringify(updated))
}

function getCompletedBookIds(metrics) {
  return Array.isArray(metrics.completedBookIds) ? metrics.completedBookIds : []
}

function getMetricValue(achievement, metrics) {
  if (achievement.type === 'chapters') return metrics.chaptersCompleted || 0
  if (achievement.type === 'books') return metrics.completedBooks || 0
  if (achievement.type === 'streak') return metrics.currentStreak || 0

  const completedBookIds = getCompletedBookIds(metrics)

  if (achievement.type === 'book') {
    return completedBookIds.includes(achievement.bookId) ? 1 : 0
  }

  if (achievement.type === 'bookSet') {
    return achievement.bookIds.filter((bookId) => completedBookIds.includes(bookId)).length
  }

  return 0
}

export function syncAchievements(metrics) {
  const previouslyEarned = readEarnedAchievements()
  const earnedSet = new Set(previouslyEarned)
  const newlyEarned = []

  achievements.forEach((achievement) => {
    const currentValue = getMetricValue(achievement, metrics)

    if (currentValue >= achievement.target && !earnedSet.has(achievement.id)) {
      earnedSet.add(achievement.id)
      newlyEarned.push(achievement.id)
    }
  })

  const updated = Array.from(earnedSet)

  if (newlyEarned.length > 0) {
    localStorage.setItem(EARNED_ACHIEVEMENTS_KEY, JSON.stringify(updated))
    addUnseenAchievements(newlyEarned)
    window.dispatchEvent(new CustomEvent('project326-achievement-change', { detail: { newlyEarned } }))
  }

  return updated
}

export function getAchievementProgress(achievement, metrics) {
  const currentValue = getMetricValue(achievement, metrics)

  return {
    current: Math.min(currentValue, achievement.target),
    target: achievement.target,
    percentage: Math.min(Math.round((currentValue / achievement.target) * 100), 100),
  }
}
