import fs from 'node:fs'

function read(path) {
  return fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

function requireText(source, text, label) {
  if (!source.includes(text)) {
    throw new Error(`App contract check failed: ${label}`)
  }
}

function rejectText(source, text, label) {
  if (source.includes(text)) {
    throw new Error(`App contract check failed: ${label}`)
  }
}

const app = read('src/App.jsx')
const backend = read('src/services/backend.js')
const api = read('src/services/api.js')
const library = read('src/pages/LibraryPage.jsx')
const chapter = read('src/pages/ChapterPage.jsx')
const reader = read('src/components/BibleReader.jsx')
const compass = read('src/components/CompassAssistant.jsx')
const referrals = read('src/services/referrals.js')
const churchConnection = read('src/components/profile/ChurchConnectionPanel.jsx')

requireText(backend, "'/api/app/auth/sign-in'", 'member sign-in endpoint must remain connected')
requireText(backend, "'/api/app/auth/sign-up'", 'member signup endpoint must remain connected')
requireText(backend, "'/api/app/me'", 'member bootstrap endpoint must remain connected')
requireText(backend, "'X-Project326-Test-Plan'", 'founder entitlement simulation header must remain connected')

requireText(api, 'snapshot.access?.fullBibleStudyAccess', 'paid Bible access must come from backend entitlements')
requireText(api, 'snapshot.access?.leaderGuideAccess', 'leader access must come from backend entitlements')
requireText(library, "bookId === 'john'", 'Free John must include the Gospel of John')
requireText(library, "selectedResourceType === 'leader' && !hasLeaderAccess", 'Library must lock leader guides separately')
requireText(chapter, "tab.id === 'leader' && !hasLeaderAccess", 'chapter tabs must lock leader guides separately')
requireText(reader, "readerError?.code === 'BIBLE_UPGRADE_REQUIRED'", 'reader must preserve paid Bible upgrade handling')

requireText(library, '<CompassAssistant', 'Library must expose Compass AI')
requireText(reader, '<CompassAssistant', 'Bible reader must expose contextual Compass AI')
rejectText(app, '<CompassAssistant', 'Compass AI must not return as a global floating control')
requireText(compass, 'role="dialog"', 'Compass must expose dialog semantics')
requireText(compass, 'role="alert"', 'Compass errors must be announced accessibly')

requireText(referrals, "'/api/app/referrals/me'", 'referral tracking endpoint must remain connected')
requireText(referrals, "'/api/app/referrals/claim'", 'referral claim endpoint must remain connected')
requireText(churchConnection, '50% off the first month', 'friend offer must remain clearly marked as checkout-dependent')

console.log('Authentication, entitlement, and Compass contracts verified.')
