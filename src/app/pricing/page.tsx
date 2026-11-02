import Link from 'next/link'
import { Coins, Crown, Play, Check } from 'lucide-react'
import LegalPage from '@/components/LegalPage'
import { COIN_PACKAGES } from '@/lib/mock-data'
import { LEGAL } from '@/lib/legal'

export const metadata = { title: `Pricing | ${LEGAL.brand}` }

export default function PricingPage() {
  const { brand, freeEpisodes, coinsPerEpisode, subscription } = LEGAL

  return (
    <LegalPage
      title="Pricing"
      intro={`Start every ${brand} series for free. Unlock the rest with coins, or watch everything with ${subscription.name}. Prices are in USD; taxes may apply depending on your country.`}
    >
      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
          <Play className="w-6 h-6 text-yellow-400" />
          <h2 className="!mb-1 mt-3">Free</h2>
          <p className="text-3xl font-black text-white">$0</p>
          <ul className="!list-none !pl-0 mt-4 text-sm">
            <li className="flex gap-2"><Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />Episodes 1–{freeEpisodes} of every series</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />No card needed</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-yellow-400/40 bg-yellow-400/5 p-6">
          <Crown className="w-6 h-6 text-yellow-400" />
          <h2 className="!mb-1 mt-3">{subscription.name}</h2>
          <p className="text-3xl font-black text-white">
            ${subscription.priceUsd}<span className="text-base font-medium text-gray-400">/{subscription.period}</span>
          </p>
          <ul className="!list-none !pl-0 mt-4 text-sm">
            <li className="flex gap-2"><Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />Every episode of every series unlocked</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />Renews each {subscription.period}, cancel anytime</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="flex items-center gap-2"><Coins className="w-5 h-5 text-yellow-400" />Coin packs</h2>
        <p>
          Unlock any locked episode for {coinsPerEpisode} coins. Unlocked episodes stay unlocked
          on your account. Coins are one-time purchases and do not renew.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          {COIN_PACKAGES.map((pkg) => (
            <div key={pkg.id} className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
              <p className="text-gray-400 text-sm">{pkg.name}</p>
              <p className="text-2xl font-black text-white mt-1">{pkg.coins} coins</p>
              <p className="text-yellow-400 font-bold mt-1">${pkg.price_usd}</p>
              <p className="text-gray-500 text-xs mt-2">
                Unlocks {Math.floor(pkg.coins / coinsPerEpisode)} episodes
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p>
          Payments are processed by Paddle.com, our Merchant of Record. See our{' '}
          <Link href="/terms">Terms of Service</Link> and{' '}
          <Link href="/refunds">Refund Policy</Link>.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-yellow-400 !text-black font-bold rounded-xl hover:bg-yellow-300 hover:!no-underline"
        >
          <Play className="w-4 h-4 fill-black" />
          Start watching free
        </Link>
      </section>
    </LegalPage>
  )
}
