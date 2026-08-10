import fs from 'node:fs'

function read(path) {
  return fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

function requireText(source, text, label) {
  if (!source.includes(text)) {
    throw new Error(`Canonical chapter experience check failed: ${label}`)
  }
}

const chapterPage = read('src/pages/ChapterPage.jsx')
const studyAccordion = read('src/components/StudySummaryAccordion.jsx')
const api = read('src/services/api.js')
const compass = read('src/components/CompassAssistant.jsx')
const compassService = read('src/services/compass.js')
const discussionRoom = read('src/components/connect/DiscussionRoom.jsx')

for (const tab of ['read', 'listen', 'study', 'leader']) {
  requireText(chapterPage, `id: '${tab}'`, `missing canonical ${tab} tab`)
}

requireText(chapterPage, "skipAudio(-15)", 'Listen must keep 15-second rewind')
requireText(chapterPage, "skipAudio(15)", 'Listen must keep 15-second forward')
requireText(chapterPage, 'type="range"', 'Listen must keep seekable timeline')
requireText(chapterPage, 'chapter.audio.body', 'Listen must render the chapter summary subtitle')

for (const key of [
  'before_you_read',
  'setting_the_scene',
  'observe',
  'interpret',
  'apply',
  'closing_prayer',
  'memory_verse',
]) {
  requireText(studyAccordion, `'${key}'`, `Study accordion is missing ${key}`)
}

if (/<details[^>]*\sopen(?:\s|=|>)/.test(studyAccordion)) {
  throw new Error('Canonical chapter experience check failed: Study accordions must begin collapsed')
}

requireText(api, 'payload?.listenSummary', 'frontend adapter must use dedicated Listen summary')
requireText(api, 'studyExperience?.sections', 'frontend adapter must use approved Study sections')
requireText(api, 'chapterQuote', 'frontend adapter must preserve chapter quote')
requireText(compass, 'requestControllerRef.current?.abort()', 'Compass must cancel stale requests')
requireText(compass, 'MAX_QUESTION_LENGTH', 'Compass must enforce the server question limit')
requireText(compassService, 'COMPASS_TIMEOUT_MS', 'Compass requests must time out safely')
requireText(discussionRoom, 'roomRequestRef.current?.abort()', 'Connect must cancel stale room loads')
requireText(discussionRoom, 'reactionLocksRef', 'Connect must prevent duplicate reaction mutations')

console.log('Canonical chapter experience verified.')
