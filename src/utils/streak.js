const COMPLETION_DAYS_KEY =
  'project326-completion-days'

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0')
  const day = String(
    date.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getDateFromKey(dateKey) {
  const [
    year,
    month,
    day,
  ] = dateKey
    .split('-')
    .map(Number)

  return new Date(
    year,
    month - 1,
    day,
  )
}

function getPreviousDateKey(dateKey) {
  const date =
    getDateFromKey(dateKey)

  date.setDate(
    date.getDate() - 1,
  )

  return getLocalDateKey(date)
}

export function readCompletionDays() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(
        COMPLETION_DAYS_KEY,
      ) || '[]',
    )

    if (!Array.isArray(stored)) {
      return []
    }

    return [
      ...new Set(
        stored.filter(
          (value) =>
            typeof value ===
            'string',
        ),
      ),
    ].sort()
  } catch {
    return []
  }
}

export function recordCompletionDay() {
  const completionDays =
    readCompletionDays()

  const today =
    getLocalDateKey()

  if (
    completionDays.includes(today)
  ) {
    return completionDays
  }

  const updated = [
    ...completionDays,
    today,
  ].sort()

  localStorage.setItem(
    COMPLETION_DAYS_KEY,
    JSON.stringify(updated),
  )

  window.dispatchEvent(
    new CustomEvent(
      'project326-streak-change',
      {
        detail: {
          date: today,
        },
      },
    ),
  )

  return updated
}

export function calculateCurrentStreak() {
  const completionDays =
    readCompletionDays()

  if (
    completionDays.length === 0
  ) {
    return 0
  }

  const completedDates =
    new Set(completionDays)

  const today =
    getLocalDateKey()

  const yesterday =
    getPreviousDateKey(today)

  let currentDate

  if (
    completedDates.has(today)
  ) {
    currentDate = today
  } else if (
    completedDates.has(yesterday)
  ) {
    currentDate = yesterday
  } else {
    return 0
  }

  let streak = 0

  while (
    completedDates.has(
      currentDate,
    )
  ) {
    streak += 1

    currentDate =
      getPreviousDateKey(
        currentDate,
      )
  }

  return streak
}