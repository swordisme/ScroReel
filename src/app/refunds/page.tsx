import LegalPage from '@/components/LegalPage'
import { LEGAL } from '@/lib/legal'

export const metadata = { title: `Refund Policy | ${LEGAL.brand}` }

export default function RefundsPage() {
  const { brand, contactEmail, refundWindowDays } = LEGAL

  return (
    <LegalPage
      title="Refund Policy"
      intro={`We want you to be happy with ${brand}. If you are not, you can request a refund within ${refundWindowDays} days of purchase.`}
    >
      <section>
        <h2>Coin packs</h2>
        <p>
          You can request a full refund of a coin pack within {refundWindowDays} days of
          purchase. If some of the coins have already been used, we may refund the unused part
          instead. The refunded coins are removed from your balance.
        </p>
      </section>

      <section>
        <h2>{LEGAL.subscription.name} subscription</h2>
        <p>
          You can cancel at any time and keep access until the end of the current paid{' '}
          {LEGAL.subscription.period}. You can request a refund of a subscription payment within{' '}
          {refundWindowDays} days of being charged.
        </p>
      </section>

      <section>
        <h2>How to request a refund</h2>
        <p>
          Our orders are processed by Paddle.com, our Merchant of Record. To request a refund,
          use the link in your Paddle receipt email or contact Paddle at{' '}
          <a href="https://paddle.net" target="_blank" rel="noopener noreferrer">paddle.net</a>.
          You can also email us at <a href={`mailto:${contactEmail}`}>{contactEmail}</a> with
          your order number and we will help.
        </p>
        <p>Approved refunds are returned to your original payment method, usually within 5–10 business days.</p>
      </section>

      <section>
        <h2>Your legal rights</h2>
        <p>
          This policy does not affect any rights you have under consumer protection law in your
          country, including any statutory right of withdrawal.
        </p>
      </section>
    </LegalPage>
  )
}
