import LegalPage from '@/components/LegalPage'
import { LEGAL } from '@/lib/legal'

export const metadata = { title: `Privacy Policy | ${LEGAL.brand}` }

export default function PrivacyPage() {
  const { brand, operatorName, contactEmail } = LEGAL

  return (
    <LegalPage
      title="Privacy Policy"
      intro={`This policy explains what personal data ${operatorName} collects when you use ${brand}, why, and the choices you have.`}
    >
      <section>
        <h2>What we collect</h2>
        <ul>
          <li><strong>Account data:</strong> your email address and login details when you sign up.</li>
          <li><strong>Purchase data:</strong> your coin balance, unlocked episodes, subscription status and order history. Card and payment details are collected by Paddle, not by us.</li>
          <li><strong>Viewing activity:</strong> which series and episodes you view, paywalls you reach and unlocks you make, used to run and improve the service.</li>
          <li><strong>Device data:</strong> basic technical information such as browser type and IP address, collected by our hosting provider for security and reliability.</li>
        </ul>
      </section>

      <section>
        <h2>How we use it</h2>
        <ul>
          <li>To provide your account, coins, unlocks and subscription.</li>
          <li>To process payments and prevent fraud (through Paddle).</li>
          <li>To understand which content people watch so we can improve the catalog.</li>
          <li>To contact you about your account or purchases.</li>
        </ul>
        <p>We do not sell your personal data.</p>
      </section>

      <section>
        <h2>Cookies and local storage</h2>
        <p>
          We use essential cookies to keep you signed in, and your browser&apos;s local storage to
          remember your language preference. We do not use advertising cookies on {brand}.
        </p>
      </section>

      <section>
        <h2>Who we share it with</h2>
        <ul>
          <li><strong>Supabase:</strong> stores account and app data.</li>
          <li><strong>Vercel:</strong> hosts the website.</li>
          <li><strong>Paddle:</strong> our reseller and Merchant of Record, which processes payments under its own privacy policy.</li>
        </ul>
        <p>We may also disclose data where required by law.</p>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <p>
          We keep account data while your account is open. When you close your account we delete
          or anonymise it, except records we must keep for legal, tax or accounting reasons.
        </p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          Depending on where you live, you may have the right to access, correct, export or
          delete your personal data, and to object to or restrict its use. To make a request,
          email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. You can also complain to
          your local data protection authority.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>
          {brand} is not intended for children under 16, and we do not knowingly collect their
          data.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>We may update this policy and will post the new version here with a new date.</p>
      </section>
    </LegalPage>
  )
}
