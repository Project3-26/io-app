import {
  BookCheck,
  BookOpen,
  CheckCircle2,
  Church,
  Compass,
  Crown,
  Cross,
  Feather,
  Flag,
  Flame,
  Footprints,
  Globe2,
  Hammer,
  Heart,
  Landmark,
  Lamp,
  Library,
  Mail,
  Mountain,
  Music,
  Scale,
  ScrollText,
  Send,
  Shield,
  Signpost,
  Sparkles,
  Star,
  Sunrise,
  TreePine,
  Trophy,
  Waves,
  Wheat,
} from 'lucide-react'

const artworkIcons = {
  footprints: Footprints,
  'open-bible': BookOpen,
  'trail-marker': Signpost,
  roots: TreePine,
  mountain: Mountain,
  'summit-flag': Flag,
  'sunrise-trail': Sunrise,
  'crowned-bible': Crown,
  flame: Flame,
  'laurel-flame': Flame,
  torch: Flame,
  lamp: Lamp,
  'radiant-torch': Sparkles,
  'book-check': BookCheck,
  'book-stack': Library,
  compass: Compass,
  bookshelf: Library,
  'half-library': Library,
  'full-library': Library,
  scales: Scale,
  gate: Landmark,
  'harp-scroll': Music,
  watchtower: Landmark,
  'twelve-stars': Star,
  temple: Church,
  church: Church,
  'cross-rays': Cross,
  'flame-footsteps': Footprints,
  letter: Mail,
  'quill-letter': Feather,
  'crown-stars': Crown,
  tomb: Sunrise,
  'illuminated-bible': BookOpen,
  'fig-tree': TreePine,
  'broken-chain-cross': Cross,
  'stars-horizon': Star,
  'globe-flame': Globe2,
  wheat: Wheat,
  'sandaled-footsteps': Footprints,
  'watchtower-sunrise': Sunrise,
  'lamp-path': Lamp,
  'parted-sea': Waves,
  'hands-tools-heart': Hammer,
  'harp-crown': Music,
  'fish-wave': Waves,
  armor: Shield,
  'torch-chaos': Flame,
  trophy: Trophy,
  heart: Heart,
  send: Send,
  scroll: ScrollText,
}

const tierStyles = {
  bronze: {
    rim: 'from-[#6f3b1d] via-[#d28a50] to-[#8c4e2c]',
    face: 'from-[#7b4424] via-[#b86f42] to-[#6b391f]',
    icon: 'text-[#ffe0c2]',
    glow: 'shadow-[0_0_18px_rgba(184,111,66,0.2)]',
  },
  silver: {
    rim: 'from-[#74838d] via-[#d7e0e5] to-[#7c8a94]',
    face: 'from-[#46545e] via-[#8b9aa4] to-[#3c4952]',
    icon: 'text-[#eef5f8]',
    glow: 'shadow-[0_0_18px_rgba(180,197,207,0.18)]',
  },
  gold: {
    rim: 'from-[#9b6719] via-[#ffd76c] to-[#a86c15]',
    face: 'from-[#8d5a18] via-[#d9a12f] to-[#7d4e13]',
    icon: 'text-[#fff1b8]',
    glow: 'shadow-[0_0_22px_rgba(240,185,64,0.24)]',
  },
  legendary: {
    rim: 'from-cyan-400 via-orange-300 to-cyan-500',
    face: 'from-[#0d5265] via-[#b86532] to-[#123e55]',
    icon: 'text-white',
    glow: 'shadow-[0_0_28px_rgba(34,211,238,0.25)]',
  },
}

function BadgeMedallion({ achievement, earned = false, size = 'md', showCheck = false }) {
  const ArtworkIcon = artworkIcons[achievement?.artwork] || Trophy
  const tier = tierStyles[achievement?.tier] || tierStyles.bronze
  const sizing = size === 'sm'
    ? { outer: 'h-14 w-14', middle: 'inset-[4px]', inner: 'inset-[8px]', icon: 21 }
    : size === 'lg'
      ? { outer: 'h-24 w-24', middle: 'inset-[5px]', inner: 'inset-[11px]', icon: 38 }
      : { outer: 'h-[76px] w-[76px]', middle: 'inset-[4px]', inner: 'inset-[9px]', icon: 29 }

  return (
    <div
      className={`relative ${sizing.outer} shrink-0 rounded-full bg-gradient-to-br p-[2px] ${earned ? `${tier.rim} ${tier.glow}` : 'from-slate-600 via-slate-400 to-slate-700 opacity-65'}`}
      aria-label={`${achievement?.title || 'Achievement'} ${earned ? 'earned' : 'locked'}`}
    >
      <div className={`absolute ${sizing.middle} rounded-full border border-black/30 bg-[#091a28]`} />
      <div className={`absolute ${sizing.inner} flex items-center justify-center rounded-full border border-white/15 bg-gradient-to-br ${earned ? tier.face : 'from-[#263746] via-[#344958] to-[#1e2e3b]'}`}>
        <ArtworkIcon size={sizing.icon} strokeWidth={1.7} className={earned ? tier.icon : 'text-slate-400'} />
      </div>
      <div className="pointer-events-none absolute inset-[3px] rounded-full border border-white/20" />
      <div className="pointer-events-none absolute bottom-[12%] left-[19%] right-[19%] h-px bg-white/20" />

      {showCheck && earned && (
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#041326] bg-cyan-300 text-[#041326] shadow-lg">
          <CheckCircle2 size={15} strokeWidth={2.5} />
        </span>
      )}
    </div>
  )
}

export default BadgeMedallion
