import Link from 'next/link'
import LegalPage from '@/components/LegalPage'
import { LEGAL } from '@/lib/legal'

export const metadata = { title: `Terms of Service | ${LEGAL.brand}` }

export default function TermsPage() {
  const { brand, operatorName, governingCountry, contactEmail, siteUrl } = LEGAL

  return (
    <LegalPage
      title="Terms of Service"
      intro={`These Terms govern your use of ${brand} (${siteUrl}) and its apps, operated by ${operatorName} ("we", "us"). By creating an account or using ${brand}, you agree to these Terms.`}
    >
      <section>
        <h2>1. The service</h2>
        <p>
          {brand} is a streaming service for short-form drama series and movies. All
          series, movies, characters, voices and images on {brand} are generated with
          artificial intelligence and are fictional. Any resemblance to real people or
          events is coincidental. Titles are labelled &quot;AI-Generated&quot;.
        </p>
      </section>

      <section>
        <h2>2. Eligibility and accounts</h2>
        <ul>
          <li>You must be at least 16 years old to create an account. Titles rated 18+ are only for adults.</li>
          <li>You are responsible for keeping your login secure and for activity on your account.</li>
          <li>Provide accurate information and keep your email address up to date.</li>
        </ul>
      </section>

      <section>
        <h2>3. Free episodes, coins and subscriptions</h2>
        <ul>
          <li>The first {LEGAL.freeEpisodes} episodes of each series are free to watch.</li>
          <li>
            Further episodes can be unlocked with coins ({LEGAL.coinsPerEpisode} coins per
            episode) or with an {LEGAL.subscription.name} subscription. See{' '}
            <Link href="/pricing">Pricing</Link>.
          </li>
          <li>
            Coins are a virtual item with no cash value. They can only be used on {brand}, cannot
            be transferred or exchanged for money, and do not expire while your account is open.
          </li>
          <li>An unlocked episode stays unlocked on your account.</li>
          <li>
            Subscriptions renew automatically each {LEGAL.subscription.period} until cancelled.
            You can cancel at any time; access continues until the end of the paid period.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Payments</h2>
        <p>
          Our order process is conducted by our online reseller Paddle.com. Paddle.com is the
          Merchant of Record for all our orders. Paddle provides all customer service inquiries
          and handles returns. Prices are shown before purchase and may include taxes where
          applicable. Refunds are covered by our <Link href="/refunds">Refund Policy</Link>.
        </p>
      </section>

      <section>
        <h2>5. Acceptable use</h2>
        <ul>
          <li>Content is licensed to you for personal, non-commercial viewing only.</li>
          <li>Do not copy, download, redistribute, or publicly show content without permission.</li>
          <li>Do not attempt to bypass the paywall, interfere with the service, or access other users&apos; accounts.</li>
          <li>We may suspend or close accounts that break these rules.</li>
        </ul>
      </section>

      <section>
        <h2>6. Intellectual property</h2>
        <p>
          The {brand} name, logo, website, apps and content are owned by or licensed to{' '}
          {operatorName}. Nothing in these Terms transfers ownership to you.
        </p>
      </section>

      <section>
        <h2>7. Availability and changes</h2>
        <p>
          We may add, change or remove titles and features at any time. We aim to keep{' '}
          {brand} available but do not guarantee uninterrupted service. We may update these
          Terms; we will post the new version here and update the date above. Continuing to
          use {brand} after a change means you accept the updated Terms.
        </p>
      </section>

      <section>
        <h2>8. Liability</h2>
        <p>
          {brand} is provided &quot;as is&quot;. To the extent permitted by law, we are not liable for
          indirect or consequential losses, and our total liability to you is limited to the
          amount you paid us in the 12 months before the claim. Nothing in these Terms limits
          rights you have under consumer protection law.
        </p>
      </section>

      <section>
        <h2>9. Termination</h2>
        <p>
          You can close your account at any time by contacting us. On closure, unused coins and
          unlocked episodes are lost, except where a refund applies under our Refund Policy.
        </p>
      </section>

      {governingCountry && (
        <section>
          <h2>10. Governing law</h2>
          <p>These Terms are governed by the laws of {governingCountry}.</p>
        </section>
      )}

      <section>
        <h2>Contact</h2>
        <p>
          Questions about these Terms: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
      </section>
    </LegalPage>
  )
}
