export interface ViralTrope {
  id: string
  title: string
  category: string
  audienceInterest: string
  retentionHook: string
  cliffhangerFormula: string
  characterArchetypes: {
    protagonist: string
    loveInterest: string
    antagonist: string
  }
  samplePremises: string[]
}

export const VIRAL_DRAMA_TROPES: ViralTrope[] = [
  {
    id: 'trope-billionaire-undercover',
    title: 'The Hidden Billionaire CEO / Undercover Janitor',
    category: 'Romance',
    audienceInterest: '98% Engagement (ReelShort / TikTok #1 Formula)',
    retentionHook:
      'Extreme disrespect in Ep 1-3 followed by shocking identity reveal and power reversal in Ep 6.',
    cliffhangerFormula:
      'The antagonist orders the protagonist fired/humiliated, only for the global board of directors to kneel.',
    characterArchetypes: {
      protagonist:
        'Liam (24) - Humble cleaning staff in a torn uniform, secretly the trillionaire heir of Vanguard Group.',
      loveInterest:
        'Elena (23) - Sweet, hard-working junior designer who treats Liam with kindness and respect.',
      antagonist:
        'Richard (30) - Arrogant branch director engaged to Elena by contract, constantly flaunting fake wealth.',
    },
    samplePremises: [
      'The Janitor Who Bought Her Entire Company',
      'The Trillionaire’s Revenge Marriage',
      'My Humble Husband is the Global King',
    ],
  },
  {
    id: 'trope-forbidden-professor',
    title: 'Forbidden Student & Professor / Age Gap Tension',
    category: 'Drama',
    audienceInterest: '95% Engagement (#BookTok / Romance Reader Favorite)',
    retentionHook:
      'High-stakes moral boundary, intense whispered confrontations, and secret glances in crowded lecture halls.',
    cliffhangerFormula:
      'A jealous rival records a private moment through the office blinds right before a kiss.',
    characterArchetypes: {
      protagonist:
        'Karim (19) - Dangerous intelligence, fierce pride, scholarship prodigy with nothing to lose.',
      loveInterest:
        'Dr. Leila Mansour (28) - Prestigious literature professor trapped in a loveless high-society engagement.',
      antagonist:
        'Fares (35) - Powerful hedge fund tycoon who views Leila as an ornament.',
    },
    samplePremises: [
      'Forbidden Lesson',
      'The Professor’s Midnight Confession',
      'Dangerous Syllabus',
    ],
  },
  {
    id: 'trope-mafia-contract',
    title: 'Cold Mafia Boss & The Innocent Hostage',
    category: 'Thriller',
    audienceInterest: '94% Engagement (TikTok Dark Romance Trend)',
    retentionHook:
      'Ruthless anti-hero who burns the world down for everyone except the one woman he swore to protect.',
    cliffhangerFormula:
      'A rival syndicate storms the penthouse; the boss steps in front of the bullet to save her.',
    characterArchetypes: {
      protagonist:
        'Dante Moretti (29) - Feared underground syndicate boss, impeccably tailored, merciless.',
      loveInterest:
        'Aria Vance (22) - Classical pianist whose brother owes an impossible gambling debt.',
      antagonist:
        'Viktor (34) - Sadistic cartel rival threatening both families.',
    },
    samplePremises: [
      'Claimed by the Shadow King',
      'The Don’s Weakness',
      'Contract with a Monster',
    ],
  },
  {
    id: 'trope-werewolf-alpha-rejected',
    title: 'The Rejected Mate Returns as Queen',
    category: 'Fantasy',
    audienceInterest: '96% Engagement (DramaBox / GoodNovel Top Grosser)',
    retentionHook:
      'Emotional heartbreak in Episode 1 turns into supreme power awakening and revenge by Episode 5.',
    cliffhangerFormula:
      'The former Alpha who rejected her begs on his knees as her true Royal Bloodline awakens.',
    characterArchetypes: {
      protagonist:
        'Selene (20) - Cast-out rogue wolf who awakens ancient lunar celestial magic.',
      loveInterest:
        'King Valen (28) - Legendary Blood Moon Alpha who recognizes her true worth instantly.',
      antagonist:
        'Alpha Tyler (24) - Arrogant pack leader who discarded her for a wealthy rival.',
    },
    samplePremises: [
      'The Rejected Luna’s Crown',
      'Alpha King’s Unforgiven Mate',
      'Silver Moon Reckoning',
    ],
  },
]

export function analyzeMarketTrend(preferredCategory?: string): ViralTrope {
  if (preferredCategory) {
    const matched = VIRAL_DRAMA_TROPES.find(
      (t) => t.category.toLowerCase() === preferredCategory.toLowerCase()
    )
    if (matched) return matched
  }
  // Select highest converting trope by default or randomly for variety
  const randomIndex = Math.floor(Math.random() * VIRAL_DRAMA_TROPES.length)
  return VIRAL_DRAMA_TROPES[randomIndex]
}
