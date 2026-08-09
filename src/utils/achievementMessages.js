const specialMessages = {
  'the-law': 'You read all 5 books of the Law — Genesis through Deuteronomy!',
  'the-history': 'You read all 12 Historical Books — Joshua through Esther!',
  'wisdom-poetry': 'You read all 5 books of Wisdom & Poetry!',
  'major-prophets': 'You read all 5 Major Prophets!',
  'the-twelve': 'You read all 12 Minor Prophets — Hosea through Malachi!',
  'old-testament-complete': 'You read all 39 books of the Old Testament!',
  'the-gospels': 'You read all 4 Gospels — Matthew, Mark, Luke, and John!',
  'church-on-fire': 'You completed the entire book of Acts!',
  'pauls-letters': "You read all 13 of Paul's letters — Romans through Philemon!",
  'general-letters': 'You read all 8 General Letters — Hebrews through Jude!',
  'the-revelation': 'You completed the entire book of Revelation!',
  'new-testament-complete': 'You read all 27 books of the New Testament!',
  'whole-counsel': 'You completed every book of the Bible — all 66 books!',
  'finish-bible': 'You completed all 1,189 chapters of the Bible!',
  'every-book': 'You completed every one of the Bible’s 66 books!',
}

export function getAchievementEarnedMessage(achievement) {
  if (!achievement) return ''

  if (specialMessages[achievement.id]) return specialMessages[achievement.id]

  if (achievement.type === 'chapters') {
    if (achievement.target === 1) return 'You completed your first Bible chapter!'
    return `You completed ${achievement.target.toLocaleString()} Bible chapters!`
  }

  if (achievement.type === 'streak') {
    return `You spent ${achievement.target} consecutive days in Scripture!`
  }

  if (achievement.type === 'books') {
    if (achievement.target === 1) return 'You completed your first entire book of the Bible!'
    return `You completed ${achievement.target} entire books of the Bible!`
  }

  if (achievement.type === 'book') {
    const bookName = achievement.bookName || achievement.title
    return `You completed the entire book of ${bookName}!`
  }

  if (achievement.type === 'bookSet') {
    return `You completed all ${achievement.target} books required for this collection!`
  }

  return achievement.description
}
