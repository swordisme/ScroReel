#!/usr/bin/env node

/**
 * ScroReel AI Content Bot — CLI Runner
 * Run anytime with: npm run bot:generate
 */

import { analyzeMarketTrend } from '../../src/lib/bot/trend-analyzer.ts'
import { generateSeriesFromTrope } from '../../src/lib/bot/script-engine.ts'

console.log('\n🎬 ═══════════════════════════════════════════════════')
console.log('   SCROREEL AUTONOMOUS AI CONTENT ENGINE')
console.log('═════════════════════════════════════════════════════\n')

console.log('🔍 [1/3] Scanning TikTok / BookTok / DramaBox market trends...')
const trope = analyzeMarketTrend()
console.log(`   ✔ Top-Performing Trope Identified: "${trope.title}"`)
console.log(`   ✔ Category: ${trope.category}`)
console.log(`   ✔ Audience Hook: ${trope.retentionHook}\n`)

console.log('📝 [2/3] Generating 15-Episode Vertical Drama Package...')
const pkg = generateSeriesFromTrope(trope)
console.log(`   ✔ Series Title: "${pkg.title}"`)
console.log(`   ✔ Tagline: "${pkg.tagline}"`)
console.log(`   ✔ Episodes Formatted: ${pkg.episodes.length} (Ep 1-5 Free, Ep 6-15 Locked)`)
console.log(`   ✔ Character Stills Prompts & Voice Models: Ready\n`)

console.log('🚀 [3/3] Production Summary:')
console.log(`   • Episode 1 Climax: ${pkg.episodes[0].dialogue[0].text}`)
console.log(`   • Episode 5 Paywall: ${pkg.episodes[4].cliffhanger}\n`)
console.log('✅ Generation Complete! Open http://localhost:3000/admin/generator to inspect or publish.\n')
