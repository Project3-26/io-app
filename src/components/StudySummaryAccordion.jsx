import { ChevronDown } from 'lucide-react'

const preferredOrder = [
  'before_you_read',
  'setting_the_scene',
  'observe',
  'interpret',
  'apply',
  'closing_prayer',
  'memory_verse',
]

export default function StudySummaryAccordion({ sections = [] }) {
  const ordered = [...sections].sort(
    (a, b) => preferredOrder.indexOf(a.key) - preferredOrder.indexOf(b.key),
  )

  if (!ordered.length) return null

  return (
    <div className="mt-5 space-y-3">
      {ordered.map((section, index) => (
        <details
          key={section.key}
          open={index === 0}
          className="group overflow-hidden border border-slate-300/80 bg-white/65"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-left font-semibold text-[#153047] [&::-webkit-details-marker]:hidden">
            <span>{section.label}</span>
            <ChevronDown
              size={18}
              className="shrink-0 text-cyan-700 transition-transform group-open:rotate-180"
            />
          </summary>
          <div className="border-t border-slate-300/70 px-4 py-4">
            <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {section.summary}
            </div>
          </div>
        </details>
      ))}
    </div>
  )
}
