import { GeneratedSeriesPackage } from './script-engine'
import { createServiceClient } from '@/lib/supabase/server'

export interface PublishResult {
  success: boolean
  seriesId: string
  slug: string
  episodesCreated: number
  message: string
}

function failure(pkg: GeneratedSeriesPackage, reason: string): PublishResult {
  return {
    success: false,
    seriesId: '',
    slug: pkg.slug,
    episodesCreated: 0,
    message: `⚠️ Publish failed for "${pkg.title}": ${reason}`,
  }
}

export async function publishSeriesToPlatform(
  pkg: GeneratedSeriesPackage
): Promise<PublishResult> {
  try {
    const supabase = await createServiceClient()

    // 1. Insert or update the series record
    const { data: seriesData, error: seriesError } = await supabase
      .from('series')
      .upsert(
        {
          title: pkg.title,
          slug: pkg.slug,
          tagline: pkg.tagline,
          description: pkg.description,
          thumbnail_url: pkg.thumbnailUrl,
          banner_url: pkg.bannerUrl,
          content_type: pkg.contentType,
          genre: pkg.genre,
          release_year: pkg.releaseYear,
          rating: pkg.rating,
          is_featured: pkg.isFeatured,
        },
        { onConflict: 'slug' }
      )
      .select('id')
      .single()

    if (seriesError || !seriesData?.id) {
      console.error('[Publisher] Series upsert error:', seriesError?.message)
      return failure(pkg, seriesError?.message || 'series row was not returned')
    }

    const seriesId = seriesData.id

    // 2. Re-publishing an existing slug updates the series only; inserting
    //    episodes again would duplicate them.
    const { count: existingEpisodes, error: countError } = await supabase
      .from('episodes')
      .select('id', { count: 'exact', head: true })
      .eq('series_id', seriesId)

    if (countError) {
      return failure(pkg, countError.message)
    }

    if (existingEpisodes && existingEpisodes > 0) {
      return {
        success: true,
        seriesId,
        slug: pkg.slug,
        episodesCreated: 0,
        message: `Updated "${pkg.title}" (it already had ${existingEpisodes} episodes, left unchanged).`,
      }
    }

    // 3. Insert all episodes with is_free flags
    const episodesToInsert = pkg.episodes.map((ep) => ({
      series_id: seriesId,
      title: ep.title,
      episode_number: ep.episodeNumber,
      video_url: '',
      thumbnail_url: `https://picsum.photos/seed/${pkg.slug}-${ep.episodeNumber}/450/800`,
      is_free: ep.isFree,
      duration_seconds: ep.durationSeconds,
    }))

    const { error: epError } = await supabase
      .from('episodes')
      .insert(episodesToInsert)

    if (epError) {
      console.error('[Publisher] Episode batch insert error:', epError.message)
      return failure(pkg, `series saved, but episodes failed: ${epError.message}`)
    }

    return {
      success: true,
      seriesId,
      slug: pkg.slug,
      episodesCreated: episodesToInsert.length,
      message: `🎉 Published "${pkg.title}" with ${episodesToInsert.length} episodes to your platform!`,
    }
  } catch (err) {
    console.error('[Publisher] Database error:', err)
    return failure(pkg, err instanceof Error ? err.message : 'database unreachable')
  }
}
