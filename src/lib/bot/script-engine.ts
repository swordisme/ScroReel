import { ViralTrope } from './trend-analyzer'

export interface GeneratedEpisodeScript {
  episodeNumber: number
  title: string
  isFree: boolean
  durationSeconds: number
  visualSetting: string
  imagePrompt: string
  motionPrompt: string
  audioCue: string
  cliffhanger: string
  dialogue: { speaker: string; text: string; emotion: string }[]
}

export interface GeneratedSeriesPackage {
  title: string
  slug: string
  tagline: string
  description: string
  genre: string
  contentType: 'series' | 'movie'
  releaseYear: number
  rating: string
  totalEpisodes: number
  isFeatured: boolean
  thumbnailUrl: string
  bannerUrl: string
  characterPrompts: {
    name: string
    role: string
    prompt: string
    voiceModel: string
  }[]
  episodes: GeneratedEpisodeScript[]
}

export function generateSeriesFromTrope(
  trope: ViralTrope,
  customTitle?: string
): GeneratedSeriesPackage {
  const chosenTitle =
    customTitle ||
    trope.samplePremises[
      Math.floor(Math.random() * trope.samplePremises.length)
    ]

  const slug = chosenTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const characterPrompts = [
    {
      name: trope.characterArchetypes.protagonist.split(' ')[0],
      role: 'Protagonist',
      prompt: `Cinematic ultra-realistic portrait of ${trope.characterArchetypes.protagonist}, 8k resolution, dramatic cinematic lighting, photorealistic, 9:16 vertical ratio --ar 9:16 --v 6.1`,
      voiceModel: 'Adam (Deep / Confident)',
    },
    {
      name: trope.characterArchetypes.loveInterest.split(' ')[0],
      role: 'Love Interest',
      prompt: `Cinematic portrait of ${trope.characterArchetypes.loveInterest}, high fashion elegance, intense emotional expression, volumetric lighting, photorealistic, 9:16 vertical ratio --ar 9:16 --v 6.1`,
      voiceModel: 'Rachel (Warm / Passionate)',
    },
    {
      name: trope.characterArchetypes.antagonist.split(' ')[0],
      role: 'Antagonist',
      prompt: `Cinematic portrait of ${trope.characterArchetypes.antagonist}, cold arrogant expression, sharp luxury suit, high contrast lighting, photorealistic, 9:16 vertical ratio --ar 9:16 --v 6.1`,
      voiceModel: 'Antony (Cold / Authoritative)',
    },
  ]

  const episodeTitles = [
    'The Unforgivable Disrespect',
    'Whispers in the Dark',
    'A Dangerous Game',
    'Close Encounters',
    'The Trap Snaps Shut',
    'The True Identity Revealed',
    'No Mercy for Traitors',
    'Stolen Glance',
    'The Blackmail Contract',
    'Burning Bridges',
    'Midnight Confession',
    'The Rival Falls',
    'Cornered Tiger',
    'The Ultimatum',
    'Season Finale: Reign of Fire',
  ]

  const episodes: GeneratedEpisodeScript[] = Array.from(
    { length: 15 },
    (_, i) => {
      const epNum = i + 1
      const isFree = epNum <= 5

      return {
        episodeNumber: epNum,
        title: episodeTitles[i] || `Episode ${epNum}`,
        isFree,
        durationSeconds: 75 + ((i * 3) % 15),
        visualSetting: `Dramatic luxury interior / high-tension setting, cinematic neon and shadows, 9:16 vertical framing.`,
        imagePrompt: `Cinematic 9:16 shot of ${characterPrompts[0].name} confronting ${characterPrompts[2].name} in luxury penthouse, intense dramatic lighting, 8k, photorealistic --ar 9:16`,
        motionPrompt: `Slow cinematic zoom in on eyes, subtle tension, jaw clenching, hair movement in wind, shallow depth of field, 4k 60fps.`,
        audioCue: isFree
          ? 'Rising suspense strings with sudden sharp bass drop.'
          : 'High-octane orchestral battle beats with dramatic silence pauses.',
        cliffhanger:
          epNum === 5
            ? '🔥 PAYWALL CLIFFHANGER: The antagonist orders security to crush him, but the master key falls from his pocket...'
            : `Episode ${epNum} cuts to black as a gun clicks / a secret document is opened.`,
        dialogue: [
          {
            speaker: characterPrompts[2].name,
            text: `You have no right to stand in the same room as her. Know your place!`,
            emotion: 'ARROGANT',
          },
          {
            speaker: characterPrompts[0].name,
            text: `You think this company belongs to you? Look at the name on the deed.`,
            emotion: 'COLD_CONFIDENCE',
          },
          {
            speaker: characterPrompts[1].name,
            text: `Wait... Liam, what have you done?`,
            emotion: 'SHOCKED',
          },
        ],
      }
    }
  )

  return {
    title: chosenTitle,
    slug,
    tagline: `Power. Secrets. A forbidden passion that defied an empire.`,
    description: `When ${characterPrompts[0].name} was pushed past the edge, the entire high-society dynasty realized they picked a fight with the wrong person. A viral 15-episode micro-drama binge.`,
    genre: trope.category,
    contentType: 'series',
    releaseYear: 2026,
    rating: '16+',
    totalEpisodes: 15,
    isFeatured: true,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=80',
    characterPrompts,
    episodes,
  }
}
