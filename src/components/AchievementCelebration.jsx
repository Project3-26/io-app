import {
  CheckCircle2,
  Trophy,
} from 'lucide-react'
import {
  useEffect,
} from 'react'

const confettiPieces = [
  { left: '8%', delay: '0s', rotate: '15deg' },
  { left: '14%', delay: '0.08s', rotate: '70deg' },
  { left: '20%', delay: '0.16s', rotate: '125deg' },
  { left: '27%', delay: '0.04s', rotate: '180deg' },
  { left: '33%', delay: '0.2s', rotate: '230deg' },
  { left: '39%', delay: '0.11s', rotate: '290deg' },
  { left: '45%', delay: '0.02s', rotate: '340deg' },
  { left: '51%', delay: '0.18s', rotate: '35deg' },
  { left: '57%', delay: '0.06s', rotate: '95deg' },
  { left: '63%', delay: '0.14s', rotate: '145deg' },
  { left: '69%', delay: '0.03s', rotate: '200deg' },
  { left: '75%', delay: '0.19s', rotate: '255deg' },
  { left: '81%', delay: '0.09s', rotate: '310deg' },
  { left: '87%', delay: '0.15s', rotate: '355deg' },
  { left: '11%', delay: '0.22s', rotate: '45deg' },
  { left: '24%', delay: '0.12s', rotate: '110deg' },
  { left: '36%', delay: '0.24s', rotate: '165deg' },
  { left: '48%', delay: '0.1s', rotate: '220deg' },
  { left: '60%', delay: '0.21s', rotate: '275deg' },
  { left: '72%', delay: '0.07s', rotate: '325deg' },
  { left: '84%', delay: '0.23s', rotate: '20deg' },
]

function AchievementCelebration({
  achievement,
  additionalCount = 0,
  onClose,
}) {
  useEffect(() => {
    if (!achievement) {
      return undefined
    }

    const timer = window.setTimeout(
      () => {
        onClose()
      },
      3500,
    )

    return () =>
      window.clearTimeout(timer)
  }, [
    achievement,
    onClose,
  ])

  if (!achievement) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <style>
        {`
          @keyframes project326-confetti-fall {
            0% {
              transform: translateY(-40px) rotate(0deg);
              opacity: 0;
            }

            10% {
              opacity: 1;
            }

            100% {
              transform: translateY(72vh) rotate(720deg);
              opacity: 0;
            }
          }

          @keyframes project326-achievement-pop {
            0% {
              transform: translate(-50%, -50%) scale(.72);
              opacity: 0;
            }

            12% {
              transform: translate(-50%, -50%) scale(1.05);
              opacity: 1;
            }

            20% {
              transform: translate(-50%, -50%) scale(1);
            }

            88% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }

            100% {
              transform: translate(-50%, -50%) scale(.96);
              opacity: 0;
            }
          }
        `}
      </style>

      {confettiPieces.map(
        (piece, index) => {
          const orange =
            index % 3 === 0

          const cyan =
            index % 3 === 1

          return (
            <span
              key={index}
              className={`absolute top-0 h-3 w-2 rounded-sm ${
                orange
                  ? 'bg-orange-400'
                  : cyan
                    ? 'bg-cyan-400'
                    : 'bg-white'
              }`}
              style={{
                left: piece.left,
                animation:
                  'project326-confetti-fall 2.1s ease-out forwards',
                animationDelay:
                  piece.delay,
                transform: `rotate(${piece.rotate})`,
              }}
            />
          )
        },
      )}

      <div
        className="pointer-events-auto absolute left-1/2 top-1/2 w-[calc(100%-32px)] max-w-sm rounded-[28px] border border-orange-300/50 bg-[#e8ddd0] p-5 text-center text-[#153047] shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
        style={{
          animation:
            'project326-achievement-pop 3.5s ease forwards',
        }}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/30">
          <Trophy size={31} />
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
          Achievement Unlocked
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          {achievement.title}
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {achievement.description}
        </p>

        {additionalCount > 0 && (
          <p className="mt-3 text-xs font-semibold text-orange-600">
            +{additionalCount}{' '}
            more achievement
            {additionalCount === 1
              ? ''
              : 's'}{' '}
            unlocked
          </p>
        )}

        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-cyan-700">
          <CheckCircle2 size={16} />
          Added to your achievements
        </div>
      </div>
    </div>
  )
}

export default AchievementCelebration